import Logo from "../icons/logo";
import { NavItems } from "./nav-items";
import { MobileMenu } from "./mobile-menu";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export function Header() {
  return (
    <header className="text-primary bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
              <span className="ml-1 font-inter font-bold text-3xl">Pages</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {siteConfig.socialLinks.map(({ icon: Icon, href }) => (
                <Link
                  target="_blank"
                  key={href}
                  href={href}
                  className="bg-foreground p-2 w-10 h-10 flex items-center justify-center"
                >
                  <Icon color="#1B3764" />
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NavItems />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
