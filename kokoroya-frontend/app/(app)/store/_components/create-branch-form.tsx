"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createBranchAction } from "@/lib/actions/branch";
import {
  createBranchSchema,
  type CreateBranchPayload,
} from "@/schema/branch/branch.schema";

export function CreateBranchForm() {
  const router = useRouter();

  const form = useForm<CreateBranchPayload>({
    resolver: zodResolver(createBranchSchema),
    defaultValues: { name: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: CreateBranchPayload) => {
      try {
        await createBranchAction(values);
        form.reset();
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to create branch",
        );
      }
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="max-w-sm"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="e.g. Jakarta Branch" {...field} />
                </FormControl>
                <Button type="submit" disabled={isPending} variant="brutal">
                  {isPending ? "Saving..." : "Add"}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
