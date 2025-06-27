import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: number;
    email: string;
    rol: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    isAdmin: boolean;
    token: string | null;
    user: User | null;
    login: (role: string, token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("rol");
    const storedUser = localStorage.getItem("user");
    let parsedUser: User | null = null;
    if (storedUser && storedUser !== "undefined") {
        try {
            parsedUser = JSON.parse(storedUser);
        } catch {
            parsedUser = null;
        }
    }
    if (storedToken && role && parsedUser) {
        setIsLoggedIn(true);
        setIsAdmin(role === "ADMIN");
        setToken(storedToken);
        setUser(parsedUser);
    }
}, []);

    const login = (role: string, token: string, user: User) => {
        localStorage.setItem("token", token);
        localStorage.setItem("rol", role);
        localStorage.setItem("user", JSON.stringify(user));
        setIsLoggedIn(true);
        setIsAdmin(role === "ADMIN");
        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setIsAdmin(false);
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};