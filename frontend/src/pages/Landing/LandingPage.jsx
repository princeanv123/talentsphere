import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF7F7] text-gray-900">

      {/* ================================
          HEADER
      ================================= */}

      <header className="flex items-center justify-between px-10 py-6 bg-white border-b border-red-100">

        <div>
          <h1 className="text-3xl font-bold text-red-600">
            TalentSphere
          </h1>

          <p className="text-sm text-gray-500">
            AI Talent Intelligence
          </p>
        </div>

        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2.5 rounded-lg text-gray-700 hover:text-red-600 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            Get Started
          </button>

        </div>

      </header>


      {/* ================================
          HERO
      ================================= */}

      <main>

        <section className="max-w-7xl mx-auto px-10 py-24">

          <div className="grid grid-cols-2 gap-16 items-center">

            {/* Hero Content */}

            <div>

              <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-medium">
                ✨ AI-Powered Talent Intelligence
              </div>

              <h2 className="mt-6 text-6xl font-bold leading-tight">
                Find the right
                <span className="text-red-600">
                  {" "}talent faster.
                </span>
              </h2>

              <p className="mt-6 text-xl text-gray-500 leading-relaxed max-w-xl">
                TalentSphere transforms your resume database into
                an intelligent talent discovery platform using
                AI-powered search, matching and candidate intelligence.
              </p>

              <div className="mt-8 flex gap-4">

                <button
                  onClick={() => navigate("/login")}
                  className="px-7 py-3.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                >
                  Get Started
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="px-7 py-3.5 rounded-xl border border-red-200 bg-white text-red-600 font-semibold hover:bg-red-50 transition"
                >
                  Explore TalentSphere
                </button>

              </div>

            </div>


            {/* Product Visual */}

            <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-8">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <p className="text-sm text-gray-400">
                    Talent Intelligence
                  </p>

                  <h3 className="text-2xl font-bold">
                    Candidate Matching
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                  AI
                </div>

              </div>

              <div className="space-y-4">

                <div className="p-4 rounded-xl bg-gray-50">

                  <div className="flex justify-between">

                    <div>
                      <p className="font-semibold">
                        Senior Product Manager
                      </p>

                      <p className="text-sm text-gray-500">
                        AI • Product • SaaS
                      </p>
                    </div>

                    <span className="text-red-600 font-bold">
                      94%
                    </span>

                  </div>

                </div>


                <div className="p-4 rounded-xl bg-gray-50">

                  <div className="flex justify-between">

                    <div>
                      <p className="font-semibold">
                        Technology Product Manager
                      </p>

                      <p className="text-sm text-gray-500">
                        Cloud • Agile • Product
                      </p>
                    </div>

                    <span className="text-red-600 font-bold">
                      89%
                    </span>

                  </div>

                </div>


                <div className="p-4 rounded-xl bg-gray-50">

                  <div className="flex justify-between">

                    <div>
                      <p className="font-semibold">
                        AI Product Owner
                      </p>

                      <p className="text-sm text-gray-500">
                        AI • Analytics • Strategy
                      </p>
                    </div>

                    <span className="text-red-600 font-bold">
                      86%
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================================
            VALUE PROPOSITION
        ================================= */}

        <section className="bg-white border-y border-red-100 py-20">

          <div className="max-w-6xl mx-auto px-10">

            <div className="text-center">

              <p className="text-red-600 font-semibold">
                WHY TALENTSPHERE
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                From resumes to talent intelligence
              </h2>

              <p className="mt-4 text-lg text-gray-500">
                Search, understand and match candidates using one intelligent platform.
              </p>

            </div>


            <div className="grid grid-cols-3 gap-8 mt-12">

              <div className="p-8 rounded-2xl bg-[#FFF7F7] border border-red-100">

                <h3 className="text-xl font-bold">
                  Smart Candidate Search
                </h3>

                <p className="mt-3 text-gray-500">
                  Quickly discover candidates using skills,
                  experience and other profile attributes.
                </p>

              </div>


              <div className="p-8 rounded-2xl bg-[#FFF7F7] border border-red-100">

                <h3 className="text-xl font-bold">
                  AI Matching
                </h3>

                <p className="mt-3 text-gray-500">
                  Evaluate candidate-job alignment using
                  intelligent matching and scoring.
                </p>

              </div>


              <div className="p-8 rounded-2xl bg-[#FFF7F7] border border-red-100">

                <h3 className="text-xl font-bold">
                  Resume Intelligence
                </h3>

                <p className="mt-3 text-gray-500">
                  Turn your resume repository into a searchable
                  and actionable talent intelligence system.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* ================================
          FOOTER
      ================================= */}

      <footer className="py-8 text-center text-sm text-gray-400 bg-white">

        © Built by Prince Singh

      </footer>

    </div>
  );
}