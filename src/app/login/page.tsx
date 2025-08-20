export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import getServerSession from "next-auth";
import { GalleryVerticalEnd } from "lucide-react";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-signup/LoginForm";

export default async function LoginPage() {
  try {
    const session = await auth();

    if (session?.user) {
      redirect("/dashboard");
    }
  } catch (error) {
    console.error("Failed to load session:", error);
    // optional: render a fallback or allow login
  }

  return (
    <div className="bg-muted w-full flex h-full flex-col items-center pb-30 pt-30">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Internship tracker.
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
