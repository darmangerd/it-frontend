import { defineStore } from "pinia";

export const useRegisterStore = defineStore('register', { 
    state: () => ({
        hasRegister: false,
    }),

})