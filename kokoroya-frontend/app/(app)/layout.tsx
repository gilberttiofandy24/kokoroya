import { getCurrentUser } from "@/lib/user";
import { AppSidebar } from "./_components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <SidebarProvider>
      <AppSidebar role={user.role} permissions={user.permissions} />
      <main className="w-full">
        <SidebarTrigger className="m-3" />
        {children}
      </main>
    </SidebarProvider>
  );
}
