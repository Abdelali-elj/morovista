import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");
            
            if (token && savedUser) {
                try {
                    // Optionally verify token with /api/user
                    setUser(JSON.parse(savedUser));
                } catch (error) {
                    console.error("Auth check failed:", error);
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                await api.post("/logout", {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
        }
    };

    const value = {
        user,
        setUser,
        loading,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
