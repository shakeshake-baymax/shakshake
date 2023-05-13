import { useContext } from "react";
import { ViewContext, ViewContextData } from "../context/viewContext";

export function useView(): ViewContextData {
  const context = useContext(ViewContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
