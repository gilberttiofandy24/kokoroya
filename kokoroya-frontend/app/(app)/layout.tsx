import { getCurrentUser } from "@/lib/user";
import { getMyBranches } from "@/api/branch";
import { getSelectedBranch } from "@/lib/auth";
import { AppSidebar } from "./_components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, branches, selectedBranchId] = await Promise.all([
    getCurrentUser(),
    getMyBranches(),
    getSelectedBranch(),
  ]);
  const branchName = branches.find((b) => String(b.id) === selectedBranchId)?.name;

  return (
    <SidebarProvider>
      <AppSidebar role={user.role} permissions={user.permissions} branchName={branchName} />
      <main className="w-full">
        <SidebarTrigger className="m-3" />
        {children}
      </main>
    </SidebarProvider>
  );
}
