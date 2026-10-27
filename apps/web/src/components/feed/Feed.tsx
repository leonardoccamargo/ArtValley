"use client";

import dynamic from "next/dynamic";
import type { Artist, Asset, Post } from "@/data/types";
import { PostCard } from "./PostCard";

const SharedCanvas = dynamic(() => import("@/components/three/SharedCanvas"), { ssr: false });

export type FeedItem = { post: Post; artist: Artist; asset: Asset };

export function Feed({ items }: { items: FeedItem[] }) {
  return (
    <>
      <SharedCanvas />
      <div className="mx-auto flex w-full max-w-[470px] flex-col gap-6 py-6">
        {items.map((item) => (
          <PostCard key={item.post.id} {...item} />
        ))}
      </div>
    </>
  );
}
