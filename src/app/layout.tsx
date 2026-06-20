import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "CheckClip - HR Intelligence",
  description: "Indonesian HR Compliance Platform",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cloud text-midnight antialiased">
        <Providers>
          <main className="w-full">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
