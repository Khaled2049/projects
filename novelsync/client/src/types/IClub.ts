export interface IClub {
  id: string;
  name: string;
  description: string;
  image: string;
  members: string[];
  category: string;
  activity: string;
  creatorId: string;
}

export interface IBookClub {
  club: IClub;
}
