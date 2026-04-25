import { ArrowLeftIcon } from "../../../../home.icons";
import { Surface, cn } from "../../../../home.ui";
import Aurora from "../../../../../../Animation/Aurora";
import { getRunnerPartyLobbyRoomSeed } from "./party-lobby-room";

export function PartyLobbyRoomPage({
  partyId,
  onBack,
}: {
  partyId: string;
  onBack: () => void;
}) {
  const vm = getRunnerPartyLobbyRoomSeed(partyId);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onBack}
        className="btn btn-sm h-10 self-start gap-2 rounded-[10px] border-primary/30 bg-base-100/50 px-4 text-base-content/80 shadow-sm"
      >
        <ArrowLeftIcon className="size-4" />
        Leave Lobby Room
      </button>

      <div className="grid gap-4 lg:grid-cols-[1fr_350px]">
        <div className="space-y-4">
          <Surface className="relative overflow-hidden border border-primary/30 p-5 sm:p-7">
            <div className="pointer-events-none absolute inset-0 z-0 opacity-10 mix-blend-soft-light">
              <Aurora colorStops={["#A046FF", "#38BDF8", "#3B82F6"]} amplitude={1.2} />
            </div>
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-base-200 px-2.5 py-1 text-[10px] font-bold text-base-content/70">
                  <span className="size-2 rounded-full bg-success animate-pulse" />
                  LOBBY ACTIVE
                </span>
                <h1 className="mt-3 text-2xl font-bold text-base-content">
                  {vm.partyInfo.title}
                </h1>
                <p className="mt-1 text-sm text-base-content/60">
                  {vm.partyInfo.giver} • ID: {vm.partyInfo.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                  Total Upah Grup
                </p>
                <p className="mt-1 text-xl font-bold text-success">
                  {vm.partyInfo.reward}
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                Slot Anggota Tim ({vm.partyInfo.slotTotal})
              </p>
              <div className="flex flex-wrap gap-4">
                {vm.partyInfo.teamSlots.map((slot) => (
                  <div key={slot.id} className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "flex size-16 items-center justify-center rounded-full text-xl shadow-inner",
                        slot.state === "self"
                          ? "bg-linear-to-tr from-primary to-info text-white ring-4 ring-primary/30"
                          : slot.state === "filled"
                            ? "bg-base-200 text-base-content/80"
                            : "border-2 border-dashed border-base-300 bg-base-100/50 text-base-content/20",
                      )}
                    >
                      {slot.icon}
                    </div>
                    <span className="text-[10px] font-bold text-base-content/70">
                      {slot.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Surface>
        </div>

        <Surface className="mt-auto flex h-[500px] flex-col border border-base-300 p-0">
          <div className="border-b border-base-200 p-4">
            <p className="text-sm font-bold text-base-content">Papan Diskusi Tim</p>
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-base-100/30 p-4">
            {vm.chatMessages.map((message) =>
              message.role === "giver" ? (
                <div key={message.id} className="max-w-[85%] self-start">
                  <p className="mb-0.5 ml-1 text-[10px] text-base-content/50">
                    {message.sender}
                  </p>
                  <div className="rounded-[12px] rounded-tl-none bg-base-200 p-2.5 text-xs text-base-content">
                    {message.content}
                  </div>
                </div>
              ) : (
                <div key={message.id} className="max-w-[85%] self-end">
                  <div className="rounded-[12px] rounded-tr-none bg-primary p-2.5 text-xs text-primary-content">
                    {message.content}
                  </div>
                </div>
              ),
            )}
          </div>
          <div className="mt-auto border-t border-base-200 bg-base-100 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ketik pesan..."
                className="input input-sm input-bordered h-9 flex-1 text-xs"
              />
              <button className="btn btn-sm h-9 border-none bg-primary px-4 text-xs font-bold text-primary-content">
                Kirim
              </button>
            </div>
          </div>
        </Surface>
      </div>
    </div>
  );
}
