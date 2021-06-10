export interface Post {
  id: string;
  description: string;
  image: string;
  user_id: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
}
