"use client";

import { createContext, useContext } from "react";

// The dashboard layout (server) reads the session once and shares the user with every dashboard page.
export const DashboardUserContext = createContext(null);

export function useDashboardUser() {
  const user = useContext(DashboardUserContext);
  if (!user) throw new Error("useDashboardUser must be used inside the dashboard layout");
  return user;
}
