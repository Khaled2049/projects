import { User } from "firebase/auth";

export interface AuthUser extends User {
  username?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}
