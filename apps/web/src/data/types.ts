export type AssetCategory = "asas" | "capa" | "chapeu" | "armadura" | "avatar";

export type Asset = {
  slug: string;
  title: string;
  description: string;
  category: AssetCategory;
  tags: string[];
  /**
   * Arquivo .bbmodel público usado só na prévia 3D (fictício por enquanto).
   * O arquivo vendido deve ficar em armazenamento privado e ser liberado
   * apenas após a compra (Fase 3).
   */
  previewModelUrl: string;
  /** Preço em centavos; `null` quando o asset só existe como portfólio. */
  priceCents: number | null;
  likes: number;
  saves: number;
  palette: [string, string];
  artistHandle: string;
};

export type Review = {
  author: string;
  rating: number;
  deadlineRating: number;
  qualityRating: number;
  comment: string;
};

export type Artist = {
  handle: string;
  name: string;
  bio: string;
  location: string;
  joinedAt: string;
  followers: number;
  commissionsOpen: boolean;
  commissionPriceFromCents: number;
  specialties: string[];
  reviews: Review[];
};
