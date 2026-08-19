import { useEffect, useState } from "react";
import { Search, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../components/layouts/MainLayout";
import { getCandidates } from "../../services/candidateService";

export default function Candidates() {

  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const loadCandidates = async () => {

      try {

        setLoading(true);
        setError("");

        const data = await getCandidates();

        console.log("Candidates loaded:", data);

        setCandidates(data || []);

      } catch (error) {

        console.error("Candidate loading error:", error);

        setError(
          error.message || "Unable to load candidates."
        );

      } finally {

        setLoading(false);

      }

    };

    loadCandidates();

  }, []);


  const filteredCandidates =
    candidates.filter((candidate) => {

      const search =
        searchTerm.trim().toLowerCase();

      if (!search) {
        return true;
      }

      return (

        candidate.full_name
          ?.toLowerCase()
          .includes(search)

        ||

        candidate.email
          ?.toLowerCase()
          .includes(search)

        ||

        candidate.location
          ?.toLowerCase()
          .includes(search)

      );

    });


  return (

    <MainLayout>

      {/* Header */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-bold text-gray-900">
            Candidates
          </h1>

          <p className="mt-2 text-gray-500">
            Discover and manage candidates in your talent pool.
          </p>

        </div>

        <div className="flex items-center gap-2 text-red-600">

          <UserRound size={22} />

          <span className="font-semibold">
            {candidates.length} Candidates
          </span>

        </div>

      </div>


      {/* Search */}

      <div className="mb-8">

        <div className="flex items-center h-14 max-w-3xl rounded-xl border border-red-100 bg-white shadow-sm px-5">

          <Search
            size={21}
            className="text-gray-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            placeholder="Search by name, email or location..."
            className="ml-4 w-full bg-transparent outline-none text-gray-700"
          />

        </div>

      </div>


      {/* Loading */}

      {loading && (

        <div className="py-12 text-center text-gray-500">

          Loading candidates...

        </div>

      )}


      {/* Error */}

      {!loading && error && (

        <div className="rounded-xl bg-red-50 border border-red-100 p-6 text-red-600">

          {error}

        </div>

      )}


      {/* Candidate list */}

      {!loading && !error && (

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-red-50 text-sm font-semibold text-gray-600">

            <div className="col-span-4">
              Candidate
            </div>

            <div className="col-span-3">
              Location
            </div>

            <div className="col-span-2">
              Experience
            </div>

            <div className="col-span-3 text-right">
              Action
            </div>

          </div>


          {filteredCandidates.length === 0 ? (

            <div className="p-12 text-center text-gray-500">

              No candidates found.

            </div>

          ) : (

            filteredCandidates.map((candidate) => (

              <div
                key={candidate.id}
                className="grid grid-cols-12 gap-4 items-center px-6 py-5 border-t border-gray-100 hover:bg-red-50/50 transition"
              >

                {/* Candidate */}

                <div className="col-span-4">

                  <p className="font-semibold text-gray-900">

                    {candidate.full_name ||
                      "Unnamed Candidate"}

                  </p>

                  <p className="text-sm text-gray-500 mt-1">

                    {candidate.email ||
                      "No email available"}

                  </p>

                </div>


                {/* Location */}

                <div className="col-span-3 text-sm text-gray-600">

                  {candidate.location ||
                    "Not specified"}

                </div>


                {/* Experience */}

                <div className="col-span-2">

                  <span className="text-sm font-medium text-red-600">

                    {candidate.experience ?? "N/A"}

                    {candidate.experience != null
                      ? " years"
                      : ""}

                  </span>

                </div>


                {/* Action */}

                <div className="col-span-3 text-right">

                  <button
                    onClick={() =>
                      navigate(
                        `/candidates/${candidate.id}`
                      )
                    }
                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                  >

                    View Profile →

                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      )}

    </MainLayout>

  );

}