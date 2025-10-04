import { Trophy } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
const achievements = [
    {
      year: "2024",
      title: "Provincial Mathematics Olympiad - 1st Place",
      description: "Our Grade 11 team secured first place in the Limpopo Mathematics Olympiad"
    },
    {
      year: "2023", 
      title: "Best Performing Rural School Award",
      description: "Recognized by the Department of Education for outstanding academic performance"
    },
    {
      year: "2023",
      title: "Inter-School Debate Championship",
      description: "Won the regional debate championship for the third consecutive year"
    }
  ];
const Achievement = () => {
    return (
        <>
            <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
              <Trophy className="w-8 h-8 mr-3 text-red-800" />
              Our Achievements
            </h2>
            <p className="text-gray-600 mt-2">Celebrating excellence in academics and extracurricular activities</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <span className="text-2xl font-bold text-red-800">{achievement.year}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
    );
}

export default Achievement;
