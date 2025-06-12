import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);

        const decoded = jwtDecode(storedToken);
        setUserId(decoded.userId);
      }
    } catch (e) {
      console.warn("Nie można odczytać tokena:", e);
    }
  }, []);

  const login = ({ token, userId, is_admin }) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("isAdmin", is_admin);

      setToken(token);
      setUserId(userId);
      setIsAdmin(is_admin);
    } catch (e) {
      console.warn("Nie można zapisać danych użytkownika:", e);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("isAdmin");
    } catch (e) {
      console.warn("Nie można usunąć danych użytkownika:", e);
    }
    setToken(null);
    setUserId(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, userId, isAdmin, login, logout, isLoggedIn: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
