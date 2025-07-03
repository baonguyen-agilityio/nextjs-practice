import EmptyState from "@/components/ui/EmptyState";

export default function ContactPage() {
  // throw new Error("Server-side error occurred");
  return (
    <div className="container mx-auto px-4 py-16">
      <EmptyState
        title="Contact Us"
        message="We'd love to hear from you! Reach out to us with any questions, comments, or feedback."
        icon={
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        }
      />
    </div>
  );
}
