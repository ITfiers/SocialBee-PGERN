export interface SignUpDto {
  username: string;
  email: string;
  avatar?: string;
  password: string;
}

export interface SignInDto {
  email: string;
  password: string;
}
