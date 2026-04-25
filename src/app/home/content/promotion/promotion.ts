import {
  PROMOTION_SUBVIEW_STORAGE_KEY_SEED,
  promotionCategoryOptionsSeed,
  promotionMockItemsSeed,
  promotionViewCopySeed,
  BOOST_PACKAGES_SEED,
  MOCK_WALLET_BALANCE_SEED,
  type PromotionViewCopy,
  type BoostPackage,
  type WalletBalance,
} from "./promotion.service";

export type { BoostPackage, WalletBalance };

export type PromotionCategory =
  | "Semua Jasa"
  | "Jasa Digital"
  | "Kreatif & Desain"
  | "Jasa Fisik & Lapangan"
  | "Loker & Rekrutmen";

export type PromotionItem = {
  id: string;
  providerName: string;
  providerRole: string;
  title: string;
  description: string;
  tags: string[];
  rate: string;
  category: PromotionCategory;
  likes: number;
  isAvailable: boolean;
  avatarIcon: string;
};

export type PromotionSubView =
  | { view: "Detail"; id: string }
  | { view: "Editor" }
  | { view: "Payment"; boostPackageId: string; postTitle: string };

export type PromotionViewText = PromotionViewCopy;

export type PromotionAvailabilityView = {
  label: string;
  chipClassName: string;
  pulseDotClassName?: string;
};

export const promotionSubViewStorageKey = PROMOTION_SUBVIEW_STORAGE_KEY_SEED;

export const promotionCategoryOptions: PromotionCategory[] = [
  ...promotionCategoryOptionsSeed,
];

export const promotionViewText: PromotionViewText = promotionViewCopySeed;

export const MOCK_PROMOTIONS: PromotionItem[] = [...promotionMockItemsSeed];
export const BOOST_PACKAGES: BoostPackage[] = [...BOOST_PACKAGES_SEED];
export const MOCK_WALLET_BALANCE: WalletBalance = { ...MOCK_WALLET_BALANCE_SEED };

export function resolveInitialPromotionSubView(): PromotionSubView | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(promotionSubViewStorageKey);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as PromotionSubView;
  } catch {
    return null;
  }
}

export function syncPromotionSubViewStorage(subView: PromotionSubView | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (subView) {
    window.localStorage.setItem(promotionSubViewStorageKey, JSON.stringify(subView));
  } else {
    window.localStorage.removeItem(promotionSubViewStorageKey);
  }
}

function containsQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

export function filterPromotionItems(
  promotions: PromotionItem[],
  activeCategory: PromotionCategory,
  searchQuery: string,
): PromotionItem[] {
  return promotions.filter((promotion) => {
    const categoryMatch =
      activeCategory === "Semua Jasa" || promotion.category === activeCategory;

    const searchMatch =
      containsQuery(promotion.title, searchQuery) ||
      containsQuery(promotion.providerName, searchQuery) ||
      promotion.tags.some((tag) => containsQuery(tag, searchQuery));

    return categoryMatch && searchMatch;
  });
}

export function resolvePromotionAvailabilityView(
  isAvailable: boolean,
): PromotionAvailabilityView {
  if (isAvailable) {
    return {
      label: promotionViewText.card.availableLabel,
      chipClassName:
        "shrink-0 flex items-center gap-1.5 rounded-[6px] bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-bold text-[#166534]",
      pulseDotClassName: "size-1.5 rounded-full bg-current animate-pulse",
    };
  }

  return {
    label: promotionViewText.card.busyLabel,
    chipClassName:
      "shrink-0 rounded-[6px] bg-base-200 px-2 py-0.5 text-[10px] font-bold text-base-content/50",
  };
}
