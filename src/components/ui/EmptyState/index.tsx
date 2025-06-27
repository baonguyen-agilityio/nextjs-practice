import { Button } from "../Button";

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const DefaultIcon = () => (
  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
    />
  </svg>
);

export default function EmptyState({
  title,
  message,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-4 ${className}`}
    >
      <div className="mb-6">{icon || <DefaultIcon />}</div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>

      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">{message}</p>

      {action && (
        <Button onClick={action.onClick} variant="secondary">
          {action.label}
        </Button>
      )}
    </div>
  );
}
