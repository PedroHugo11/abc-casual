import type { Product } from "@/features/products/productsTypes"

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColor: string
}