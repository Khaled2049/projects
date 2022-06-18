export interface IAuthor {
    name: string;
    photo: string;
    bio: string;
    post: IPost[];
}

export interface Post {
    posts: IPost[] | any;
}

export interface IPost {    
    posts: any;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image?: string;
    featurePost: boolean;
    author: IAuthor;
    categories: ICategory[];
    comments: IComment[];
    createAt: string;
    node: any;
}

export interface ICategory {
    name: string;
    slug: string;
    posts: IPost[];
}
export interface IComment {
    name: string;
    email: string;
    comment: string;
    createdAt: string;
    slug: string;
}