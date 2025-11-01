// Permission utilities

import { Alert, Platform } from 'react-native';
import { bleService } from '../services/ble/BLEService';
import * as Location from 'expo-location';

export interface PermissionStatus {
  ble: boolean;
  location: boolean;
  allGranted: boolean;
}

export const requestAllPermissions = async (): Promise<PermissionStatus> => {
  const status: PermissionStatus = {
    ble: false,
    location: false,
    allGranted: false,
  };

  try {
    // Request BLE permissions
    status.ble = await bleService.requestPermissions();

    // Request location permissions
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    status.location = locationStatus === 'granted';

    status.allGranted = status.ble && status.location;

    if (!status.allGranted) {
      Alert.alert(
        'Permissions Required',
        'WaveOS needs Bluetooth and Location permissions to detect nearby users. Please enable them in Settings.',
        [{ text: 'OK' }]
      );
    }

    return status;
  } catch (error) {
    console.error('Failed to request permissions:', error);
    return status;
  }
};

export const checkPermissions = async (): Promise<PermissionStatus> => {
  const status: PermissionStatus = {
    ble: false,
    location: false,
    allGranted: false,
  };

  try {
    // Check BLE permissions (simplified)
    status.ble = true; // Assume granted if we can initialize

    // Check location permissions
    const { status: locationStatus } = await Location.getForegroundPermissionsAsync();
    status.location = locationStatus === 'granted';

    status.allGranted = status.ble && status.location;
    return status;
  } catch (error) {
    console.error('Failed to check permissions:', error);
    return status;
  }
};


