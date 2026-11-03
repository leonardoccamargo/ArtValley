"use client";

import type { Artist, Asset, Post } from "@/data/types";
import { PostCard } from "./PostCard";
import { SharedCanvasLoader } from "@/components/three/SharedCanvasLoader";


export type FeedItem = { post: Post; artist: Artist; asset: Asset };

export function Feed({ items }: { items: FeedItem[] }) {
  return (
    <>
      <SharedCanvasLoader />
      <div className="mx-auto flex w-full max-w-[470px] flex-col gap-6 py-6">
        {items.map((item) => (
          <PostCard key={item.post.id} {...item} />
        ))}
      </div>
    </>
  );
}
