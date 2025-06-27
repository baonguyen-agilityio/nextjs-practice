"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createImageUrl } from "@/utils/image";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export default function ImagePicker({
  imageUrl,
  onFileChange,
}: {
  imageUrl: string;
  onFileChange: (file: File | null) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
    if (onFileChange) {
      onFileChange(file);
    }
  };

  const display = previewUrl || (imageUrl && createImageUrl(imageUrl));

  return (
    <div className="flex flex-col gap-2">
      {display && (
        <div className="w-[200px] h-[240px] relative border rounded-lg overflow-hidden bg-gray-50">
          <ImageWithFallback
            data-testid="preview-image"
            src={display}
            alt="Preview"
            fill
            className="object-contain"
            sizes="200px"
            fallbackText="Preview"
          />
        </div>
      )}
      {!display && (
        <div className="w-[200px] h-[240px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
          <p className="text-gray-500 text-center">No image selected.</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
        name="image"
      />
      <Button data-testid="pick-button" onPress={handlePick} variant="secondary">
        Pick Image
      </Button>
    </div>
  );
}
