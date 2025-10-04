import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ImageIcon } from 'lucide-react';

const galleryHighlights = [
    { title: "Sports Day 2024", image: "/placeholder.svg" },
    { title: "Science Fair Winners", image: "/placeholder.svg" },
    { title: "Cultural Day Celebration", image: "/placeholder.svg" },
    { title: "Matric Results Celebration", image: "/placeholder.svg" }
  ];
  

const Gallery = () => {
    return (
        <>
            <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Gallery Highlights</h2>
                        <Button className="bg-gray-100 text-red-800 hover:bg-gray-100 cursor-pointer">View Full Gallery</Button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryHighlights.map((item, index) => (
                          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <CardContent className="p-4">
                              <p className="text-sm font-medium text-center">{item.title}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
        </>
    );
}

export default Gallery;
