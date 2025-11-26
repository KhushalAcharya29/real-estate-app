import { createSlice, type PayloadAction } from "@reduxjs/toolkit"; // 👈 type-only import fix

interface User {
  id: string;
  name: string;
  email: string;
  role: "agent" | "client";
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = { user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
