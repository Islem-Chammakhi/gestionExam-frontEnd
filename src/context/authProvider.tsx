"use client"

import { useState,createContext, ReactNode } from "react";
interface AuthContextType {

    setAuth: React.Dispatch<React.SetStateAction<any>>
    auth: any
    // persistLoginDone: boolean
    // setPersistLoginDone: React.Dispatch<React.SetStateAction<boolean>>

  
  }
const AuthContext = createContext<AuthContextType>({
    auth: {},
    setAuth: () => {},
    // persistLoginDone: false,
    // setPersistLoginDone: () => {}
  });

interface AuthProviderProps {
    children: ReactNode;
}
interface AuthState {
    accessToken?: string;
    email?: string;
    password?: string;
    role?: string;
  }

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<AuthState>({})
    // const [persistLoginDone, setPersistLoginDone] = useState<boolean>(JSON.parse(localStorage.getItem("persistLoginDone") ?? "false"))


    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext










