import { AuthUser } from "./IUser";

export interface Chapter {
  chapterId: string;
  title: string;
  content: string;
}

export interface Story {
  storyId: string;
  title: string;
  chapters: Chapter[];
  author: string;
  lastUpdated: string;
}

export interface CreateStoryParams {
  storyId: string;
  user: AuthUser | null;
  title: string;
  chapters: Chapter[];
}
