import { useAdminRoute } from "../route.context.tsx";

export default function AdminLoginComponent() {
  const { navigate } = useAdminRoute();

  return (
    <div className="theme-bg min-h-screen bg-base-100 px-6 py-8 text-base-content">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <div className="rounded-[20px] border border-base-300 bg-base-100 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-base-content/50">
            Administrator
          </p>
          <h1 className="mt-2 text-3xl font-bold">Admin Login</h1>
          <p className="mt-2 text-sm leading-relaxed text-base-content/70">
            Halaman login admin masih placeholder, tapi route internal admin
            sekarang sudah terpisah rapi dari AppRoot.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("administrator")}
              className="btn h-10 min-h-10 rounded-[10px] border-none bg-primary px-4 text-sm text-primary-content shadow-none hover:opacity-90"
            >
              Masuk Administrator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
