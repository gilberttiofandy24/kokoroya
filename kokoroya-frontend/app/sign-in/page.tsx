"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  LoginPayload as LoginFormValues,
  loginPayloadSchema,
} from "@/schema/auth/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginPayloadSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: postLoginMutation, isPending } = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      try {
        await loginAction(values);
        router.push("/");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Something went wrong",
        );
      }
    },
  });

  return (
    <main className="bg-secondary-foreground flex min-h-full flex-1 items-center justify-center p-6">
      <div className="mx-auto min-h-[80vh] min-w-[60vw] p-10">
        <div className="mb-5 flex flex-col">
          <h1 className="text-5xl font-extrabold">Kokoroya</h1>
          <h1 className="text-2xl font-bold">Welcome Back!</h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => postLoginMutation(values))}
            className="flex w-full flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Email</FormLabel>
                  <FormControl>
                    <Input variant="brutal" placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      variant="brutal"
                      placeholder="Enter Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="brutal"
              disabled={isPending}
              className="mt-5 h-14 gap-2 text-base"
            >
              {isPending ? "Loading..." : "Sign In"}
              <ArrowRight className="size-5" />
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
