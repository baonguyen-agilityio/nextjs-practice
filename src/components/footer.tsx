import Logo from "./icons/logo";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-darkblue text-white pt-8 pb-4">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo />
              <span className="ml-1 font-inter font-bold text-3xl">Pages</span>
            </div>
            <div className="flex gap-2">
              {siteConfig.socialLinks.map(({ icon: Icon, href }) => (
                <Link
                  target="_blank"
                  key={href}
                  href={href}
                  className="border border-accent w-10 h-10 flex items-center justify-center hover:bg-accent hover:text-darkblue transition-colors"
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl mb-4">Keep in Touch</h3>
            <div className="space-y-2 text-lg">
              <div>
                <span className="font-semibold">Address: </span>
                <span className="font-inter text-lightblue">
                  24A Kingston St, Los Vegas NC 28202, USA.
                </span>
              </div>
              <div>
                <span className="font-semibold">Mail: </span>
                <span className="font-inter text-lightblue">support@doctors.com</span>
              </div>
              <div>
                <span className="font-semibold">Phone: </span>
                <span className="font-inter text-lightblue">(+22) 123 - 4567 - 900</span>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-white/20 mb-4" />
        <div className="text-center font-inter text-sm text-lightblue">
          Copyright © 2024 - All rights reserved.
        </div>
      </div>
    </footer>
  );
}
