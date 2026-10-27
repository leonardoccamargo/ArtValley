export type AssetCategory = "asas" | "capa" | "chapeu" | "armadura" | "avatar";

export type Asset = {
  slug: string;
  title: string;
  description: string;
  category: AssetCategory;
  tags: string[];
  /**
   * Nome do arquivo .bbmodel em `content/models/`. Essa pasta nunca é servida
   * publicamente: o arquivo original só pode ser liberado ao comprador.
   */
  modelFile: string;
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
