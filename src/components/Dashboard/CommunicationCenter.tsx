"use client";
import React, { useEffect, useRef, useState } from 'react';

import { 
  Send, 
  Users, 
  Mail, 
  MessageSquare, 
  Plus,
  Eye,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useDatabase } from '@/context/Database';


const CommunicationCenter = () => {
  // Helper to get unique parents from chatMessages

  const { parents } = useDatabase();

 
  const [activeTab, setActiveTab] = useState('compose');
  const [message, setMessage] = useState({
    type: 'sms',
    subject: '',
    content: '',
    recipients: 'all'
  });
  const [subscribers, setSubscribers] = useState<any>(0);
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [groups, setGroups] = useState<any[]>([{ groupID: -1, groupName: 'All' }]);

  const hasFetched = useRef(false);

useEffect(() => {
  if (!hasFetched.current) {
    hasFetched.current = true;
    const fetchSubscribers = async () => {
      const groups = await getSmsGroups();
      setGroups(prep => prep.concat(groups));
      let total = 0;

      groups.forEach((group: any) => {
        total += group.count;
      })
      setSubscribers(total);
    };
    fetchSubscribers();
  }
}, []);

 const getSmsGroups = async (): Promise<any[]> => {
    const res = await fetch('/api/get-sms-groups', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    console.log(data.groups);
    if (!res.ok) throw new Error(data.error || 'Failed to get SMS groups');
    return data.groups;
  };

 
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (message.type === 'sms') {
      const res = await fetch('/api/get-sms-numbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({groupID: message.recipients, groupSize: subscribers})
      });
      const data = await res.json();
      
      try{
       data.data.results.forEach(async (number: any) => {
        await fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: number.number, message: message.content})
        });
       })
      }
      catch (error: any) {
        console.log(error);
      }

      if (!res.ok) throw new Error(data.error || 'Failed to send SMS');
    }
       
  };

  const renderComposeTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Compose Message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendMessage} className="space-y-6">
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="default"
              onClick={() => setMessage({...message, type: 'sms'})}
              className={message.type === 'sms' ? 'flex-1 bg-red-800 text-white ' : 'flex-1 bg-white text-gray-900 shadow-sm cursor-pointer hover:bg-white hover:text-red-800'}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              SMS
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={() => setMessage({...message, type: 'email'})}
              className={message.type === 'email' ? 'flex-1 bg-red-800 text-white ' : 'flex-1 bg-white text-gray-900 shadow-sm cursor-pointer hover:bg-white hover:text-red-800'}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">Send to</Label>
            <select
              id="recipients"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800 outline-none "
              value={message.recipients}
              onChange={(e) => setMessage({...message, recipients: e.target.value})}
            >
              {
                groups.map((group) => (
                  <option key={group.groupID} value={group.groupID}>
                    {group.groupName}
                  </option>
                ))
              }
            </select>
          </div>

          {message.type === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <input
                id="subject"
                className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                placeholder="Enter email subject"
                value={message.subject}
                onChange={(e) => setMessage({...message, subject: e.target.value})}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="content">Message</Label>
            <textarea
              id="content"
              rows={6}
              className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
              placeholder={message.type === 'sms' ? 'Enter SMS message (160 chars max)' : 'Enter email content'}
              value={message.content}
              onChange={(e) => setMessage({...message, content: e.target.value})}
              maxLength={message.type === 'sms' ? 459 : undefined}
              required
            />
            {message.type === 'sms' && (
              <p className="text-sm text-gray-500">
                {message.content.length}/459 characters
              </p>
            )}
          </div>

          <Button type="submit" className="w-full bg-red-800 text-white hover:bg-red-900">
            <Send className="w-4 h-4 mr-2" />
            Send {message.type.toUpperCase()}
          </Button>
        </form>
      </CardContent>
    </Card>
  );


  const renderHistoryTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>SMS Message History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {0 === 0 ? (
            <p className="text-center text-gray-400">No SMS history available.</p>
          ) : (
            [].map((msg, idx) => (
              <div key={idx} className="p-4 border rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                  {/* {msg === 'admin' ? 'A' : (subscribers.find(p => p.phone === msg)?.name?.[0] || msg)} */}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {/* <span className="font-medium">{msg === 'admin' ? 'Admin' : (subscribers.find(p => p.phone === msg)?.name || msg)}</span>
                    <span className="text-xs text-gray-500">{new Date(msg).toLocaleString()}</span> */}
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{msg}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return renderHistoryTab();
      default:
        return renderComposeTab();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Communication Center</h2>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-red-800" />
          <span className="text-sm text-gray-600">{message.type == "sms" ? subscribers : 0} total subscribers</span>
        </div>
      </div>

      <nav className="flex space-x-1p-1 rounded-lg gap-2">
        <Button
          variant={activeTab === 'compose' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('compose')}
          className={'flex-1 bg-white text-gray-900 shadow-sm cursor-pointer hover:bg-white hover:text-red-800'}
        >
          <Plus className="w-4 h-4 mr-2" />
          Compose
        </Button>
    
        <Button
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('history')}
         className={'flex-1 bg-white text-gray-900 shadow-sm cursor-pointer hover:bg-white hover:text-red-800'}
        >
          <Eye className="w-4 h-4 mr-2" />
          History
        </Button>
      
      </nav>

      {renderContent()}
    </div>
  );
};

export default CommunicationCenter;
