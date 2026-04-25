import { useState, useRef } from "react";
import { ArrowLeftIcon } from "../../../home.icons";
import { Surface, cn } from "../../../home.ui";

export function PromotionEditor({
  onBack,
  onBoostPayment,
}: {
  onBack: () => void;
  onBoostPayment?: (boostPackageId: string, postTitle: string) => void;
}) {
  const [selectedPackage, setSelectedPackage] = useState("basic");
  const titleRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onBack}
        className="btn btn-sm border-base-300 bg-base-100/50 hover:bg-base-200 self-start gap-2 h-10 px-4 rounded-[10px] text-base-content/80 shadow-sm"
      >
        <ArrowLeftIcon className="size-4" />
        Batal & Kembali
      </button>

      <Surface className="p-6 sm:p-8 max-w-3xl border border-base-300">
        <h1 className="text-2xl font-bold mb-2 text-base-content tracking-tight">
          Buat Postingan Jasa
        </h1>
        <p className="text-sm text-base-content/60 mb-8 leading-relaxed">
          Isi detail keahlian atau *gig* yang mau lo tawarin ke *Giver*.
          Pastikan judulnya menarik perhatin dan *Rate* harga bersahabat!
        </p>

        <div className="space-y-5">
          <div className="form-control w-full">
            <label className="label pb-1.5">
              <span className="label-text font-bold text-xs uppercase tracking-wide">
                Judul Jasa / Promosi
              </span>
            </label>
            <input
              ref={titleRef}
              type="text"
              placeholder="Contoh: Jasa Joki Rank Valorant Radiant"
              className="input h-10 min-h-10 w-full bg-base-200 border-transparent focus:border-primary text-sm"
            />
          </div>

          <div className="form-control w-full">
            <label className="label pb-1.5">
              <span className="label-text font-bold text-xs uppercase tracking-wide">
                Kategori
              </span>
            </label>
            <select
              defaultValue="default"
              className="select h-10 min-h-10 w-full bg-base-200 border-transparent focus:border-primary text-sm font-medium"
            >
              <option disabled value="default">
                Pilih Kategori
              </option>
              <option>Jasa Digital</option>
              <option>Kreatif & Desain</option>
              <option>Jasa Fisik & Lapangan</option>
              <option>Loker & Rekrutmen</option>
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label pb-1.5">
              <span className="label-text font-bold text-xs uppercase tracking-wide">
                Deskripsi Lengkap
              </span>
            </label>
            <textarea
              className="textarea h-32 w-full bg-base-200 border-transparent focus:border-primary resize-none text-sm leading-relaxed"
              placeholder="Ceritakan detail jasa, keunggulan, atau portfolio mini lo di sini..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="form-control w-full">
              <label className="label pb-1.5">
                <span className="label-text font-bold text-xs uppercase tracking-wide">
                  Rate Harga (Opsional)
                </span>
              </label>
              <input
                type="text"
                placeholder="Mulai dari Rp. 50.000 / Jam"
                className="input h-10 min-h-10 w-full bg-base-200 border-transparent focus:border-primary text-sm"
              />
            </div>
            <div className="form-control w-full">
              <label className="label pb-1.5">
                <span className="label-text font-bold text-xs uppercase tracking-wide">
                  Tags Kemampuan
                </span>
              </label>
              <input
                type="text"
                placeholder="Pisahkan pakai koma (Cth: Design, Logo)"
                className="input h-10 min-h-10 w-full bg-base-200 border-transparent focus:border-primary text-sm"
              />
            </div>
          </div>

          {/* Upsell Boost Engine */}
          <div className="mt-8 pt-6 border-t border-base-200">
            <label className="label pb-3">
              <span className="label-text font-bold text-xs uppercase tracking-wide text-base-content/70">
                Pilih Eksposur Tayangan (Ads Boost)
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setSelectedPackage("basic")}
                className={cn(
                  "cursor-pointer rounded-[12px] border-2 p-4 transition-all",
                  selectedPackage === "basic"
                    ? "border-base-300 bg-base-200"
                    : "border-transparent bg-base-100 hover:border-base-300/50",
                )}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>Basic Post</span>
                  <span className="text-base-content/60 text-sm">Gratis</span>
                </div>
                <p className="text-xs text-base-content/60 leading-relaxed">
                  Postingan akan masuk ke urutan standar sesuai algoritma
                  *matching* dan pencarian biasa.
                </p>
              </div>

              <div
                onClick={() => setSelectedPackage("vip")}
                className={cn(
                  "cursor-pointer rounded-[12px] border-2 p-4 transition-all relative overflow-hidden group",
                  selectedPackage === "vip"
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-[#A046FF]/30 bg-base-100 hover:border-primary/60",
                )}
              >
                {selectedPackage === "vip" && (
                  <div className="absolute top-0 right-0 h-24 w-24 bg-primary/20 rounded-bl-full blur-[20px] pointer-events-none" />
                )}
                <div className="flex items-center justify-between font-bold mb-1 relative z-10">
                  <span className="bg-linear-to-r from-[#A046FF] to-[#38BDF8] bg-clip-text text-transparent">
                    VIP Spotlight Boost
                  </span>
                  <span className="text-primary text-sm">Rp 25.000</span>
                </div>
                <p className="text-xs text-base-content/70 leading-relaxed font-medium relative z-10">
                  🔥 Dipajang permanen di **Slider Atas (Hero Banner)** selama
                  24 Jam. Jaminan orderan meledak!
                </p>
                {selectedPackage === "vip" && (
                  <div className="absolute top-3 right-3">
                    <span className="flex size-3 items-center justify-center rounded-full bg-primary/20">
                      <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-base-200">
            <button
              onClick={onBack}
              className="btn h-10 min-h-10 bg-transparent border border-base-300 font-bold px-6 shadow-none hover:bg-base-200"
            >
              Batal Draft
            </button>
            <button
              onClick={() => {
                if (selectedPackage === "vip" && onBoostPayment) {
                  const title = titleRef.current?.value || "Postingan Jasa Baru";
                  onBoostPayment("boost-vip-24h", title);
                } else {
                  onBack();
                }
              }}
              className="btn h-10 min-h-10 bg-primary text-primary-content hover:bg-primary/90 border-none font-bold px-8 shadow-md shadow-primary/25"
            >
              {selectedPackage === "vip"
                ? "Bayar & Publikasikan 🚀"
                : "Publikasikan Jasa P2P"}
            </button>
          </div>
        </div>
      </Surface>
    </div>
  );
}
