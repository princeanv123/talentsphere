import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchCandidates } from "../../services/candidateService";

export default function Dashboard() {
  const navigate = useNavigate();

  // ========================================
  // Search State
  // ========================================

  // What the user is currently typing
  const [searchTerm, setSearchTerm] = useState("");

  // The query that was actually submitted
  const [submittedSearchTerm, setSubmittedSearchTerm] =
    useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // ========================================
  // Search Candidates
  // Runs ONLY when Search is clicked
  // or Enter is pressed
  // ========================================

  const handleSearch = async () => {
    const keyword = searchTerm.trim();

    // Empty search
    if (!keyword) {
      setSubmittedSearchTerm("");
      setSearchResults([]);
      setSearchError("");
      return;
    }

    try {
      setLoading(true);
      setSearchError("");

      // Store the query that was actually submitted
      setSubmittedSearchTerm(keyword);

      console.log("======================================");
      console.log("DASHBOARD SEARCH");
      console.log("Submitted Query:", keyword);
      console.log("======================================");

      const results = await searchCandidates({
        keyword,
      });

      console.log(
        "Candidate Search Results:",
        results
      );

      /*
        candidateService normally returns result.data.

        This defensive handling also supports the case
        where the service returns the complete API response.
      */

      const candidates = Array.isArray(results)
        ? results
        : Array.isArray(results?.data)
          ? results.data
          : [];

      console.log(
        "Candidates to render:",
        candidates
      );

      setSearchResults(candidates);

    } catch (error) {
      console.error(
        "Candidate search error:",
        error
      );

      setSearchResults([]);

      setSearchError(
        error?.message ||
          "Unable to search candidates"
      );

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Search Input - Enter Shortcut
  // ========================================

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  // ========================================
  // Candidate Helpers
  // ========================================

  const getCandidateName = (candidate) => {
    return (
      candidate?.full_name ||
      candidate?.name ||
      candidate?.candidate_name ||
      "Unnamed Candidate"
    );
  };

  const getCandidateEmail = (candidate) => {
    return (
      candidate?.email ||
      "Email not available"
    );
  };

  const getCandidateLocation = (candidate) => {
    return (
      candidate?.location ||
      candidate?.city ||
      "Location not available"
    );
  };

  const getCandidateExperience = (candidate) => {
    const experience =
      candidate?.experience ??
      candidate?.total_experience ??
      candidate?.years_of_experience ??
      candidate?.experience_years ??
      candidate?.candidate?.experience ??
      candidate?.candidate?.total_experience ??
      candidate?.candidate?.years_of_experience ??
      candidate?.candidate?.experience_years;

    if (
      experience !== null &&
      experience !== undefined &&
      experience !== ""
    ) {
      return experience;
    }

    return "N/A";
  };

  const getCandidateKey = (
    candidate,
    index
  ) => {
    return (
      candidate?.id ||
      candidate?.candidate_id ||
      candidate?.uuid ||
      candidate?.email ||
      `candidate-${index}`
    );
  };

  // ========================================
  // Render
  // ========================================

  return (
    <div className="min-h-screen bg-white text-slate-800">

      <div className="flex min-h-screen">

        {/* ========================================
            Sidebar
        ======================================== */}

        <aside className="hidden w-[308px] shrink-0 border-r border-red-100 bg-white lg:block">

          {/* Logo */}

          <div className="px-6 pt-10 pb-12">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-red-500 text-2xl font-bold text-red-500">
                O
              </div>

              <div>

                <h1 className="text-4xl font-bold tracking-tight text-red-500">
                  TalentSphere
                </h1>

                <p className="text-base text-slate-500">
                  AI Talent Intelligence
                </p>

              </div>

            </div>

          </div>

          {/* Navigation */}

          <nav className="space-y-2 px-6">

            <SidebarItem
              icon="▦"
              label="Dashboard"
              active
            />

            <SidebarItem
              icon="♧"
              label="Candidates"
            />

            <SidebarItem
              icon="▣"
              label="Jobs"
            />

            <SidebarItem
              icon="♧"
              label="AI Search"
            />

            <SidebarItem
              icon="▤"
              label="Resume Vault"
            />

            <SidebarItem
              icon="▥"
              label="Analytics"
            />

            <SidebarItem
              icon="〽"
              label="Observability"
            />

            <SidebarItem
              icon="⚙"
              label="Settings"
            />

          </nav>

        </aside>

        {/* ========================================
            Main Content
        ======================================== */}

        <main className="min-w-0 flex-1 bg-[#fff7f7]">

          {/* ========================================
              Header
          ======================================== */}

          <header className="flex h-[102px] items-center justify-end border-b border-red-100 bg-white px-8">

            <div className="flex items-center gap-6">

              <button
                type="button"
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-slate-700 transition hover:bg-red-100"
                title="Filters"
              >
                ☷
              </button>

              <button
                type="button"
                className="text-2xl text-slate-700 transition hover:text-red-500"
                title="Notifications"
              >
                ♧
              </button>

            </div>

          </header>

          {/* ========================================
              Dashboard Content
          ======================================== */}

          <section className="px-6 py-10 lg:px-12">

            {/* ========================================
                Heading
            ======================================== */}

            <div className="text-center">

              <h2 className="text-5xl font-bold tracking-tight text-[#ff6666] lg:text-6xl">
                TalentSphere Dashboard
              </h2>

              <p className="mt-4 text-xl text-slate-500">
                Find the best candidates from your talent pool
              </p>

            </div>

            {/* ========================================
                Search Box
            ======================================== */}

            <div className="mx-auto mt-12 max-w-[1100px]">

              <div className="flex items-center gap-3 rounded-2xl border-2 border-red-100 bg-white px-5 py-3 shadow-sm transition focus-within:border-red-500">

                {/* Search Icon */}

                <span className="text-3xl text-slate-400">
                  ⌕
                </span>

                {/* Search Input */}

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleSearchKeyDown
                  }
                  placeholder="Search candidates, jobs or skills..."
                  className="w-full bg-transparent px-2 py-3 text-lg text-slate-700 outline-none placeholder:text-slate-400"
                />

                {/* Search Button */}

                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={loading}
                  className="shrink-0 rounded-xl bg-red-500 px-7 py-3 text-base font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Searching..."
                    : "Search"}
                </button>

              </div>

              {/* ========================================
                  Search Status
              ======================================== */}

              {loading && (
                <p className="mt-5 text-center text-base text-slate-500">
                  Searching candidates...
                </p>
              )}

              {!loading &&
                submittedSearchTerm.trim() &&
                !searchError && (
                  <p className="mt-5 text-center text-base text-slate-500">
                    ✨ AI Powered Search
                  </p>
                )}

              {searchError && (
                <p className="mt-5 text-center text-red-500">
                  {searchError}
                </p>
              )}

            </div>

            {/* ========================================
                Candidate Search Results
            ======================================== */}

            {submittedSearchTerm.trim() &&
              !loading &&
              !searchError && (

                <div className="mx-auto mt-8 max-w-[1100px]">

                  {/* ========================================
                      No Results
                  ======================================== */}

                  {searchResults.length === 0 ? (

                    <div className="rounded-2xl border border-red-100 bg-white px-6 py-12 text-center shadow-sm">

                      <p className="text-lg text-slate-500">
                        No matching profiles found
                        in the current talent pool.
                      </p>

                    </div>

                  ) : (

                    /* ========================================
                       Results
                    ======================================== */

                    <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">

                      {searchResults.map(
                        (candidate, index) => {

                          const name =
                            getCandidateName(
                              candidate
                            );

                          const email =
                            getCandidateEmail(
                              candidate
                            );

                          const location =
                            getCandidateLocation(
                              candidate
                            );

                          const experience =
                            getCandidateExperience(
                              candidate
                            );

                          const key =
                            getCandidateKey(
                              candidate,
                              index
                            );

                          const candidateId =
                            candidate?.id ||
                            candidate?.candidate_id ||
                            candidate?.uuid;

                          return (

                            <div
                              key={key}
                              className="flex items-center justify-between border-b border-slate-100 px-6 py-6 transition last:border-b-0 hover:bg-red-50"
                            >

                              {/* Candidate Information */}

                              <div className="min-w-0">

                                <h3 className="text-lg font-semibold text-slate-900">
                                  {name}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                  {email}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                  {location}
                                </p>

                              </div>

                              {/* Candidate Meta */}

                              <div className="ml-6 flex shrink-0 flex-col items-end">

                                <span className="text-lg font-medium text-red-500">
                                  {experience} years
                                </span>

                                <button
                                  type="button"
                                  disabled={!candidateId}
                                  className="mt-1 text-sm text-slate-400 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                  onClick={() => {

                                    if (
                                      !candidateId
                                    ) {
                                      console.error(
                                        "Candidate ID not found:",
                                        candidate
                                      );
                                      return;
                                    }

                                    console.log(
                                      "Selected Candidate:",
                                      candidate
                                    );

                                    navigate(
                                      `/candidates/${candidateId}`
                                    );

                                  }}
                                >
                                  View Profile →
                                </button>

                              </div>

                            </div>

                          );
                        }
                      )}

                    </div>

                  )}

                </div>

              )}

            {/* ========================================
                Dashboard Statistics
            ======================================== */}

            {!submittedSearchTerm.trim() && (

              <div className="mx-auto mt-16 grid max-w-[1100px] gap-8 md:grid-cols-2">

                <DashboardCard
                  icon="♧"
                  title="Candidates"
                  value="12,584"
                  subtitle="+12% this month"
                />

                <DashboardCard
                  icon="▣"
                  title="Active Jobs"
                  value="247"
                  subtitle="18 closing soon"
                />

                <DashboardCard
                  icon="♧"
                  title="AI Matches"
                  value="8,421"
                  subtitle="+18% this month"
                />

                <DashboardCard
                  icon="▤"
                  title="Resumes"
                  value="18,932"
                  subtitle="+8% this month"
                />

              </div>

            )}

          </section>

          {/* ========================================
              Footer
          ======================================== */}

          <footer className="border-t border-red-100 bg-white py-8 text-center">

            <p className="text-sm text-slate-400">
              © Built by Prince Singh
            </p>

          </footer>

        </main>

      </div>

    </div>
  );
}


// ========================================
// Sidebar Item
// ========================================

function SidebarItem({
  icon,
  label,
  active = false,
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-5 rounded-xl px-5 py-4 text-left text-lg transition ${
        active
          ? "bg-red-50 font-semibold text-slate-900"
          : "text-slate-700 hover:bg-red-50"
      }`}
    >

      <span
        className={`w-6 text-center text-xl ${
          active
            ? "text-red-500"
            : "text-slate-700"
        }`}
      >
        {icon}
      </span>

      <span>{label}</span>

    </button>
  );
}


// ========================================
// Dashboard Card
// ========================================

function DashboardCard({
  icon,
  title,
  value,
  subtitle,
}) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-500">
          {icon}
        </div>

        <span className="text-2xl text-slate-400">
          ↗
        </span>

      </div>

      <p className="mt-8 text-lg text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-4xl font-bold text-black">
        {value}
      </p>

      <p className="mt-3 text-base text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}