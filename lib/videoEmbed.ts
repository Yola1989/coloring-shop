export type VideoEmbed =
  | { type: "youtube"; embedUrl: string }
  | { type: "vimeo"; embedUrl: string }
  | { type: "file"; url: string };

// Detects YouTube / Vimeo links (including YouTube Shorts) and returns an
// embeddable iframe URL. Anything else (e.g. a direct .mp4 uploaded to R2)
// is treated as a raw video file for the native <video> element.
export function resolveVideoEmbed(url: string): VideoEmbed {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      if (id) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` };
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/shorts/")[1];
        if (id) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` };
      }

      const id = parsed.searchParams.get("v");
      if (id) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` };

      if (parsed.pathname.startsWith("/embed/")) {
        return { type: "youtube", embedUrl: url };
      }
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (id) return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${id}` };
    }

    if (host === "player.vimeo.com") {
      return { type: "vimeo", embedUrl: url };
    }
  } catch {
    // not a valid absolute URL — fall through to treating it as a file
  }

  return { type: "file", url };
}
