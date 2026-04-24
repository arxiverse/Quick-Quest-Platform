import { useState, useEffect } from "react";
import { SearchIcon, StarIcon, ChatIcon } from "../../home.icons";
import { Surface, cn } from "../../home.ui";
import {
  MOCK_PROMOTIONS,
  filterPromotionItems,
  promotionCategoryOptions,
  promotionViewText,
  resolveInitialPromotionSubView,
  resolvePromotionAvailabilityView,
  syncPromotionSubViewStorage,
  type PromotionCategory,
  type PromotionSubView,
} from "./promotion";
import { PromotionDetail } from "./page/promotion-detail";
import { PromotionEditor } from "./page/promotion-editor";
import BorderGlow from "../../../../Animation/BorderGlow";
import FloatingLines from "../../../../Animation/FloatingLines";
import GlareHover from "../../../../Animation/GlareHover";
import { useAnimationTheme } from "../../../global.theme";

const PromotionComponent = () => {
  const [activeCategory, setActiveCategory] =
    useState<PromotionCategory>("Semua Jasa");
  const [searchQuery, setSearchQuery] = useState("");
  const [subView, setSubView] = useState<PromotionSubView | null>(
    resolveInitialPromotionSubView,
  );

  useEffect(() => {
    syncPromotionSubViewStorage(subView);
  }, [subView]);

  const filteredPromotions = filterPromotionItems(
    MOCK_PROMOTIONS,
    activeCategory,
    searchQuery,
  );

  const { animationsEnabled } = useAnimationTheme();

  if (subView?.view === "Detail") {
    return <PromotionDetail id={subView.id} onBack={() => setSubView(null)} />;
  }

  if (subView?.view === "Editor") {
    return <PromotionEditor onBack={() => setSubView(null)} />;
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto w-full pb-8">
      {/* Hero Banner Area */}
      <Surface className="relative overflow-hidden p-6 sm:p-8 bg-linear-to-r from-primary/10 to-transparent border border-primary/20">
        {animationsEnabled ? (
          <div className="absolute inset-0 pointer-events-none opacity-80 mix-blend-overlay">
            <FloatingLines
              enabledWaves={["top", "bottom"]}
              lineCount={[12, 12]}
              lineDistance={[10, 10]}
              animationSpeed={1.2}
              interactive={false}
              linesGradient={[
                "#3B82F6",
                "#8B5CF6",
                "#EC4899",
                "#8B5CF6",
                "#3B82F6",
              ]}
            />
          </div>
        ) : (
          <div className="absolute top-0 right-0 h-64 w-64 bg-primary/20 rounded-bl-full blur-3xl rounded-full opacity-50 pointer-events-none" />
        )}
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold text-primary uppercase tracking-[0.2em] bg-primary/10 rounded-full">
            {promotionViewText.hero.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            {promotionViewText.hero.title}
          </h1>
          <p className="mt-3 text-sm text-base-content/70 leading-relaxed max-w-xl">
            {promotionViewText.hero.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setSubView({ view: "Editor" })}
              className="btn border-none bg-primary text-primary-content font-bold px-6 shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform"
            >
              🚀 {promotionViewText.hero.createPostButton}
            </button>
            <button className="btn border border-base-300 bg-base-100 font-bold px-6 text-base-content/80 shadow-sm hover:bg-base-200">
              {promotionViewText.hero.draftButton}
            </button>
          </div>
        </div>
      </Surface>

      {/* Filter & Search Toolbar */}
      <div className="sticky top-[72px] xl:top-[88px] z-20 -mx-2 px-2 py-3 backdrop-blur sm:-mx-4 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {promotionCategoryOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "shrink-0 rounded-[10px] px-4 py-2 text-[13px] font-bold transition-colors",
                  activeCategory === cat
                    ? "border-primary bg-primary text-primary-content shadow-sm shadow-primary/20"
                    : "bg-base-100 border border-base-300 text-base-content/70 hover:bg-base-300 hover:text-base-content",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative shrink-0 sm:w-72">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
            <input
              type="text"
              placeholder={promotionViewText.toolbar.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-[10px] border border-base-300 bg-base-100 py-2 pl-9 pr-4 text-sm font-medium focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid Katalog Jasa */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch w-full max-w-6xl mx-auto mt-2">
        {filteredPromotions.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-base-content/50 font-medium">
              {promotionViewText.toolbar.emptyStateMessage}
            </p>
          </div>
        ) : (
          filteredPromotions.map((promo) => {
            const availabilityView = resolvePromotionAvailabilityView(
              promo.isAvailable,
            );
            const InnerCard = () => (
              <div className="flex flex-col p-4 h-full">
                {/* Header Info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-base-200 border border-base-300 shadow-sm text-lg">
                      {promo.avatarIcon}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-base-content text-sm">
                        {promo.providerName}
                      </p>
                      <p className="truncate text-[11px] font-semibold text-primary">
                        {promo.providerRole}
                      </p>
                    </div>
                  </div>
                  <span className={availabilityView.chipClassName}>
                    {availabilityView.pulseDotClassName ? (
                      <span className={availabilityView.pulseDotClassName} />
                    ) : null}
                    {availabilityView.label}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="flex-1">
                  <h3 className="font-bold text-base-content leading-snug group-hover:text-primary transition-colors">
                    {promo.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-base-content/65 line-clamp-3 leading-relaxed">
                    {promo.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {promo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-base-200 border border-base-300/60 px-2 py-0.5 text-[10px] font-semibold text-base-content/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-3 border-t border-base-200 flex flex-wrap items-center justify-between gap-y-2 relative z-10">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
                      {promotionViewText.card.rateLabel}
                    </p>
                    <p className="text-xs font-bold text-base-content mt-0.5">
                      {promo.rate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 p-1.5 text-base-content/40 hover:text-[#F59E0B] transition-colors rounded-lg hover:bg-base-200 relative z-20 pointer-events-auto"
                    >
                      <StarIcon className="size-4" />
                      <span className="text-[11px] font-bold">
                        {promo.likes} {promotionViewText.card.likeLabelSuffix}
                      </span>
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      disabled={!promo.isAvailable}
                      className="btn h-8 min-h-8 border-none bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 gap-1.5 text-xs shadow-none transition-colors relative z-20 pointer-events-auto"
                    >
                      <ChatIcon className="size-3.5" />
                      {promotionViewText.card.negotiateButton}
                    </button>
                  </div>
                </div>
              </div>
            );

            return animationsEnabled ? (
              <BorderGlow
                key={promo.id}
                className="cursor-pointer h-full hover:shadow-lg group bg-base-100/50"
                edgeSensitivity={30}
                glowRadius={25}
                glowIntensity={1.2}
                animated={false}
              >
                <GlareHover
                  width="100%"
                  height="100%"
                  glareColor="#8B5CF6"
                  glareOpacity={0.15}
                  glareAngle={105}
                  transitionDuration={600}
                  className="rounded-[28px] border-none"
                >
                  <div
                    onClick={() => setSubView({ view: "Detail", id: promo.id })}
                    className="h-full relative z-[1] w-full text-left"
                  >
                    <InnerCard />
                  </div>
                </GlareHover>
              </BorderGlow>
            ) : (
              <Surface
                key={promo.id}
                onClick={() => setSubView({ view: "Detail", id: promo.id })}
                className="flex flex-col p-0 transition-all hover:border-primary/40 hover:shadow-lg group cursor-pointer h-full border border-base-300"
              >
                <InnerCard />
              </Surface>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PromotionComponent;
