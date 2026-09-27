import {
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "../api/auth";

import { ApiError } from "../api/api";
import { deleteMyAccount } from "../api/user";

import { AuthContext } from "./useAuth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    const expire = () => setUser(null);
    const controller = new AbortController();
    window.addEventListener("auth-expired", expire);
    getCurrentUser({ signal: controller.signal })
      .then((user) => {
        if (!cancelled) setUser(user);
      })
      .catch((error) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 401) {
          if (!cancelled) setUser(null);
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
      window.removeEventListener("auth-expired", expire);
    };
  }, []);

  async function login(username, password, rememberMe = false) {
    await loginRequest(username, password, rememberMe);

    const user = await getCurrentUser();

    setUser(user);
  }

  async function deleteAccount() {
    await deleteMyAccount();
    setUser(null);
  }

  async function logout() {
    try {
      await logoutRequest();
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) throw error;
    }

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
