"use client";

import Link from "next/link";
import { useState } from "react";
import type { Artist, Asset, Post } from "@/data/types";
import { formatBRL, formatCompact, formatDayMonth } from "@/lib/format";
import { MediaCarousel } from "./MediaCarousel";

const icon = "size-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]";

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" className={`${icon} ${filled ? "fill-current" : ""}`} aria-hidden>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </svg>
);
const CommentIcon = () => (
  <svg viewBox="0 0 24 24" className={icon} aria-hidden>
    <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4A8 8 0 1 1 20 12z" />
  </svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" className={icon} aria-hidden>
    <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />
  </svg>
);
const SaveIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" className={`${icon} ${filled ? "fill-current" : ""}`} aria-hidden>
    <path d="M6 3h12v18l-6-4-6 4z" />
  </svg>
);

function ActionButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex size-9 items-center justify-center rounded-full text-xl transition hover:bg-white/10 ${
        active ? (label === "Curtir" ? "text-rose-500" : "text-emerald-400") : "text-zinc-100"
      }`}
    >
      {children}
    </button>
  );
}

export function PostCard({ post, artist, asset }: { post: Post; artist: Artist; asset: Asset }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/#${post.id}`;
    if (navigator.share) {
      await navigator.share({ title: asset.title, url }).catch(() => {});
      return;
    }
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article id={post.id} className="flex flex-col sm:rounded-2xl sm:border sm:border-white/10">
      <header className="flex items-center gap-3 bg-zinc-950 px-4 py-3 sm:rounded-t-2xl">
        <Link
          href={`/artistas/${artist.handle}`}
          className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-violet-600 text-sm font-bold"
        >
          {artist.name.charAt(0)}
        </Link>
        <div className="flex flex-1 flex-col leading-tight">
          <Link href={`/artistas/${artist.handle}`} className="text-sm font-semibold hover:underline">
            {artist.name}
          </Link>
          <span className="text-xs text-zinc-500">{formatDayMonth(post.publishedAt)}</span>
        </div>
        <button
          type="button"
          onClick={() => setFollowing((v) => !v)}
          className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
        >
          {following ? "Seguindo" : "Seguir"}
        </button>
      </header>

      <MediaCarousel post={post} asset={asset} />

      <div className="flex flex-col gap-2 bg-zinc-950 px-4 pb-4 pt-2 sm:rounded-b-2xl">
        <div className="flex items-center gap-1">
          <ActionButton label="Curtir" active={liked} onClick={() => setLiked((v) => !v)}>
            <HeartIcon filled={liked} />
          </ActionButton>
          <ActionButton label="Comentar">
            <CommentIcon />
          </ActionButton>
          <ActionButton label="Compartilhar" onClick={share}>
            <ShareIcon />
          </ActionButton>
          {copied && <span className="text-xs text-zinc-400">Link copiado</span>}
          <div className="flex-1" />
          <ActionButton label="Salvar" active={saved} onClick={() => setSaved((v) => !v)}>
            <SaveIcon filled={saved} />
          </ActionButton>
        </div>
        <p className="text-sm font-semibold">{formatCompact(post.likes + (liked ? 1 : 0))} curtidas</p>
        <p className="text-sm text-zinc-200">
          <span className="font-semibold">{artist.name}</span> {post.caption}
        </p>
        <ul className="flex flex-wrap gap-1.5 text-sm text-sky-400">
          {asset.tags.map((tag) => (
            <li key={tag}>#{tag}</li>
          ))}
        </ul>
        <p className="text-sm text-zinc-500">Ver todos os {post.comments} comentários</p>
        <button
          type="button"
          className="mt-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
        >
          {asset.priceCents === null
            ? "Encomendar com este criador"
            : `Comprar asset - ${formatBRL(asset.priceCents)}`}
        </button>
      </div>
    </article>
  );
}
