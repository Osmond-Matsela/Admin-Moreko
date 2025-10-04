import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calendar, ImageIcon } from 'lucide-react';
 const newsArticles = [
    {
      id: 1,
      title: "School receives library grant",
      excerpt: "Moreko High School has been awarded a R50,000 grant to upgrade the school library with new books and digital resources.",
      date: "January 15, 2024",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Grade 12 farewell celebration",
      excerpt: "Our Grade 12 learners celebrated their final year with a memorable farewell ceremony attended by staff, parents, and community members.",
      date: "January 10, 2024",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Principal wins teacher's award",
      excerpt: "Mrs. Mogale has been recognized as Outstanding Educator of the Year at the provincial education awards ceremony.",
      date: "January 5, 2024",
      image: "/placeholder.svg"
    }
  ];

const LatestNews = () => {
    return (
        <>
            <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
            <Button className="bg-gray-100 text-red-800 hover:bg-gray-100 cursor-pointer">View All News</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {article.date}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{article.excerpt}</p>
                  <Button variant="link" className="p-0 mt-2 text-red-800 cursor-pointer">
                    Read More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
    );
}

export default LatestNews;
