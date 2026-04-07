export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}