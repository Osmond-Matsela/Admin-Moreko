"use client";
import { useEffect, useState } from 'react';

import { 
  FileText, 
  Image, 
  Users, 
  PlusCircle, 
  LogOut, 
  BookOpen,
  BarChart3,
  MessageSquare,
  CheckSquare,
  Group
} from 'lucide-react';
import NewsManagement from './NewsManagement';
import LibraryManagement from './LibraryManagement';
import GalleryManagement from './GalleryManagement';
import CommunicationCenter from './CommunicationCenter';
import ContentApproval from './ContentApproval';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '@/components/ui/button';
import styles from "@/components/styles/DashboardStyles.module.css"
import DashNavBar from './DashboardNav';
import UserManagement from './UserManagement';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { data: session, status } = useSession();
  const stats = [
    { title: 'Published Articles', value: '12', icon: FileText, color: 'text-blue-600' },
    { title: 'Active Subscribers', value: '245', icon: Users, color: 'text-green-600' },
    { title: 'Pending Approvals', value: '3', icon: CheckSquare, color: 'text-orange-600' },
    { title: 'Messages Sent', value: '89', icon: MessageSquare, color: 'text-purple-600' }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'news':
        return <NewsManagement />;
      case 'library':
        return <LibraryManagement  />;
      case 'gallery':
        return <GalleryManagement />;
      case 'communication':
        return <CommunicationCenter />;
      case 'approval':
        return <ContentApproval />;
      case 'parents':
        return <UserManagement />;
      default:
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg shadow-sm shadow-gray-100 transition-shadow border-1 border-none bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => setActiveView('news')} 
                    className='border-none cursor-pointer shadow-md hover:shadow-sm h-20 bg-white text-gray-900  hover:text-red-900 hover:bg-white'
                  >
                    <div className="text-center">
                      <PlusCircle className="w-6 h-6 mx-auto mb-2" />
                      <span>Add News Article</span>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveView('communication')} 
                    variant="outline" 
                   className='border-none cursor-pointer shadow-md hover:shadow-sm h-20 bg-white text-gray-900  hover:text-red-900 hover:bg-white'
                  >
                    <div className="text-center">
                      <MessageSquare className="w-6 h-6 mx-auto mb-2" />
                      <span>Send Message</span>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveView('approval')} 
                    variant="outline" 
                    className='border-none cursor-pointer shadow-md hover:shadow-sm h-20 bg-white text-gray-900  hover:text-red-900 hover:bg-white'
                  >
                    <div className="text-center">
                      <CheckSquare className="w-6 h-6 mx-auto mb-2" />
                      <span>Review Content</span>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveView('library')} 
                    variant="outline" 
                    className='border-none cursor-pointer shadow-md hover:shadow-sm h-20 bg-white text-gray-900  hover:text-red-900 hover:bg-white'
                  >
                    <div className="text-center">
                      <BookOpen className="w-6 h-6 mx-auto mb-2" />
                      <span>Upload Resource</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Approved article: "Inter-house Sports Results"</span>
                    <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Sent newsletter to 245 subscribers</span>
                    <span className="text-xs text-gray-500 ml-auto">3 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">New student submission pending review</span>
                    <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Uploaded "Term 2 Exam Guidelines.pdf"</span>
                    <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className={`${styles.styles} `}>
      {/* Header */}
      <DashNavBar />  

      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 ">
        {/* Navigation */}
        <nav className="flex gap-2 mb-8 py-5 overflow-x-auto ">
          <Button
            variant={activeView === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setActiveView('dashboard')}
            className={activeView === 'dashboard' ? 'bg-red-800 hover:bg-red-900 text-white' : 'border-none cursor-pointer shadow-md hover:shadow-sm bg-white text-gray-900  hover:text-red-900 hover:bg-white'}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeView === 'parents' ? 'default' : 'outline'}
            onClick={() => setActiveView('parents')}
            className={activeView === 'parents' ? 'bg-red-800 hover:bg-red-900 text-white' : 'border-none cursor-pointer shadow-md hover:shadow-sm bg-white text-gray-900  hover:text-red-900 hover:bg-white'}
          >
            <Users className="w-4 h-4 mr-2" />
            Manage Parents
          </Button>
          <Button
            variant={activeView === 'news' ? 'default' : 'outline'}
            onClick={() => setActiveView('news')}
            className={activeView === 'news' ? 'bg-red-800 hover:bg-red-900 text-white' : 'border-none cursor-pointer shadow-md hover:shadow-sm bg-white text-gray-900  hover:text-red-900 hover:bg-white'}
          >
            <FileText className="w-4 h-4 mr-2" />
            News
          </Button>
          <Button
            variant={activeView === 'communication' ? 'default' : 'outline'}
            onClick={() => setActiveView('communication')}
            className={activeView === 'communication' ? 'bg-red-800 hover:bg-red-900 text-white' : 'border-none cursor-pointer shadow-md hover:shadow-sm bg-white text-gray-900  hover:text-red-900 hover:bg-white'}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Communications
          </Button>
          <Button
            variant={activeView === 'approval' ? 'default' : 'outline'}
            onClick={() => setActiveView('approval')}
            className={activeView === 'approval' ? 'bg-red-800 hover:bg-red-900 text-white' : 'border-none cursor-pointer shadow-md hover:shadow-sm bg-white text-gray-900  hover:text-red-900 hover:bg-white'}
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Content Approval
          </Button>
          <Button
            variant={activeView === 'library' ? 'default' : 'outline'}
            onClick={() => setActiveView('library')}
            className={activeView === 'library' ? 'bg-red-800 hover:bg-red-900 text-white' : 'border-none cursor-pointer shadow-md hover:shadow-sm bg-white text-gray-900  hover:text-red-900 hover:bg-white'}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Library
          </Button>
          <Button
            variant={activeView === 'gallery' ? 'default' : 'outline'}
            onClick={() => setActiveView('gallery')}
            className={activeView === 'gallery' ? 'bg-red-800 hover:bg-red-900 text-white' : 'border-none cursor-pointer shadow-md hover:shadow-sm bg-white text-gray-900  hover:text-red-900 hover:bg-white'}
          >
            <Image className="w-4 h-4 mr-2" />
            Gallery
          </Button>
        </nav>

        {/* Main Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;