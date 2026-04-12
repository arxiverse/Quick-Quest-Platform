import { ArrowLeftIcon } from "../../../home.icons";
import { Surface } from "../../../home.ui";

export function KycSettlement({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onBack}
        className="btn btn-sm border-base-300 bg-base-100/50 hover:bg-base-200 self-start gap-2 h-10 px-4 rounded-[10px] text-base-content/80 shadow-sm"
      >
        <ArrowLeftIcon className="size-4" />
        Kembali ke Dashboard Profil
      </button>

      <Surface className="p-5 sm:p-7 relative overflow-hidden border border-success/30 shadow-xl max-w-5xl mx-auto w-full">
         <div className="absolute top-0 right-0 h-40 w-40 bg-success/10 rounded-bl-[100px] blur-2xl pointer-events-none" />
         
         <div>
            <h1 className="text-2xl font-bold text-base-content tracking-tight">Financial Hub & Settlement</h1>
            <p className="text-sm text-base-content/60 mt-1">Cairkan saldo upah QQM Anda ke Rekening Bank atau E-Wallet dalam hitungan menit.</p>
         </div>

         <div className="mt-8 grid lg:grid-cols-[1fr_350px] gap-8 relative z-10">
            <div className="space-y-6">
               <div className="p-6 rounded-[16px] bg-gradient-to-tr from-[#166534] to-[#22C55E] text-white shadow-lg shadow-success/20">
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-80">Total Saldo Tersedia (Net Amount)</p>
                  <h2 className="mt-2 text-4xl font-black font-mono">Rp 18.600.000</h2>
                  <div className="mt-6 flex items-center gap-4">
                     <span className="bg-black/20 px-3 py-1 text-xs rounded-[6px] backdrop-blur font-bold font-mono border border-white/10">ESCROW CLEARED</span>
                     <span className="text-xs opacity-75">Tersedia ditarik kapan saja 24/7.</span>
                  </div>
               </div>

               <h3 className="text-sm font-bold text-base-content border-b border-base-200 pb-2 mt-8">Pilih Metode Tujuan Pencairan</h3>
               
               <div className="grid grid-cols-2 gap-3">
                  <div className="relative rounded-[12px] border-2 border-success bg-success/5 p-4 cursor-pointer">
                     <div className="absolute top-3 right-3 size-4 rounded-full bg-success flex items-center justify-center">
                        <svg className="size-2.5 text-white" viewBox="0 0 10 10" fill="none"><path d="M2.5 5L4.5 7L7.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                     </div>
                     <p className="text-lg font-black italic text-[#0000A0]">BCA</p>
                     <p className="text-xs font-semibold text-base-content mt-1">Rp 0 Fee Instan</p>
                  </div>
                  <div className="rounded-[12px] border border-base-300 bg-base-100 p-4 cursor-pointer hover:border-base-300/80 transition-colors">
                     <p className="text-lg font-black italic text-[#005E6A]">Mandiri</p>
                     <p className="text-xs font-semibold text-base-content mt-1">Rp 0 Fee Instan</p>
                  </div>
                  <div className="rounded-[12px] border border-base-300 bg-base-100 p-4 cursor-pointer hover:border-base-300/80 transition-colors">
                     <p className="text-lg font-black italic text-[#0B5C95]">GOPAY</p>
                     <p className="text-xs font-semibold text-base-content mt-1">Admin + Rp 1.500</p>
                  </div>
                  <div className="flex items-center justify-center rounded-[12px] border border-dashed border-base-300 bg-base-200/50 p-4 cursor-pointer hover:bg-base-200">
                     <p className="text-xs font-bold text-base-content/50">+ Tambah Akun</p>
                  </div>
               </div>

               <div className="mt-6 form-control w-full">
                  <label className="label"><span className="label-text font-bold text-xs uppercase tracking-wider text-base-content/60">Nominal Penarikan Saldo</span></label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg text-base-content/50">Rp</span>
                     <input type="tel" className="input input-lg w-full pl-12 font-bold text-2xl font-mono border-base-300 focus:border-success bg-base-100 placeholder:text-base-300" placeholder="0" defaultValue="5,000,000" />
                  </div>
                  <label className="label">
                     <span className="label-text-alt text-base-content/50 font-medium">Minimal penarikan: Rp 50.000</span>
                     <button className="label-text-alt font-bold text-success hover:underline">Tarik Semua</button>
                  </label>
               </div>
            </div>

            <div className="flex flex-col gap-6">
               <div className="rounded-[12px] bg-base-200 border border-base-300 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-3">Rincian Transaksi</p>
                  <div className="space-y-3 text-sm">
                     <div className="flex justify-between items-center">
                        <span className="text-base-content/70">Nominal Tarik</span>
                        <span className="font-semibold font-mono">Rp 5.000.000</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-base-content/70">Biaya Layanan</span>
                        <span className="text-success font-semibold">Gratis</span>
                     </div>
                     <div className="flex justify-between items-center border-t border-base-300 pt-3 mt-3">
                        <span className="font-bold text-base-content">Total Diterima</span>
                        <span className="text-xl font-bold font-mono text-success">Rp 5.000.000</span>
                     </div>
                  </div>

                  <button className="btn btn-block bg-success hover:bg-success/90 text-white font-bold border-none mt-6 h-12 shadow-md shadow-success/20">
                     Konfirmasi & Tarik Saldo
                  </button>
               </div>

               <div className="rounded-[12px] bg-warning/10 border border-warning/30 p-4">
                  <div className="flex gap-3">
                     <div className="shrink-0 text-xl">🛡️</div>
                     <div>
                        <p className="text-xs font-bold text-warning-content">QQM Escrow Protection</p>
                        <p className="text-[10px] text-warning-content/80 mt-1.5 leading-relaxed">Dana ini adalah pencairan sah hasil dari keringat *Runner* yang telah divalidasi dan bukan berasal dari uang hasil money laundry. Seluruh KYC Settlement telah disetujui OJK.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </Surface>
    </div>
  );
}
