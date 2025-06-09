import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <section className="bg-primary text-white py-4 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-5xl md:text-5xl mb-4">Error</h1>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto font-inter">
            There are many variations of passages of Lorem Ipsum available, have suffered alteration
            in some form.
          </p>
        </div>
      </section>
      <section>
        <div className="relative bg-cover bg-center min-h-screen">
          <Image
            src={"/notfound.png"}
            alt="background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute w-full px-4 sm:px-8 max-w-[95vw] sm:max-w-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
            <div className="w-[220px] sm:w-[320px] md:w-[470px]">
              <Image
                src={"/404.png"}
                alt="404"
                width={470}
                height={215}
                className="object-contain w-full h-auto"
                priority
              />
            </div>
            <h1 className="text-primary text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-bold text-center">
              Page Not Found!!!
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-center text-description font-inter">
              The page you are looking for doesn&apos;t exist. Please try searching for some other
              page, or return to the website&apos;s homepage to find what you&apos;re looking for.
            </p>
            <Link href={siteConfig.navItems[0]?.href || "/"}>
              <Button variant="solid" className="text-primary w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
