import { Feed, type FeedItem } from "@/components/feed/Feed";
import { getArtist } from "@/data/artists";
import { assets } from "@/data/assets";
import { posts } from "@/data/posts";

export default function Home() {
  const items: FeedItem[] = posts.flatMap((post) => {
    const artist = getArtist(post.artistHandle);
    const asset = assets.find((a) => a.slug === post.assetSlug);
    return artist && asset ? [{ post, artist, asset }] : [];
  });

  return (
    <main className="flex flex-1 flex-col">
      <Feed items={items} />
    </main>
  );
}
