import { Surface } from "../../home.ui";
import { recentActivities } from "./recent.service";

function RecentComponent() {
  return (
    <div className="space-y-4">
      {recentActivities.map((activity, index) => (
        <Surface key={`${activity.title}-${index}`} className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <span className="size-3 rounded-full bg-primary" />
              {index < recentActivities.length - 1 && <span className="mt-2 h-16 w-px bg-base-300" />}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-base-content">{activity.title}</h3>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">{activity.time}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-base-content/65">{activity.detail}</p>
            </div>
          </div>
        </Surface>
      ))}
    </div>
  );
}

export default RecentComponent;

