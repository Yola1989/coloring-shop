import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage";
import { isAuthenticated } from "@/lib/auth";

// Vercel caps serverless request bodies at roughly 4.5 MB, so the video
// limit sits just under that. Bigger clips have to be uploaded straight to
// R2 from the Cloudflare dashboard and pasted in as a URL instead.
const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const VIDEO_MAX_BYTES = 4 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isVideo = req.nextUrl.searchParams.get("kind") === "video";

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was sent." }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "The file is empty." }, { status: 400 });
  }

  const allowedTypes = isVideo ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json(
      {
        error: isVideo
          ? "File type not allowed. Videos only (MP4, WEBM, MOV)."
          : "File type not allowed. Images only (JPG, PNG, WEBP, AVIF, GIF).",
      },
      { status: 415 }
    );
  }

  const maxBytes = isVideo ? VIDEO_MAX_BYTES : IMAGE_MAX_BYTES;

  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: isVideo
          ? "Video too large. Maximum size is 4 MB. Compress it, or upload it to R2 from the Cloudflare dashboard and paste the URL instead."
          : "Image too large. Maximum size is 5 MB.",
      },
      { status: 413 }
    );
  }

  // Strip anything that could be used for path traversal or odd storage keys.
  const safeName =
    file.name
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(-80) || (isVideo ? "video" : "image");

  const key = `${isVideo ? "videos" : "books"}/${Date.now()}-${safeName}`;

  try {
    const url = await uploadFile(key, file);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      { error: isVideo ? "Video upload failed." : "Image upload failed." },
      { status: 500 }
    );
  }
}
