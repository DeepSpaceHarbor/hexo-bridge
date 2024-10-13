export type Post = {
  _id: string;
  title: string;
  date: string;
  published: boolean;
  content: string;
  categories: string[];
  tags: string[];
  source: string;
};
