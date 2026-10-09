"use client";

import { useDashboardUser } from "../../components/dashboard/user-context";
import { AdminOverview, CollaboratorOverview, FounderOverview } from "../../components/dashboard/overviews";

export default function DashboardOverviewPage() {
  const user = useDashboardUser();
  const firstName = (user.name || "there").split(" ")[0];

  if (user.role === "admin") return <AdminOverview name={firstName} />;
  if (user.role === "founder") return <FounderOverview name={firstName} />;
  return <CollaboratorOverview name={firstName} />;
}
