interface IPost {
  id: string;
  author?: IAuthor;
  content: IContent;
  createdAt: string;
  title: string;
  coverImage: {
    url: string;
  };
  slug: string;
  excerpt: string;
}

interface IAuthor {
  name: string;
  id: string;
  picture: {
    url: string;
  };
}

interface IContent {
  text: string;
}

interface IPostDetail {
  id: string;
  content: IContent;
  title: string;
  coverImage: {
    url: string;
  };
  slug: string;
}
