// maps-live.ts — ESVMC Compute Layer
// Business logic untuk data Map Giver

import { useState, useCallback, useEffect } from 'react';
import type { RawCoords } from './maps-live.service';
import { getDeviceLocationRaw } from './maps-live.service';

export type MapMarkerRole = 'ME_GIVER' | 'RUNNER_STANDBY' | 'RUNNER_BUSY';

export interface MapMarker {
  id: string;
  position: RawCoords;
  role: MapMarkerRole;
  title: string;
  opacity: number;
}

export const useMapsLiveLogic = () => {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [center, setCenter] = useState<RawCoords | null>(null);
  
  // Status Permission: 'pending' (belum ditanya), 'granted', 'denied'
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [isLoading, setIsLoading] = useState(false);

  // Rule: Transformasi data berat & penyamaran lokasi
  // Mensimulasikan Runner di sekitar lokasi asli Giver agar menjaga privasi Runner
  const generateMaskedRunners = (origin: RawCoords): MapMarker[] => {
    return [
      {
        id: 'runner-api-1',
        position: { lat: origin.lat + 0.0015, lng: origin.lng - 0.002 },
        role: 'RUNNER_STANDBY',
        title: 'Runner Terdekat',
        opacity: 0.8 // Tersamarkan demi privasi
      },
      {
        id: 'runner-api-2',
        position: { lat: origin.lat - 0.001, lng: origin.lng + 0.003 },
        role: 'RUNNER_STANDBY',
        title: 'Runner Siap',
        opacity: 0.8
      },
      {
        id: 'runner-api-3',
        position: { lat: origin.lat + 0.003, lng: origin.lng + 0.002 },
        role: 'RUNNER_BUSY',
        title: 'Sedang Di Quest',
        opacity: 0.5 // Jauh tersamarkan krn sibuk
      }
    ];
  };

  const requestLocationAndInitMap = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Tembak Service untuk minta GPS Device
      const myCoords = await getDeviceLocationRaw();
      
      // 2. Set Center Canvas ke lokasi Device
      setCenter(myCoords);
      setPermissionStatus('granted');
      localStorage.setItem('qqm_maps_active', 'true'); // Simpan status izin

      // 3. Render Marker diri sendiri + Obfuscated Data sekitarnya
      const allMarkers: MapMarker[] = [
        { 
          id: 'me', 
          position: myCoords, 
          role: 'ME_GIVER', 
          title: 'Lokasi Giver',
          opacity: 1 
        },
        ...generateMaskedRunners(myCoords)
      ];
      setMarkers(allMarkers);

    } catch (error) {
      console.error("Gagal mendapatkan lokasi:", error);
      setPermissionStatus('denied');
      localStorage.removeItem('qqm_maps_active'); // Hapus kalau error/ditolak
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-load saat komponen dipanggil kalau udah pernah Izinkan
  useEffect(() => {
    const hasMapActive = localStorage.getItem('qqm_maps_active') === 'true';
    if (hasMapActive) {
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'granted') {
            requestLocationAndInitMap();
          } else if (result.state === 'denied') {
            localStorage.removeItem('qqm_maps_active');
          }
        });
      } else {
        requestLocationAndInitMap();
      }
    }
  }, [requestLocationAndInitMap]);

  return { 
    markers, 
    center, 
    permissionStatus, 
    isLoading,
    requestLocationAndInitMap 
  };
};
