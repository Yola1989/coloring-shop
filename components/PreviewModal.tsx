
"use client";
type PreviewModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function PreviewModal({
  open,
  onClose,
}: PreviewModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Book Preview
          </h2>

          <button
            onClick={onClose}
            className="text-3xl font-bold text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="flex h-80 items-center justify-center rounded-2xl bg-gray-100">
          Cover Image
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full rounded-xl bg-orange-500 py-4 font-semibold text-white hover:bg-orange-600"
        >
          Close
        </button>

      </div>
    </div>
  );
}