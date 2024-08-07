export interface FetchOrdersResponse {
  message: string;
  orders: {
    _id: string;
    __v: number;
    user: string;
    emailAddress: string;
    country: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    city: string;
    postalCode: number;
    address1: string;
    paymentMethod: string;
    productInfo: {
      productName: string;
      quantity: number;
      productsTotal: number;
    }[];
    paid: boolean;
    fullfilled: boolean;
    trackingId: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    address2?: string;
  }[];
}
