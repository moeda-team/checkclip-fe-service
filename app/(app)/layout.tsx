// app/(app)/layout.tsx
// Layout for app pages - includes sidebar and header with breadcrumbs

import { AppLayout } from "@/components/layout/AppLayout";

export default function AppGroupLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
