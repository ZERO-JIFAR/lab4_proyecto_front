import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    isAdmin: boolean;
    token: string | null; // <-- AGREGA ESTA LÍNEA
    login: (role: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [token, setToken] = useState<string | null>(null); // <-- AGREGA ESTA LÍNEA

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const role = localStorage.getItem("rol");
        if (storedToken && role) {
            setIsLoggedIn(true);
            setIsAdmin(role === "ADMIN");
            setToken(storedToken); // <-- AGREGA ESTA LÍNEA
        }
    }, []);

    const login = (role: string, token: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("rol", role);
        setIsLoggedIn(true);
        setIsAdmin(role === "ADMIN");
        setToken(token); // <-- AGREGA ESTA LÍNEA
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        setIsLoggedIn(false);
        setIsAdmin(false);
        setToken(null); // <-- AGREGA ESTA LÍNEA
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};