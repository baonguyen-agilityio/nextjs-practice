import React from "react";
import type { Preview } from "@storybook/react";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";

import "@/app/globals.css";
import { fontCardo, fontInter } from "../src/config/fonts";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: "requiredFirst",
    },

    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#333333",
        },
        {
          name: "gray",
          value: "#f5f5f5",
        },
      ],
    },

    docs: {
      toc: true,
      source: {
        state: "open",
      },
    },

    actions: {
      argTypesRegex: "^on[A-Z].*",
    },

    layout: "centered",
  },

  decorators: [
    (Story) => {
      return (
        <div className={`${fontCardo.variable} ${fontInter.variable} font-cardo myTheme`}>
          <HeroUIProvider>
            <ToastProvider
              toastOffset={50}
              placement="top-right"
              maxVisibleToasts={1}
              toastProps={{
                variant: "bordered",
                classNames: {
                  base: "font-inter",
                  title: "text-[14px]",
                  description: "text-[12px]",
                },
              }}
            />
            <div className="min-h-screen">
              <Story />
            </div>
          </HeroUIProvider>
        </div>
      );
    },
  ],

  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes to apply to the component",
      table: {
        category: "Styling",
      },
    },
    children: {
      control: { type: "text" },
      description: "The content to display inside the component",
      table: {
        category: "Content",
      },
    },
  },

  tags: ["autodocs"],
};

export default preview;
