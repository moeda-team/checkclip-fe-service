import { Sidebar } from "@/components/layout/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFF]">
      <Sidebar />
      {/* Main content — offset by sidebar width */}
      <main className="flex-1 ml-[220px] min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
