"use client";

import Image from "next/image";
import { useState } from "react";
import PlaceholderImage from "../PlaceholderImage";
import { cn } from "@/utils/cn";
import { ImageQuality, ResponsiveSizes } from "@/utils/image";

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
  quality?: number;
  onError?: () => void;
  onLoad?: () => void;
  responsive?: keyof typeof ResponsiveSizes;
  loading?: "lazy" | "eager";
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fill,
  className,
  fallbackText = "Image not available",
  priority = false,
  sizes,
  quality = ImageQuality.STANDARD,
  onError,
  onLoad,
  responsive,
  loading = "lazy",
  placeholder = "empty",
  blurDataURL,
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

  const optimizedSizes = responsive ? ResponsiveSizes[responsive] : sizes;

  const placeholderDataURL =
    placeholder === "blur" && !blurDataURL
      ? "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEhknzNcABJBlpR2dDHq5ZQBgdSqOl0YJNXhG1hCxK3sATYzNhNUJAQAAAA=="
      : blurDataURL;

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
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        priority={priority}
        sizes={optimizedSizes}
        quality={quality}
        loading={priority ? "eager" : loading}
        placeholder={placeholder}
        blurDataURL={placeholderDataURL}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
}
