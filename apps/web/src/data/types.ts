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

export type PostMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster: string };

/** Publicação do feed. O 1º slide é sempre a prévia 3D do asset; depois vêm as mídias. */
export type Post = {
  id: string;
  artistHandle: string;
  assetSlug: string;
  publishedAt: string;
  caption: string;
  media: PostMedia[];
  likes: number;
  comments: number;
};
