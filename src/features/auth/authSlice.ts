import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./types";
import type { RootState } from "@/store/store";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  loginModalOpen: boolean;
  redirectAfterLogin: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  loginModalOpen: false,
  redirectAfterLogin: null,
};

// ✅ Async thunk (mantido exatamente como você fez)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    openLoginModal(state) {
      state.loginModalOpen = true;
    },
    closeLoginModal(state) {
      state.loginModalOpen = false;
    },
    setRedirectAfterLogin(state, action: PayloadAction<string | null>) {
      state.redirectAfterLogin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loginModalOpen = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  logout,
  updateUser,
  openLoginModal,
  closeLoginModal,
  setRedirectAfterLogin,
} = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectLoginModalOpen = (state: RootState) => state.auth.loginModalOpen;
export const selectRedirectAfterLogin = (state: RootState) => state.auth.redirectAfterLogin;

export default authSlice.reducer;
