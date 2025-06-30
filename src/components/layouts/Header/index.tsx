import Logo from "@/components/icons/logo";
import { NavItems } from "./NavItems";
import { MobileMenu } from "./MobileMenu";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";

export async function Header() {
  const session = await auth();
  return (
    <header className="text-white bg-primary fixed top-0 left-0 right-0 z-50" id="navigation">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded-sm"
              aria-label="BookStore Home"
            >
              <Logo />
              <span className="ml-1 font-inter font-bold text-3xl">Pages</span>
            </Link>
            <div className="hidden md:flex items-center gap-4" aria-label="Social media links">
              {siteConfig.socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  target="_blank"
                  key={href}
                  href={href}
                  className="bg-white p-2 w-10 h-10 flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary transition-transform hover:scale-105"
                  aria-label={`Visit our ${label} page (opens in new window)`}
                  rel="noopener noreferrer"
                >
                  <Icon color="#1B3764" />
                </Link>
              ))}
            </div>
          </div>
          <nav className="flex items-center gap-4" aria-label="Main navigation">
            <NavItems session={session} />
            <MobileMenu />
          </nav>
        </div>
      </div>
    </header>
  );
}
