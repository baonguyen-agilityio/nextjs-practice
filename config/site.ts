import FacebookIcon from "@/components/icons/facebook-icon";
import LinkedInIcon from "@/components/icons/linkedin-icon";
import TwitterIcon from "@/components/icons/twitter-icon";

export const siteConfig = {
  name: "Pages",
  navItems: [
    {
      label: "Store",
      href: "/",
    },
    {
      label: "Articles",
      href: "/articles",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Services",
      href: "/services",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
  socialLinks: [
    {
      label: "Facebook",
      href: "https://facebook.com",
      icon: FacebookIcon,
    },
    {
      label: "Twitter",
      href: "https://twitter.com",
      icon: TwitterIcon,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com",
      icon: LinkedInIcon,
    },
  ],
};
