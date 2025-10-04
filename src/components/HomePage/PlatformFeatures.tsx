"use client";
import { BookOpen, Calendar, Download, Lock, LogIn, Users } from 'lucide-react';
import React from 'react';
import { Card } from '../ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';
import { signIn, useSession } from 'next-auth/react';

const PlatformFeatures = () => {

  const {data : session, status} = useSession();
    return (
        <>
            <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">What's Available on Our Digital Platform</h2>
            <p className="text-gray-600 mt-2">Sign in to access these exclusive features</p>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Card className="text-center p-6 opacity-75 cursor-pointer" title='View Digital Library'>
              <div className="p-3 bg-red-100 rounded-lg mx-auto w-fit mb-4">
                <BookOpen className="w-8 h-8 text-red-800" />
              </div>
              <h3 className="font-semibold mb-2">Digital Library</h3>
              <p className="text-sm text-gray-600">Download study materials, exam papers, and educational resources</p>
              <Lock className="w-4 h-4 text-gray-400 mx-auto mt-2" />
            </Card>
            <Card className="text-center p-6 opacity-75 cursor-pointer">
              <div className="p-3 bg-red-100 rounded-lg mx-auto w-fit mb-4">
                <Download className="w-8 h-8 text-red-800" />
              </div>
              <h3 className="font-semibold mb-2">Newsletters</h3>
              <p className="text-sm text-gray-600">Access monthly newsletters and submit content for publication</p>
              <Lock className="w-4 h-4 text-gray-400 mx-auto mt-2" />
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href={`${process.env.NEXT_PUBLIC_GUEST_URL}`} className="hover:disabled">
            
              <Button size="lg"  className="bg-red-800 hover:bg-red-900 text-gray-100 cursor-pointer">
              <LogIn className="w-5 h-5 mr-2" />
              Sign In And View As Guest
            </Button>
            
            </Link>
          </div>
        </>
    );
}

export default PlatformFeatures;
