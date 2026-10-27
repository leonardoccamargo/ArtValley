import { assets } from "@/data/assets";
import { loadPreviewModel } from "@/lib/bbmodel.server";

export function generateStaticParams() {
  return assets.map((asset) => ({ slug: asset.slug }));
}

export async function GET(_request: Request, ctx: RouteContext<"/api/previews/[slug]">) {
  const { slug } = await ctx.params;
  const asset = assets.find((a) => a.slug === slug);
  if (!asset) return Response.json({ error: "Modelo não encontrado" }, { status: 404 });

  return Response.json(await loadPreviewModel(asset.modelFile));
}
