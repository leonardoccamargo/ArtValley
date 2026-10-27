import type { Artist } from "./types";

export const artists: Artist[] = [
  {
    handle: "pixelforja",
    name: "Pixel Forja",
    bio: "Modeladora 3D focada em acessórios e cosméticos para Minecraft. Trabalho com Blockbench há 5 anos, criando asas, capas e chapéus animados para servidores e criadores de conteúdo.",
    location: "Curitiba, PR",
    joinedAt: "2026-03-14",
    followers: 1284,
    commissionsOpen: true,
    commissionPriceFromCents: 4500,
    specialties: ["Acessórios", "Cosméticos", "Animações", "Low poly"],
    reviews: [
      {
        author: "CraftLandia Server",
        rating: 5,
        deadlineRating: 5,
        qualityRating: 5,
        comment: "Entregou o pacote de capas antes do prazo e ainda fez ajustes sem custo extra.",
      },
      {
        author: "lucasblocks",
        rating: 4,
        deadlineRating: 4,
        qualityRating: 5,
        comment: "Asas ficaram incríveis. Atrasou um dia, mas avisou com antecedência.",
      },
      {
        author: "MiraGamer",
        rating: 5,
        deadlineRating: 5,
        qualityRating: 5,
        comment: "Super atenciosa, mandou prévias em cada etapa da encomenda.",
      },
    ],
  },
];

export function getArtist(handle: string): Artist | undefined {
  return artists.find((artist) => artist.handle === handle);
}
