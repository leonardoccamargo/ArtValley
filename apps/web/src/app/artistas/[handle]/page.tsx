import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssetCard } from "@/components/AssetCard";
import { Rating } from "@/components/Rating";
import { artists, getArtist } from "@/data/artists";
import { getAssetsByArtist } from "@/data/assets";
import { formatBRL, formatCompact, formatMonthYear } from "@/lib/format";

export function generateStaticParams() {
  return artists.map((artist) => ({ handle: artist.handle }));
}

export async function generateMetadata(props: PageProps<"/artistas/[handle]">): Promise<Metadata> {
  const { handle } = await props.params;
  const artist = getArtist(handle);
  return { title: artist ? `${artist.name} · ArtValley` : "Artista · ArtValley" };
}

const average = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / values.length;

export default async function ArtistPage(props: PageProps<"/artistas/[handle]">) {
  const { handle } = await props.params;
  const artist = getArtist(handle);
  if (!artist) notFound();

  const artistAssets = getAssetsByArtist(artist.handle);
  const storefront = artistAssets.filter((asset) => asset.priceCents !== null);
  const rating = average(artist.reviews.map((r) => r.rating));
  const deadline = average(artist.reviews.map((r) => r.deadlineRating));
  const quality = average(artist.reviews.map((r) => r.qualityRating));

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-12">
      <section className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex size-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-violet-600 text-3xl font-bold">
          {artist.name.charAt(0)}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{artist.name}</h1>
            <span className="text-zinc-500">@{artist.handle}</span>
          </div>
          <p className="max-w-2xl text-zinc-300">{artist.bio}</p>
          <p className="text-sm text-zinc-500">
            {artist.location} · No ArtValley desde {formatMonthYear(artist.joinedAt)} ·{" "}
            {formatCompact(artist.followers)} seguidores
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {artist.specialties.map((s) => (
              <li key={s} className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-300">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
          >
            Seguir
          </button>
          {artist.commissionsOpen && (
            <button
              type="button"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
            >
              Encomendar · a partir de {formatBRL(artist.commissionPriceFromCents)}
            </button>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Galeria 3D</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artistAssets.map((asset) => (
            <AssetCard key={asset.slug} asset={asset} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Loja (pronta entrega)</h2>
        <ul className="divide-y divide-white/10 rounded-2xl border border-white/10">
          {storefront.map((asset) => (
            <li key={asset.slug} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium">{asset.title}</p>
                <p className="text-sm text-zinc-500">Download imediato · arquivo .bbmodel</p>
              </div>
              <span className="font-semibold text-emerald-400">
                {formatBRL(asset.priceCents ?? 0)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <h2 className="text-xl font-semibold">Avaliações</h2>
          <span className="text-sm text-zinc-400">
            <Rating value={rating} /> {rating.toFixed(1)} geral · prazo {deadline.toFixed(1)} ·
            qualidade {quality.toFixed(1)}
          </span>
        </div>
        <ul className="grid gap-4 sm:grid-cols-3">
          {artist.reviews.map((review) => (
            <li key={review.author} className="flex flex-col gap-2 rounded-2xl bg-zinc-900 p-4">
              <Rating value={review.rating} />
              <p className="text-sm text-zinc-300">&ldquo;{review.comment}&rdquo;</p>
              <p className="mt-auto text-xs text-zinc-500">{review.author}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
