export interface IClub {
  id: string;
  name: string;
  description: string;
  image: string;
  members: number;
  category: string;
  activity: string;
}

export interface IBookClub {
  club: IClub;
}
