import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import RNFS from 'react-native-fs';

import {API_BASE_URL, ENABLE_API_LOGGING, STATIC_API_TOKEN} from '../utils/enums';

import {ToastService} from '../utils/service-handlers';

const downloadApiLog = async (msg: string) => {
  if (!ENABLE_API_LOGGING) return;
  try {
    const timestamp = new Date().toISOString();
    const logText = `${timestamp}  ${msg}\n`;

    const fileName = `rainbow-api-log-${dayjs().format('YYYY-MM-DD')}.txt`;
    const filePath = RNFS.DownloadDirectoryPath + '/' + fileName;
    const exists = await RNFS.exists(filePath);
    if (!exists) {
      await RNFS.writeFile(filePath, logText, 'utf8');
    } else {
      await RNFS.appendFile(filePath, logText, 'utf8');
    }
  } catch (error: any) {
    console.warn('Failed to download log:', error);
    ToastService.error(
      'Error',
      error?.response?.data?.message ||
        error?.message ||
        'Something went wrong',
    );
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000,
});

/* -------- 1. Refresh helper -------- */
const refreshToken = async () => {
  const rt = await AsyncStorage.getItem('refreshToken');
  if (!rt) return null;

  try {
    const {data} = await axios.post(`${API_BASE_URL}/login/refresh`, {
      refreshToken: rt,
    });

    await AsyncStorage.multiSet([
      ['accessToken', data.AccessToken],
      ['refreshToken', data.RefreshToken],
      ['tokenExpiry', data.Expires],
    ]);

    return data.AccessToken;
  } catch (err: any) {
    await AsyncStorage.clear();
    return null;
  }
};

/* -------- 2. Request interceptor -------- */
api.interceptors.request.use(async config => {
  (config as any).metadata = {start: Date.now()};
  
  // Set Content-Type header
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  // Check if this is a login endpoint
  const isLoginEndpoint = config.url?.includes('v1/login') || config.url?.includes('/login');
  
  // For login endpoint, always use static token
  if (isLoginEndpoint) {
    if (STATIC_API_TOKEN) {
      config.headers.Authorization = `Bearer ${STATIC_API_TOKEN}`;
      console.log('=== LOGIN ENDPOINT: USING STATIC TOKEN ===');
    }
    return config;
  }
  
  // For all other endpoints: use login api_token if available, otherwise use static token
  let accessToken = await AsyncStorage.getItem('accessToken');
  const expiry = await AsyncStorage.getItem('tokenExpiry');

  /* 🔄 Expired? Try refresh right before the request */
  if (expiry && dayjs().isAfter(dayjs(expiry))) {
    accessToken = await refreshToken();
  }

  // Priority: 1. Login api_token (from AsyncStorage), 2. Static token as fallback
  if (accessToken) {
    // User is logged in, use their api_token
    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log('=== USING LOGIN API TOKEN (USER LOGGED IN) ===');
    console.log('Token:', accessToken.substring(0, 20) + '...');
  } else if (STATIC_API_TOKEN) {
    // User not logged in, use static token
    config.headers.Authorization = `Bearer ${STATIC_API_TOKEN}`;
    console.log('=== USING STATIC TOKEN (NOT LOGGED IN) ===');
  }

  return config;
});

/* -------- 3. Response interceptor -------- */
api.interceptors.response.use(
  async response => {
    const {config} = response;
    const ms = Date.now() - (config as any).metadata.start;
    const msg = `[OK] ${config.method?.toUpperCase()} ${config.url} ${
      response.status
    } ${ms}ms`;

    downloadApiLog(msg); // 👈 auto-download to Downloads
    return response;
  },
  async error => {
    const {config} = error;
    const ms = Date.now() - (config as any).metadata?.start;
    const status = error.response?.status ?? 'ERR';
    const msg = `[FAIL] ${config?.method?.toUpperCase()} ${
      config?.url
    } ${status} ${ms}ms`;

    // Enhanced logging for login endpoint errors
    const isLoginEndpoint = config?.url?.includes('v1/login') || config?.url?.includes('/login');
    if (isLoginEndpoint) {
      console.error('=== LOGIN REQUEST ERROR ===');
      console.error('Status:', status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Error Response Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('Error Response Headers:', JSON.stringify(error.response?.headers, null, 2));
      console.error('Request Config:', JSON.stringify({
        url: config?.url,
        method: config?.method,
        headers: config?.headers,
        data: config?.data,
      }, null, 2));
      console.error('===========================');
    }

    downloadApiLog(msg); // 👈 still download even if it fails
    return Promise.reject(error);
  },
);

export default api;
