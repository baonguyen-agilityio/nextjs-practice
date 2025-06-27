interface LoadingPageProps {
  message?: string;
  className?: string;
}

export default function LoadingPage({ message = "Loading...", className = "" }: LoadingPageProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}>
      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>

      <p className="text-gray-600 dark:text-gray-300 text-lg">{message}</p>
    </div>
  );
}
