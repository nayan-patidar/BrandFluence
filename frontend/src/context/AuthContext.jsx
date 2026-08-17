import { createContext, useContext, useState } from "react";
import {
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser,
    isAuthenticated
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getCurrentUser());
    const [loading, setLoading] = useState(false);

    const login = async (credentials) => {
        setLoading(true);

        try {
            const response = await loginUser(credentials);

            const loggedInUser = {
                id: response.id,
                name: response.name,
                email: response.email,
                role: response.role
            };

            setUser(loggedInUser);

            return response;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);

        try {
            return await registerUser(userData);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: isAuthenticated()
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}