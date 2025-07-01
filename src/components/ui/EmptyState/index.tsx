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
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
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
  headingLevel = 1,
}: EmptyStateProps) {
  const getHeadingElement = () => {
    const headingProps = {
      className: "text-xl font-semibold text-gray-900 dark:text-white mb-3",
      children: title,
    };

    switch (headingLevel) {
      case 1:
        return <h1 {...headingProps} />;
      case 2:
        return <h2 {...headingProps} />;
      case 3:
        return <h3 {...headingProps} />;
      case 4:
        return <h4 {...headingProps} />;
      case 5:
        return <h5 {...headingProps} />;
      case 6:
        return <h6 {...headingProps} />;
      default:
        return <h1 {...headingProps} />;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-4 ${className}`}
    >
      <div className="mb-6">{icon || <DefaultIcon />}</div>

      {getHeadingElement()}

      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">{message}</p>

      {action && (
        <Button onClick={action.onClick} variant="secondary">
          {action.label}
        </Button>
      )}
    </div>
  );
}
