// utils/auth.js
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const saveUserData = (userData) => {
  localStorage.setItem("userData", JSON.stringify(userData));
};

export const getUserData = () => {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : null;
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
};