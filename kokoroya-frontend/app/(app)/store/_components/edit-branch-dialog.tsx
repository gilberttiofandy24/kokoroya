"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateBranchNameAction } from "@/lib/actions/branch";
import {
  editBranchSchema,
  type BranchData,
  type EditBranchPayload,
} from "@/schema/branch/branch.schema";

export function EditBranchDialog({ branch }: { branch: BranchData }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<EditBranchPayload>({
    resolver: zodResolver(editBranchSchema),
    defaultValues: { name: branch.name },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: EditBranchPayload) => {
      try {
        await updateBranchNameAction(branch.id, values.name);
        setOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to update branch",
        );
      }
    },
  });

  function handleOpenChange(next: boolean) {
    if (next) form.reset({ name: branch.name });
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="brutal" size="sm" />}>
        Edit
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Branch</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
