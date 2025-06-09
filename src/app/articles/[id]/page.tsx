import { Banner } from "@/components/ui/Banner";
import { getArticle } from "@/services/article";
import Image from "next/image";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function ArticlePage({ params }: { params: Params }) {
  const { id } = await params;
  const { article } = await getArticle({ id });

  if (!article) {
    return notFound();
  }

  return (
    <>
      <Banner title="Significant reading has more info number" />
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="py-10 md:p-16 lg:p-20">
          <Image
            src={`/significant.png`}
            alt={`article`}
            layout="responsive"
            width={600}
            height={400}
            objectFit="contain"
          />
          <div className="space-y-4 mt-5">
            <p className="text-xl font-semibold text-primary">October 6, 2021 / Author</p>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  "There are many variations of passages of Lorem Ipsum available, but the majorithave suffered alteration in some form, by injected humour, or randomised words whicdon't look even slightly believable. If you are going to use a passage of Lorem Ipsum, need to be sure there isn't anything embarrassing hidden in the middle of text. All thLorem Ipsum generators on the Internet tend.",
              }}
            ></div>
          </div>
        </div>
      </section>
    </>
  );
}
