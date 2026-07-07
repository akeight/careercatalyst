import { AppProviders } from "@/components/AppProviders";
import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProviders>
      <div className="flex min-h-dvh w-full flex-col overflow-x-clip">
        <main className="w-full flex-1 min-w-0">
          {children}
          <Toaster
            position="top-center"
            richColors
            closeButton
            expand
            theme="system"
            duration={3500}
          />
        </main>
      </div>
    </AppProviders>
  );
}
