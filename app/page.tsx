import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export default async function RootPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

//   const role = session.user?.role;

//   if (role === "admin") redirect("/dashboard");

  redirect("/dashboard");
}
