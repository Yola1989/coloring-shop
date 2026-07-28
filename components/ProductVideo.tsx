import { resolveVideoEmbed } from "@/lib/videoEmbed";

type ProductVideoProps = {
  videoUrl?: string | null;
};

// Shows a product video once a book has a videoUrl set — supports
// YouTube/Vimeo links (embedded via iframe) as well as direct video
// files (e.g. an .mp4 uploaded straight to storage), auto-detected.
// Stays completely hidden until a videoUrl is provided.
export default function ProductVideo({ videoUrl }: ProductVideoProps) {
  if (!videoUrl) return null;

  const video = resolveVideoEmbed(videoUrl);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-900">Product Video</h2>
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-black">
        {video.type === "file" ? (
          <video
            src={video.url}
            controls
            playsInline
            className="h-full w-full"
          />
        ) : (
          <iframe
            src={video.embedUrl}
            title="Product video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        )}
      </div>
    </div>
  );
}
