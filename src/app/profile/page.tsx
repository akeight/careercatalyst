import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { ProfilePageClient } from "@/components/profile/ProfilePageClient";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="w-full px-1 py-2">
      <ProfilePageClient />
    </div>
  );
}
