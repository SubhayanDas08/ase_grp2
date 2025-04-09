import { useState, useEffect } from "react";
import {
  isAuthenticated,
  getPermissions,
  clearAuthTokens,
} from "../utils/auth";

export function useAuth() {
  const [userAuthenticated, setUserAuthenticated] = useState<Boolean>(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setUserAuthenticated(authenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (userAuthenticated) {
        const userPermissions = await getPermissions();
        if (userPermissions) {
          setPermissions(userPermissions);
        }
      } else {
        setPermissions([]);
      }
    };

    fetchPermissions();
  }, [userAuthenticated]);

  const logout = async () => {
    await clearAuthTokens();
    setUserAuthenticated(false);
    setPermissions([]);
  };

  return {
    userAuthenticated,
    permissions,
    loading,
    logout,
    setUserAuthenticated,
  };
}
