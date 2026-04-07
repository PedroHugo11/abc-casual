export type OrderStatus =
  | "confirmed"
  | "paid"
  | "separating"
  | "shipping"
  | "delivered";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  tracking?: string;

  address: {
    name: string;
    street: string;
    number: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };

  payment: {
    method: string;
    last4?: string;
  };

  shipping: {
    name: string;
    price: number;
    days: number;
  };
}