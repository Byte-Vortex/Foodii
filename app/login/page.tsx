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

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const resetSchema = z.object({
  email: z.string().email(),
});

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [reset, setReset] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  // Login Form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Reset Password Form
  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      router.push("/profile");
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

  const handleForgotPassword = async (values: z.infer<typeof resetSchema>) => {
    setResetLoading(true);
  
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset`,
      });
  
      if (error) {
        console.error("Error sending reset email:", error.message);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check Your Email",
          description:
            "If your email is registered, you'll receive a password reset link shortly.",
          variant: "default",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };
  

  return (
    <div className="h-[80vh] flex items-center justify-center bg-gradient-to-b from-primary/20 to-white p-4">
      <Card className="w-full max-w-md p-8">
        {!reset && (
          <>
            {/* Login Form */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-gray-600">Login to your account</p>
            </div>
            <div className="grid gap-3">
              <form onSubmit={loginForm.handleSubmit(handleLogin)} noValidate>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      placeholder="johndiggle@example.com"
                      type="email"
                      disabled={loading}
                      {...loginForm.register("email")}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-xs text-red-500">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={`* * * * * * * * * * * * *`}
                      disabled={loading}
                      {...loginForm.register("password")}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-xs text-red-500">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <Button disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </div>
              </form>
              <Button
                variant="link"
                className="w-full text-sm text-primary hover:no-underline -mb-3"
                onClick={() => setReset(true)}
              >
                Forgot Password?
              </Button>
              <div className="relative ">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="w-full text-foreground/70"
                  disabled={loading}
                >
                  Create an account
                </Button>
              </Link>
            </div>
          </>
        )}

        {reset && (
          <>
            {/* Reset Password Form */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Forgot your Password?</h1>
            </div>
            <div className="grid gap-3">
              <form
                onSubmit={resetForm.handleSubmit(handleForgotPassword)}
                noValidate
              >
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      placeholder="johndiggle@example.com"
                      type="email"
                      disabled={resetLoading}
                      {...resetForm.register("email")}
                    />
                    {resetForm.formState.errors.email && (
                      <p className="text-xs text-red-500">
                        {resetForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <Button disabled={resetLoading}>
                    {resetLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </form>
              <Button
                variant="link"
                className="w-full text-sm text-primary hover:no-underline -mb-3"
                onClick={() => {
                  setReset(false);
                  resetForm.reset(); // Clear the reset form state
                }}
              >
                Back to Login
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
