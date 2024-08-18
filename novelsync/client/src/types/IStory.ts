export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface Story {
  id: string;
  title: string;
  chapters: Chapter[];
}
