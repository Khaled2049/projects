import { AuthUser } from "./IUser";

export interface IChapter {
  chapterName: string;
  content: string;
}

export interface INovel {
  id: string;
  title: string;
  authorId: string;
  author: string;
  lastUpdated: string;
  chapters: IChapter[];
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
  // content: string;
  chapters: { chapterName: string; content: string }[];
}

export interface ICurrentNovel extends INovel {
  lastUpdated: string;
  chaptersPath: string;
}
