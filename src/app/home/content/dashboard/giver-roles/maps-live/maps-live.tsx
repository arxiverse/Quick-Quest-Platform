// maps-live.tsx — ESVMC View Layer
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { useMapsLiveLogic } from './maps-live';
import { GOOGLE_MAPS_CONFIG } from '../../../../../global.service';
import { Surface } from '../../../../home.ui';
import clsx from 'clsx';

export function GiverMapsLive({ onBack }: { onBack: () => void }) {
  const { markers, center, permissionStatus, isLoading, requestLocationAndInitMap } = useMapsLiveLogic();
  // Mengambil API Key dari source of truth (global.service)
  const GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_CONFIG.apiKey; 
  const MAP_ID = GOOGLE_MAPS_CONFIG.mapId;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Surface className="flex flex-col sm:flex-row items-center justify-between p-5 bg-base-100 border border-base-300">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/70 mb-1">
            Live Mapping
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-base-content">
            Radar Kandidat (Giver Mode)
          </h2>
        </div>
        <button
          onClick={onBack}
          className="btn h-10 px-5 rounded-[8px] bg-base-200 text-base-content/70 hover:bg-base-300 border-none transition-transform active:scale-95 mt-3 sm:mt-0"
        >
          Kembali
        </button>
      </Surface>

      {/* Frame Kanvas Peta */}
      <Surface className="relative h-[600px] w-full overflow-hidden border border-base-300 bg-base-200">
        {permissionStatus === 'granted' && center ? (
          <div className="h-full w-full touch-none" data-lenis-prevent>
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <Map
                defaultCenter={center}
                defaultZoom={15}
                mapId={MAP_ID}
                disableDefaultUI={false}
                gestureHandling="greedy"
              >
                {markers.map((m) => (
                  <AdvancedMarker key={m.id} position={m.position} title={m.title}>
                    {m.role === 'ME_GIVER' && (
                      // Titik Putih Khas Anchor
                      <Pin background={'#FFFFFF'} borderColor={'#333333'} glyphColor={'#333333'} scale={1.2} />
                    )}
                    {m.role === 'RUNNER_STANDBY' && (
                      // Titik Hijau Terang untuk Runner Kosong
                      <Pin background={'#22C55E'} borderColor={'#166534'} scale={1.0} />
                    )}
                    {m.role === 'RUNNER_BUSY' && (
                      // Titik Abu-abu untuk Runner Sibuk
                      <Pin background={'#94A3B8'} borderColor={'#475569'} scale={0.8} />
                    )}
                  </AdvancedMarker>
                ))}
              </Map>
            </APIProvider>

            {/* Overlay UI (Sonar / Radius Info) */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <div className="rounded-[10px] bg-black/60 backdrop-blur-sm p-3 border border-white/10 shadow-lg">
                <p className="text-xs font-bold text-white mb-0.5">🗼 Mode Broadcast</p>
                <p className="text-[10px] text-white/70">Jangkauan Anchor: 5 KM</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
            {/* Modal / State Layar Kosong Sebelum Akses Lokasi Diberikan */}
            <div className="max-w-md rounded-[16px] bg-base-100 p-8 shadow-xl border border-base-300 text-center">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-lg font-bold text-base-content mb-2">
                Aktifkan Anchor Lokasi
              </h3>
              <p className="text-sm text-base-content/70 mb-6 leading-relaxed">
                Kami membutuhkan lokasimu sebagai titik Anchor (Pusat) untuk melakukan matching dengan lokasi para Runner di sekitarmu. <br/><br/>
                Radius broadcast Quest akan dihitung dari lokasi devicemu secara real-time.
              </p>
              
              <button
                onClick={requestLocationAndInitMap}
                disabled={isLoading}
                className={clsx(
                  "btn w-full rounded-[10px] bg-primary text-primary-content hover:bg-primary/90 border-none",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? "Mengunci Anchor..." : "Pindai Radius Sekitar"}
              </button>
              
              {permissionStatus === 'denied' && (
                <p className="mt-4 text-xs font-semibold text-error">
                  Akses ditolak oleh browser. Silakan aktifkan manual di pengaturan URL lu.
                </p>
              )}
            </div>
          </div>
        )}
      </Surface>
    </div>
  );
}
