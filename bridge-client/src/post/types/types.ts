export type Category = {
  name: string;
};

export type Tag = {
  name: string;
};
export type Post = {
  _id: string;
  title: string;
  date: string;
  published: boolean;
  content: string;
  categories: {
    data: Category[];
    length: number;
  };
  tags: {
    data: Tag[];
    length: number;
  };
};
