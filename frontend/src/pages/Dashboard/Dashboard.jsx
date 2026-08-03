import { Search } from "lucide-react";
import MainLayout from "../../components/layouts/MainLayout";

export default function Dashboard() {
  return (
    <MainLayout>

<div className="flex flex-col items-center pt-2">

  {/* Heading */}

 <h1 className="text-5xl font-bold text-red-600 -mt-6">
    Welcome to TalentSphere
</h1>

  {/* Tagline */}

  <p className="mt-3 text-xl text-gray-500">
    Find the best candidates from your talent pool
  </p>

  {/* Search */}

  <div className="relative mt-10 w-full max-w-5xl">

    <Search
      size={22}
      className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      type="text"
      placeholder="Search candidates, jobs or skills..."
      className="w-full h-16 rounded-2xl border border-red-100 bg-white pl-16 pr-6 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
    />

  </div>

</div>

    </MainLayout>
  );
}