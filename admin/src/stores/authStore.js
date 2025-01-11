import { create } from "zustand";
import axios from "../customize/axios";

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  user: null,
  login: (userData) => set({ isLoggedIn: true, user: userData }),
  logout: () => set({ isLoggedIn: false, user: null }),
  updateUser: (updatedData) =>
    set((state) => ({ user: { ...state.user, ...updatedData } })),
  doGetAccount: async () => {
    try {
      const response = await axios.get('/account', {withCredentials: true});

      console.log(">>> response: ", response);

      if(response && +response.EC === 0) {
        set({isLoggedIn: true, user: response?.DT?.user || null});
      }else{
        console.error("Error: ", response.EM);
        set({isLoggedIn: false, user: null});
      }
    } catch (error) {
      console.error("Error: ", error);
      set({isLoggedIn: false, user: null});
    }
  }
}));

export default useAuthStore;
