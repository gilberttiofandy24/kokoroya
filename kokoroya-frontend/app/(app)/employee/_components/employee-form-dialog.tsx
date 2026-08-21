"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUserAction, updateUserAction } from "@/lib/actions/user";
import {
  employeeFormSchema,
  type EmployeeFormPayload,
  type UserData,
} from "@/schema/user/user.schema";
import type { BranchData } from "@/schema/branch/branch.schema";

type Props = {
  pages: string[];
  branches: BranchData[];
  employee?: UserData;
  trigger: React.ReactNode;
};

export function EmployeeFormDialog({ pages, branches, employee, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isEdit = !!employee;

  function getDefaultValues(): EmployeeFormPayload {
    return {
      name: employee?.name ?? "",
      email: employee?.email ?? "",
      password: "",
      role: (employee?.role as "owner" | "employee") ?? "employee",
      phone: employee?.phone ?? "",
      tfn: employee?.tfn ?? "",
      pin: employee?.pin ?? "",
      rate_weekday: employee?.rate_weekday?.toString() ?? "",
      rate_weekend: employee?.rate_weekend?.toString() ?? "",
      permissions: employee?.permissions ?? [],
      branch_ids: employee?.branch_ids ?? [],
    };
  }

  const form = useForm<EmployeeFormPayload>({
    resolver: zodResolver(employeeFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: getDefaultValues(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: EmployeeFormPayload) => {
      try {
        if (isEdit) {
          await updateUserAction(employee.id, values);
        } else {
          await createUserAction(values);
        }
        setOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to save employee",
        );
      }
    },
  });

  function handleOpenChange(next: boolean) {
    if (next) form.reset(getDefaultValues());
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Employee" : "New Employee"}</DialogTitle>
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (optional — leave blank for PIN-only clock-in)</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEdit && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password (optional, requires an email)</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tfn"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>TFN</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clock-in PIN (4 digits)</FormLabel>
                  <FormControl>
                    <Input inputMode="numeric" maxLength={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="rate_weekday"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Weekday Rate ($/hr)</FormLabel>
                    <FormControl>
                      <NumericFormat
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.value)}
                        onBlur={field.onBlur}
                        thousandSeparator=","
                        decimalSeparator="."
                        decimalScale={2}
                        allowNegative={false}
                        customInput={Input}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rate_weekend"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Weekend Rate ($/hr)</FormLabel>
                    <FormControl>
                      <NumericFormat
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.value)}
                        onBlur={field.onBlur}
                        thousandSeparator=","
                        decimalSeparator="."
                        decimalScale={2}
                        allowNegative={false}
                        customInput={Input}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel className="mb-2">Page Access</FormLabel>
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-2">
                    {pages.map((page) => (
                      <label
                        key={page}
                        className="flex items-center gap-2 text-sm capitalize"
                      >
                        <Checkbox
                          checked={field.value.includes(page)}
                          onCheckedChange={(checked) => {
                            field.onChange(
                              checked
                                ? [...field.value, page]
                                : field.value.filter((p) => p !== page),
                            );
                          }}
                        />
                        {page.replace("-", " ")}
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

            <div>
              <FormLabel className="mb-2">Branch Access</FormLabel>
              <FormField
                control={form.control}
                name="branch_ids"
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-2">
                    {branches.map((branch) => (
                      <label
                        key={branch.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={field.value.includes(branch.id)}
                          onCheckedChange={(checked) => {
                            field.onChange(
                              checked
                                ? [...field.value, branch.id]
                                : field.value.filter((id) => id !== branch.id),
                            );
                          }}
                        />
                        {branch.name}
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

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
