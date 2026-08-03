export default function Logo() {
  return (
    <div className="flex items-center gap-3">

      <div className="w-12 h-12 rounded-full border-2 border-red-600 flex items-center justify-center">

        <div className="w-6 h-6 rounded-full bg-red-600"></div>

      </div>

      <div>

        <h1 className="text-2xl font-bold text-red-600">
          TalentSphere
        </h1>

        <p className="text-xs text-gray-500">
          AI Talent Intelligence
        </p>

      </div>

    </div>
  );
}