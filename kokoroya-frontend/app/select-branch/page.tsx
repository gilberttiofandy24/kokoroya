import Link from "next/link";
import { Building2 } from "lucide-react";
import { getMyBranches } from "@/api/branch";
import { getCurrentUser } from "@/lib/user";
import { selectBranchAction } from "@/lib/actions/branch";
import { Button } from "@/components/ui/button";
import { AutoSelectBranch } from "./_components/auto-select";

export default async function SelectBranchPage() {
  const [user, branches] = await Promise.all([
    getCurrentUser(),
    getMyBranches(),
  ]);
  const activeBranches = branches.filter((b) => b.is_active);

  if (activeBranches.length === 1) {
    return <AutoSelectBranch branchId={activeBranches[0].id} />;
  }

  return (
    <main className="bg-secondary-foreground flex min-h-full flex-1 items-center justify-center p-6">
      <div className="mx-auto w-full max-w-3xl p-10">
        <h1 className="mb-1 text-3xl font-bold">Select Branch</h1>
        <p className="text-muted-foreground mb-8">
          Pick which branch you want to work in.
        </p>
        {activeBranches.length === 0 ? (
          user.role === "owner" ? (
            <div className="flex flex-col gap-3">
              <p>No branches yet. Create one on the Branches page first.</p>
              <Button variant="brutal" render={<Link href="/store" />}>
                Go to Branches
              </Button>
            </div>
          ) : (
            <p>You don&apos;t have access to any branch yet. Contact the owner.</p>
          )
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {activeBranches.map((b) => (
              <form key={b.id} action={selectBranchAction.bind(null, b.id)}>
                <button
                  type="submit"
                  className="group flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-accent-deep bg-accent p-6 text-white shadow-[0_4px_0_0_var(--accent-deep)] transition-all duration-75 active:translate-y-1 active:shadow-none"
                >
                  <Building2 className="size-10 opacity-90" />
                  <span className="text-center text-lg font-semibold break-words">
                    {b.name}
                  </span>
                </button>
              </form>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
