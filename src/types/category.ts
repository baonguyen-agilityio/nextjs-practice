export type Category = {
  id: number;
  name: string;
  documentId: string;
};

export type CategoryStrapiResponse = {
  data: Category[];
  error: string | null;
};
