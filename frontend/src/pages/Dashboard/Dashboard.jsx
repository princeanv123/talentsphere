import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layouts/MainLayout";
import { searchCandidates } from "../../services/candidateService";
import {
  Users,
  Briefcase,
  BrainCircuit,
  FileText,
} from "lucide-react";

import DashboardCard from "../../components/dashboard/DashboardCard";
export default function Dashboard() {
    const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
    const handleSearch = async (e) => {
    if (e.key !== "Enter") {
      return;
    }

    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError("");

      const results = await searchCandidates({
        keyword: searchTerm,
      });
      console.log("Candidate Search Results:", results);
      setSearchResults(results);
      
    } catch (error) {
      console.error("Candidate search error:", error);
      setSearchError(error.message);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };
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
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    setSearchResults([]);
    setSearchError("");
  }}
  onKeyDown={handleSearch}
  placeholder="Search candidates, jobs or skills..."
  className="ml-4 w-full bg-transparent text-lg text-gray-700 placeholder:text-gray-400 outline-none"
/>

  </div>
  {searchLoading && (
  <p className="mt-3 text-center text-gray-500">
    Searching candidates...
  </p>
)}

{searchError && (
  <p className="mt-3 text-center text-red-500">
    {searchError}
  </p>
)}

{!searchLoading && searchResults.length > 0 && (
  <div className="mt-4 w-full max-w-3xl mx-auto rounded-xl bg-white shadow-md border border-gray-200 overflow-hidden">
    {searchResults.map((candidate) => (
      <div
        key={candidate.id}
        onClick={() => navigate(`/candidates/${candidate.id}`)}
        className="cursor-pointer border-b border-gray-100 p-4 last:border-b-0 hover:bg-red-50"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">
              {candidate.full_name}
            </p>

            <p className="text-sm text-gray-500">
              {candidate.email || "No email available"}
            </p>

            <p className="text-sm text-gray-500">
              {candidate.location || "Location not available"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium text-red-600">
              {candidate.experience ?? "N/A"} years
            </p>

            <p className="text-xs text-gray-400">
              View Profile →
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

{!searchLoading &&
  searchTerm.trim() &&
  searchResults.length === 0 &&
  !searchError && (
    <p className="mt-3 text-center text-gray-500">
      No candidates found.
    </p>
  )}

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