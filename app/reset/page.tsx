"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";

const formSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Reset() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPassword = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.confirmPassword,
      });

      if (error) throw error;
      toast({
        title: "Success",
        description: "Password Reset successfull",
      });

      router.push("/dashboard"); 
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="h-[80vh] flex items-center justify-center bg-gradient-to-b from-primary/20 to-white p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Reset you password</h1>
        </div>
        <div className="grid gap-3">
          <form onSubmit={form.handleSubmit(resetPassword)} noValidate>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={`* * * * * * * * * * * * *`}
                  disabled={loading}
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmpassword">Confirm New Password</Label>
                <Input
                  id="confirmpassword"
                  type="password"
                  placeholder={`* * * * * * * * * * * * *`}
                  disabled={loading}
                  {...form.register("confirmPassword")}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button disabled={loading}>
                {loading && (
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                Reset Password
              </Button>
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Link href="/login">
            <Button
              variant="outline"
              className="w-full text-foreground/70"
              disabled={loading}
            >
              Login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
