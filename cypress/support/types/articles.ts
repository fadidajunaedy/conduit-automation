export interface Article {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export interface ArticleResponseBody {
  article: {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: string;
    updatedAt: string;
    favorited: false;
    favoritesCount: number;
    author: {
      username: string;
      bio: string;
      image: string;
      following: boolean;
    };
  };
}
