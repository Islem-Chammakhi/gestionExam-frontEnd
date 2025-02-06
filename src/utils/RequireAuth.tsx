"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

interface AuthWrapperProps {
  children: React.ReactNode;
  requiredRole: string;
}

const RequireAuth: React.FC<AuthWrapperProps> = ({ children, requiredRole }) => {
  const { auth } = useAuth();
  const router = useRouter();

//   useEffect(() => {
    

//     if (!auth?.email) {
//       router.push("/sign-in");
//     } else if (auth.role !== requiredRole) {
//       router.push("/unauthorized");
//     }
//   }, [auth, isLoading, router]);

//   if (isLoading) return <p>Chargement...</p>;

  if (!auth?.accessToken) {
    router.push("/sign-in");
    return null;
  } else if (auth.role !== requiredRole) {
    router.push("/unauthorized");
    return null;
  }
return <>{children}</>;
};

export default RequireAuth;
