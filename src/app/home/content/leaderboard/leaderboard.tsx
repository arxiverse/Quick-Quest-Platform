import { Surface } from "../../home.ui";
import { leaderboardEntries } from "./leaderboard.service";

function LeaderboardComponent() {
  return (
    <div className="space-y-4">
      <Surface className="border-primary/20 bg-primary/5 p-5 sm:hidden">
        <p className="text-sm font-medium text-base-content/70">Leaderboard paling enak dipantau di desktop. Di mobile kita sengaja nggak tampilin di nav bawah biar dock tetap ringkas.</p>
      </Surface>

      <div className="grid gap-4 md:grid-cols-2">
        {leaderboardEntries.map((entry) => (
          <Surface key={entry.rank} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-[14px] bg-base-200 text-lg font-bold text-base-content">#{entry.rank}</div>
                <div>
                  <h3 className="text-lg font-bold text-base-content">{entry.name}</h3>
                  <p className="mt-1 text-sm text-base-content/60">{entry.points}</p>
                </div>
              </div>
              <span className="badge border-none bg-[#D9F99D] px-3 py-3 text-black">{entry.badge}</span>
            </div>
          </Surface>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardComponent;

