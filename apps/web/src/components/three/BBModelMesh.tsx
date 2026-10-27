"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import type { FaceDirection, PreviewModel } from "@/lib/preview-model";

const PX = 1 / 16;
// Ordem dos grupos de faces do BoxGeometry: +x, -x, +y, -y, +z, -z.
const BOX_FACES: FaceDirection[] = ["east", "west", "up", "down", "south", "north"];
// UV padrão de cada vértice de uma face do BoxGeometry: (0,1) (1,1) (0,0) (1,0).
const CORNERS: [number, number][] = [
  [0, 1],
  [1, 1],
  [0, 0],
  [1, 0],
];

function buildGeometry(cube: PreviewModel["cubes"][number], res: PreviewModel["resolution"]) {
  const size = cube.to.map((v, i) => Math.max(Math.abs(v - cube.from[i]), 0.001) * PX);
  const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const uv = geometry.getAttribute("uv") as THREE.BufferAttribute;

  BOX_FACES.forEach((dir, faceIndex) => {
    const [u1, v1, u2, v2] = cube.faces[dir] ?? [0, 0, res.width, res.height];
    CORNERS.forEach(([du, dv], corner) => {
      const x = u1 + (u2 - u1) * du;
      const y = v1 + (v2 - v1) * (1 - dv);
      uv.setXY(faceIndex * 4 + corner, x / res.width, 1 - y / res.height);
    });
  });
  uv.needsUpdate = true;
  return geometry;
}

export function useTexture(source: string | null) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!source) return;
    const loaded = new THREE.TextureLoader().load(source, (t) => {
      t.magFilter = THREE.NearestFilter;
      t.minFilter = THREE.NearestFilter;
      t.colorSpace = THREE.SRGBColorSpace;
      t.needsUpdate = true;
      setTexture(t);
    });
    return () => loaded.dispose();
  }, [source]);
  return texture;
}

/** Renderiza os cubos de um modelo Blockbench (coordenadas em pixels do Minecraft). */
export function BBModelMesh({ model, wireframe }: { model: PreviewModel; wireframe: boolean }) {
  const texture = useTexture(model.texture);
  const cubes = useMemo(
    () =>
      model.cubes.map((cube) => {
        const center = cube.from.map((v, i) => (v + cube.to[i]) / 2);
        return {
          geometry: buildGeometry(cube, model.resolution),
          origin: cube.origin.map((v) => v * PX) as [number, number, number],
          offset: center.map((v, i) => (v - cube.origin[i]) * PX) as [number, number, number],
          rotation: new THREE.Euler(
            ...(cube.rotation.map(THREE.MathUtils.degToRad) as [number, number, number]),
            "ZYX",
          ),
        };
      }),
    [model],
  );

  useEffect(() => () => cubes.forEach((c) => c.geometry.dispose()), [cubes]);

  return (
    <group>
      {cubes.map((cube, i) => (
        <group key={i} position={cube.origin} rotation={cube.rotation}>
          <mesh geometry={cube.geometry} position={cube.offset} castShadow>
            <meshStandardMaterial
              map={texture}
              color={texture ? "#ffffff" : "#a1a1aa"}
              wireframe={wireframe}
              transparent
              alphaTest={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
