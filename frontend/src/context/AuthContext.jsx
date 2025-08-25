import { createContext, useState, useEffect } from "react";
import api from "../services/api";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    async function login(email, senha) {
        try {
            const response = await api.post("/login", { email, senha });

            const { token, user } = response.data;

            setToken(token);
            setUser(user);

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
            throw new Error(error.response?.data?.message || "Erro ao fazer login");
        }
    }

    // Função de logout
    function logout() {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;

