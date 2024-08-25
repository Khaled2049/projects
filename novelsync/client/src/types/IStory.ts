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
  views: number;
  likes: number;
}
export interface Draft {
  draftId: string;
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

export interface CreateDraftParams {
  draftId: string;
  user: AuthUser | null;
  title: string;
  chapters: Chapter[];
}

export interface ILikes {
  storyId: string;
  likes: number;
  likedBy: string[];
}
