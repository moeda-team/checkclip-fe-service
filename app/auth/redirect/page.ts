// app/auth/redirect/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function RedirectPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const role = session.user?.role;

  if (role === "admin") redirect("/dashboard");

  // Default fallback untuk role lain (student, teacher, dll)
  redirect("/dashboard");
}
