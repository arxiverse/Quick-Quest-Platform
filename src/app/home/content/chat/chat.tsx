import { Surface } from "../../home.ui";
import { chatPreviews } from "./chat.service";

function ChatComponent() {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
      <Surface className="p-2 sm:p-2">
        <div className="space-y-3">
          {chatPreviews.map((chat) => (
            <button key={`${chat.name}-${chat.time}`} type="button" className="w-full items-start gap-3 rounded-[14px] border border-base-300/70 bg-base-100 p-3 text-left transition-colors hover:bg-base-200/70">
              <div className="mt-1 size-10 rounded-full bg-base-300" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-bold text-base-content">{chat.name}</p>
                  <span className="text-[11px] font-semibold text-base-content/45">{chat.time}</span>
                </div>
                <p className="mt-1 truncate text-sm text-base-content/60">{chat.message}</p>
              </div>
              {chat.unread && <span className="mt-2 size-2.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </Surface>

      <Surface className="p-3 sm:p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">Thread Preview</p>
        <h2 className="mt-2 text-xl font-bold text-base-content">Neira</h2>
        <div className="mt-6 space-y-4">
          <div className="chat chat-start">
            <div className="chat-bubble bg-base-200 text-base-content">Lokasi udah aman, aku mulai dari area depan dulu ya.</div>
          </div>
          <div className="chat chat-end">
            <div className="chat-bubble bg-primary text-primary-content">Gas, lanjut. Habis itu cek stok rak kanan juga.</div>
          </div>
          <div className="chat chat-start">
            <div className="chat-bubble bg-base-200 text-base-content">Siap, nanti aku update foto hasil akhirnya.</div>
          </div>
        </div>
      </Surface>
    </div>
  );
}

export default ChatComponent;

