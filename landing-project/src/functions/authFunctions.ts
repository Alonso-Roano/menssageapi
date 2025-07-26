import { apiRequest } from "./auth";
import type { AuthResponse } from "./types";
import { saveAuthData, clearAuthData, getAuthDataFromStorage } from "./helpers";

const ANON_KEY = import.meta.env.PUBLIC_API_KEY ?? "tu-token-anon";

export async function register(
  email: string,
  password: string
): Promise<AuthResponse | { error: any }> {
  try {
    const data = await apiRequest<AuthResponse>(
      "auth.signup",
      {},
      { email, password },
      {
        headers: { Authorization: `Bearer ${ANON_KEY}` },
      }
    );
    saveAuthData(data);
    return data;
  } catch (error: any) {
    return { error: error.response?.data || error.message };
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse | { error: any }> {
  try {
    const data = await apiRequest<AuthResponse>(
      "auth.login",
      {},
      { email, password },
      {
        headers: { Authorization: `Bearer ${ANON_KEY}` },
      }
    );
    saveAuthData(data);
    return data;
  } catch (error: any) {
    return { error: error.response?.data || error.message };
  }
}

export async function refreshToken(
  refreshToken: string
): Promise<AuthResponse | { error: any }> {
  try {
    const data = await apiRequest<AuthResponse>(
      "auth.refresh",
      {},
      { refresh_token: refreshToken },
      {
        headers: { Authorization: `Bearer ${ANON_KEY}` },
      }
    );
    saveAuthData(data);
    return data;
  } catch (error: any) {
    return { error: error.response?.data || error.message };
  }
}

export async function logout(
  accessToken: string | any
): Promise<{ error?: any }> {
  try {
    
    clearAuthData();
    await apiRequest("auth.logout", {}, null, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return {};
  } catch (error: any) {
    return { error: error.response?.data || error.message };
  }
}

export async function getSession(): Promise<{ user?: any; error?: any }> {
  const authData = getAuthDataFromStorage();
  if (!authData) {
    return { error: "No session data found" };
  }
  try {
    const user = await apiRequest<any>(
      "auth.user",
      {},
      null,
      {
        headers: { Authorization: `Bearer ${authData.access_token}` },
      }
    );
    return { user };
  } catch (error: any) {
    return { error: error.response?.data || error.message };
  }
}
