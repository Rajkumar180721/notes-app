import { create } from "zustand";
import { User, UserAttributes } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthState {
  user: User | null;
  email: string;
  password: string;
  setUserState: (state: Partial<AuthState>) => void;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgetPassword: (email: string) => Promise<void>;
  updateUser: (user: UserAttributes) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  email: "",
  password: "",
  setUserState: (state) => set(state),
  setUser: (user) => set({ user }),
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },
  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
  forgetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/forgot-password`,
    });
    if (error) throw error;
  },
  updateUser: async (user: UserAttributes) => {
    const { error } = await supabase.auth.updateUser(user);
    if (error) throw error;
  },
}));
