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

import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: Users,
    label: "Candidates",
    path: "/candidates",
  },
  {
    icon: Briefcase,
    label: "Jobs",
    path: "/jobs",
  },
  {
    icon: BrainCircuit,
    label: "AI Search",
    path: "/ai-search",
  },
  {
    icon: FileText,
    label: "Resume Vault",
    path: "/resume-vault",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    path: "/analytics",
  },
  {
    icon: Activity,
    label: "Observability",
    path: "/observability",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="relative w-72 shrink-0 min-h-screen bg-white border-r border-red-100 px-6 py-8">

      <Logo />

      <nav className="mt-12 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.label}
              </span>
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