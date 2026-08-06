export default function Logo() {
  return (
    <div className="flex items-center gap-2">

      <div className="w-14 h-14 rounded-full border-4 border-red-600 flex items-center justify-center">

        <div className="w-7 h-7 rounded-full bg-red-600"></div>

      </div>

      <div>

        <h1 className="text-5xl font-bold text-red-600">
          TalentSphere
        </h1>

        <p className="text-gray-500">
          AI Talent Intelligence
        </p>

      </div>

    </div>
  );
}