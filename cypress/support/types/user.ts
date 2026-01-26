export interface UserSettings {
  image?: string;
  username?: string;
  bio?: string;
  email?: string;
  password?: string;
}

export interface CurrentUser {
  user: {
    id: number;
    email: string;
    username: string;
    bio: string;
    image: string;
    token: string;
  };
}
