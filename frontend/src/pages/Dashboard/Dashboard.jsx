import { Search } from "lucide-react";
import MainLayout from "../../components/layouts/MainLayout";
import {
  Users,
  Briefcase,
  BrainCircuit,
  FileText,
} from "lucide-react";

import DashboardCard from "../../components/dashboard/DashboardCard";
export default function Dashboard() {
  return (
    <MainLayout>

<div className="flex flex-col items-center pt-2">

  {/* Heading */}

 <h1 className="text-5xl font-bold text-red-400 -mt-6">
    TalentSphere Dashboard 
</h1>

  {/* Tagline */}

  <p className="mt-3 text-xl text-gray-500">
    Find the best candidates from your talent pool
  </p>

  {/* Search */}
<div className="mt-10 w-full max-w-5xl">

  <div className="flex items-center h-16 rounded-2xl border border-red-100 bg-white shadow-sm px-6 focus-within:ring-2 focus-within:ring-red-500">

    <Search
      size={24}
      className="text-gray-400 flex-shrink-0"
    />

    <input
      type="text"
      placeholder="Search candidates, jobs or skills..."
      className="ml-4 w-full bg-transparent text-lg text-gray-700 placeholder:text-gray-400 outline-none"
    />

  </div>

  <div className="mt-4 flex justify-center">
    <span className="text-gray-500 text-lg">
      ✨ AI Powered Search
    </span>
  </div>

</div>

</div>
<div className="grid grid-cols-2 gap-8 mt-14 w-full max-w-6xl">

  <DashboardCard
    icon={Users}
    title="Candidates"
    value="12,584"
    subtitle="+12% this month"
  />

  <DashboardCard
    icon={Briefcase}
    title="Active Jobs"
    value="247"
    subtitle="18 closing soon"
  />

  <DashboardCard
    icon={BrainCircuit}
    title="AI Matches Today"
    value="438"
    subtitle="96% matching accuracy"
  />

  <DashboardCard
    icon={FileText}
    title="Resume Vault"
    value="25,000"
    subtitle="+326 uploaded today"
  />

</div>
    </MainLayout>
  );
}