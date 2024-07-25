export interface FetchProductsResponse {
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

export interface SaveFeaturedProduct {
  message: string;
}

export interface SaveShippingFee {
  message: string;
}

export interface FetchSettings {
  message: string;
  settings: {
    _id: string;
    name: string;
    value: string | number;
  }[];
}
