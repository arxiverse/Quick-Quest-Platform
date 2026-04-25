// maps-live.service.ts — ESVMC Service Layer 
// Koordinat GPS & API Interactor untuk Giver

export interface RawCoords {
  lat: number;
  lng: number;
}

/**
 * Mengambil koordinat mentah dari sensor GPS Device.
 * Membutuhkan izin lokasi dari user.
 */
export const getDeviceLocationRaw = (): Promise<RawCoords> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Browser tidak mendukung Geolocation"));
      return;
    }
    
    // Timeout 10 detik untuk fallback jika lama
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};
