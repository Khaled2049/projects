import { User as FirebaseUser } from "firebase/auth";

export interface IUser extends FirebaseUser {
  username: string;
  followers: string[];
  following: string[];
  createdAt: string;
  lastLogin: string;
  stories: string[]; // Array of post IDs
  likedPosts: string[]; // Array of liked post IDs
  savedPosts: string[]; // Array of saved post IDs
}
