import Logo from "../../icons/logo";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-8 pb-4">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo />
              <span className="ml-1 font-inter font-bold text-3xl">Pages</span>
            </div>
            <div className="flex gap-2" aria-label="Social media links">
              {siteConfig.socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  target="_blank"
                  key={href}
                  href={href}
                  className="border border-secondary w-10 h-10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors"
                  aria-label={`Visit our ${label} page (opens in new window)`}
                  rel="noopener noreferrer"
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-bold text-2xl mb-4">Keep in Touch</h2>
            <div className="space-y-2 text-lg">
              <div>
                <span className="font-semibold">Address: </span>
                <span className="font-inter">24A Kingston St, Los Vegas NC 28202, USA.</span>
              </div>
              <div>
                <span className="font-semibold">Mail: </span>
                <a
                  href="mailto:support@doctors.com"
                  className="font-inter"
                  aria-label="Send email to support@doctors.com"
                >
                  support@doctors.com
                </a>
              </div>
              <div>
                <span className="font-semibold">Phone: </span>
                <a
                  href="tel:+22123-4567-900"
                  className="font-inter"
                  aria-label="Call us at +22 123-4567-900"
                >
                  (+22) 123 - 4567 - 900
                </a>
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
