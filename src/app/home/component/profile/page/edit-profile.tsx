import { ArrowLeftIcon } from "../../../home.icons";
import { Surface } from "../../../home.ui";

export function EditProfile({ onBack }: { onBack: () => void }) {
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

      <Surface className="p-5 sm:p-7 relative overflow-hidden border border-base-300 shadow-xl max-w-4xl">
         <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 rounded-bl-[100px] blur-2xl pointer-events-none" />
         
         <div className="relative z-10 flex flex-col md:flex-row gap-8">
            <div className="md:w-[250px] shrink-0">
               <div className="flex flex-col items-center gap-3">
                  <div className="size-32 rounded-full border-4 border-base-100 shadow-lg bg-base-200 relative overflow-hidden flex items-center justify-center cursor-pointer group">
                     {/* Pseudo Image Placeholder */}
                     <span className="text-4xl">😎</span>
                     <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-[10px] font-bold transition-all">
                        UBAH FOTO
                     </div>
                  </div>
                  <div className="text-center">
                     <p className="text-[11px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded uppercase tracking-wider">Terverifikasi KYC</p>
                     <p className="text-xs text-base-content/50 mt-1">Sertifikat ID Valid sampai 2029</p>
                  </div>
               </div>

               <div className="mt-8">
                  <p className="text-xs font-bold text-base-content/60 uppercase tracking-widest mb-3">Menu Profil</p>
                  <ul className="space-y-1">
                     <li><a href="#" className="flex px-3 py-2 text-sm font-semibold text-primary bg-primary/5 rounded-[8px]">Infromasi Dasar</a></li>
                     <li><a href="#" className="flex px-3 py-2 text-sm font-semibold text-base-content/70 hover:bg-base-200 rounded-[8px]">Skill & Kategori Kerja</a></li>
                     <li><a href="#" className="flex px-3 py-2 text-sm font-semibold text-base-content/70 hover:bg-base-200 rounded-[8px]">Lokasi & Kontak</a></li>
                  </ul>
               </div>
            </div>
            
            <div className="flex-1 space-y-6">
               <div>
                  <h1 className="text-2xl font-bold text-base-content tracking-tight">Edit Informasi Dasar</h1>
                  <p className="text-sm text-base-content/60 mt-1">Perbarui data dirimu agar relevan dengan algoritma pencocokan Giver.</p>
               </div>
               
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="form-control w-full">
                        <label className="label"><span className="label-text font-bold text-xs">Nama Lengkap (KTP)</span></label>
                        <input type="text" placeholder="Sesuai KTP" className="input input-sm h-10 w-full bg-base-200 border-transparent focus:border-primary" defaultValue="Neiraverse" />
                     </div>
                     <div className="form-control w-full">
                        <label className="label"><span className="label-text font-bold text-xs">Nama Panggilan / Alias</span></label>
                        <input type="text" placeholder="Alias lu di lapapangan" className="input input-sm h-10 w-full bg-base-200 border-transparent focus:border-primary" defaultValue="Bang Neira" />
                     </div>
                  </div>
                  
                  <div className="form-control w-full">
                     <label className="label"><span className="label-text font-bold text-xs">Posisi / Tagline Singkat</span></label>
                     <input type="text" placeholder="Bisa apa aja?" className="input input-sm h-10 w-full bg-base-200 border-transparent focus:border-primary" defaultValue="Elite Runner & Giver Explorer" />
                  </div>
                  
                  <div className="form-control w-full">
                     <label className="label"><span className="label-text font-bold text-xs">Bio Singkat</span></label>
                     <textarea className="textarea h-24 w-full bg-base-200 border-transparent focus:border-primary resize-none" placeholder="Ceritain kehebatan lu..."></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="form-control w-full">
                        <label className="label"><span className="label-text font-bold text-xs">Titik Operasional (Domisili)</span></label>
                        <input type="text" placeholder="Area jelajah" className="input input-sm h-10 w-full bg-base-200 border-transparent focus:border-primary" defaultValue="Jakarta Selatan" />
                     </div>
                     <div className="form-control w-full">
                        <label className="label"><span className="label-text font-bold text-xs">Nomor Kontak Mediasi</span></label>
                        <input type="text" placeholder="+62" className="input input-sm h-10 w-full bg-base-200 border-transparent focus:border-primary" defaultValue="+62 822 1234 5678" />
                     </div>
                  </div>
                  
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-[10px] mt-2">
                     <p className="text-xs text-warning-content"><span className="font-bold">⚠️ Perhatian:</span> Mengubah Nama Lengkap (Sesuai KTP) membutuhkan resubmisi KYC yang dapat memakan waktu 1x24 Jam validasi.</p>
                  </div>
               </div>
               
               <div className="pt-4 border-t border-base-200 flex justify-end gap-3">
                  <button className="btn h-10 min-h-10 border-base-300 border bg-transparent px-6 shadow-none">Reset Data</button>
                  <button className="btn h-10 min-h-10 border-none bg-primary text-primary-content px-8 shadow-md shadow-primary/20 hover:opacity-90">Simpan Profil</button>
               </div>
            </div>
         </div>
      </Surface>
    </div>
  );
}
