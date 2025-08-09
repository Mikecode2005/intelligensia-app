import { Metadata } from "next";
import ModernDashboard from "./ModernDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Page() {
  return <ModernDashboard />;
}