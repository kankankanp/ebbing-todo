"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const GUEST_EMAIL = "guest@example.com";
  const GUEST_PASSWORD = "guestpassword";

  const login = async (tokenOrType: string) => {
    try {
      if (tokenOrType === "guest-token") {
        // ゲストログイン時はAPI経由でトークン取得
        const res = await fetch("http://localhost:3001/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: GUEST_EMAIL,
            password: GUEST_PASSWORD,
          }),
        });
        const data = await res.json();
        console.log(res);
        if (!res.ok)
          throw new Error(data.message || "ゲストログインに失敗しました");
        localStorage.setItem("token", data.token);
        Cookies.set("token", data.token, { path: "/" });
        setToken(data.token);
        setIsAuthenticated(true);
        router.push("/todos");
        router.refresh();
        return;
      }
      // 通常ログイン
      localStorage.setItem("token", tokenOrType);
      Cookies.set("token", tokenOrType, { path: "/" });
      setToken(tokenOrType);
      setIsAuthenticated(true);
      router.push("/todos");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      Cookies.remove("token", { path: "/" }); // cookieも削除
      setToken(null);
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
