import { SwitchTheme } from "../../../global.theme";
import { SearchIcon } from "../../home.icons";
import { Surface } from "../../home.ui";
import type { HeaderProps } from "./header";
import ProfileComponent from "../profile/profile.tsx";

function HeaderComponent({ meta, profile, onProfileOpen }: HeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <Surface className="overflow-hidden p-4 sm:p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-base-content/45">{meta.eyebrow}</p>
            <h1 className="mt-2 text-2xl font-bold leading-tight text-base-content sm:text-3xl xl:max-w-[15ch] xl:text-[2.15rem]">{meta.title}</h1>
            <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-base-content/65 sm:text-base">{meta.description}</p>
          </div>
          <div className="flex items-center justify-end xl:min-w-[14rem] xl:pt-1">
            <SwitchTheme />
          </div>
        </div>
      </Surface>

      <Surface className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="input input-bordered flex h-12 w-full items-center gap-3 rounded-[12px] border-base-300 bg-base-100 px-4 text-base-content shadow-none transition-colors focus-within:border-primary/40 sm:h-[61px]">
            <SearchIcon className="size-5 text-base-content/50 sm:size-6" />
            <input
              type="text"
              placeholder={meta.searchPlaceholder}
              className="grow text-sm font-semibold text-base-content placeholder:text-base-content/50 sm:text-lg"
            />
          </label>
          <div className="xl:hidden">
            <button type="button" className="w-full text-left" onClick={onProfileOpen}>
              <ProfileComponent profile={profile} compact className="w-full md:min-w-[15.5rem]" />
            </button>
          </div>
        </div>
      </Surface>
    </div>
  );
}

export default HeaderComponent;
