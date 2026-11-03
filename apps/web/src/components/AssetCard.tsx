import type { Asset } from "@/data/types";
import { formatBRL, formatCompact } from "@/lib/format";
import { AssetPreview } from "./AssetPreview";

export function AssetCard({ asset }: { asset: Asset }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-white/10">
      <AssetPreview asset={asset} />
      <div className="flex flex-1 flex-col gap-2 bg-zinc-900 p-4">
        <h3 className="font-semibold text-white">{asset.title}</h3>
        <p className="text-sm text-zinc-400">{asset.description}</p>
        <ul className="flex flex-wrap gap-1.5">
          {asset.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-300">
              #{tag}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <span className="text-zinc-400">
            {formatCompact(asset.likes)} curtidas · {formatCompact(asset.saves)} salvos
          </span>
        </div>
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
