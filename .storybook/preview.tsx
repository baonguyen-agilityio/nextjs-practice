import React from "react";

import type { Preview } from "@storybook/react";
import "@/app/globals.css";
import { fontCardo, fontInter } from "../src/config/fonts";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <div className={`${fontCardo.variable} ${fontInter.variable} font-cardo myTheme`}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
