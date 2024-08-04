import { AuthUser } from "./IUser";

export interface IChapter {
  chapterName: string;
  content: string;
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

export interface INovelWithChapters {
  id: string;
  chaptersPath: string;
  author: string;
  authorId: string;
  lastUpdated: string;
  title: string;
  chapters: IChapter[];
}

export interface IRenderContent {
  chapterName: string;
  content: string;
}
