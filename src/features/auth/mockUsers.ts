import { User } from "./types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Pedro",
    email: "pedro@email.com",
    password: "123456",
    phone: "(84) 99999-9999",
    role: "customer",
  },
  {
    id: "2",
    name: "Admin",
    email: "admin@email.com",
    password: "123456",
    role: "admin",
  },
];