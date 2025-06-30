import type { Meta, StoryObj } from "@storybook/react";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/types";
import { HeroUIProvider } from "@heroui/react";

const meta: Meta<typeof ArticleCard> = {
  title: "Features/Article/ArticleCard",
  component: ArticleCard,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
  decorators: [
    (Story) => (
      <HeroUIProvider>
        <div className="w-[400px]">
          <Story />
        </div>
      </HeroUIProvider>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleArticle: Article = {
  id: "1",
  documentId: "article-1",
  slug: "the-significant",
  title: "The Significant",
  description: "A long established fact that a reader normal as well distribution of letters",
  content: "A long established fact that a reader normal as well distribution of letters",
  imageUrl: "/significant.png",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
  publishedAt: "2024-01-15T10:30:00Z",
  author: {
    name: "John Doe",
  },
};

export const Default: Story = {
  args: {
    article: sampleArticle,
  },
};
