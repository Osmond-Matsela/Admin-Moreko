"use client";
import { redirect } from "next/navigation";

import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import Loader from "@/components/HomePage/Loader";
import { useSession } from "next-auth/react";
import React from "react";

export default function Admin({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { data: session, status } = useSession();
  const { username } = React.use(params);

  if (status === "loading") return <Loader />;
  else if (
    status === "authenticated" &&
    `${session?.user?.name?.toLowerCase().replace(/\s+/g, "-")}` !== username
  )
    redirect("/_error");

   else if(!session) {
    redirect("/login")
  }
  else return <AdminDashboard />;
}
