import React, { useEffect, useRef, useState } from "react";
import { FiImage, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

// existingUrl: the saved screenshot when editing a trade
// onChange({ file, remove }): tells the form what the user chose
const ScreenshotUpload = ({ existingUrl, onChange }) => {
  const [preview, setPreview] = useState(existingUrl || "");
  const inputRef = useRef(null);

  // free the browser memory used by the preview when it changes or the form closes
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
    onChange({ file, remove: false });
  };

  const handleRemove = () => {
    setPreview("");
    if (inputRef.current) inputRef.current.value = "";
    // remove: true tells the backend to delete the saved image
    onChange({ file: null, remove: true });
  };

  return (
    <div>
      <label className="text-sm font-medium text-fg">Screenshot (optional)</label>

      {preview ? (
        <div className="relative mt-1.5 overflow-hidden rounded-lg border border-border">
          <img src={preview} alt="Trade screenshot" className="max-h-56 w-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove screenshot"
            className="absolute right-2 top-2 rounded-full bg-fg/70 p-1.5 text-white hover:bg-fg"
          >
            <FiX size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="mt-1.5 flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-surface/50 py-8 text-sm text-muted transition-colors hover:border-primary hover:text-primary"
        >
          <FiImage size={24} />
          Click to upload a chart screenshot (max 5 MB)
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  );
};

export default ScreenshotUpload;