import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { getBranches } from "@/api/branch";
import { CreateBranchForm } from "./_components/create-branch-form";
import { BranchRow } from "./_components/branch-row";

export default async function StorePage() {
  const user = await getCurrentUser();
  if (user.role !== "owner") redirect("/");

  const branches = await getBranches();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">Branches</h1>
        <p className="text-muted-foreground mt-1">
          Manage your branches and see who has access to each one.
        </p>
      </div>
      <CreateBranchForm />
      <div className="flex flex-col gap-3">
        {branches.length === 0 && (
          <p className="text-muted-foreground">No branches yet.</p>
        )}
        {branches.map((b) => (
          <BranchRow key={b.id} branch={b} />
        ))}
      </div>
    </div>
  );
}
