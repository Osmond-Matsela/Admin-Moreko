"use client";
import React, { useEffect, useState } from "react";

import { GraduationCap, User, Users } from "lucide-react";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import NavBar from "./NavBar";
import styles from "@/components/styles/HomepageStyles.module.css"
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Modal } from "../Dashboard/Modal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading , setLoading] = useState(false);


  

 const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setLoading(true);
  try {
    const res = await signIn("credentials", { 
      redirect: false, 
      email, 
      password 
    });
  
    
    if (res?.error) {
      setError("Incorrect email or password");
      setLoading(false);
    }
  } catch (err) {
    console.error('Sign in error:', err);
    setError("Incorrect credentials");
    setLoading(false);
  }
};
  return (
    <>
    {
      error.length > 0 && (
        <Modal isOpen={true} onClose={() => setError("")} type="error" message={error} title="Invalid Credentials"/>
      )
    }
    <NavBar/>
    <div className="min-h-screen bg-red-800 flex justify-center p-4 ">
      <div className={`p-8 bg-white flex items-center justify-center h-fit mt-20 rounded-md ${styles.login}`}>
        <Card className={`rounded-none max-w-sm flex flex-col space-x-7 ${styles.card}`}>
        <h1 className="font-bold text-gray-800 mb-4 text-center">
          Welcome to Moreko High School
        </h1>
        <p className="text-gray-600 mt-2 text-center">Hard Work Conquers All</p>
      </Card>
      <Card className={`p-8 ${styles.form}`}>
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-red-800 rounded-full flex items-center justify-center mb-4">
           <Image src={"/images/logo.png"} width={40} height={40} alt='LOGO'/>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">
            Login
          </h1>
          
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
             <input
              type="password"
              id="password"
              name="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-800 hover:bg-red-900 text-white"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <div className="text-sm text-gray-600">
            Don't have an account? <Link href="/register" className="text-red-800 cursor-pointer " >Sign Up</Link>
          </div>

          <Link
            href="/"
            className="text-sm text-gray-600 cursor-pointer"
          >
            ← Go to Home page
          </Link>
        </div>
      </Card>
      </div>
      
    </div>
    </>
    
  );
};

export default Login;
