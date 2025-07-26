export const storage = {
  get: (key: string): string | null => {
    return localStorage.getItem(key);
  },
  set: (key: string, value: string) => {
    localStorage.setItem(key, value);
  },
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
  clearAll: () => {
    console.log("Borrando")
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("tokenType");
  },
};
