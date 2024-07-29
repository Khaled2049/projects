import { AuthUser } from "./IUser";

export interface INovel {
  id: string;
  title: string;
  authorId: string;
  author: string;
  lastUpdated: string;
  contentPath: string;
}

export interface UpdateNovelParams {
  id: string;
  title?: string;
  newContent?: string;
  // Add other fields that can be updated
}

export interface CreateNovelParams {
  user: AuthUser | null;
  title: string;
  content: string;
  // Add other fields that can be updated
}

export interface ICurrentNovel extends INovel {
  lastUpdated: string;
  contentURL: string;
}
