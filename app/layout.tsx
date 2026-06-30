// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { NotificationProvider } from "@/hooks/useNotification";
import { AppQueryProvider } from "@/lib/query-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Check Clip",
  description: "Real-time business overview"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <SessionProvider>
          <NotificationProvider>
            <AppQueryProvider>{children}</AppQueryProvider>
          </NotificationProvider>
        </SessionProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
