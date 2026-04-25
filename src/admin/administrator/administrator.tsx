import { useAdminRoute } from "../route.context.tsx";

export default function AdministratorComponent() {
  const { navigate } = useAdminRoute();

  return (
    <div className="theme-bg min-h-screen bg-base-100 px-6 py-8 text-base-content">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="rounded-[20px] border border-base-300 bg-base-100 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-base-content/50">
            Administrator
          </p>
          <h1 className="mt-2 text-3xl font-bold">Admin Side</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-base-content/70">
            Root panel masih disiapkan. Route context admin sekarang sudah aktif
            dan siap dipakai untuk pecah konten administrator tanpa router URL.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("login")}
              className="btn h-10 min-h-10 rounded-[10px] border border-base-300 bg-base-100 px-4 text-sm text-base-content shadow-none hover:bg-base-200"
            >
              Pindah ke Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
