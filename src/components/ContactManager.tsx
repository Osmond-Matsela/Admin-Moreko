"use client";
import { useState } from 'react';


import { Plus, Search, Edit, Trash2, Phone, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader } from './ui/card';

interface Contact {
  id: string;
  studentName: string;
  grade: string;
  guardianName: string;
  phoneNumber: string;
}

interface ContactManagerProps {
  contacts: Contact[];
}

const ContactManager = ({ contacts: initialContacts }: ContactManagerProps) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    studentName: '',
    grade: '',
    guardianName: '',
    phoneNumber: ''
  });

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.guardianName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || contact.grade.startsWith(gradeFilter);
    return matchesSearch && matchesGrade;
  });

  const handleAddContact = () => {
    if (newContact.studentName && newContact.grade && newContact.guardianName && newContact.phoneNumber) {
      const contact = {
        id: Date.now().toString(),
        ...newContact
      };
      setContacts([...contacts, contact]);
      setNewContact({ studentName: '', grade: '', guardianName: '', phoneNumber: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const grades = ['8', '9', '10', '11', '12'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Management</h2>
          <p className="text-gray-600">Manage parent and guardian contact information</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2 bg-red-800 hover:bg-red-900">
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  value={newContact.studentName}
                  onChange={(e) => setNewContact({ ...newContact, studentName: e.target.value })}
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Select value={newContact.grade} onValueChange={(value) => setNewContact({ ...newContact, grade: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map(grade => (
                      <SelectItem key={grade} value={`${grade}A`}>{grade}A</SelectItem>
                    ))}
                    {grades.map(grade => (
                      <SelectItem key={`${grade}B`} value={`${grade}B`}>{grade}B</SelectItem>
                    ))}
                    {grades.map(grade => (
                      <SelectItem key={`${grade}C`} value={`${grade}C`}>{grade}C</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input
                  id="guardianName"
                  value={newContact.guardianName}
                  onChange={(e) => setNewContact({ ...newContact, guardianName: e.target.value })}
                  placeholder="Enter guardian name"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={newContact.phoneNumber}
                  onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
                  placeholder="+27821234567"
                />
              </div>
              <Button onClick={handleAddContact} className="w-full">
                Add Contact
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by student or guardian name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {grades.map(grade => (
              <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteContact(contact.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="font-semibold text-gray-900">{contact.studentName}</p>
                  <p className="text-sm text-gray-500">Grade {contact.grade}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{contact.guardianName}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-3 h-3" />
                    <span>{contact.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ContactManager;
