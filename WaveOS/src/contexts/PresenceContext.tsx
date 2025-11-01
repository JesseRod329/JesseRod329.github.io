// Presence Context - manages BLE presence and nearby users

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { bleService } from '../services/ble/BLEService';
import { NearbyUser } from '../types';

interface PresenceContextType {
  currentBeaconId: string | null;
  nearbyUsers: NearbyUser[];
  isScanning: boolean;
  startPresence: () => Promise<void>;
  stopPresence: () => Promise<void>;
  refreshNearbyUsers: () => void;
}

const PresenceContext = createContext<PresenceContextType | undefined>(undefined);

export const PresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBeaconId, setCurrentBeaconId] = useState<string | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const startPresence = useCallback(async () => {
    try {
      await bleService.startBeacon();
      setCurrentBeaconId(bleService.getCurrentBeaconId());

      await bleService.startScanning((users) => {
        setNearbyUsers(users);
      });
      setIsScanning(true);
    } catch (error) {
      console.error('Failed to start presence:', error);
      throw error;
    }
  }, []);

  const stopPresence = useCallback(async () => {
    try {
      await bleService.stopBeacon();
      await bleService.stopScanning();
      setCurrentBeaconId(null);
      setNearbyUsers([]);
      setIsScanning(false);
    } catch (error) {
      console.error('Failed to stop presence:', error);
    }
  }, []);

  const refreshNearbyUsers = useCallback(() => {
    setNearbyUsers(bleService.getNearbyUsers());
  }, []);

  useEffect(() => {
    // Initialize BLE service on mount
    bleService.initialize().catch(console.error);

    return () => {
      // Cleanup on unmount
      stopPresence();
    };
  }, [stopPresence]);

  return (
    <PresenceContext.Provider
      value={{
        currentBeaconId,
        nearbyUsers,
        isScanning,
        startPresence,
        stopPresence,
        refreshNearbyUsers,
      }}
    >
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = () => {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error('usePresence must be used within PresenceProvider');
  }
  return context;
};


