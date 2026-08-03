import { Bell, SlidersHorizontal } from "lucide-react";

export default function TopNavbar() {
  return (
    <header className="h-24 bg-white border-b border-red-100 flex items-center justify-end px-8">

      <div className="flex items-center gap-5">

        <button className="w-12 h-12 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition">
          <SlidersHorizontal
            size={22}
            className="text-gray-700"
          />
        </button>

        <Bell
          size={24}
          className="text-gray-700 cursor-pointer hover:text-red-600 transition"
        />

      </div>

    </header>
  );
}