import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex bg-[#FFF7F7] min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <TopNavbar />

        <main className="p-12">
          {children}
        </main>

      </div>

    </div>
  );
}