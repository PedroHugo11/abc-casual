import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "./productsTypes";
import type { RootState } from "@/store/store";

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk para buscar produtos
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Erro na API");
      }

      return (await response.json()) as Product[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// CREATE
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product: Partial<Product>) => {
    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(product),
    });

    return res.json();
  },
);

// UPDATE
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }: { id: string; data: Partial<Product> }) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    return res.json();
  },
);

// DELETE
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string) => {
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    return id;
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Erro desconhecido";
      })

      // CREATE
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.items.push(action.payload);
      })

      // UPDATE
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const selectProducts = (state: RootState) : Product[] => state.products.items;
export const selectProductsLoading = (state: RootState) =>
  state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;

export default productsSlice.reducer;
