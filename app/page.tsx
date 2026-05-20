import launchData from "@/data/launches.json";
import { Dashboard } from "@/components/Dashboard";
import type { LaunchData } from "@/types";

export default function Page() {
  return <Dashboard data={launchData as LaunchData} />;
}
