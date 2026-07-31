"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PreviewGalleryProps = {
  images: string[];
  title: string;
};

export default function PreviewGallery({ images, title }: PreviewGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const isOpen = openIndex !== null;

  function open(index: number) {
    setOpenIndex(index);
  }

  function close() {
    setOpenIndex(null);
  }

  function showPrev() {
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }

  function showNext() {
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
  }

  // Escape to close, arrow keys to navigate
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Prevent background scroll while the lightbox is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 50;

    if (deltaX > SWIPE_THRESHOLD) {
      showPrev();
    } else if (deltaX < -SWIPE_THRESHOLD) {
      showNext();
    }

    touchStartX.current = null;
  }

  if (images.length === 0) return null;

  return (
    <>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => open(index)}
            className="group"
            aria-label={`Open preview ${index + 1} of ${title}`}
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-gray-200">
              <Image
                src={image}
                alt={`معاينة ${index + 1} من ${title}`}
                fill
                sizes="(max-width: 640px) 33vw, 160px"
                className="object-cover transition group-hover:opacity-80"
              />
            </div>
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close preview"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-3xl font-bold text-white hover:bg-white/20"
          >
            ×
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:left-6"
            >
              ‹
            </button>
          )}

          <Image
            src={images[openIndex]}
            alt={`معاينة ${openIndex + 1} من ${title}`}
            width={1200}
            height={1600}
            sizes="95vw"
            priority
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="h-auto max-h-[90vh] w-auto max-w-[95vw] rounded-lg object-contain shadow-2xl select-none"
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:right-6"
            >
              ›
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
              {openIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
