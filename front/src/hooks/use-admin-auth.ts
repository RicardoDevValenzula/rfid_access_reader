"use client";

import { useState, useEffect } from "react";

export function useAdminAuth() {
  // Inicializamos isAuthenticated como null para indicar que aún no sabemos el estado
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Este efecto solo se ejecuta en el cliente
    const adminKey = localStorage.getItem("admin_key");
    setIsAuthenticated(!!adminKey);
    setIsLoading(false);
  }, []);

  const login = (key: string) => {
    localStorage.setItem("admin_key", key);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("admin_key");
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
