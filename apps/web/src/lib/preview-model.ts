export type FaceDirection = "north" | "east" | "south" | "west" | "up" | "down";

/** Versão "só para exibição" de um .bbmodel: apenas geometria e textura. */
export type PreviewModel = {
  resolution: { width: number; height: number };
  texture: string | null;
  cubes: {
    from: [number, number, number];
    to: [number, number, number];
    origin: [number, number, number];
    rotation: [number, number, number];
    faces: Partial<Record<FaceDirection, [number, number, number, number]>>;
  }[];
};
