import { createContext, useContext, useState } from "react";
import { mockImages } from "../utils/mockData";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    console.table({
      action: "Login attempt",
      email,
      password: "****",
    });

    setUser({
      id: "1",
      name: "John Doe",
      email,
      avatar: mockImages.users[0],
    });

    return Promise.resolve();
  };

  const logout = () => {
    setUser(null);
    return Promise.resolve();
  };

  const register = (name, email, password) => {
    console.table({
      action: "Register attempt",
      name,
      email,
      password: "****",
    });

    setUser({
      id: "1",
      name,
      email,
      avatar:
        mockImages.users[Math.floor(Math.random() * mockImages.users.length)],
    });

    return Promise.resolve();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
