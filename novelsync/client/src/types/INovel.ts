import { AuthUser } from "./IUser";

export interface IChapter {
  chapterName: string;
  content: string;
}

export interface UpdateNovelParams {
  id: string;
  title?: string;
  chapters?: IChapter[];
}

export interface CreateNovelParams {
  user: AuthUser | null;
  title: string;
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
  feedback?: Feedback[];
}

export interface IRenderContent {
  chapterName: string;
  content: string;
}
export interface Feedback {
  id: string;
  text: string;
  timestamp: Date;
  username: string;
}
