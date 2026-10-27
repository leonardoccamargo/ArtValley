import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { FaceDirection, PreviewModel } from "./preview-model";

type Vec3 = [number, number, number];

type RawBBModel = {
  resolution?: { width: number; height: number };
  elements?: {
    type?: string;
    from: Vec3;
    to: Vec3;
    origin?: Vec3;
    rotation?: Vec3;
    faces?: Partial<Record<FaceDirection, { uv: [number, number, number, number] }>>;
  }[];
  textures?: { source?: string }[];
};

const MODELS_DIR = join(process.cwd(), "content", "models");

/** Lê um .bbmodel privado e devolve só o necessário para renderizar a prévia. */
export async function loadPreviewModel(file: string): Promise<PreviewModel> {
  const raw = JSON.parse(await readFile(join(MODELS_DIR, file), "utf8")) as RawBBModel;

  return {
    resolution: raw.resolution ?? { width: 16, height: 16 },
    texture: raw.textures?.[0]?.source ?? null,
    cubes: (raw.elements ?? [])
      .filter((el) => (el.type ?? "cube") === "cube")
      .map((el) => ({
        from: el.from,
        to: el.to,
        origin: el.origin ?? [0, 0, 0],
        rotation: el.rotation ?? [0, 0, 0],
        faces: Object.fromEntries(
          Object.entries(el.faces ?? {}).map(([dir, face]) => [dir, face.uv]),
        ),
      })),
  };
}
