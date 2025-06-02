import { getBook } from "@/lib/api/book";
import { formatUSD } from "@/utils/currency";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default async function BookDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await getBook(slug);

  return (
    <section className="py-16 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-background">
            <Image
              src={`${process.env.STRAPI_URL}${data[0].image.url}`}
              alt={data[0].title}
              fill
              className="object-cover p-10"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">{data[0].title}</h2>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-inter font-bold text-secondary">
                {formatUSD(data[0].price)}
              </span>
            </div>
            <p className="font-inter">{data[0].description}</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-gray-600">Publisher</p>
                  <p className="font-medium">Printed Book</p>
                </div>
                <div>
                  <p className="text-gray-600">Pages</p>
                  <p className="font-medium">250</p>
                </div>
                <div>
                  <p className="text-gray-600">Dimensions</p>
                  <p className="font-medium">20 x 14 x 4 cm</p>
                </div>
                <div>
                  <p className="text-gray-600">Language</p>
                  <p className="font-medium">English</p>
                </div>
              </div>
            </div>
            <Button variant="solid" fullWidth>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
