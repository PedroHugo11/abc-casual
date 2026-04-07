export type ProductType = "regata" | "oversized" | "t-shirt";

export interface Product {
  id: string;
  groupId: string;
  name: string;
  description: string;
  price: number;
  size: string[];
  color: string[];
  type: ProductType | "";
  image: string;
  stock: number;
}