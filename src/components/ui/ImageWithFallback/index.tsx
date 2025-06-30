"use client";

import Image from "next/image";
import { useState } from "react";
import PlaceholderImage from "../PlaceholderImage";
import { cn } from "@/utils/cn";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  fallbackText?: string;
  priority?: boolean;
  sizes?: string;
  onError?: () => void;
  onLoad?: () => void;
}

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fill,
  className,
  fallbackText = "Image not available",
  priority,
  sizes,
  onError,
  onLoad,
  ...props
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  if (imageError) {
    return (
      <PlaceholderImage
        className={className}
        width={width || "100%"}
        height={height || "100%"}
        text={fallbackText}
      />
    );
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <PlaceholderImage width="100%" height="100%" text="Loading..." />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}
        priority={priority}
        sizes={sizes}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
}
