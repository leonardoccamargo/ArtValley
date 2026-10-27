// Gera os modelos .bbmodel de exemplo usados pelos dados fictícios.
// Uso: node scripts/generate-sample-models.mjs
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { deflateSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "models");

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(width, height, pixel) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixel(x, y);
      const i = y * (width * 4 + 1) + 1 + x * 4;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      raw[i + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function hex(color) {
  const n = parseInt(color.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255];
}

function shade([r, g, b, a], f) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
  return [c(r), c(g), c(b), a];
}

// Textura 16x16 com ruído determinístico, no estilo pixel art do Minecraft.
function texture(name, primary, secondary) {
  const p = hex(primary);
  const s = hex(secondary);
  const data = png(16, 16, (x, y) => {
    const noise = ((x * 7 + y * 13 + x * y) % 5) / 20;
    const base = (x + y) % 6 === 0 ? s : p;
    return shade(base, 0.9 + noise);
  });
  return {
    path: "",
    name: `${name}.png`,
    folder: "",
    namespace: "",
    id: "0",
    width: 16,
    height: 16,
    uv_width: 16,
    uv_height: 16,
    particle: false,
    render_mode: "default",
    visible: true,
    mode: "bitmap",
    saved: true,
    uuid: randomUUID(),
    source: `data:image/png;base64,${data.toString("base64")}`,
  };
}

const FACES = ["north", "east", "south", "west", "up", "down"];

function cube(name, from, to, origin, rotation) {
  const faces = Object.fromEntries(FACES.map((f) => [f, { uv: [0, 0, 16, 16], texture: 0 }]));
  return {
    name,
    box_uv: false,
    rescale: false,
    locked: false,
    from,
    to,
    autouv: 0,
    color: 0,
    origin,
    ...(rotation ? { rotation } : {}),
    faces,
    type: "cube",
    uuid: randomUUID(),
  };
}

function model(name, tex, groups) {
  const elements = [];
  const outliner = groups.map((group) => {
    elements.push(...group.cubes);
    return {
      name: group.name,
      origin: group.origin,
      color: 0,
      uuid: randomUUID(),
      export: true,
      isOpen: true,
      locked: false,
      visibility: true,
      autouv: 0,
      children: group.cubes.map((c) => c.uuid),
    };
  });
  return {
    meta: { format_version: "4.10", model_format: "free", box_uv: false },
    name,
    model_identifier: "",
    visible_box: [1, 1, 0],
    variable_placeholders: "",
    variable_placeholder_buttons: [],
    timeline_setups: [],
    unhandled_root_fields: {},
    resolution: { width: 16, height: 16 },
    elements,
    outliner,
    textures: [tex],
  };
}

// Coordenadas no espaço do jogador do Minecraft (corpo: x -4..4, y 12..24, z -2..2).
const samples = {
  "asas-de-dragao": model("Asas de Dragão", texture("asas_de_dragao", "#7c3aed", "#c4b5fd"), [
    {
      name: "asa_esquerda",
      origin: [2, 22, 2],
      cubes: [
        cube("osso_esquerdo", [2, 21, 2], [14, 23, 3], [2, 22, 2], [0, -20, 15]),
        cube("membrana_esquerda", [3, 12, 2.5], [14, 21, 2.5], [2, 22, 2], [0, -20, 15]),
      ],
    },
    {
      name: "asa_direita",
      origin: [-2, 22, 2],
      cubes: [
        cube("osso_direito", [-14, 21, 2], [-2, 23, 3], [-2, 22, 2], [0, 20, -15]),
        cube("membrana_direita", [-14, 12, 2.5], [-3, 21, 2.5], [-2, 22, 2], [0, 20, -15]),
      ],
    },
  ]),
  "capa-real": model("Capa Real", texture("capa_real", "#b91c1c", "#fbbf24"), [
    {
      name: "capa",
      origin: [0, 24, 2],
      cubes: [
        cube("tecido", [-5, 6, 2], [5, 24, 3], [0, 24, 2], [8, 0, 0]),
        cube("gola", [-5, 23, -3], [5, 25, 3], [0, 24, 0]),
      ],
    },
  ]),
  "chapeu-de-mago": model("Chapéu de Mago", texture("chapeu_de_mago", "#1d4ed8", "#facc15"), [
    {
      name: "chapeu",
      origin: [0, 32, 0],
      cubes: [
        cube("aba", [-6, 32, -6], [6, 33, 6], [0, 32, 0]),
        cube("base", [-4, 33, -4], [4, 37, 4], [0, 33, 0]),
        cube("meio", [-3, 37, -3], [3, 40, 3], [0, 37, 0], [-8, 0, 0]),
        cube("ponta", [-1.5, 40, -1.5], [1.5, 43, 1.5], [0, 40, 0], [-16, 0, 0]),
      ],
    },
  ]),
};

for (const [file, data] of Object.entries(samples)) {
  writeFileSync(join(outDir, `${file}.bbmodel`), JSON.stringify(data, null, 2) + "\n");
  console.log(`gerado: public/models/${file}.bbmodel`);
}
