"use client";
import { Calendar, Lock, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import CalendarComponent from './Calendar';
import { useSession } from 'next-auth/react';

const PlatformAccess = () => {
     const [showCalendar, setShowCalendar] = useState(false);
    const {data: session,status} = useSession();
    return (
        <>
        {
      showCalendar ? <CalendarComponent close={setShowCalendar}/> : null
    }
             <div className="text-center">
            <Lock className="w-12 h-12 mx-auto text-red-800 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Digital Platform Access</h2>
            <p className="text-gray-700 text-lg mb-6">
              Our digital magazine, news articles, downloadable resources, and communication features are available to registered students and parents only.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className=" text-red-800 hover:bg-gray-100 cursor-pointer" >
             {
              status === 'unauthenticated' ?  <Button 
                size="lg" 
                className="bg-red-800 hover:bg-red-900 text-gray-100 cursor-pointer"
               
              >
                <Users className="w-5 h-5 mr-2" />
                Register / Sign In
              </Button> : <></>
             }
              </Link>

               <Button className="bg-gray-50 text-red-800 hover:bg-gray-100 cursor-pointer"size="lg" onClick={() => setShowCalendar(true)}>
                <Calendar className="w-5 h-5 mr-2" />
                View School Calendar
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Access news, digital library, newsletters, and stay connected with school updates
            </p>
          </div>
        </>
    );
}

export default PlatformAccess;
