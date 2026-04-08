import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Surface } from "../../home.ui";
import { elementChartPoints, elementMetrics, elementTableRows } from "./element.service";

type TooltipRow = {
  color?: string;
  name?: string;
  value?: string | number;
};

function ElementTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipRow[]; label?: string }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-[14px] border border-base-300/70 bg-base-100/95 px-3 py-2 shadow-lg backdrop-blur">
      {label && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">{label}</p>}
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={`${entry.name}-${entry.value}`} className="flex items-center gap-2 text-sm text-base-content">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.color ?? "#A046FF" }} />
            <span className="font-medium text-base-content/65">{entry.name}</span>
            <span className="font-bold text-base-content">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ElementComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {elementMetrics.map((metric) => (
          <Surface key={metric.label} className="p-5">
            <p className="text-sm font-semibold text-base-content/55">{metric.label}</p>
            <p className="mt-3 text-3xl font-bold text-base-content">{metric.value}</p>
            <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold text-black ${metric.tone}`}>{metric.detail}</span>
          </Surface>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">Shell Density</p>
              <h2 className="mt-2 text-xl font-bold text-base-content">Chart Playground</h2>
            </div>
            <div className="badge badge-ghost border-base-300 bg-base-100">TailAdmin vibe</div>
          </div>

          <div className="mt-6 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={elementChartPoints} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A046FF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#A046FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <Tooltip content={<ElementTooltip />} />
                <Area type="monotone" dataKey="orders" name="Orders" stroke="#A046FF" fill="url(#ordersGradient)" strokeWidth={3} />
                <Area type="monotone" dataKey="users" name="Users" stroke="#38BDF8" fill="url(#usersGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        <Surface className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">UI Elements</p>
              <h2 className="mt-2 text-xl font-bold text-base-content">Buttons, Badge, Modal</h2>
            </div>
            <button type="button" className="btn btn-sm rounded-[10px] border-none bg-primary text-primary-content shadow-none hover:opacity-90" onClick={() => setShowModal(true)}>
              Open Modal
            </button>
          </div>

          <div className="mt-6 space-y-5">
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn rounded-[12px] border-none bg-primary text-primary-content shadow-none hover:opacity-90">Primary</button>
              <button type="button" className="btn rounded-[12px] border-base-300 bg-base-100 shadow-none hover:bg-base-200">Secondary</button>
              <button type="button" className="btn rounded-[12px] border-none bg-error text-error-content shadow-none hover:opacity-90">Danger</button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="badge border-none bg-[#D9F99D] px-3 py-3 text-black">Success</span>
              <span className="badge border-none bg-[#BFDBFE] px-3 py-3 text-black">Info</span>
              <span className="badge border-none bg-[#FDE68A] px-3 py-3 text-black">Warning</span>
              <span className="badge border-none bg-[#FECACA] px-3 py-3 text-black">Issue</span>
            </div>

            <div className="space-y-3">
              <label className="form-control gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Nama Element</span>
                <input type="text" placeholder="Input placeholder" className="input input-bordered rounded-[12px] border-base-300 bg-base-100" />
              </label>

              <label className="form-control gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Kategori</span>
                <select className="select select-bordered rounded-[12px] border-base-300 bg-base-100">
                  <option>Cards</option>
                  <option>Charts</option>
                  <option>Forms</option>
                  <option>Tables</option>
                </select>
              </label>
            </div>
          </div>
        </Surface>
      </div>

      <Surface className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-base-300/70 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">Table Density</p>
            <h2 className="mt-1 text-xl font-bold text-base-content">Recent Team Snapshot</h2>
          </div>
          <div className="badge badge-ghost border-base-300 bg-base-100">4 rows</div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr className="text-base-content/55">
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              {elementTableRows.map((row) => (
                <tr key={row.name}>
                  <td className="font-semibold text-base-content">{row.name}</td>
                  <td>{row.role}</td>
                  <td>
                    <span className="badge badge-ghost border-base-300 bg-base-100">{row.status}</span>
                  </td>
                  <td className="font-bold text-base-content">{row.completion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] border border-base-300/70 bg-base-100 p-6 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">Modal Example</p>
            <h3 className="mt-2 text-2xl font-bold text-base-content">UI Density Confirmed</h3>
            <p className="mt-3 text-sm leading-relaxed text-base-content/65">
              Modal ini sengaja simpel, buat nunjukin kalau shell kita sekarang udah siap nampung dialog, form action, dan interaction pattern tambahan.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="btn rounded-[12px] border-base-300 bg-base-100 shadow-none hover:bg-base-200" onClick={() => setShowModal(false)}>
                Tutup
              </button>
              <button type="button" className="btn rounded-[12px] border-none bg-primary text-primary-content shadow-none hover:opacity-90" onClick={() => setShowModal(false)}>
                Mantap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ElementComponent;
