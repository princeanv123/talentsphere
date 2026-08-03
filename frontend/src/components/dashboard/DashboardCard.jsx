import { ArrowUpRight } from "lucide-react";

export default function DashboardCard({
  icon,
  title,
  value,
  subtitle,
}) {
  const Icon = icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 hover:shadow-lg transition">

      <div className="flex items-center justify-between">

        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">

          <Icon
            className="text-red-600"
            size={24}
          />

        </div>

        <ArrowUpRight
          className="text-gray-400"
          size={20}
        />

      </div>

      <h3 className="mt-6 text-gray-500 font-medium">
        {title}
      </h3>

      <h2 className="text-4xl font-bold mt-2">
        {value}
      </h2>

      <p className="text-gray-400 mt-3">
        {subtitle}
      </p>

    </div>
  );
}