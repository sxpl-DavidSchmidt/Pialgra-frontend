import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "../api/auth";

import { ApiError } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) {
          setUser(null);
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function login(username, password) {
    await loginRequest(username, password);

    const user = await getCurrentUser();

    setUser(user);
  }

  async function logout() {
    await logoutRequest();

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
