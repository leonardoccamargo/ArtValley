import Link from "next/link";
import { AssetCard } from "@/components/AssetCard";
import { assets } from "@/data/assets";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
      <section className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Modelos 3D de Minecraft, direto de quem cria.
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400">
          Descubra, inspecione e compre assets feitos no Blockbench, ou encomende um trabalho
          personalizado com o artista. O feed 3D interativo está em construção.
        </p>
        <Link
          href="/artistas/pixelforja"
          className="w-fit rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
        >
          Ver perfil do artista de exemplo
        </Link>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Em destaque</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <AssetCard key={asset.slug} asset={asset} />
          ))}
        </div>
      </section>
    </main>
  );
}
