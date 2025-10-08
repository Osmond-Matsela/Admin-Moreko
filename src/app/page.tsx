
"use client";
import Login from "@/components/HomePage/Login";
import { redirect } from "next/navigation";

import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    redirect("/login");
  },[]);
  
  return (
    <div className="">   
        <Login />
    </div>
  );
}
