import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  FileText,
  Filter,
  HeartPulse,
  LayoutDashboard,
  LoaderCircle,
  Menu,
  RefreshCw,
  Search,
  Server,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { searchCandidates } from "../../services/candidateService";

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
)
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");


// ============================================================
// DASHBOARD
// ============================================================

export default function Dashboard() {
  const navigate = useNavigate();

  // =========================================================
  // SEARCH STATE
  // =========================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // =========================================================
  // DASHBOARD LIVE DATA
  // =========================================================

  const [dashboardData, setDashboardData] = useState(null);
  const [healthData, setHealthData] = useState(null);

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [healthLoading, setHealthLoading] = useState(true);

  const [dashboardError, setDashboardError] = useState("");
  const [healthError, setHealthError] = useState("");

  const [lastUpdated, setLastUpdated] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  // =========================================================
  // MOBILE SIDEBAR
  // =========================================================

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================

  const loadDashboardData = async () => {
    try {
      setDashboardError("");

      const response = await fetch(
        `${API_BASE_URL}/api/dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Dashboard API returned ${response.status}`
        );
      }

      const result = await response.json();

      if (!result?.success) {
        throw new Error(
          result?.message || "Unable to load dashboard data."
        );
      }

      setDashboardData(result.data || {});
    } catch (error) {
      console.error("Dashboard data error:", error);

      setDashboardError(
        error?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setDashboardLoading(false);
    }
  };


  // =========================================================
  // LOAD SYSTEM HEALTH
  // =========================================================

  const loadSystemHealth = async () => {
    try {
      setHealthError("");

      const response = await fetch(
        `${API_BASE_URL}/api/health`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      /*
       * /api/health intentionally returns 503 when the
       * system is degraded. That is NOT a network error.
       *
       * We still read the JSON response and display the
       * actual component-level health information.
       */

      const result = await response.json();

      if (!result) {
        throw new Error(
          "Empty response from health API."
        );
      }

      setHealthData(result);
    } catch (error) {
      console.error("System health error:", error);

      setHealthError(
        error?.message ||
          "Unable to retrieve system health."
      );

      /*
       * If the health endpoint itself cannot be reached,
       * represent that clearly in the UI.
       */

      setHealthData({
        success: false,
        status: "failed",
        message:
          "System health service is unreachable.",
        components: {
          backend: {
            name: "Backend API",
            status: "failed",
            message:
              "Health endpoint could not be reached.",
          },
          supabase: {
            name: "Supabase",
            status: "unknown",
            message:
              "Unable to determine database status.",
          },
          gemini: {
            name: "Gemini AI",
            status: "unknown",
            message:
              "Unable to determine AI service status.",
          },
        },
        failedComponents: ["Backend API"],
      });
    } finally {
      setHealthLoading(false);
    }
  };


  // =========================================================
  // REFRESH EVERYTHING
  // =========================================================

  const refreshDashboard = async () => {
    try {
      setRefreshing(true);

      await Promise.all([
        loadDashboardData(),
        loadSystemHealth(),
      ]);

      setLastUpdated(new Date());
    } finally {
      setRefreshing(false);
    }
  };


  // =========================================================
  // INITIAL LOAD + AUTO REFRESH
  // =========================================================

  useEffect(() => {
    refreshDashboard();

    /*
     * Refresh live dashboard information every 30 seconds.
     */

    const interval = setInterval(() => {
      refreshDashboard();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);


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

        console.log(
          "Candidate Search Results:",
          results
        );

        /*
         * candidateService normally returns result.data.
         *
         * Defensive handling also supports the case
         * where the service returns the complete API response.
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

      case "Jobs":
        navigate("/jobs");
        break;

      case "Resume Vault":
        navigate("/resume-vault");
        break;

      default:
        console.log(
          `${label} navigation clicked`
        );
        break;
    }
  };


  // =========================================================
  // CLOSE MOBILE MENU WITH ESCAPE
  // =========================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);


  // =========================================================
  // LIVE DASHBOARD VALUES
  // =========================================================

  const totalCandidates =
    dashboardData?.totalCandidates ??
    0;

  const activeJobs =
    dashboardData?.activeJobs ??
    0;

  const aiMatches =
    dashboardData?.aiMatches ??
    0;


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
              onClick={() =>
                setMobileMenuOpen(true)
              }
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-slate-700 transition hover:bg-red-100 hover:text-red-500 lg:hidden"
              aria-label="Open menu"
              aria-expanded={
                mobileMenuOpen
              }
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
                      setSearchTerm(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleSearchKeyDown
                    }
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
                  {loading
                    ? "Searching..."
                    : "Search"}
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
                        (
                          candidate,
                          index
                        ) => {

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
                                  <ChevronRight
                                    size={15}
                                  />
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
                LIVE DASHBOARD STATISTICS
            ================================================= */}

            {!submittedSearchTerm.trim() && (

              <div className="mx-auto mt-14 grid max-w-[1100px] gap-6 md:grid-cols-2 lg:gap-8">

                {/* =================================================
                    CANDIDATES
                ================================================= */}

                <DashboardCard
                  icon={
                    <Users size={25} />
                  }
                  title="Candidates"
                  value={
                    dashboardLoading
                      ? null
                      : formatNumber(
                          totalCandidates
                        )
                  }
                  subtitle={
                    dashboardLoading
                      ? "Loading live data..."
                      : dashboardError
                        ? "Unable to load live data"
                        : "Live talent pool"
                  }
                  loading={
                    dashboardLoading
                  }
                />


                {/* =================================================
                    ACTIVE JOBS
                ================================================= */}

                <DashboardCard
                  icon={
                    <Briefcase size={25} />
                  }
                  title="Active Jobs"
                  value={
                    dashboardLoading
                      ? null
                      : formatNumber(
                          activeJobs
                        )
                  }
                  subtitle={
                    dashboardLoading
                      ? "Loading live data..."
                      : dashboardError
                        ? "Unable to load live data"
                        : "Currently open positions"
                  }
                  loading={
                    dashboardLoading
                  }
                />


                {/* =================================================
                    AI MATCHES
                ================================================= */}

                <DashboardCard
                  icon={
                    <BrainCircuit
                      size={25}
                    />
                  }
                  title="AI Matches"
                  value={
                    dashboardLoading
                      ? null
                      : formatNumber(
                          aiMatches
                        )
                  }
                  subtitle={
                    dashboardLoading
                      ? "Loading live data..."
                      : dashboardError
                        ? "Unable to load live data"
                        : "Candidate-job matches generated"
                  }
                  loading={
                    dashboardLoading
                  }
                />


                {/* =================================================
                    SYSTEM HEALTH
                ================================================= */}

                <SystemHealthCard
                  healthData={healthData}
                  loading={healthLoading}
                  error={healthError}
                  onRefresh={
                    refreshDashboard
                  }
                  refreshing={
                    refreshing
                  }
                />

              </div>

            )}


            {/* =================================================
                DASHBOARD REFRESH STATUS
            ================================================= */}

            {!submittedSearchTerm.trim() && (

              <div className="mx-auto mt-6 flex max-w-[1100px] flex-col items-center justify-between gap-3 text-sm text-slate-400 sm:flex-row">

                <div className="flex items-center gap-2">

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      healthData?.status ===
                      "healthy"
                        ? "bg-green-500"
                        : healthData?.status ===
                            "degraded"
                          ? "bg-amber-500"
                          : "bg-slate-300"
                    }`}
                  />

                  <span>
                    Live system monitoring
                    active
                  </span>

                </div>


                <div className="flex items-center gap-3">

                  {lastUpdated && (
                    <span>
                      Last updated{" "}
                      {formatTime(
                        lastUpdated
                      )}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={
                      refreshDashboard
                    }
                    disabled={refreshing}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-500 transition hover:bg-white hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RefreshCw
                      size={15}
                      className={
                        refreshing
                          ? "animate-spin"
                          : ""
                      }
                    />
                    Refresh
                  </button>

                </div>

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
// SYSTEM HEALTH CARD
// ============================================================

function SystemHealthCard({
  healthData,
  loading,
  error,
  onRefresh,
  refreshing,
}) {

  const status =
    healthData?.status ||
    (error ? "failed" : "unknown");


  const isHealthy =
    status === "healthy";


  const isDegraded =
    status === "degraded";


  const statusLabel = isHealthy
    ? "SYSTEM OPERATIONAL"
    : isDegraded
      ? "SYSTEM DEGRADED"
      : "SYSTEM UNAVAILABLE";


  const statusDescription = isHealthy
    ? "All monitored services are operating normally."
    : isDegraded
      ? "One or more monitored services need attention."
      : "Unable to verify all monitored services.";


  const statusClasses = isHealthy
    ? {
        badge:
          "bg-green-50 text-green-700 border-green-200",
        icon:
          "bg-green-50 text-green-600",
        dot:
          "bg-green-500",
        accent:
          "text-green-600",
      }
    : isDegraded
      ? {
          badge:
            "bg-amber-50 text-amber-700 border-amber-200",
          icon:
            "bg-amber-50 text-amber-600",
          dot:
            "bg-amber-500",
          accent:
            "text-amber-600",
        }
      : {
          badge:
            "bg-red-50 text-red-700 border-red-200",
          icon:
            "bg-red-50 text-red-600",
          dot:
            "bg-red-500",
          accent:
            "text-red-600",
        };


  const components = [
    {
      key: "backend",
      name: "Backend API",
      icon: Server,
      data:
        healthData?.components
          ?.backend,
    },
    {
      key: "supabase",
      name: "Supabase",
      icon: Database,
      data:
        healthData?.components
          ?.supabase,
    },
    {
      key: "gemini",
      name: "Gemini AI",
      icon: Bot,
      data:
        healthData?.components
          ?.gemini,
    },
  ];


  return (
    <div className="group relative overflow-hidden rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-7">

      {/* Decorative background */}

      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-50/70 blur-2xl transition group-hover:bg-red-100/70" />


      {/* Header */}

      <div className="relative flex items-start justify-between">

        <div className="flex items-center gap-4">

          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${statusClasses.icon}`}
          >
            {loading ? (
              <LoaderCircle
                size={27}
                className="animate-spin"
              />
            ) : (
              <HeartPulse
                size={27}
              />
            )}
          </div>


          <div>

            <p className="text-lg font-medium text-slate-500">
              System Health
            </p>

            <div className="mt-1 flex items-center gap-2">

              <span
                className={`h-2.5 w-2.5 rounded-full ${statusClasses.dot} ${
                  isHealthy
                    ? "animate-pulse"
                    : ""
                }`}
              />

              <span
                className={`text-sm font-semibold ${statusClasses.accent}`}
              >
                {loading
                  ? "CHECKING SYSTEM..."
                  : statusLabel}
              </span>

            </div>

          </div>

        </div>


        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          title="Refresh system health"
          aria-label="Refresh system health"
        >
          <RefreshCw
            size={19}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />
        </button>

      </div>


      {/* Status message */}

      <div className="relative mt-6">

        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusClasses.badge}`}
        >
          {isHealthy ? (
            <CheckCircle2
              size={14}
            />
          ) : (
            <AlertTriangle
              size={14}
            />
          )}

          {loading
            ? "Monitoring services"
            : statusLabel}
        </div>


        <p className="mt-3 text-sm leading-6 text-slate-500">
          {loading
            ? "Checking Backend, Supabase and Gemini AI..."
            : statusDescription}
        </p>

      </div>


      {/* Components */}

      <div className="relative mt-6 space-y-3">

        {components.map(
          (component) => {

            const Icon =
              component.icon;

            const componentStatus =
              component.data
                ?.status ||
              (loading
                ? "checking"
                : "unknown");

            const componentHealthy =
              componentStatus ===
              "healthy";

            const componentFailed =
              componentStatus ===
              "failed";

            return (

              <div
                key={component.key}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3"
              >

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500">

                    <Icon size={17} />

                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-slate-700">
                      {component.name}
                    </p>

                    {component.data
                      ?.responseTimeMs !==
                      undefined && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                        <Clock3
                          size={11}
                        />
                        {
                          component.data
                            .responseTimeMs
                        }
                        ms
                      </p>
                    )}

                  </div>

                </div>


                <div className="flex shrink-0 items-center gap-2">

                  <span
                    className={`h-2 w-2 rounded-full ${
                      componentHealthy
                        ? "bg-green-500"
                        : componentFailed
                          ? "bg-red-500"
                          : componentStatus ===
                              "checking"
                            ? "bg-amber-400 animate-pulse"
                            : "bg-slate-300"
                    }`}
                  />

                  <span
                    className={`text-xs font-semibold ${
                      componentHealthy
                        ? "text-green-600"
                        : componentFailed
                          ? "text-red-600"
                          : "text-slate-400"
                    }`}
                  >
                    {componentHealthy
                      ? "Healthy"
                      : componentFailed
                        ? "Failed"
                        : componentStatus ===
                            "checking"
                          ? "Checking"
                          : "Unknown"}
                  </span>

                </div>

              </div>

            );
          }
        )}

      </div>


      {/* Footer */}

      <div className="relative mt-5 border-t border-slate-100 pt-4">

        <div className="flex items-center justify-between gap-3">

          <p
            className={`text-xs font-medium ${
              isHealthy
                ? "text-green-600"
                : isDegraded
                  ? "text-amber-600"
                  : "text-red-500"
            }`}
          >
            {loading
              ? "Running health checks..."
              : healthData?.message ||
                error ||
                "Health information unavailable."}
          </p>


          <ChevronRight
            size={18}
            className="shrink-0 text-slate-300 transition group-hover:text-slate-500"
          />

        </div>

      </div>

    </div>
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
  loading = false,
}) {

  return (

    <div className="group relative overflow-hidden rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-7">

      {/* Decorative glow */}

      <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-red-50 opacity-70 blur-2xl transition group-hover:opacity-100" />


      <div className="relative flex items-start justify-between">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          {icon}
        </div>

        <ChevronRight
          size={24}
          className="text-slate-400 transition group-hover:text-red-400"
        />

      </div>


      <p className="relative mt-8 text-lg text-slate-500">
        {title}
      </p>


      <div className="relative mt-2 min-h-[48px]">

        {loading ? (

          <div className="flex items-center gap-3 pt-2">

            <LoaderCircle
              size={28}
              className="animate-spin text-red-400"
            />

            <span className="text-sm text-slate-400">
              Loading...
            </span>

          </div>

        ) : (

          <p className="text-4xl font-bold text-black">
            {value}
          </p>

        )}

      </div>


      <p className="relative mt-3 text-base text-slate-400">
        {subtitle}
      </p>

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

      <div className="px-6 pb-12 pt-10">

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

        {menuItems.map(
          (item) => {

            const Icon =
              item.icon;

            return (

              <SidebarItem
                key={item.label}
                icon={
                  <Icon size={21} />
                }
                label={
                  item.label
                }
                active={
                  active ===
                  item.label
                }
                onClick={() =>
                  onNavigate(
                    item.label
                  )
                }
              />

            );
          }
        )}

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
// HELPERS
// ============================================================

function formatNumber(value) {
  const numericValue =
    Number(value);

  if (
    !Number.isFinite(
      numericValue
    )
  ) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-US"
  ).format(numericValue);
}


function formatTime(date) {
  if (!date) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    ).format(date);
  } catch {
    return "";
  }
}