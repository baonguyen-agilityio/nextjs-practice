import SkeletonList from "@/components/ui/SkeletonList";
import { Suspense } from "react";

export default function ArchiveLayout({
  books,
  articles,
}: {
  books: React.ReactNode;
  articles: React.ReactNode;
}) {
  return (
    <>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-5xl md:text-5xl mb-4">My Store</h1>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto font-inter">
            Looking for your next great read? Look no further than our expert recommendations and
            curated collections.
          </p>
        </div>
      </section>
      <Suspense fallback={<SkeletonList length={6} />}>{books}</Suspense>
      <Suspense fallback={<SkeletonList length={6} />}>{articles}</Suspense>
    </>
  );
}
