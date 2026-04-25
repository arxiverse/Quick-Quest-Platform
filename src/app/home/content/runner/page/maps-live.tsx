import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useRunnerMapsLiveVM } from "../runner";
import { GOOGLE_MAPS_CONFIG } from "../../../../global.service";
import { Surface, cn } from "../../../home.ui";
import Aurora from "../../../../../Animation/Aurora";
import { ArrowLeftIcon } from "../../../home.icons";

export function RunnerMapsLive({ onBack }: { onBack: () => void }) {
  const { markers, center, permissionStatus, isLoading, requestLocationAndInitMap } = useRunnerMapsLiveVM();
  
  const GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_CONFIG.apiKey;
  const MAP_ID = GOOGLE_MAPS_CONFIG.mapId;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Surface className="flex flex-col sm:flex-row items-center justify-between p-5 bg-base-100 border border-[#38BDF8]/30">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#38BDF8] mb-1">
            Live Mapping
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-base-content">
            Radar Quest (Runner Mode)
          </h2>
        </div>
        <button
          onClick={onBack}
          className="btn h-10 px-5 rounded-[8px] border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#38BDF8] hover:bg-[#38BDF8]/20 transition-transform active:scale-95 mt-3 sm:mt-0 shadow-none font-bold"
        >
          <ArrowLeftIcon className="size-4 mr-1" />
          Keluar Radar
        </button>
      </Surface>

      <Surface className="relative h-[600px] w-full overflow-hidden border border-[#38BDF8]/30 bg-base-200">
        {permissionStatus === "granted" && center ? (
          <div className="h-full w-full relative group">
            <div className="absolute inset-0 z-10 pointer-events-none opacity-30 mix-blend-screen transition-opacity duration-1000 group-hover:opacity-20 overflow-hidden flex items-center justify-center">
               <div className="absolute size-[800px] rounded-full border-2 border-[#38BDF8] shadow-[0_0_30px_#38BDF8] animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" />
               <div className="absolute size-[800px] rounded-full border-2 border-[#38BDF8]/50 shadow-[0_0_50px_#38BDF8] animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_2s]" />
            </div>

            <div className="h-full w-full touch-none relative z-0" data-lenis-prevent>
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
                      {m.role === "ME_RUNNER" && (
                        <Pin background={"#38BDF8"} borderColor={"#0284C7"} glyphColor={"#FFFFFF"} scale={1.2} />
                      )}
                      {m.role === "QUEST_LIVE" && (
                        <Pin background={"#22C55E"} borderColor={"#166534"} glyphColor={"#FFFFFF"} scale={1.0} />
                      )}
                      {m.role === "HOT_ZONE" && (
                        <Pin background={"#EF4444"} borderColor={"#991B1B"} glyphColor={"#FFFFFF"} scale={1.5} />
                      )}
                    </AdvancedMarker>
                  ))}
                </Map>
              </APIProvider>

              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <div className="rounded-[10px] bg-black/60 backdrop-blur-md p-3 border border-white/10 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#38BDF8]/10 pointer-events-none animate-pulse" />
                  <p className="text-xs font-bold text-white mb-0.5 relative z-10 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                    Sinyal Satelit Aktif
                  </p>
                  <p className="text-[10px] text-white/70 relative z-10">Radius Radar: 2 KM</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center relative z-20 overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-soft-light">
              <Aurora colorStops={["#38BDF8", "#3B82F6", "#A046FF"]} amplitude={0.8} />
            </div>
            
            <div className="max-w-md rounded-[16px] bg-base-100/80 backdrop-blur-xl p-8 shadow-2xl border border-base-300 text-center relative z-10">
              <div className="text-5xl mb-4 animate-bounce">📡</div>
              <h3 className="text-lg font-bold text-base-content mb-2">
                Akses Radar Satelit Dibutuhkan
              </h3>
              <p className="text-sm text-base-content/70 mb-6 leading-relaxed">
                Untuk menemukan Quest terdekat yang akurat, sistem membutuhkan izin lokasi (Khatulistiwa Mock). <br/><br/>
                Privasi aman, koordinat Anda disamarkan di peta publik.
              </p>
              <button
                onClick={requestLocationAndInitMap}
                disabled={isLoading}
                className={cn(
                  "btn w-full rounded-[10px] bg-linear-to-r from-[#38BDF8] to-[#3B82F6] text-white hover:opacity-90 border-none font-bold shadow-lg shadow-[#38BDF8]/20 transition-all active:scale-95",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? "Menghubungkan Satelit..." : "Izinkan & Nyalakan Radar Transponder"}
              </button>
              {permissionStatus === "denied" && (
                <p className="mt-4 text-xs font-semibold text-error">
                  Akses ditolak. Refresh atau izinkan manual dari pengaturan browser.
                </p>
              )}
            </div>
          </div>
        )}
      </Surface>
    </div>
  );
}
