"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Asset, Post } from "@/data/types";
import type { MannequinAnimation } from "@/components/three/Mannequin";

const ModelView = dynamic(() => import("@/components/three/ModelView").then((m) => m.ModelView), {
  ssr: false,
});

const BACK_FACING: Asset["category"][] = ["asas", "capa"];

function useNearViewport<T extends Element>(margin = "300px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: margin,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);
  return [ref, near] as const;
}

function ControlButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur transition ${
        active ? "bg-white text-black" : "bg-black/50 text-white hover:bg-black/70"
      }`}
    >
      {children}
    </button>
  );
}

export function MediaCarousel({ post, asset }: { post: Post; asset: Asset }) {
  const scroller = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [animation, setAnimation] = useState<MannequinAnimation>("idle");
  const [wireframe, setWireframe] = useState(false);
  const [containerRef, near] = useNearViewport<HTMLDivElement>();
  const slideCount = post.media.length + 1;
  const show3D = near && atStart;
  const poster = post.media.find((m) => m.type === "image")?.src;

  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (video && (!near || index !== i + 1)) video.pause();
    });
  }, [index, near]);

  function goTo(i: number) {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div ref={containerRef} className="relative aspect-square w-full select-none">
      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
          setAtStart(el.scrollLeft < 2);
        }}
        className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative h-full w-full shrink-0 snap-center">
          {!show3D && poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className="absolute inset-0 size-full object-cover" />
          )}
          {near && (
            <ModelView
              slug={asset.slug}
              initialYaw={BACK_FACING.includes(asset.category) ? -0.35 : Math.PI - 0.5}
              visible={show3D}
              animation={animation}
              wireframe={wireframe}
              className="absolute inset-0"
            />
          )}
          <div data-overlay className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3">
            <span className="rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur">
              3D · arraste para girar
            </span>
          </div>
          <div data-overlay className="absolute bottom-3 left-3 flex gap-2">
            <ControlButton active={animation === "idle"} onClick={() => setAnimation("idle")}>
              Parado
            </ControlButton>
            <ControlButton active={animation === "walk"} onClick={() => setAnimation("walk")}>
              Andando
            </ControlButton>
            <ControlButton active={wireframe} onClick={() => setWireframe((v) => !v)}>
              Malha
            </ControlButton>
          </div>
        </div>
        {post.media.map((media, i) => (
          <div key={i} className="h-full w-full shrink-0 snap-center bg-zinc-900">
            {media.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.src} alt={media.alt} className="size-full object-cover" draggable={false} />
            ) : (
              <video
                ref={(el) => {
                  videos.current[i] = el;
                }}
                src={media.src}
                poster={media.poster}
                className="size-full object-cover"
                controls
                muted
                loop
                playsInline
              />
            )}
          </div>
        ))}
      </div>

      {index > 0 && (
        <button
          type="button"
          data-overlay
          aria-label="Slide anterior"
          onClick={() => goTo(index - 1)}
          className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black shadow hover:bg-white"
        >
          ‹
        </button>
      )}
      {index < slideCount - 1 && (
        <button
          type="button"
          data-overlay
          aria-label="Próximo slide"
          onClick={() => goTo(index + 1)}
          className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black shadow hover:bg-white"
        >
          ›
        </button>
      )}
      <div className="pointer-events-none absolute inset-x-0 -bottom-5 flex justify-center gap-1.5">
        {Array.from({ length: slideCount }, (_, i) => (
          <span
            key={i}
            className={`size-1.5 rounded-full ${i === index ? "bg-emerald-400" : "bg-zinc-600"}`}
          />
        ))}
      </div>
    </div>
  );
}
