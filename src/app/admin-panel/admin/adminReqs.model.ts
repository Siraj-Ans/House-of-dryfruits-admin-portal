export interface createAdminResponse {
  message: string;
  admin: {
    _id: string;
    __v: number;
    userName: string;
    password: string;
    dateAndTime: string;
  };
}

export interface fetchAdminsResponse {
  message: string;
  admins: {
    _id: string;
    __v: number;
    userName: string;
    password: string;
    dateAndTime: string;
  }[];
}

export interface deleteAdminResponse {
  message: string;
}
