"use client";
import SignUp from "@/components/HomePage/SignUp";
import { Loader } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";



const Page = () => {
  const { data: session, status } = useSession();



  useEffect(() => {

    if (status === 'authenticated' && session && session?.user) {
      if (session?.user.name) {
        redirect(`/admin/${session?.user.name.toLowerCase().replace(/\s+/g, '-')}`);
      } else {
        signOut();
      }
    }
  }, [status, session]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (!session || !session?.user || !session?.user.name) {
    return <SignUp />;
  }

  return <Loader/>;
};

export default Page;