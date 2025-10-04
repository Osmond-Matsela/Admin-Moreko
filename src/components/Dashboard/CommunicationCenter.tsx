"use client";
import React, { useState } from 'react';

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
  const getParentListFromChats = () => {
    const parentMap: { [phone: string]: { name: string; phone: string; unread: boolean } } = {};
    

    // Add all parents from the database (subscribers state)
    subscribers.forEach(p => {
      if (!parentMap[p.phone]) {
        parentMap[p.phone] = { name: p.name, phone: p.phone, unread: false };
      }
    });
    return Object.values(parentMap);
  };
  type ChatMessage = {
    sender: string;
    receiver: string;
    message: string;
    numbe: string;
    timestamp: number;
  };
  const [activeTab, setActiveTab] = useState('compose');
  const [message, setMessage] = useState({
    type: 'sms',
    subject: '',
    content: '',
    recipients: 'all'
  });
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>('');




  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: selectedParent, message: message.content })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send SMS');
      setMessage({ ...message, content: '' });
      // Refresh chat
      const res2 = await fetch(`/api/chat-history?parentNum=${selectedParent}`);
      const data2 = await res2.json();

    } catch (err: any) {
      alert('Error sending SMS: ' + err.message);
    }
  };

  const renderChatTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>SMS Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          {/* Parent list */}
          <div className="w-1/3 border-r pr-4">
            <h4 className="font-semibold mb-2">Parents</h4>
            <ul className="space-y-2">
              {getParentListFromChats().map(parent => (
                <li key={parent.phone}>
                  <button
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${selectedParent === parent.phone ? 'bg-green-100' : 'hover:bg-gray-100'} ${parent.unread ? 'border-l-4 border-green-600' : ''}`}
                    onClick={() => setSelectedParent(parent.phone)}
                  >
                    <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                      {parent.name[0]}
                    </span>
                    <span className="flex-1">{parent.name}</span>
                    {parent.unread && <span className="text-xs text-green-600 font-bold">New</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Chat thread */}
          <div className="flex-1 flex flex-col">
            <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-gray-50 mb-4 flex flex-col gap-2" style={{scrollBehavior: 'smooth'}}>
              {true ? (
                <p>Loading chat...</p>
              ) : 0 !== 0 ? (
                <p className="text-center text-gray-400">No messages yet.</p>
              ) : (
                []
                  .filter(msg => msg === selectedParent)
                  .map((msg, idx) => (
                    <div key={idx} className={`flex ${msg === 'admin' ? 'justify-end' : 'justify-start'}`}> 
                      <div className={`flex items-end gap-2`}>
                        {msg !== 'admin' && (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                            {subscribers.find(p => p.phone === msg)?.name?.[0] || msg}
                          </div>
                        )}
                        <div className={`max-w-xs px-4 py-2 rounded-2xl shadow ${msg === 'admin' ? 'bg-green-600 text-white' : 'bg-white text-gray-900 border'}`}> 
                          <span className="block text-sm">{msg}</span>
                          <span className="block text-[10px] mt-1 text-gray-400 text-right">{new Date(msg).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {msg === 'admin' && (
                          <div className="w-8 h-8 rounded-full bg-red-800 flex items-center justify-center text-white font-bold">A</div>
                        )}
                      </div>
                    </div>
                  ))
              )}

            </div>
            <form onSubmit={handleSendChatMessage} className="flex gap-2 items-center">
              <input
                type="text"
                className="flex-1 px-4 py-2 border rounded-2xl focus:ring-2 focus:ring-green-600"
                placeholder="Type a message..."
                value={message.content}
                onChange={e => setMessage({ ...message, content: e.target.value })}
                maxLength={160}
                required
              />
              <Button type="submit" className="bg-green-600 text-white rounded-2xl px-6 py-2">Send</Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.type === 'sms') {
      
      try {
        
        parents.forEach(async(parent: { phone: any; }) => {
          console.log({ to: parent.phone, message: message.content})
          const res = await fetch('/api/send-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: parent.phone, message: message.content})
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to send SMS');
        });
        
      } catch (err: any) {
        alert('Error sending SMS: ' + err.message);
      }
      setMessage({ type: 'sms', subject: '', content: '', recipients: 'all' });
    } else {
      // Email logic (unchanged)
      alert('Email sent successfully!');
      setMessage({ type: 'sms', subject: '', content: '', recipients: 'all' });
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
             className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
              value={message.recipients}
              onChange={(e) => setMessage({...message, recipients: e.target.value})}
            >
              <option value="all">All Subscribers</option>
              <option value="parents">Parents Only</option>
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
              maxLength={message.type === 'sms' ? 160 : undefined}
              required
            />
            {message.type === 'sms' && (
              <p className="text-sm text-gray-500">
                {message.content.length}/160 characters
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
                  {msg === 'admin' ? 'A' : (subscribers.find(p => p.phone === msg)?.name?.[0] || msg)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{msg === 'admin' ? 'Admin' : (subscribers.find(p => p.phone === msg)?.name || msg)}</span>
                    <span className="text-xs text-gray-500">{new Date(msg).toLocaleString()}</span>
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
      case 'chat':
        return renderChatTab();
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
          <span className="text-sm text-gray-600">{subscribers.length} total subscribers</span>
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
        <Button
          variant={activeTab === 'chat' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('chat')}
         className={'flex-1 bg-white text-gray-900 shadow-sm cursor-pointer hover:bg-white hover:text-red-800'}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat
        </Button>
      </nav>

      {renderContent()}
    </div>
  );
};

export default CommunicationCenter;
