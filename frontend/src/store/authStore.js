// src/store/authStore.js

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            /**
             * Sets the user and token, updating authentication status.
             * @param {{user, token}} data - The user object and JWT.
             */
            login: (data) => {
                set({
                    user: data.user,
                    token: data.token,
                    isAuthenticated: true,
                });
            },

            /**
             * Clears user and token, resetting authentication status.
             */
            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: 'auth-storage', // name of the item in storage
            storage: createJSONStorage(() => localStorage), // use localStorage
        }
    )
);