export interface FetchDataProps {
  searchParams?: URLSearchParams;
  options?: RequestInit;
}

export type PageErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
