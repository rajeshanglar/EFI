import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = 'device_id';

export interface DeviceInfoData {
  appVersion: string;
  platform: string;
  deviceId: string;
  buildNumber?: string;
  systemVersion?: string;
  deviceName?: string;
  deviceModel?: string;
}

/**
 * Get device information including app version, platform, and device ID
 */
export const getDeviceInfo = async (): Promise<DeviceInfoData> => {
  try {
    // Get app version
    const appVersion = DeviceInfo.getVersion();
    
    // Get platform (ios/android)
    const platform = Platform.OS;
    
    // Get or create device ID
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      // Generate a unique device ID if not exists
      try {
        const uniqueId = await DeviceInfo.getUniqueId();
        deviceId = uniqueId || `${Platform.OS}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      } catch (error) {
        deviceId = `${Platform.OS}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      }
      if (deviceId) {
        await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
      }
    }
    
    // Ensure deviceId is not null
    if (!deviceId) {
      deviceId = `${Platform.OS}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    
    // Get additional device info (optional)
    const buildNumber = DeviceInfo.getBuildNumber();
    const systemVersion = DeviceInfo.getSystemVersion();
    let deviceName: string | null = null;
    try {
      deviceName = await DeviceInfo.getDeviceName();
    } catch (error) {
      // Silently handle device name error
    }
    const deviceModel = DeviceInfo.getModel();
    
    return {
      appVersion,
      platform,
      deviceId,
      buildNumber,
      systemVersion,
      deviceName: deviceName || undefined,
      deviceModel,
    };
  } catch (error) {
    console.error('Error getting device info:', error);
    // Return fallback values
    return {
      appVersion: '1.0.0',
      platform: Platform.OS,
      deviceId: `${Platform.OS}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
    };
  }
};

/**
 * Get device info in a format ready to send to backend
 */
export const getDeviceInfoForBackend = async (): Promise<{
  app_version: string;
  platform: string;
  device_id: string;
  build_number?: string;
  system_version?: string;
  device_name?: string;
  device_model?: string;
}> => {
  const deviceInfo = await getDeviceInfo();
  return {
    app_version: deviceInfo.appVersion,
    platform: deviceInfo.platform,
    device_id: deviceInfo.deviceId,
    build_number: deviceInfo.buildNumber,
    system_version: deviceInfo.systemVersion,
    device_name: deviceInfo.deviceName,
    device_model: deviceInfo.deviceModel,
  };
};

