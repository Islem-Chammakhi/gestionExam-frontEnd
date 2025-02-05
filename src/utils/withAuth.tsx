"use client"

import React, { useEffect } from "react";
import useAuth from "@/hooks/useAuth"
import {useRouter } from 'next/navigation'

{/* protéger des pages avec un HOC (Higher Order Component) à partir min compsant nasna3 composant protéger en vérifiant authContext mte3na mba3ed taw nzidou les roles */}

const withAuth = <P extends object>(Component: React.ComponentType<P>, requiredRole: string) => {
    return function ProtectedComponent(props: P) {
      const { auth } = useAuth()
      const router = useRouter()
  
      useEffect(() => {
        if (!auth?.email) {
            router.push(`/sign-in`)
        } 
        else if (auth.role !== requiredRole) {
          router.push("/unauthorized"); // Accès interdit
        }
      }, [auth, router])
      
      //à comprendre aprés !!!!!!!!
      if (!auth?.email) return <p>Chargement...</p>
  
      return <Component {...props} />;
    };
  };
  
  export default withAuth;


  
  {/*if (!auth || auth.role !== requiredRole) return <p>Chargement...</p> */}