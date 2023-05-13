import { useContext } from "react";
import { UserContext, UserContextData } from "../context/userContext";

export function useAuth(): UserContextData {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
