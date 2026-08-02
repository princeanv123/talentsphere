import { ArrowRight } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-[#FFF7F7] flex items-center justify-center relative overflow-hidden">

      {/* Background Decorations */}

      <div className="absolute w-72 h-72 rounded-full bg-red-100 -top-24 -left-24 opacity-70"></div>

      <div className="absolute w-80 h-80 rounded-full bg-red-50 -bottom-32 -right-32 opacity-80"></div>

      <div className="absolute top-20 left-24 grid grid-cols-4 gap-3 opacity-40">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-red-300"
          />
        ))}
      </div>

      <div className="absolute bottom-20 right-24 grid grid-cols-4 gap-3 opacity-40">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-red-300"
          />
        ))}
      </div>

      {/* Main Card */}

      <div className="w-[1100px] h-[620px] bg-white rounded-[35px] shadow-2xl flex overflow-hidden relative">

        {/* LEFT */}

        <div className="w-1/2 flex flex-col justify-center px-20">

          {/* Logo */}

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center">

              <div className="w-8 h-8 rounded-full bg-red-500"></div>

            </div>

            <h1 className="text-6xl font-bold text-red-600">
              TalentSphere
            </h1>

          </div>

          <div className="w-20 h-1 bg-red-500 rounded mt-8"></div>

          <h2 className="text-4xl text-gray-700 font-semibold mt-10">
            AI Powered Talent Intelligence Platform
          </h2>

          <p className="mt-8 text-2xl leading-10 text-gray-500">

            Streamline your hiring process with AI-driven insights and effortless talent discovery.

          </p>

          <button
            className="mt-14 bg-red-600 hover:bg-red-700 transition-all text-white rounded-2xl px-10 py-5 w-fit flex items-center gap-3 text-xl shadow-lg">

            Get Started

            <ArrowRight size={26} />

          </button>

        </div>

        {/* RIGHT */}

        <div className="w-1/2 flex items-center justify-center relative">

          <div className="relative">

            <div className="w-72 h-72 rounded-full border border-red-200"></div>

            <div className="absolute inset-8 rounded-full border border-red-200"></div>

            <div className="absolute inset-16 rounded-full border border-red-200"></div>

            <div className="absolute inset-24 rounded-full border border-red-200"></div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-red-500 shadow-xl"></div>

            <div className="absolute -left-5 top-1/2 w-7 h-7 rounded-full bg-red-400"></div>

            <div className="absolute -right-5 top-1/3 w-5 h-5 rounded-full bg-red-300"></div>

          </div>

          <div className="absolute bottom-10 right-10 text-gray-500 text-lg">
            (Built by Prince Singh)
          </div>

        </div>

      </div>

    </div>
  );
}