"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, View } from "@react-three/drei";
import type { Group } from "three";
import type { PreviewModel } from "@/lib/preview-model";
import { BBModelMesh } from "./BBModelMesh";
import { Mannequin, type MannequinAnimation } from "./Mannequin";

type Orientation = { yaw: number; pitch: number };

function Scene({
  model,
  orientation,
  animation,
  wireframe,
}: {
  model: PreviewModel | null;
  orientation: React.RefObject<Orientation>;
  animation: MannequinAnimation;
  wireframe: boolean;
}) {
  const turntable = useRef<Group>(null);

  useFrame(() => {
    const g = turntable.current;
    if (!g) return;
    g.rotation.y += (orientation.current.yaw - g.rotation.y) * 0.2;
    g.rotation.x += (orientation.current.pitch - g.rotation.x) * 0.2;
  });

  return (
    <>
      <color attach="background" args={["#18181b"]} />
      <PerspectiveCamera makeDefault position={[0, 1.25, 5.2]} fov={40} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 4]} intensity={2} />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} />
      <group ref={turntable} position={[0, 1.3, 0]}>
        <group position={[0, -1.3, 0]}>
          <Mannequin animation={animation} wireframe={wireframe}>
            {model && <BBModelMesh model={model} wireframe={wireframe} />}
          </Mannequin>
          <mesh position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.7, 0.75, 0.12, 32]} />
            <meshStandardMaterial color="#3f3f46" wireframe={wireframe} />
          </mesh>
        </group>
      </group>
    </>
  );
}

/**
 * Janela 3D desenhada pelo canvas compartilhado. Arrastar na horizontal gira o
 * modelo; com mouse, arrastar na vertical inclina. No toque, a rolagem vertical
 * continua com o navegador (`touch-action: pan-y`).
 */
export function ModelView({
  slug,
  initialYaw,
  visible,
  animation,
  wireframe,
  className,
}: {
  slug: string;
  initialYaw: number;
  visible: boolean;
  animation: MannequinAnimation;
  wireframe: boolean;
  className?: string;
}) {
  const [model, setModel] = useState<PreviewModel | null>(null);
  const orientation = useRef<Orientation>({ yaw: initialYaw, pitch: 0.12 });
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/previews/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PreviewModel | null) => {
        if (!cancelled) setModel(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div
      className={className}
      style={{ touchAction: "pan-y", cursor: "grab" }}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current || drag.current.id !== e.pointerId) return;
        if (e.pointerType === "mouse" && e.buttons === 0) {
          drag.current = null;
          return;
        }
        const dx = e.clientX - drag.current.x;
        const dy = e.clientY - drag.current.y;
        drag.current.x = e.clientX;
        drag.current.y = e.clientY;
        orientation.current.yaw += dx * 0.012;
        if (e.pointerType === "mouse") {
          orientation.current.pitch = Math.max(-0.5, Math.min(0.6, orientation.current.pitch + dy * 0.008));
        }
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
    >
      <View className="size-full" visible={visible}>
        <Scene model={model} orientation={orientation} animation={animation} wireframe={wireframe} />
      </View>
    </div>
  );
}
