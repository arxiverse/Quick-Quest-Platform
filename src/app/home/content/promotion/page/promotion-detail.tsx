import { ArrowLeftIcon, StarIcon, ChatIcon } from "../../../home.icons";
import { Surface } from "../../../home.ui";
import { MOCK_PROMOTIONS } from "../promotion";

import Folder from "../../../../../Animation/Folder";
import Carousel from "../../../../../Animation/Carousel";
import { useAnimationTheme } from "../../../../global.theme";

export function PromotionDetail({
  id,
  onBack,
}: {
  id: string;
  onBack: () => void;
}) {
  const promo = MOCK_PROMOTIONS.find((p) => p.id === id);
  const { animationsEnabled } = useAnimationTheme();

  if (!promo) {
    return (
      <div className="flex flex-col gap-4">
        <button onClick={onBack} className="btn btn-sm btn-ghost self-start">
          <ArrowLeftIcon className="size-4" /> Kembali
        </button>
        <p>Jasa tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-7 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-6xl mx-auto w-full pb-8">
      {/* Navigation Return */}
      <button
        type="button"
        onClick={onBack}
        className="btn btn-sm border-base-300 bg-base-100/50 hover:bg-base-200 self-start gap-2 h-10 px-4 rounded-[10px] text-base-content/80 shadow-sm"
      >
        <ArrowLeftIcon className="size-4" />
        Kembali ke Etalase Jasa
      </button>

      {/* Hero Header & Gallery Mock */}
      <Surface className="relative overflow-hidden p-0 border border-base-300 shadow-md">
        <div className="h-32 sm:h-48 bg-linear-to-tr from-primary/80 to-base-300 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <span className="badge badge-sm badge-neutral gap-1.5 opacity-90">
              <StarIcon className="size-3" /> {promo.likes} Likes
            </span>
          </div>
        </div>
        <div className="px-5 pb-6 pt-0 relative sm:px-8">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-end -mt-12 sm:-mt-16">
            <div className="flex size-24 sm:size-32 shrink-0 items-center justify-center rounded-[18px] bg-base-100 border-4 border-base-100 shadow-xl text-5xl z-10">
              {promo.avatarIcon}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
                  {promo.providerName}
                </h1>
                {promo.isAvailable ? (
                  <span className="shrink-0 flex items-center gap-1.5 rounded-[6px] bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-bold text-[#166534]">
                    <span className="size-1.5 rounded-full bg-current animate-pulse" />{" "}
                    TERSEDIA
                  </span>
                ) : (
                  <span className="shrink-0 rounded-[6px] bg-base-200 px-2 py-0.5 text-[10px] font-bold text-base-content/50">
                    SEDANG SIBUK
                  </span>
                )}
              </div>
              <p className="font-semibold text-primary">
                {promo.providerRole} • {promo.category}
              </p>
              <h2 className="mt-2 text-lg sm:text-xl font-bold text-base-content">
                {promo.title}
              </h2>
            </div>
            <div className="pb-2 w-full sm:w-auto">
              <button
                disabled={!promo.isAvailable}
                className="btn w-full sm:w-auto btn-primary font-bold shadow-lg shadow-primary/30 h-12 px-8"
              >
                <ChatIcon className="size-4" /> Kontak Sekarang
              </button>
            </div>
          </div>
        </div>
      </Surface>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content: Description & Portfolio */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
          <Surface className="p-5 sm:p-7 border border-base-300">
            <h3 className="text-xs font-bold text-base-content/50 uppercase tracking-[0.15em] mb-4">
              Tentang Jasa Ini
            </h3>
            <div className="prose prose-sm max-w-none text-base-content/80 leading-relaxed">
              <p className="text-base">{promo.description}</p>
              <p>
                Kualitas dan integritas adalah prioritas utama pekerjaan saya.
                Berikut kelebihan yang akan Anda dapatkan jika merekrut saya
                melalui Escrow QQM:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Pelayanan responsif 24/7 (SLA dijamin cepat).</li>
                <li>
                  Sistem *Milestone Task* (Khusus jasa yang memakan waktu di
                  atas 1 minggu).
                </li>
                <li>
                  Garansi Revisi (Tergantung paket *pricing* yang diambil).
                </li>
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {promo.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-base-200 border border-base-300 px-3 py-1 text-xs font-semibold text-base-content/70"
                >
                  #{t}
                </span>
              ))}
            </div>
          </Surface>

          {/* Portfolio / Attachments Gallery */}
          <Surface className="p-5 sm:p-7 border border-base-300">
            <h3 className="text-xs font-bold text-base-content/50 uppercase tracking-[0.15em] mb-4">
              Portofolio & File Pendukung
            </h3>
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start overflow-hidden">
              {animationsEnabled ? (
                <Carousel
                  baseWidth={280}
                  autoplay={true}
                  loop={true}
                  items={[
                    {
                      id: 1,
                      title: "Toko Sembako App",
                      description: "Modern POS System UI",
                      icon: <StarIcon className="text-white h-4 w-4" />,
                    },
                    {
                      id: 2,
                      title: "Neiraverse Login",
                      description: "Cyberpunk Authentication",
                      icon: <StarIcon className="text-white h-4 w-4" />,
                    },
                    {
                      id: 3,
                      title: "SOP Document",
                      description: "Workflow documentation",
                      icon: <StarIcon className="text-white h-4 w-4" />,
                    },
                  ]}
                />
              ) : (
                <div className="h-48 w-full bg-base-200 rounded-xl flex items-center justify-center border border-base-300">
                  <p className="text-base-content/50 font-bold">
                    Galeri Portofolio (Animasi Nonaktif)
                  </p>
                </div>
              )}

              <div className="flex-1 flex flex-wrap gap-6 justify-center">
                {animationsEnabled ? (
                  <>
                    <div className="flex flex-col items-center gap-2">
                      <Folder color="#2563EB" />
                      <span className="text-[10px] font-bold">
                        Kontrak_Kerja.pdf
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Folder color="#8B5CF6" />
                      <span className="text-[10px] font-bold">
                        Assets_Mocks.zip
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2 w-full">
                    <span className="btn btn-sm btn-outline">
                      Kontrak_Kerja.pdf
                    </span>
                    <span className="btn btn-sm btn-outline">
                      Assets_Mocks.zip
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Surface>

          {/* Fake Testimonials */}
          <Surface className="p-5 sm:p-7 border border-base-300 bg-base-100">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-xs font-bold text-base-content/50 uppercase tracking-[0.15em]">
                  Riwayat & Ulasan Giver
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <StarIcon className="size-5 text-[#F59E0B]" />
                  <span className="text-2xl font-black text-base-content">
                    4.9
                  </span>
                  <span className="text-sm font-semibold text-base-content/50">
                    / 5.0 (48 Ulasan Terverifikasi)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: "Toko Sembako Baru",
                  role: "Giver Spesialis",
                  review:
                    "Gila kerjanya cepet banget, sesuai SOP awal. The best runner lah ga rugi hire lewat QQM!",
                  rating: 5,
                  date: "12 Apr 2026",
                },
                {
                  name: "Budi Santoso",
                  role: "Giver Individu",
                  review:
                    "Komunikasinya bagus, sempet ada delay dikit tapi direvisi cepat dan dikasih *after-sales* yang oke.",
                  rating: 4.8,
                  date: "09 Apr 2026",
                },
                {
                  name: "PT. Maju Mundur",
                  role: "Korporasi (Verified)",
                  review:
                    "Cukup memuaskan. Skil relevan dengan yang ditulis. Sangat pantas mendapatkan badge Elite Runner.",
                  rating: 5,
                  date: "03 Apr 2026",
                },
              ].map((t, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[12px] border border-base-200 bg-base-100/50"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                      <div className="size-10 rounded-full bg-base-300 flex items-center justify-center font-bold text-base-content/50">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-base-content">
                          {t.name}
                        </p>
                        <p className="text-[11px] text-primary font-semibold">
                          {t.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-0.5 text-[#F59E0B]">
                        <StarIcon className="size-3" />
                        <StarIcon className="size-3" />
                        <StarIcon className="size-3" />
                        <StarIcon className="size-3" />
                        <StarIcon className="size-3" />
                      </div>
                      <p className="text-[10px] text-base-content/40 font-semibold mt-1">
                        {t.date}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] text-base-content/75 leading-relaxed">
                    "{t.review}"
                  </p>
                </div>
              ))}
              <button className="btn btn-block btn-sm border-base-300 bg-base-200 text-base-content/70 hover:bg-base-300">
                Muat Lebih Banyak Ulasan...
              </button>
            </div>
          </Surface>
        </div>

        {/* Sidebar: Pricings / Paket Khusus */}
        <div className="flex flex-col gap-4">
          {/* Custom Package Component */}
          <Surface className="p-0 border border-base-300 overflow-hidden sticky top-24">
            <div className="bg-base-200 px-5 py-3 border-b border-base-300 relative z-10">
              <h3 className="font-bold text-base-content tracking-wide">
                Pricelist & Paket Layanan
              </h3>
            </div>
            <div className="p-5 flex flex-col gap-5 h-full">
                <div className="flex flex-col gap-4">
                  {/* Basic Package */}
                  <div className="group border border-base-300 rounded-[12px] p-4 bg-base-100 hover:border-primary/40 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-base-content text-lg">
                        Pekerjaan Lepas
                      </h4>
                      <span className="font-mono font-bold text-base-content">
                        {promo.rate}
                      </span>
                    </div>
                    <p className="text-xs text-base-content/60">
                      Layanan standar dan fleksibel sesuai deskripsi iklan. Nego di chat.
                    </p>
                  </div>

                  {/* Pro Package */}
                  <div className="relative group border-2 border-primary rounded-[12px] p-4 bg-primary/5 hover:border-primary transition-colors overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-[8px] uppercase">
                      Rekomendasi
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-primary text-lg">
                        Paket "Terima Beres"
                      </h4>
                      <span className="font-mono font-bold text-base-content text-lg">
                        Custom
                      </span>
                    </div>
                    <p className="text-xs text-base-content/70 font-semibold mb-4">
                      Include Prioritas Pengerjaan & Free Revisi.
                    </p>
                    <button className="btn btn-primary btn-sm btn-block h-10 shadow-lg shadow-primary/30 font-bold">
                      Pilih Paket Pro
                    </button>
                  </div>
                </div>

              <div className="p-4 bg-warning/10 border border-warning/20 rounded-[12px] mt-2 relative z-10">
                <div className="flex gap-2">
                  <span className="text-lg">🛡️</span>
                  <div>
                    <p className="text-xs font-bold text-warning-content">
                      QQM Escrow Protection
                    </p>
                    <p className="text-[10px] text-warning-content/80 mt-1 leading-relaxed">
                      Dana Anda akan ditahan di rekening bersama QQM hingga
                      *Runner*/Penyedia Jasa ini mengumpulkan bukti penyelesaian
                      pekerjaan (SOP Lulus).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}
