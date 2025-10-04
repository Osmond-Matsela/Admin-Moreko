import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { GraduationCap, MapPin } from 'lucide-react';
 const schoolInfo = {
    address: "123 Education Street, Moreko Village, Limpopo Province",
    phone: "(015) 123-4567",
    email: "info@morekohigh.edu.za",
    established: "1987",
    motto: "Excellence Through Education",
    principal: "Mrs. T. Mogale"
  };
const About = () => {
    return (
        <>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">About Moreko High School</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-6 h-6 mr-3 text-red-800" />
                  School Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Address</h3>
                  <p className="text-gray-600">{schoolInfo.address}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Contact</h3>
                  <p className="text-gray-600">Phone: {schoolInfo.phone}</p>
                  <p className="text-gray-600">Email: {schoolInfo.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Principal</h3>
                  <p className="text-gray-600">{schoolInfo.principal}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Established</h3>
                  <p className="text-gray-600">{schoolInfo.established}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-6 h-6 mr-3 text-red-800" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Moreko High School is dedicated to providing quality education that nurtures academic excellence, 
                  character development, and community leadership. We strive to prepare our learners for success 
                  in higher education and meaningful careers.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Since {schoolInfo.established}, we have been a cornerstone of education in our community, 
                  fostering a culture of learning, respect, and achievement.
                </p>
              </CardContent>
            </Card>
          </div>
        </>
    );
}

export default About;
