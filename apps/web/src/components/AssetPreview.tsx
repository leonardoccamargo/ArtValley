"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Asset } from "@/data/types";

const ModelView = dynamic(() => import("@/components/three/ModelView").then((m) => m.ModelView), {
  ssr: false,
});

const BACK_FACING: Asset["category"][] = ["asas", "capa"];

export function AssetPreview({ asset }: { asset: Asset }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: "300px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative aspect-square">
      {near && (
        <ModelView
          slug={asset.slug}
          initialYaw={BACK_FACING.includes(asset.category) ? -0.35 : Math.PI - 0.5}
          visible
          animation="idle"
          wireframe={false}
          className="absolute inset-0"
        />
      )}
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
        3D · arraste para girar
      </span>
    </div>
  );
}
