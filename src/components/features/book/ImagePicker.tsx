"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createImageUrl } from "@/utils/image";

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
      {display && <Image src={display} alt="Preview" width={100} height={100} />}
      {!display && <p className="text-gray-500">No image selected.</p>}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
        name="image"
      />
      <Button onPress={handlePick} variant="flat" color="primary">
        Pick Image
      </Button>
    </div>
  );
}
