import { storage } from "./storage";
import type { AuthResponse } from "./types";

export function saveAuthData(data: AuthResponse) {
  storage.set("accessToken", data.access_token);
  storage.set("refreshToken", data.refresh_token);
  storage.set("user", JSON.stringify(data.user));
  storage.set("expiresIn", data.expires_in.toString());
  storage.set("tokenType", data.token_type);
}

export function clearAuthData() {
  storage.clearAll();
}

export function getAuthDataFromStorage(): AuthResponse | null {
  const access_token = storage.get("accessToken");
  const refresh_token = storage.get("refreshToken");
  const user = storage.get("user");
  const expires_in = storage.get("expiresIn");
  const token_type = storage.get("tokenType");

  if (!access_token || !refresh_token || !user || !expires_in || !token_type) {
    return null;
  }

  return {
    access_token,
    refresh_token,
    user: JSON.parse(user),
    expires_in: Number(expires_in),
    token_type,
  };
}
