import { Surface } from "../../home.ui";
import { giverCampaigns } from "./giver.service";

function GiverComponent() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
      <div className="space-y-4">
        {giverCampaigns.map((campaign) => (
          <Surface key={campaign.title} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-base-content">{campaign.title}</h3>
                <p className="mt-2 text-sm text-base-content/60">{campaign.note}</p>
              </div>
              <span className="badge border-none bg-[#BFDBFE] px-3 py-3 text-black">{campaign.status}</span>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-base-300/70 pt-4">
              <span className="text-sm font-medium text-base-content/55">Budget</span>
              <span className="text-base font-bold text-base-content">{campaign.budget}</span>
            </div>
          </Surface>
        ))}
      </div>

      <Surface className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">Checklist Giver</p>
        <h2 className="mt-2 text-xl font-bold text-base-content">Yang perlu diberesin hari ini</h2>
        <div className="mt-5 space-y-3">
          <label className="flex items-center gap-3 rounded-[14px] border border-base-300/70 bg-base-100 p-3">
            <input type="checkbox" className="checkbox checkbox-sm" defaultChecked />
            <span className="text-sm font-medium text-base-content">Final cek brief pickup gudang</span>
          </label>
          <label className="flex items-center gap-3 rounded-[14px] border border-base-300/70 bg-base-100 p-3">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span className="text-sm font-medium text-base-content">Approve foto hasil display warung</span>
          </label>
          <label className="flex items-center gap-3 rounded-[14px] border border-base-300/70 bg-base-100 p-3">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span className="text-sm font-medium text-base-content">Buka slot quest malam</span>
          </label>
        </div>
      </Surface>
    </div>
  );
}

export default GiverComponent;

