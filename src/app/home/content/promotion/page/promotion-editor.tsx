import { ArrowLeftIcon } from "../../../home.icons";
import { Surface } from "../../../home.ui";

export function PromotionEditor({ onBack }: { onBack: () => void }) {
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

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-base-200">
            <button
              onClick={onBack}
              className="btn h-10 min-h-10 bg-transparent border border-base-300 font-bold px-6 shadow-none hover:bg-base-200"
            >
              Batal Draft
            </button>
            <button className="btn h-10 min-h-10 bg-primary text-primary-content hover:bg-primary/90 border-none font-bold px-8 shadow-md shadow-primary/25">
              Publikasikan Jasa 🚀
            </button>
          </div>
        </div>
      </Surface>
    </div>
  );
}
