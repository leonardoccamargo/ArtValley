"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

export type MannequinAnimation = "idle" | "walk";

const PX = 1 / 16;

function Part({
  size,
  position,
  color,
  wireframe,
}: {
  size: [number, number, number];
  position: [number, number, number];
  color: string;
  wireframe: boolean;
}) {
  return (
    <mesh position={position.map((v) => v * PX) as [number, number, number]} castShadow>
      <boxGeometry args={size.map((v) => v * PX) as [number, number, number]} />
      <meshStandardMaterial color={color} roughness={0.85} wireframe={wireframe} />
    </mesh>
  );
}

/**
 * Manequim neutro com as proporções do jogador do Minecraft (64x32 px de altura 32).
 * `children` é preso ao corpo, no mesmo espaço de coordenadas dos modelos Blockbench.
 */
export function Mannequin({
  animation,
  wireframe,
  children,
}: {
  animation: MannequinAnimation;
  wireframe: boolean;
  children?: ReactNode;
}) {
  const body = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const walking = animation === "walk";
    const swing = walking ? Math.sin(t * 6) * 0.5 : 0;
    const breath = walking ? 0 : Math.sin(t * 1.6) * 0.05;

    if (body.current) body.current.position.y = walking ? Math.abs(Math.sin(t * 6)) * 0.03 : breath * 0.15;
    if (leftArm.current) leftArm.current.rotation.set(swing, 0, -0.05 - breath);
    if (rightArm.current) rightArm.current.rotation.set(-swing, 0, 0.05 + breath);
    if (leftLeg.current) leftLeg.current.rotation.x = -swing;
    if (rightLeg.current) rightLeg.current.rotation.x = swing;
  });

  const skin = "#d4d4d8";
  const cloth = "#a1a1aa";
  const eyes = "#52525b";

  return (
    <group>
      <group ref={leftLeg} position={[2 * PX, 12 * PX, 0]}>
        <Part size={[4, 12, 4]} position={[0, -6, 0]} color={cloth} wireframe={wireframe} />
      </group>
      <group ref={rightLeg} position={[-2 * PX, 12 * PX, 0]}>
        <Part size={[4, 12, 4]} position={[0, -6, 0]} color={cloth} wireframe={wireframe} />
      </group>
      <group ref={body}>
        <Part size={[8, 12, 4]} position={[0, 18, 0]} color={skin} wireframe={wireframe} />
        <Part size={[8, 8, 8]} position={[0, 28, 0]} color={skin} wireframe={wireframe} />
        <Part size={[1.5, 1, 0.2]} position={[-2, 28, -4.1]} color={eyes} wireframe={wireframe} />
        <Part size={[1.5, 1, 0.2]} position={[2, 28, -4.1]} color={eyes} wireframe={wireframe} />
        <group ref={leftArm} position={[6 * PX, 22 * PX, 0]}>
          <Part size={[4, 12, 4]} position={[0, -4, 0]} color={skin} wireframe={wireframe} />
        </group>
        <group ref={rightArm} position={[-6 * PX, 22 * PX, 0]}>
          <Part size={[4, 12, 4]} position={[0, -4, 0]} color={skin} wireframe={wireframe} />
        </group>
        {children}
      </group>
    </group>
  );
}
