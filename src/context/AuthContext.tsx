import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (role: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("rol");
        if (token && role) {
            setIsLoggedIn(true);
            setIsAdmin(role === "ADMIN");
        }
    }, []);

    const login = (role: string, token: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("rol", role);
        setIsLoggedIn(true);
        setIsAdmin(role === "ADMIN");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        setIsLoggedIn(false);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};