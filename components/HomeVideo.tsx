import { resolveVideoEmbed } from "@/lib/videoEmbed";

type HomeVideoProps = {
  videoUrl?: string | null;
};

// Short clip shown under the hero, centred. Stays completely hidden until an
// admin sets a URL in Settings, so an empty value simply removes it.
//
// A direct file (e.g. an .mp4 on R2) plays on loop with no sound, which is
// what browsers allow to autoplay. Controls stay available so visitors can
// unmute or pause. YouTube/Vimeo links fall back to an iframe.
export default function HomeVideo({ videoUrl }: HomeVideoProps) {
  if (!videoUrl) return null;

  const video = resolveVideoEmbed(videoUrl);

  return (
    <section className="mt-12 flex justify-center">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-gray-200 bg-black shadow-lg">
        {video.type === "file" ? (
          <video
            src={video.url}
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            className="h-auto w-full"
          />
        ) : (
          <div className="aspect-video w-full">
            <iframe
              src={video.embedUrl}
              title="Coloring video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        )}
      </div>
    </section>
  );
}
