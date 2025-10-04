"use client";
import { useState } from 'react';


import { Send, Eye, Users, Link, TestTube } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface Contact {
  id: string;
  studentName: string;
  grade: string;
  guardianName: string;
  phoneNumber: string;
}

interface SMSComposerProps {
  contacts: Contact[];
}

const SMSComposer = ({ contacts }: SMSComposerProps) => {
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState('');

  const generateShortLink = () => {
    if (documentUrl) {
      // Simulate short link generation
      const shortCode = Math.random().toString(36).substring(2, 8);
      setShortLink(`https://mhs.ly/${shortCode}`);
     
    }
  };

  const getRecipientCount = () => {
    if (recipientType === 'all') return contacts.length;
    if (recipientType === 'grade') {
      return contacts.filter(contact => contact.grade.startsWith(selectedGrade)).length;
    }
    if (recipientType === 'class') {
      return contacts.filter(contact => contact.grade === selectedClass).length;
    }
    return 0;
  };

  const getRecipientList = () => {
    if (recipientType === 'all') return contacts;
    if (recipientType === 'grade') {
      return contacts.filter(contact => contact.grade.startsWith(selectedGrade));
    }
    if (recipientType === 'class') {
      return contacts.filter(contact => contact.grade === selectedClass);
    }
    return [];
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
   
      return;
    }

    const recipients = getRecipientList();
    const finalMessage = shortLink ? `${message}\n\nDocument: ${shortLink}` : message;


    // Reset form
    setMessage('');
    setDocumentUrl('');
    setShortLink('');
  };

  const handleSendTest = () => {
    if (!testPhoneNumber || !message.trim()) {
      
      return;
    }

    
  };

  const grades = ['8', '9', '10', '11', '12'];
  const classes = ['8A', '8B', '8C', '9A', '9B', '9C', '10A', '10B', '10C', '11A', '11B', '11C', '12A', '12B', '12C'];
  const messageLength = message.length;
  const smsCount = Math.ceil(messageLength / 160);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Compose SMS</h2>
        <p className="text-gray-600">Create and send messages to parents and guardians</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Composer */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Message Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-32"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{messageLength} characters</span>
                  <span>{smsCount} SMS</span>
                </div>
              </div>

              {/* Document Link Section */}
              <div className="space-y-3">
                <Label>Attach Document (Optional)</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter document URL (e.g., Google Drive link)"
                    value={documentUrl}
                    onChange={(e) => setDocumentUrl(e.target.value)}
                  />
                  <Button 
                    onClick={generateShortLink} 
                    variant="outline"
                    disabled={!documentUrl}
                    className="flex items-center space-x-2"
                  >
                    <Link className="w-4 h-4" />
                    <span>Shorten</span>
                  </Button>
                </div>
                {shortLink && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Short link generated:</strong> {shortLink}
                    </p>
                  </div>
                )}
              </div>

              {/* Test Message */}
              <div className="border-t pt-4">
                <Label>Send Test Message</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    placeholder="Your phone number for testing"
                    value={testPhoneNumber}
                    onChange={(e) => setTestPhoneNumber(e.target.value)}
                  />
                  <Button 
                    onClick={handleSendTest}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <TestTube className="w-4 h-4" />
                    <span>Test</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recipients */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Recipients</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Send to</Label>
                <Select value={recipientType} onValueChange={setRecipientType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Parents</SelectItem>
                    <SelectItem value="grade">Specific Grade</SelectItem>
                    <SelectItem value="class">Specific Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {recipientType === 'grade' && (
                <div>
                  <Label>Grade</Label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          Grade {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {recipientType === 'class' && (
                <div>
                  <Label>Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Recipients:</strong> {getRecipientCount()} contacts
                </p>
              </div>

              <div className="space-y-3">
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Message Preview</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="whitespace-pre-wrap">
                          {shortLink ? `${message}\n\nDocument: ${shortLink}` : message}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>Recipients:</strong> {getRecipientCount()} contacts</p>
                        <p><strong>Message length:</strong> {messageLength} characters ({smsCount} SMS)</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  onClick={handleSendMessage} 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SMSComposer;
