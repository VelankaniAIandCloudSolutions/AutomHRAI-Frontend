export const login = (userData) => ({
  type: "login",
  payload: userData,
});
export const logout = () => ({
  type: "logout",
});
