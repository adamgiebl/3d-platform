import axios from "axios";
import { API_URL } from "./consts";

axios.defaults.withCredentials = true;

const getSessionToken = () => localStorage.getItem("sessionToken");

const setSessionToken = (token) => {
  if (token) {
    localStorage.setItem("sessionToken", token);
    axios.defaults.headers.common["x-parse-session-token"] = token;
  } else {
    localStorage.removeItem("sessionToken");
    delete axios.defaults.headers.common["x-parse-session-token"];
  }
};

const storedToken = getSessionToken();
if (storedToken) {
  axios.defaults.headers.common["x-parse-session-token"] = storedToken;
}

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: email,
      password,
    });
    const { sessionToken, user } = response.data;
    setSessionToken(sessionToken);
    return user;
  } catch (error) {
    setSessionToken(null);
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      email,
      password,
    });
    const { sessionToken, user } = response.data;
    setSessionToken(sessionToken);
    return user;
  } catch (error) {
    setSessionToken(null);
    throw new Error(error.response?.data?.error || "Registration failed");
  }
};

export const logout = async () => {
  try {
    const sessionToken = getSessionToken();
    await axios.post(`${API_URL}/auth/logout`, { sessionToken });
    setSessionToken(null);
  } catch (error) {
    setSessionToken(null);
    throw new Error(error.response?.data?.error || "Logout failed");
  }
};

export const getCurrentUser = async () => {
  try {
    const sessionToken = getSessionToken();
    if (!sessionToken) {
      return null;
    }
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data.user;
  } catch (error) {
    if (error.response?.status === 401) {
      setSessionToken(null);
      return null;
    }
    throw error;
  }
};
