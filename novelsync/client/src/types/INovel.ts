import { AuthUser } from "./IUser";

export interface IChapter {
  chapterName: string;
  content: string;
}

export interface UpdateNovelParams {
  id: string;
  title?: string;
  chapters?: IChapter[];
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
  title: string;
  chaptersPath: string;
  author: string;
  authorId: string;
  lastUpdated: string;
  chapters: IChapter[];
  firstChapter: IChapter;
}

export interface IRenderContent {
  chapterName: string;
  content: string;
}
