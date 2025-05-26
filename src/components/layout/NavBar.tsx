import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function NavBar() {
  return (
    <header className="w-full border-b px-6 py-4 flex items-center justify-between bg-white dark:bg-zinc-950">
      <h1 className="text-xl font-bold tracking-tight"></h1>
      <div className="flex items-end gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
