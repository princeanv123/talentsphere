import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Bell,
  BrainCircuit,
  Briefcase,
  ChevronRight,
  FileText,
  Filter,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { searchCandidates } from "../../services/candidateService";

export default function Dashboard() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Mobile sidebar
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // =========================================================
  // SEARCH
  // =========================================================

  useEffect(() => {
    const keyword = submittedSearchTerm.trim();

    if (!keyword) {
      setSearchResults([]);
      setSearchError("");
      setLoading(false);
      return;
    }

    const runSearch = async () => {
      try {
        setLoading(true);
        setSearchError("");

        console.log("======================================");
        console.log("DASHBOARD SEARCH");
        console.log("Submitted Query:", keyword);
        console.log("======================================");

        const results = await searchCandidates({
          keyword,
        });

        console.log("Candidate Search Results:", results);

        /*
         * candidateService normally returns result.data.
         *
         * This defensive handling also supports the case
         * where the service returns the complete API response.
         */
        const candidates = Array.isArray(results)
          ? results
          : Array.isArray(results?.data)
            ? results.data
            : [];

        console.log("Candidates to render:", candidates);

        setSearchResults(candidates);
      } catch (error) {
        console.error("Candidate search error:", error);

        setSearchResults([]);

        setSearchError(
          error?.message || "Unable to search candidates"
        );
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [submittedSearchTerm]);

  // =========================================================
  // SEARCH HANDLERS
  // =========================================================

  const handleSearch = () => {
    const keyword = searchTerm.trim();

    if (!keyword) {
      setSubmittedSearchTerm("");
      setSearchResults([]);
      setSearchError("");
      return;
    }

    setSubmittedSearchTerm(keyword);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  // =========================================================
  // CANDIDATE HELPERS
  // =========================================================

  const getCandidateName = (candidate) => {
    return (
      candidate?.full_name ||
      candidate?.name ||
      candidate?.candidate_name ||
      "Unnamed Candidate"
    );
  };

  const getCandidateEmail = (candidate) => {
    return candidate?.email || "Email not available";
  };

  const getCandidateLocation = (candidate) => {
    return (
      candidate?.location ||
      candidate?.city ||
      "Location not available"
    );
  };

  const getCandidateExperience = (candidate) => {
    /*
     * Current backend returns candidate fields at the top level.
     *
     * The nested candidate fallback is retained for compatibility
     * with older search responses.
     */
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

  const getCandidateKey = (candidate, index) => {
    return (
      candidate?.id ||
      candidate?.candidate_id ||
      candidate?.uuid ||
      candidate?.email ||
      `candidate-${index}`
    );
  };

  // =========================================================
  // MOBILE MENU
  // =========================================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavigation = (label) => {
    closeMobileMenu();

    switch (label) {
      case "Dashboard":
        navigate("/dashboard");
        break;

      case "Candidates":
        navigate("/candidates");
        break;

      default:
        /*
         * These pages are not connected yet.
         */
        console.log(`${label} navigation clicked`);
        break;
    }
  };

  // Close mobile menu with Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-white text-slate-800">

      <div className="flex min-h-screen">

        {/* ===================================================
            DESKTOP SIDEBAR
        =================================================== */}

        <aside className="hidden h-screen w-[308px] shrink-0 overflow-y-auto border-r border-red-100 bg-white lg:block">

          <SidebarContent
            active="Dashboard"
            onNavigate={handleNavigation}
          />

        </aside>

        {/* ===================================================
            MOBILE SIDEBAR OVERLAY
        =================================================== */}

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}

        {/* ===================================================
            MOBILE SIDEBAR
        =================================================== */}

        <aside
          className={`fixed inset-y-0 left-0 z-50 h-screen w-[290px] overflow-y-auto border-r border-red-100 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >

          {/* Mobile Sidebar Header */}

          <div className="flex items-center justify-between border-b border-red-100 px-5 py-5">

            <div>
              <h2 className="text-xl font-bold text-red-500">
                TalentSphere
              </h2>

              <p className="text-xs text-slate-500">
                AI Talent Intelligence
              </p>
            </div>

            <button
              type="button"
              onClick={closeMobileMenu}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-red-50 hover:text-red-500"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>

          </div>

          <SidebarContent
            active="Dashboard"
            onNavigate={handleNavigation}
          />

        </aside>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <main className="min-w-0 flex-1 bg-[#fff7f7]">

          {/* =================================================
              TOP HEADER
          ================================================= */}

          <header className="flex h-[90px] items-center justify-between border-b border-red-100 bg-white px-5 sm:px-8">

            {/* Mobile Menu Button */}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-slate-700 transition hover:bg-red-100 hover:text-red-500 lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={25} />
            </button>

            {/* Desktop Spacer */}

            <div className="hidden lg:block" />

            {/* Header Actions */}

            <div className="flex items-center gap-4 sm:gap-6">

              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-slate-700 transition hover:bg-red-100 hover:text-red-500"
                title="Filters"
                aria-label="Filters"
              >
                <Filter size={20} />
              </button>

              <button
                type="button"
                className="text-slate-700 transition hover:text-red-500"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell size={22} />
              </button>

            </div>

          </header>

          {/* =================================================
              DASHBOARD CONTENT
          ================================================= */}

          <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12">

            {/* Heading */}

            <div className="text-center">

              <h1 className="text-4xl font-bold tracking-tight text-[#ff6666] sm:text-5xl lg:text-6xl">
                TalentSphere Dashboard
              </h1>

              <p className="mt-4 text-base text-slate-500 sm:text-xl">
                Find the best candidates from your talent pool
              </p>

            </div>

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="mx-auto mt-10 max-w-[1100px]">

              <div className="flex flex-col gap-3 rounded-2xl border-2 border-red-100 bg-white p-3 shadow-sm transition focus-within:border-red-300 sm:flex-row sm:items-center sm:px-5 sm:py-3">

                <div className="flex min-w-0 flex-1 items-center">

                  <Search
                    size={28}
                    className="mr-4 shrink-0 text-slate-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search candidates, jobs or skills..."
                    className="w-full min-w-0 bg-transparent py-2 text-base text-slate-700 outline-none placeholder:text-slate-400 sm:text-lg"
                  />

                </div>

                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full rounded-xl bg-red-500 px-7 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? "Searching..." : "Search"}
                </button>

              </div>

              {/* Search Status */}

              {loading && (
                <p className="mt-5 text-center text-base text-slate-500">
                  Searching candidates...
                </p>
              )}

              {!loading &&
                submittedSearchTerm.trim() &&
                !searchError && (
                  <p className="mt-5 flex items-center justify-center gap-2 text-base text-slate-500">
                    <Sparkles size={17} />
                    AI Powered Search
                  </p>
                )}

              {searchError && (
                <p className="mt-5 text-center text-red-500">
                  {searchError}
                </p>
              )}

            </div>

            {/* =================================================
                CANDIDATE SEARCH RESULTS
            ================================================= */}

            {submittedSearchTerm.trim() &&
              !loading &&
              !searchError && (

                <div className="mx-auto mt-8 max-w-[1100px]">

                  {searchResults.length === 0 ? (

                    <div className="rounded-2xl border border-red-100 bg-white px-6 py-12 text-center shadow-sm">

                      <p className="text-lg text-slate-500">
                        No candidates found.
                      </p>

                    </div>

                  ) : (

                    <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">

                      {searchResults.map(
                        (candidate, index) => {

                          const name =
                            getCandidateName(candidate);

                          const email =
                            getCandidateEmail(candidate);

                          const location =
                            getCandidateLocation(candidate);

                          const experience =
                            getCandidateExperience(candidate);

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
                              className="flex flex-col gap-5 border-b border-slate-100 px-5 py-6 transition last:border-b-0 hover:bg-red-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                            >

                              {/* Candidate Information */}

                              <div className="min-w-0">

                                <h3 className="text-lg font-semibold text-slate-900">
                                  {name}
                                </h3>

                                <p className="mt-1 break-all text-sm text-slate-500">
                                  {email}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                  {location}
                                </p>

                              </div>

                              {/* Candidate Meta */}

                              <div className="flex shrink-0 flex-col items-start sm:ml-6 sm:items-end">

                                <span className="text-lg font-medium text-red-500">
                                  {experience} years
                                </span>

                                <button
                                  type="button"
                                  disabled={!candidateId}
                                  className="mt-1 flex items-center gap-1 text-sm text-slate-400 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                  onClick={() => {

                                    if (!candidateId) {
                                      console.error(
                                        "Candidate ID not found:",
                                        candidate
                                      );
                                      return;
                                    }

                                    navigate(
                                      `/candidates/${candidateId}`
                                    );

                                  }}
                                >
                                  View Profile
                                  <ChevronRight size={15} />

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

            {/* =================================================
                DASHBOARD STATISTICS
            ================================================= */}

            {!submittedSearchTerm.trim() && (

              <div className="mx-auto mt-14 grid max-w-[1100px] gap-6 md:grid-cols-2 lg:gap-8">

                <DashboardCard
                  icon={<Users size={25} />}
                  title="Candidates"
                  value="12,584"
                  subtitle="+12% this month"
                />

                <DashboardCard
                  icon={<Briefcase size={25} />}
                  title="Active Jobs"
                  value="247"
                  subtitle="18 closing soon"
                />

                <DashboardCard
                  icon={<BrainCircuit size={25} />}
                  title="AI Matches"
                  value="8,421"
                  subtitle="+18% this month"
                />

                <DashboardCard
                  icon={<FileText size={25} />}
                  title="Resumes"
                  value="18,932"
                  subtitle="+8% this month"
                />

              </div>

            )}

          </section>

          {/* =================================================
              FOOTER
          ================================================= */}

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


// ============================================================
// SIDEBAR CONTENT
// ============================================================

function SidebarContent({
  active,
  onNavigate,
}) {

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      icon: Users,
      label: "Candidates",
    },
    {
      icon: Briefcase,
      label: "Jobs",
    },
    {
      icon: BrainCircuit,
      label: "AI Search",
    },
    {
      icon: FileText,
      label: "Resume Vault",
    },
    {
      icon: BarChart3,
      label: "Analytics",
    },
    {
      icon: Activity,
      label: "Observability",
    },
    {
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <div className="flex min-h-full flex-col">

      {/* Logo */}

      <div className="px-6 pt-10 pb-12">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-red-500 text-2xl font-bold text-red-500">
            O
          </div>

          <div>

            <h2 className="text-4xl font-bold tracking-tight text-red-500">
              TalentSphere
            </h2>

            <p className="text-base text-slate-500">
              AI Talent Intelligence
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="space-y-2 px-6">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <SidebarItem
              key={item.label}
              icon={<Icon size={21} />}
              label={item.label}
              active={active === item.label}
              onClick={() =>
                onNavigate(item.label)
              }
            />
          );

        })}

      </nav>

      {/* Sidebar Footer */}

      <div className="mt-auto px-6 py-8">

        <p className="text-xs text-gray-400">
          © Built by Prince Singh
        </p>

      </div>

    </div>
  );
}


// ============================================================
// SIDEBAR ITEM
// ============================================================

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}) {

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-5 rounded-xl px-5 py-4 text-left text-lg transition ${
        active
          ? "bg-red-50 font-semibold text-slate-900"
          : "text-slate-700 hover:bg-red-50 hover:text-red-600"
      }`}
    >

      <span
        className={`flex w-6 shrink-0 items-center justify-center ${
          active
            ? "text-red-500"
            : "text-slate-700"
        }`}
      >
        {icon}
      </span>

      <span>
        {label}
      </span>

    </button>
  );
}


// ============================================================
// DASHBOARD CARD
// ============================================================

function DashboardCard({
  icon,
  title,
  value,
  subtitle,
}) {

  return (
    <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-7">

      <div className="flex items-start justify-between">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          {icon}
        </div>

        <ChevronRight
          size={24}
          className="text-slate-400"
        />

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