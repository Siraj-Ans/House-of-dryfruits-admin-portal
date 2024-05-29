export interface CreateCategoryResponse {
  message: string;
  category: {
    _id: string;
    __v: number;
    categoryName: string;
    parent?: {
      _id: string;
      __v: number;
      categoryName: string;
      properties: { property: string; values: string[] }[];
    };
    properties: { property: string; values: string[] }[];
  };
}

export interface FetchCategoriesResponse {
  message: string;
  categories: {
    _id: string;
    __v: number;
    categoryName: string;
    parent?: {
      _id: string;
      categoryName: string;
      properties: { property: string; values: string[] }[];
    };
    properties: { property: string; values: string[] }[];
  }[];
}

export interface DeleteCategoryResponse {
  message: string;
}
