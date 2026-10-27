import type { Asset } from "./types";

export const assets: Asset[] = [
  {
    slug: "asas-de-dragao",
    title: "Asas de Dragão",
    description: "Par de asas articuladas com membrana translúcida, pronto para rig de jogador.",
    category: "asas",
    tags: ["Blockbench", "Asas", "Fantasia"],
    modelUrl: "/models/asas-de-dragao.bbmodel",
    priceCents: 2990,
    likes: 842,
    saves: 213,
    palette: ["#7c3aed", "#c4b5fd"],
    artistHandle: "pixelforja",
  },
  {
    slug: "capa-real",
    title: "Capa Real",
    description: "Capa longa com gola dourada, inspirada em mantos medievais.",
    category: "capa",
    tags: ["Blockbench", "Capa", "Medieval"],
    modelUrl: "/models/capa-real.bbmodel",
    priceCents: 1990,
    likes: 517,
    saves: 98,
    palette: ["#b91c1c", "#fbbf24"],
    artistHandle: "pixelforja",
  },
  {
    slug: "chapeu-de-mago",
    title: "Chapéu de Mago",
    description: "Chapéu pontudo em camadas com leve curvatura na ponta. Peça de portfólio.",
    category: "chapeu",
    tags: ["Blockbench", "Chapéu", "RPG"],
    modelUrl: "/models/chapeu-de-mago.bbmodel",
    priceCents: null,
    likes: 1290,
    saves: 340,
    palette: ["#1d4ed8", "#facc15"],
    artistHandle: "pixelforja",
  },
];

export function getAssetsByArtist(handle: string): Asset[] {
  return assets.filter((asset) => asset.artistHandle === handle);
}
