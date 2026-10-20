import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check the saved token

  // runs once when the app opens: if a token is saved, ask the backend who it is
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        // token is expired or invalid, so clear it
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  // saves the token. "Remember me" = localStorage (stays after closing the browser)
  // otherwise sessionStorage (cleared when the tab closes)
  const saveSession = (data, rememberMe) => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", data.token);
    setUser(data.user);
  };

  const login = async (email, password, rememberMe) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
      rememberMe,
    });
    saveSession(data, rememberMe);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    saveSession(data, false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  // replaces the saved user after a profile or avatar change
  const updateUser = (updated) => setUser(updated);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// shortcut hook, used like: const { user } = useAuth();
export const useAuth = () => useContext(AuthContext);
