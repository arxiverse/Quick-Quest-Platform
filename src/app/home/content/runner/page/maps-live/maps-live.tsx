import { APIProvider, AdvancedMarker, Map, Pin } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_CONFIG } from "../../../../../global.service";
import { ArrowLeftIcon } from "../../../../home.icons";
import { Surface, cn } from "../../../../home.ui";
import Aurora from "../../../../../../Animation/Aurora";
import { useRunnerMapsLivePageVM } from "./maps-live";

export function RunnerMapsLivePage({ onBack }: { onBack: () => void }) {
  const { markers, center, permissionStatus, isLoading, requestLocationAndInitMap } =
    useRunnerMapsLivePageVM();

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Surface className="flex flex-col items-center justify-between border border-info/30 bg-base-100 p-5 sm:flex-row">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-info">
            Live Mapping
          </p>
          <h2 className="text-xl font-bold text-base-content sm:text-2xl">
            Radar Quest (Runner Mode)
          </h2>
        </div>
        <button
          onClick={onBack}
          className="btn mt-3 h-10 rounded-[8px] border-info/30 bg-info/10 px-5 font-bold text-info shadow-none sm:mt-0"
        >
          <ArrowLeftIcon className="mr-1 size-4" />
          Keluar Radar
        </button>
      </Surface>

      <Surface className="relative h-[600px] w-full overflow-hidden border border-info/30 bg-base-200">
        {permissionStatus === "granted" && center ? (
          <div className="relative h-full w-full group">
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden opacity-30 mix-blend-screen transition-opacity duration-1000 group-hover:opacity-20">
              <div className="absolute size-[800px] animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border-2 border-info shadow-[0_0_30px_#38BDF8]" />
              <div className="absolute size-[800px] animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_2s] rounded-full border-2 border-info/50 shadow-[0_0_50px_#38BDF8]" />
            </div>

            <div className="relative z-0 h-full w-full touch-none" data-lenis-prevent>
              <APIProvider apiKey={GOOGLE_MAPS_CONFIG.apiKey}>
                <Map
                  defaultCenter={center}
                  defaultZoom={15}
                  mapId={GOOGLE_MAPS_CONFIG.mapId}
                  disableDefaultUI={false}
                  gestureHandling="greedy"
                >
                  {markers.map((marker) => (
                    <AdvancedMarker key={marker.id} position={marker.position} title={marker.title}>
                      {marker.role === "ME_RUNNER" ? (
                        <Pin background="#38BDF8" borderColor="#0284C7" glyphColor="#FFFFFF" scale={1.2} />
                      ) : marker.role === "QUEST_LIVE" ? (
                        <Pin background="#22C55E" borderColor="#166534" glyphColor="#FFFFFF" scale={1.0} />
                      ) : (
                        <Pin background="#EF4444" borderColor="#991B1B" glyphColor="#FFFFFF" scale={1.5} />
                      )}
                    </AdvancedMarker>
                  ))}
                </Map>
              </APIProvider>
            </div>
          </div>
        ) : (
          <div className="relative z-20 flex h-full w-full flex-col items-center justify-center overflow-hidden p-6 text-center">
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-soft-light">
              <Aurora colorStops={["#38BDF8", "#3B82F6", "#A046FF"]} amplitude={0.8} />
            </div>
            <div className="relative z-10 max-w-md rounded-[16px] border border-base-300 bg-base-100/80 p-8 text-center shadow-2xl backdrop-blur-xl">
              <div className="mb-4 text-5xl">📡</div>
              <h3 className="mb-2 text-lg font-bold text-base-content">
                Akses Radar Satelit Dibutuhkan
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-base-content/70">
                Untuk menemukan Quest terdekat yang akurat, sistem membutuhkan izin lokasi.
              </p>
              <button
                onClick={requestLocationAndInitMap}
                disabled={isLoading}
                className={cn(
                  "btn w-full rounded-[10px] border-none bg-linear-to-r from-info to-[#3B82F6] font-bold text-white shadow-lg shadow-info/20",
                  isLoading && "cursor-not-allowed opacity-70",
                )}
              >
                {isLoading ? "Menghubungkan Satelit..." : "Izinkan & Nyalakan Radar"}
              </button>
            </div>
          </div>
        )}
      </Surface>
    </div>
  );
}
