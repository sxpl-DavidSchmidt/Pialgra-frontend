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
import { getMyProfilePicture, uploadMyProfilePicture, removeMyProfilePicture, deleteMyAccount } from "../api/user";
import defaultProfilePicture from "../assets/default_profile_picture.png";

import { AuthContext } from "./useAuth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [picture, setPicture] = useState(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getMyProfilePicture()
      .then((image) => {
        if (!cancelled) setPicture({ user, image });
      })
      .catch(() => {
        if (!cancelled) setPicture({ user, error: "Could not load your profile picture. Please refresh to try again." });
      });
    return () => { cancelled = true; };
  }, [user]);

  async function updateProfilePicture(file) {
    const image = file ? await uploadMyProfilePicture(file) : await removeMyProfilePicture();
    setPicture({ user, image });
  }

  const currentPicture = picture?.user === user ? picture : null;
  const profilePicture = currentPicture?.image?.imageData
    ? `data:image/png;base64,${currentPicture.image.imageData}`
    : defaultProfilePicture;

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

  async function login(username, password) {
    await loginRequest(username, password);

    const user = await getCurrentUser();

    setUser(user);
  }

  async function deleteAccount() {
    await deleteMyAccount();
    setPicture(null);
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
        profilePicture,
        pictureLoading: Boolean(user && !currentPicture),
        pictureError: currentPicture?.error,
        updateProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
