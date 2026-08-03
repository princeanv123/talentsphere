import {
  LayoutDashboard,
  Users,
  Briefcase,
  BrainCircuit,
  FileText,
  BarChart3,
  Activity,
  Settings,
} from "lucide-react";

import Logo from "./Logo";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Users, label: "Candidates" },
  { icon: Briefcase, label: "Jobs" },
  { icon: BrainCircuit, label: "AI Search" },
  { icon: FileText, label: "Resume Vault" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Activity, label: "Observability" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="relative w-72 bg-white border-r border-red-100 min-h-screen px-6 py-8">

      <Logo />

      <nav className="mt-12 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 text-xs text-gray-400">
        © Built by Prince Singh
      </div>

    </aside>
  );
}