export interface CreateProductReponse {
  message: string;
  product: {
    _id: string;
    __v: number;
    productName: string;
    productCategory: {
      _id: string;
      __v: number;
      categoryName: string;
      properties: { property: string; values: string[] }[];
    };
    productImages: string[];
    description: string;
    priceInPKR: number;
  };
}

export interface FetchProductResponse {
  message: string;
  products: {
    _id: string;
    __v: number;
    productName: string;
    productCategory: {
      _id: string;
      __v: number;
      categoryName: string;
      properties: { property: string; values: string[] }[];
    } | null;
    productImages: string[];
    description: string;
    priceInPKR: number;
  }[];
}

export interface DeleteProductResponse {
  message: string;
}

export interface UpdateProductResponse {
  message: string;
}
