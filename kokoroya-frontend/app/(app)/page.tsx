import { getCurrentUser } from "@/lib/user";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
      <p className="text-muted-foreground mt-2">
        Pick a page from the sidebar to get started.
      </p>
    </div>
  );
}
