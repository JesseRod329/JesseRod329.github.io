// BLE Service for beacon scanning and advertising

import BleManager from 'react-native-ble-manager';
import { Platform, PermissionsAndroid } from 'react-native';
import * as Location from 'expo-location';
import { resolveBeacon, registerBeacon } from '../supabase/client';
import { NearbyUser } from '../../types';

const BLE_SERVICE_UUID = '0000FFE0-0000-1000-8000-00805F9B34FB';
const BLE_CHARACTERISTIC_UUID = '0000FFE1-0000-1000-8000-00805F9B34FB';
const BEACON_ROTATION_INTERVAL = 3600000; // 1 hour
const SCAN_INTERVAL = 10000; // 10 seconds

class BLEService {
  private isInitialized = false;
  private isScanning = false;
  private isAdvertising = false;
  private currentBeaconId: string | null = null;
  private beaconRotationTimer: NodeJS.Timeout | null = null;
  private scanTimer: NodeJS.Timeout | null = null;
  private nearbyUsers: Map<string, NearbyUser> = new Map();
  private onNearbyUsersUpdate?: (users: NearbyUser[]) => void;
  private ghostZones: Array<{ latitude: number; longitude: number; radius_meters: number }> = [];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await BleManager.start({ showAlert: false });
      this.isInitialized = true;
      console.log('BLE Manager initialized');
    } catch (error) {
      console.error('Failed to initialize BLE:', error);
      throw error;
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return Object.values(granted).every((status) => status === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
      }
    } else {
      // iOS permissions are handled via Info.plist
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    }
  }

  async startBeacon(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Check if we're in a ghost zone
    const inGhostZone = await this.checkGhostZones();
    if (inGhostZone) {
      console.log('In ghost zone - not starting beacon');
      return;
    }

    // Register new beacon
    try {
      const result = await registerBeacon();
      this.currentBeaconId = result.beacon_id;
      console.log('Beacon registered:', this.currentBeaconId);

      // Start advertising (simplified - actual implementation depends on BLE library)
      // Note: react-native-ble-manager doesn't support advertising on iOS
      // You may need to use a different library or native module for iOS advertising
      if (Platform.OS === 'android') {
        await this.startAdvertising();
      }

      // Schedule beacon rotation
      this.scheduleBeaconRotation();
    } catch (error) {
      console.error('Failed to start beacon:', error);
      throw error;
    }
  }

  private async startAdvertising(): Promise<void> {
    if (this.isAdvertising || !this.currentBeaconId) return;

    try {
      // Note: react-native-ble-manager doesn't have built-in advertising
      // This is a placeholder - you'll need to implement native advertising
      // or use a library that supports it
      this.isAdvertising = true;
      console.log('BLE advertising started');
    } catch (error) {
      console.error('Failed to start advertising:', error);
      this.isAdvertising = false;
    }
  }

  async stopBeacon(): Promise<void> {
    if (this.beaconRotationTimer) {
      clearTimeout(this.beaconRotationTimer);
      this.beaconRotationTimer = null;
    }

    if (this.scanTimer) {
      clearInterval(this.scanTimer);
      this.scanTimer = null;
    }

    this.isAdvertising = false;
    this.currentBeaconId = null;
    console.log('Beacon stopped');
  }

  async startScanning(onUpdate: (users: NearbyUser[]) => void): Promise<void> {
    if (this.isScanning) return;

    this.onNearbyUsersUpdate = onUpdate;

    try {
      await BleManager.scan([BLE_SERVICE_UUID], 10, true); // Scan for 10 seconds
      this.isScanning = true;

      // Set up periodic scanning
      this.scanTimer = setInterval(async () => {
        if (this.isScanning) {
          await BleManager.scan([BLE_SERVICE_UUID], 10, true);
        }
      }, SCAN_INTERVAL);

      // Listen for discovered devices
      this.setupScanListeners();
    } catch (error) {
      console.error('Failed to start scanning:', error);
      throw error;
    }
  }

  private setupScanListeners(): void {
    // Listen for BLE scan results
    // Note: This is a simplified implementation
    // You'll need to set up proper event listeners based on react-native-ble-manager API
    BleManager.getDiscoveredPeripherals().then((peripherals) => {
      this.processScanResults(peripherals);
    });
  }

  private async processScanResults(peripherals: any[]): Promise<void> {
    const users: NearbyUser[] = [];

    for (const peripheral of peripherals) {
      const beaconId = this.extractBeaconId(peripheral);
      if (!beaconId) continue;

      try {
        // Resolve beacon to user (server-side)
        const result = await resolveBeacon(beaconId);
        if (result.nearby) {
          users.push({
            beacon_id: beaconId,
            user: result.user || undefined,
            nearby: true,
          });
        }
      } catch (error) {
        console.error('Failed to resolve beacon:', error);
      }
    }

    this.nearbyUsers.clear();
    users.forEach((user) => {
      this.nearbyUsers.set(user.beacon_id, user);
    });

    if (this.onNearbyUsersUpdate) {
      this.onNearbyUsersUpdate(Array.from(this.nearbyUsers.values()));
    }
  }

  private extractBeaconId(peripheral: any): string | null {
    // Extract beacon ID from peripheral data
    // This depends on how you encode the beacon ID in the advertisement
    // For now, using a placeholder
    return peripheral.advertising?.serviceData?.[BLE_SERVICE_UUID] || null;
  }

  async stopScanning(): Promise<void> {
    if (!this.isScanning) return;

    try {
      await BleManager.stopScan();
      this.isScanning = false;

      if (this.scanTimer) {
        clearInterval(this.scanTimer);
        this.scanTimer = null;
      }
    } catch (error) {
      console.error('Failed to stop scanning:', error);
    }
  }

  private scheduleBeaconRotation(): void {
    if (this.beaconRotationTimer) {
      clearTimeout(this.beaconRotationTimer);
    }

    this.beaconRotationTimer = setTimeout(async () => {
      if (this.currentBeaconId) {
        await this.startBeacon(); // Rotate beacon
      }
    }, BEACON_ROTATION_INTERVAL);
  }

  async setGhostZones(zones: Array<{ latitude: number; longitude: number; radius_meters: number }>): Promise<void> {
    this.ghostZones = zones;
    
    // Stop beacon if we're now in a ghost zone
    const inGhostZone = await this.checkGhostZones();
    if (inGhostZone && this.isAdvertising) {
      await this.stopBeacon();
    }
  }

  private async checkGhostZones(): Promise<boolean> {
    try {
      const { coords } = await Location.getCurrentPositionAsync();
      
      for (const zone of this.ghostZones) {
        const distance = this.calculateDistance(
          coords.latitude,
          coords.longitude,
          zone.latitude,
          zone.longitude
        );

        if (distance <= zone.radius_meters) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to check ghost zones:', error);
      return false;
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth radius in meters
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  getCurrentBeaconId(): string | null {
    return this.currentBeaconId;
  }

  getNearbyUsers(): NearbyUser[] {
    return Array.from(this.nearbyUsers.values());
  }
}

export const bleService = new BLEService();


