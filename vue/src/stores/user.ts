import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    userName: "",
  }),
  getters: {
    name: (state) => state.userName,
  },
  actions: {},
});
