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
          <h1 className="text-5xl md:text-5xl mb-4">Our Store</h1>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto font-inter">
            Looking for your next great read? Look no further than our expert recommendations and
            curated collections.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">{books}</div>
      </section>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-darkblue font-cardo">
            Articles & Resources
          </h2>
          <span className="block w-10 h-1 my-12 bg-secondary mx-auto" />
          {articles}
        </div>
      </section>
    </>
  );
}
