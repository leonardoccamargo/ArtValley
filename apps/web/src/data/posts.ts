import type { Post } from "./types";

export const posts: Post[] = [
  {
    id: "asas-de-dragao-lancamento",
    artistHandle: "pixelforja",
    assetSlug: "asas-de-dragao",
    publishedAt: "2026-10-27",
    caption:
      "Finalmente saíram as Asas de Dragão! Membrana translúcida e ossos articulados, prontas pro rig do jogador. Gira aí pra ver de todos os ângulos.",
    media: [
      { type: "image", src: "/media/posts/asas-de-dragao-1.png", alt: "Asas de Dragão vistas de lado" },
      { type: "video", src: "/media/posts/asas-de-dragao.mp4", poster: "/media/posts/asas-de-dragao-2.png" },
    ],
    likes: 842,
    comments: 57,
  },
  {
    id: "chapeu-de-mago-wip",
    artistHandle: "pixelforja",
    assetSlug: "chapeu-de-mago",
    publishedAt: "2026-10-25",
    caption:
      "Testando um chapéu de mago em camadas com a ponta curvada. Ainda não está à venda, mas aceito encomendas no mesmo estilo!",
    media: [
      { type: "image", src: "/media/posts/chapeu-de-mago-1.png", alt: "Chapéu de Mago visto de frente" },
      { type: "image", src: "/media/posts/chapeu-de-mago-2.png", alt: "Chapéu de Mago visto de lado" },
    ],
    likes: 1290,
    comments: 112,
  },
  {
    id: "capa-real-lancamento",
    artistHandle: "pixelforja",
    assetSlug: "capa-real",
    publishedAt: "2026-10-20",
    caption: "Capa Real com gola dourada, inspirada em mantos medievais. Perfeita pra servidores de RPG.",
    media: [{ type: "image", src: "/media/posts/capa-real-1.png", alt: "Capa Real vista de trás" }],
    likes: 517,
    comments: 23,
  },
];
