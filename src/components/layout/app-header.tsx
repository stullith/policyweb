import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "./user-nav";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6",
        className
      )}
    >
      <div className="flex items-center md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1">
        {/* Optional: Add breadcrumbs or page title here */}
      </div>
      <UserNav />
    </header>
  );
}
