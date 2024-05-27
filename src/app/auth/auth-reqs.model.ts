export interface LoginResponseData {
  message: string;
  user: {
    _id: string;
    __v: number;
    userName: string;
    password: string;
  };
  token: string;
  expiresIn: number;
}
