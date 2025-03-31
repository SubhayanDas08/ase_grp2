import { Store, load } from "@tauri-apps/plugin-store";
import axios, { AxiosRequestConfig } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number; // timestamp when the access token expires
  refreshTokenExpiresAt: number; // timestamp when the refresh token expires
}

async function getStore(): Promise<Store> {
  const store = await load("app-store.json", { autoSave: false });
  return store;
}

export async function getAuthTokens(): Promise<AuthTokens | null> {
  const store = await getStore();
  return (await store.get("auth_tokens")) as AuthTokens | null;
}

export async function saveAuthTokens(tokens: AuthTokens): Promise<void> {
  const store = await getStore();
  await store.set("auth_tokens", tokens);
  await store.save();
}

export async function clearAuthTokens(): Promise<void> {
  const store = await getStore();
  await store.delete("auth_tokens");
  await store.save();
}

export async function login(
  userData: any,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, {
      userData,
    });

    const accessToken = response.data.token;
    const refreshToken = response.data.refreshToken;

    // Save the tokens with both expiration times
    await saveAuthTokens({
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
      refreshTokenExpiresAt: Date.now() + 180 * 24 * 60 * 60 * 1000, // 180 days
    });

    return {
      success: true,
      message: "Login successful!",
    };
  } catch (error) {
    console.error("Login error:", error);

    // Check if it's an Axios error with a response
    if (axios.isAxiosError(error) && error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.error || "Login failed";

      // Handle specific error cases
      if (statusCode === 401) {
        return {
          success: false,
          message: "Invalid email or password. Please try again.",
        };
      } else if (statusCode === 400) {
        // Return the specific validation error from the server
        return { success: false, message: errorMessage };
      } else {
        return { success: false, message: errorMessage };
      }
    }

    // Generic error handling
    return {
      success: false,
      message: "Login failed. Please try again later.",
    };
  }
}

export async function refreshToken(): Promise<boolean> {
  const tokens = await getAuthTokens();

  if (!tokens) {
    return false;
  }

  // Check if refresh token is expired
  if (Date.now() >= tokens.refreshTokenExpiresAt) {
    await clearAuthTokens();
    return false;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/user/refresh`, {
      refreshToken: tokens.refreshToken,
    });

    // Save the new tokens
    await saveAuthTokens({
      accessToken: response.data.token,
      refreshToken: tokens.refreshToken,
      accessTokenExpiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt, // Keep old refresh expiry
    });

    return true;
  } catch (error) {
    console.error("Refresh token error:", error);
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const tokens = await getAuthTokens();

  if (!tokens) {
    return false;
  }

  const now = Date.now();

  // Check if refresh token is expired
  if (now >= tokens.refreshTokenExpiresAt) {
    await clearAuthTokens();
    return false;
  }

  // If access token is valid, user is authenticated
  if (now < tokens.accessTokenExpiresAt) {
    return true;
  }

  // If access token expired, but refresh token is valid, try to refresh
  return await refreshToken();
}

export async function register(
  userData: any,
): Promise<{ success: boolean; message: string }> {
  try {
    // Send registration data to server
    const response = await axios.post(
      `${API_BASE_URL}/user/getRegistrationData`,
      {
        userData,
      },
    );

    // If registration successful and tokens are returned
    if (response.data.token && response.data.refreshToken) {
      await saveAuthTokens({
        accessToken: response.data.token,
        refreshToken: response.data.refreshToken,
        accessTokenExpiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
        refreshTokenExpiresAt: Date.now() + 180 * 24 * 60 * 60 * 1000, // 180 days
      });
    }

    return {
      success: true,
      message: "Registration successful!",
    };
  } catch (error) {
    console.error("Registration error:", error);

    // Check if it's an Axios error with a response
    if (axios.isAxiosError(error) && error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.error || "Registration failed";

      // Handle specific error cases
      if (statusCode === 409) {
        return {
          success: false,
          message:
            "Email already in use. Please use a different email address.",
        };
      } else if (statusCode === 400) {
        // Return the specific validation error from the server
        return { success: false, message: errorMessage };
      } else {
        return { success: false, message: errorMessage };
      }
    }

    // Generic error handling
    return {
      success: false,
      message: "Registration failed. Please try again later.",
    };
  }
}

export async function authenticatedRequest<T>(
  url: string,
  config: AxiosRequestConfig = {},
): Promise<T> {
  const tokens = await getAuthTokens();

  if (!tokens) {
    throw new Error("Authentication required");
  }

  // Check if tokens are expired and refresh if needed
  if (Date.now() >= tokens.accessTokenExpiresAt) {
    const refreshSuccess = await refreshToken();
    if (!refreshSuccess) {
      throw new Error("Authentication expired");
    }
  }

  // Get the latest tokens
  const currentTokens = await getAuthTokens();
  if (!currentTokens) {
    throw new Error("Authentication required");
  }

  // Create headers with authorization
  const headers = {
    ...config.headers,
    Authorization: `Bearer ${currentTokens.accessToken}`,
  };

  try {
    // Make the request
    const response = await axios({
      url: `${API_BASE_URL}${url}`,
      ...config,
      headers,
    });

    return response.data;
  } catch (error) {
    // Check if the error is due to unauthorized (401)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // If unauthorized, try refreshing the token
      const refreshSuccess = await refreshToken();
      if (!refreshSuccess) {
        throw new Error("Authentication expired");
      }

      // Get the latest tokens after refresh
      const newTokens = await getAuthTokens();
      if (!newTokens) {
        throw new Error("Authentication required");
      }

      // Retry the request with the new token
      try {
        const retryResponse = await axios({
          url: `${API_BASE_URL}${url}`,
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${newTokens.accessToken}`,
          },
        });

        return retryResponse.data;
      } catch (retryError) {
        throw new Error(
          `API request failed after token refresh: ${retryError}`,
        );
      }
    }

    throw error;
  }
}

// Convenience wrapper for GET requests
export async function authenticatedGet<T>(
  url: string,
  config: AxiosRequestConfig = {},
): Promise<T> {
  return authenticatedRequest<T>(url, { ...config, method: "GET" });
}

// Convenience wrapper for POST requests
export async function authenticatedPost<T>(
  url: string,
  data?: any,
  config: AxiosRequestConfig = {},
): Promise<T> {
  return authenticatedRequest<T>(url, {
    ...config,
    method: "POST",
    data,
  });
}

// Convenience wrapper for DELETE requests
export async function authenticatedDelete<T>(
  url: string,
  config: AxiosRequestConfig = {},
): Promise<T> {
  return authenticatedRequest<T>(url, { ...config, method: "DELETE" });
}

export async function logout(): Promise<void> {
  try {
    // Use the authenticatedPost function which will automatically
    // add the bearer token and handle any auth issues
    await authenticatedPost("/user/logout", {
      refreshToken: (await getAuthTokens())?.refreshToken,
    });
  } catch (error) {
    console.error("Logout error:", error);
    // Continue with local logout even if server logout fails
  }

  // Always clear local tokens regardless of server response
  await clearAuthTokens();
}
