"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading,session } = useAuth(); // Ensure `isLoading` exists for async user fetching
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const nonprotectedRoutes = ["/", "/doctors", "/about", "/contact", "/privacy-policy","/terms&policy","/login","/register","/reset"];
  
  // useEffect(() => {
  //   const nonprotectedRoutes = ["/", "/doctors", "/about", "/contact", "/privacy-policy","/terms&policy","/login","/register","/reset"];
  //   const signupRoutes = ["/signup", "/login"];

  //   if (isLoading) return; // Avoid running logic while still isLoading user data

  //   if (!user && !nonprotectedRoutes.includes(pathname)) {
  //     router.replace("/login");
  //   }

  //   if (user && signupRoutes.includes(pathname)) {
  //     router.replace("/dashboard");
  //   }
  // }, [user, pathname, isLoading, router, toast]);

  // if (isLoading || (!user && !nonprotectedRoutes.includes(pathname))) return null;


  return <>{children}</>;
}
