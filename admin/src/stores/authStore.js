import { create } from "zustand";
import axios from "../customize/axios";

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  user: null,
  accessToken: null,
  refreshToken: null,

  login: (userData, tokens) =>
    set({
      isLoggedIn: true,
      user: userData,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }),

  logout: () => {
    set({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    });
    localStorage.clear();
  },

  updateUser: (updatedData) =>
    set((state) => ({ user: { ...state.user, ...updatedData } })),

  doGetAccount: async () => {
    try {
      const response = await axios.get("/account", { withCredentials: true });

      console.log(">>> response: ", response);

      if (response && +response.EC === 0) {
        set({
          isLoggedIn: true,
          user: response?.DT?.user || null,
          accessToken: response?.DT?.accessToken || null,
          refreshToken: response?.DT?.refreshToken || null,
        });
        return response?.DT?.accessToken;
      } else {
        console.error("Error: ", response.EM);
        set({ isLoggedIn: false, user: null });
        return null;
      }
    } catch (error) {
      console.error("Error: ", error);
      set({ isLoggedIn: false, user: null });
      return null;
    }
  },
}));

export default useAuthStore;
