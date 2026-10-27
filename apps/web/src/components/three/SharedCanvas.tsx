"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

/**
 * Único contexto WebGL da página. Fica fixo atrás do conteúdo e desenha cada
 * `ModelView` visível na posição do respectivo elemento.
 */
export default function SharedCanvas() {
  return (
    <Canvas
      className="pointer-events-none"
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      dpr={[1, 2]}
    >
      <View.Port />
    </Canvas>
  );
}
