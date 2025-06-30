interface PlaceholderImageProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  text?: string;
}

export default function PlaceholderImage({
  className = "",
  width = "100%",
  height = 200,
  text = "No Image",
}: PlaceholderImageProps) {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
      style={{ width, height }}
      role="img"
      aria-label={text}
    >
      <div className="text-center">
        <svg
          className="w-12 h-12 mx-auto text-gray-400 mb-2"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          role="presentation"
        >
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
        <p className="text-sm text-gray-500 dark:text-gray-400" aria-hidden="true">
          {text}
        </p>
      </div>
    </div>
  );
}
