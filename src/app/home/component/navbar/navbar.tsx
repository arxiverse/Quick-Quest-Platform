import { Link } from "react-router-dom";
import Logo from "../../../../assets/Figma/QQMLogo.png";
import { homeIconRegistry } from "../../home.icons";
import { cn, Surface } from "../../home.ui";
import type { NavbarProps } from "./navbar";

function NavbarButton({
  item,
  active,
  onActivate,
}: {
  item: NavbarProps["items"][number];
  active: boolean;
  onActivate: () => void;
}) {
  const Icon = homeIconRegistry[item.iconKey];
  const isDanger = item.tone === "danger";
  const sharedClassName = cn(
    "btn relative h-[72px] w-full justify-start rounded-[18px] border px-5 text-left normal-case shadow-[0_2px_6px_rgba(17,24,40,0.08)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-base-200",
    active && "border-[#8B3DFF] bg-[#A046FF] text-white hover:border-[#8B3DFF] hover:bg-[#A046FF]",
    !active && isDanger && "border-[#FFB8B8] bg-[#FF1616] text-white hover:border-[#FFB8B8] hover:bg-[#FF1616]",
    !active && !isDanger && "border-base-300 bg-base-100 text-base-content hover:border-primary/30 hover:bg-base-200/70"
  );

  const content = (
    <>
      <Icon className="size-5 shrink-0" />
      <span className="flex-1 text-base font-bold xl:text-lg">{item.label}</span>
      <span className={cn("h-12 w-[5px] rounded-full transition-colors", active || isDanger ? "bg-white" : "bg-base-content/80")} />
    </>
  );

  if (item.to) {
    return (
      <Link to={item.to} className={sharedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={sharedClassName} onClick={onActivate} aria-pressed={active}>
      {content}
    </button>
  );
}

function NavbarComponent({ items, mobileItems, actions, activeView, onViewChange }: NavbarProps) {
  return (
    <>
      <aside className="hidden xl:flex xl:min-h-[calc(100vh-2rem)] xl:flex-col xl:gap-4">
        <Surface className="p-3">
          <div className="flex items-center gap-3 rounded-[14px] bg-base-200 p-3">
            <div className="flex size-[68px] items-center justify-center rounded-[16px] border border-base-300/70 bg-base-100 shadow-sm">
              <img src={Logo} alt="NVRS QQM" className="size-12 object-contain" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-base-content/50">Quick Quest</p>
              <h1 className="text-xl font-bold text-base-content">NVRS QQM</h1>
            </div>
          </div>
        </Surface>

        <Surface className="flex-1 p-3">
          <div className="space-y-3">
            {items.map((item) => (
              <NavbarButton
                key={item.key}
                item={item}
                active={item.view === activeView}
                onActivate={() => item.view && onViewChange(item.view)}
              />
            ))}
          </div>
        </Surface>

        <Surface className="p-3">
          <div className="space-y-3">
            {actions.map((item) => (
              <NavbarButton
                key={item.key}
                item={item}
                active={item.view === activeView}
                onActivate={() => item.view && onViewChange(item.view)}
              />
            ))}
          </div>
        </Surface>
      </aside>

      <div className="fixed inset-x-2 bottom-2 z-40 xl:hidden">
        <div className="mx-auto max-w-[430px] rounded-[18px] border border-base-300/70 bg-base-100/95 px-2.5 py-2 shadow-[0_6px_30px_rgba(17,24,40,0.18)] backdrop-blur">
          <div className="grid grid-cols-6 gap-1">
            {mobileItems.map((item) => {
              const Icon = homeIconRegistry[item.iconKey];
              const active = item.view === activeView;
              return (
                <button
                  key={item.key}
                  type="button"
                  className="relative flex flex-col items-center gap-1 rounded-[12px] px-1.5 py-2 text-center transition-colors"
                  onClick={() => item.view && onViewChange(item.view)}
                  aria-pressed={active}
                >
                  {active && <span className="absolute -top-2 h-[5px] w-10 rounded-full bg-[#6600FF]" />}
                  <Icon className={cn("size-5 transition-colors", active ? "text-[#6600FF]" : "text-base-content/60")} />
                  <span className={cn("text-[10px] font-medium sm:text-[11px]", active ? "text-[#6600FF]" : "text-base-content/60")}>
                    {item.mobileLabel ?? item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default NavbarComponent;
