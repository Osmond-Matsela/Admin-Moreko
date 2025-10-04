import { BookOpen } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
const schoolInfo = {
    address: "123 Education Street, Moreko Village, Limpopo Province",
    phone: "(015) 123-4567",
    email: "info@morekohigh.edu.za",
    established: "1987",
    motto: "Excellence Through Education",
    principal: "Mrs. T. Mogale"
  };
const Hero = () => {
    return (
        <>
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Moreko High School
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-red-100">
            {schoolInfo.motto}
          </p>
          <div className="flex flex-col sm:flex-row gap-7 justify-center">
            
             <Link href="/#about" className=" text-red-800 hover:bg-gray-200 cursor-pointer rounded-md">
            <Button size="lg" variant="outline" className="border-gray-100 hover:bg-gray-100 text-red-800 cursor-pointer">
              <BookOpen className="w-5 h-5 mr-2" />
              Learn More About Us
            </Button>
            </Link>
          </div>
        </div>
        </>
    );
}

export default Hero;
