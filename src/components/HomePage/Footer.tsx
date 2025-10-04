import { MapPin } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
const schoolInfo = {
  address: "123 Education Street, Moreko Village, Limpopo Province",
  phone: "(015) 123-4567",
  email: "info@morekohigh.edu.za",
  established: "1987",
  motto: "Excellence Through Education",
  principal: "Mrs. T. Mogale",
};
const Footer = () => {
  return (
    <footer className="bg-red-800 text-gray-100 py-12">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src={"/images/LOGO.svg"}
                width={50}
                height={50}
                alt="LOGO"
              />
              <div>
                <h3 className="text-xl font-bold">Moreko High School</h3>
                <p className="text-red-200">{schoolInfo.motto}</p>
              </div>
            </div>
            <p className="text-red-200">
              Committed to providing quality education and nurturing the leaders
              of tomorrow since {schoolInfo.established}.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-red-200">
              <li>
                <Button
                  variant="link"
                  className="text-red-200 hover:text-gray-100 p-0 h-auto cursor-pointer"
                >
                  Digital Platform
                </Button>
              </li>
              <li>
                <a href="#achievements" className="hover:text-gray-100">
                  Our Achievements
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-gray-100">
                  About Us
                </a>
              </li>
              <li>
                <Button
                  variant="link"
                  className="text-red-200 hover:text-gray-100 p-0 h-auto cursor-pointer"
                >
                  Admin Portal
                </Button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
            <div className="text-red-200 space-y-2">
              <p className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                {schoolInfo.address}
              </p>
              <p>Phone: {schoolInfo.phone}</p>
              <p>Email: {schoolInfo.email}</p>
              <p>Principal: {schoolInfo.principal}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-red-700 mt-8 pt-8 text-center text-red-200">
          <p>&copy; 2024 Moreko High School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
