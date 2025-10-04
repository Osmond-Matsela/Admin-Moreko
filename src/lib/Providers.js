"use client"

import DatabaseProvider from "@/context/Database";
import { SessionProvider } from "next-auth/react"

const Providers = ({children}) => {
    return <>
        <SessionProvider>
            <DatabaseProvider>
            {children}
            </DatabaseProvider>
        </SessionProvider>
    </>
}

export default Providers;