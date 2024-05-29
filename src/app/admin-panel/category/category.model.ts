export class Category {
  constructor(
    public id: null | string,
    public categoryName: string,
    public properties: { property: string; values: string[] }[],
    public parent?: {
      id: string;
      categoryName: string;
      properties: { property: string; values: string[] }[];
    }
  ) {}
}
