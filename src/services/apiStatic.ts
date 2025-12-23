import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {API_BASE_URL, ENABLE_API_LOGGING, STATIC_API_TOKEN} from '../utils/enums';
import {ToastService} from '../utils/service-handlers';
import { handleAuthError } from '../utils/authErrorHandler';


/* ----------------------------------------------------------
  STATIC TOKEN ENDPOINT LIST
   All endpoints in this list will ALWAYS use STATIC_API_TOKEN
----------------------------------------------------------- */
const STATIC_TOKEN_ENDPOINTS = [
  'v1/countries',
  'v1/countries/{countryId}/states',
  'v1/validate-coupon',
  'v1/download-membership-invoice',
  'v1/hear-about-sources',
  'v1/check-membership-exists',
  'v1/settings?title=membership_price',
  'v1/membership-registration',
  'v1/membership/create-order',
  'v1/check-conference-exists',
  'v1/workshops?type=morning',
  'v1/workshops?type=afternoon',
  'v1/categories',
  'v1/event-mappings',
  'v1/conference-registration',
  'v1/conference/create-order',
 'v1/download-conference-invoice',
 'v1/download-conference-qrcode',
 'v1/conference/send-efi-member-verification-otp',
 'v1/conference/verify-efi-member-otp',
 'v1/calculate-conference-price',
 'v1/speakers',
 'v1/sessions'

  // Add more API paths here as needed
];



const downloadApiLog = async (msg: string) => {
  if (!ENABLE_API_LOGGING) return;
  try {
    const timestamp = new Date().toISOString();
    const logText = `${timestamp}  ${msg}\n`;

    const fileName = `efi-api-log-${dayjs().format('YYYY-MM-DD')}.txt`;
    const filePath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${fileName}`;
    const exists = await ReactNativeBlobUtil.fs.exists(filePath);
    if (!exists) {
      await ReactNativeBlobUtil.fs.writeFile(filePath, logText, 'utf8');
    } else {
      await ReactNativeBlobUtil.fs.appendFile(filePath, logText, 'utf8');
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

  /* 🔥 1️⃣ STATIC TOKEN ENDPOINTS: Force static token always */
  const useStaticToken = STATIC_TOKEN_ENDPOINTS.some(path =>
    config.url?.includes(path)
  );

  if (useStaticToken) {
    config.headers.Authorization = `Bearer ${STATIC_API_TOKEN}`;
    console.log('=== STATIC TOKEN ENDPOINT → Using STATIC token ===');
    return config;
  }
    /* 🔥 1️⃣ STATIC TOKEN ENDPOINTS: Force static token always END */
  
  // Check if this is a login, forgot password, or reset password endpoint
  const isLoginEndpoint = config.url?.includes('v1/login') || config.url?.includes('/login');
  const isForgotPasswordEndpoint = config.url?.includes('v1/forgot-password') || config.url?.includes('/forgot-password');
  const isResetPasswordEndpoint = config.url?.includes('v1/reset-password') || config.url?.includes('/reset-password');
  
  // For login, forgot password, and reset password endpoints, always use static token
  if (isLoginEndpoint || isForgotPasswordEndpoint || isResetPasswordEndpoint) {
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
   
  } else if (STATIC_API_TOKEN) {
    // User not logged in, use static token
    config.headers.Authorization = `Bearer ${STATIC_API_TOKEN}`;
    
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

    // Enhanced logging for membership registration endpoint errors
    const isMembershipRegistrationEndpoint = config?.url?.includes('v1/membership-registration') || config?.url?.includes('/membership-registration');
    if (isMembershipRegistrationEndpoint) {
      console.error('=== MEMBERSHIP REGISTRATION REQUEST ERROR ===');
      console.error('Status:', status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Error Response Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('Error Response Headers:', JSON.stringify(error.response?.headers, null, 2));
      console.error('Request Payload:', JSON.stringify(config?.data, null, 2));
      console.error('Request Config:', JSON.stringify({
        url: config?.url,
        method: config?.method,
        headers: config?.headers,
      }, null, 2));
      
      // Log validation errors if status is 422
      if (status === 422 && error.response?.data) {
        const errorData = error.response.data;
        console.error('=== VALIDATION ERRORS ===');
        if (errorData.errors) {
          console.error('Validation Errors Object:', JSON.stringify(errorData.errors, null, 2));
        }
        if (errorData.message) {
          console.error('Error Message:', errorData.message);
        }
        console.error('========================');
      }
      console.error('===========================================');
    }

    // Enhanced logging for videos endpoint errors (especially 401)
    const isVideosEndpoint = config?.url?.includes('v1/videos') || config?.url?.includes('/videos');
    if (isVideosEndpoint) {
      console.error('=== VIDEOS ENDPOINT REQUEST ERROR ===');
      console.error('Status:', status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Error Response Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('Request URL:', config?.url);
      console.error('Request Method:', config?.method);
      console.error('Authorization Header:', config?.headers?.Authorization ? config.headers.Authorization.substring(0, 30) + '...' : 'MISSING');
      
      if (status === 401) {
        console.error('=== 401 UNAUTHORIZED ERROR ===');
        console.error('This endpoint requires valid authentication.');
        console.error('Check if STATIC_API_TOKEN is valid or if user needs to be logged in.');
        console.error('================================');
      }
      console.error('===========================================');
    }

    // Handle 401 errors for all authenticated endpoints (except login)
    if (status === 401 && !isLoginEndpoint) {
      const errorMessage = error.response?.data?.message || '';
      
      // Check for specific token expiration message
      if (
        errorMessage.toLowerCase().includes('api token') && 
        (errorMessage.toLowerCase().includes('no longer valid') || 
         errorMessage.toLowerCase().includes('invalid') ||
         errorMessage.toLowerCase().includes('expired')) ||
        errorMessage.toLowerCase().includes('please log in again')
      ) {
        console.error('=== 401 ERROR: API TOKEN NO LONGER VALID ===');
        console.error('Error Message:', errorMessage);
        
        // Clear invalid tokens
        try {
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'tokenExpiry', 'auth_token', 'user_data']);
          console.error('=== CLEARED INVALID TOKENS ===');
          
          // Trigger logout and redirect to login
          await handleAuthError();
          console.error('=== TRIGGERED LOGOUT AND REDIRECT TO LOGIN ===');
        } catch (clearError) {
          console.error('Error clearing tokens:', clearError);
        }
      } else if (errorMessage.includes('token') || errorMessage.includes('invalid') || errorMessage.includes('expired')) {
        // Generic token error handling
        try {
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'tokenExpiry', 'auth_token']);
          console.error('=== 401 ERROR: CLEARED INVALID TOKENS ===');
          await handleAuthError();
        } catch (clearError) {
          console.error('Error clearing tokens:', clearError);
        }
      }
    }

    downloadApiLog(msg); // 👈 still download even if it fails
    return Promise.reject(error);
  },
);

export default api;
