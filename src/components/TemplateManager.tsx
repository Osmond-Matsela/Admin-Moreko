"use client";
import { useState } from 'react';

import { Plus, FileText, Edit, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';


interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  usageCount: number;
}

const TemplateManager = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Parent Meeting Reminder',
      content: 'Dear Parent/Guardian, this is a reminder that the parent-teacher meeting is scheduled for [DATE] at [TIME] in the school hall. Please confirm your attendance by replying to this message.',
      category: 'Meetings',
      usageCount: 12
    },
    {
      id: '2',
      name: 'School Closure Notice',
      content: 'Dear Parent/Guardian, due to [REASON], Moreko High School will be closed on [DATE]. Students should not report to school. Normal classes will resume on [NEXT_DATE].',
      category: 'Notices',
      usageCount: 3
    },
    {
      id: '3',
      name: 'Event Invitation',
      content: 'You are invited to [EVENT_NAME] taking place on [DATE] at [TIME]. Venue: [VENUE]. For more information, contact the school office.',
      category: 'Events',
      usageCount: 8
    },
    {
      id: '4',
      name: 'Fee Reminder',
      content: 'Dear Parent/Guardian, this is a reminder that school fees for [TERM] are due on [DATE]. Please ensure payment is made on time to avoid any inconvenience.',
      category: 'Fees',
      usageCount: 15
    },
    {
      id: '5',
      name: 'Exam Schedule',
      content: 'Dear Parent/Guardian, the [EXAM_TYPE] examinations will commence on [START_DATE] and end on [END_DATE]. Please ensure your child is prepared and arrives on time.',
      category: 'Academics',
      usageCount: 6
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    category: ''
  });

  const { toast } = useToast();

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.content && newTemplate.category) {
      const template: Template = {
        id: Date.now().toString(),
        ...newTemplate,
        usageCount: 0
      };
      setTemplates([...templates, template]);
      setNewTemplate({ name: '', content: '', category: '' });
      setIsAddDialogOpen(false);
      toast({
        title: "Template created",
        description: "New message template has been added successfully."
      });
    }
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      content: template.content,
      category: template.category
    });
  };

  const handleUpdateTemplate = () => {
    if (editingTemplate && newTemplate.name && newTemplate.content && newTemplate.category) {
      setTemplates(templates.map(template => 
        template.id === editingTemplate.id 
          ? { ...template, ...newTemplate }
          : template
      ));
      setEditingTemplate(null);
      setNewTemplate({ name: '', content: '', category: '' });
      toast({
        title: "Template updated",
        description: "Message template has been updated successfully."
      });
    }
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast({
      title: "Template deleted",
      description: "Message template has been removed."
    });
  };

  const handleCopyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Template copied",
      description: "Template content copied to clipboard."
    });
  };

  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Message Templates</h2>
          <p className="text-gray-600">Create and manage reusable message templates</p>
        </div>
        <Dialog open={isAddDialogOpen || !!editingTemplate} onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingTemplate(null);
            setNewTemplate({ name: '', content: '', category: '' });
          }
        }}>
          <DialogTrigger asChild>
            <Button 
              className="flex items-center space-x-2 bg-red-800 hover:bg-red-900 cursor-pointer"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <span>Add Template</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Add New Template'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="Enter template name"
                />
              </div>
              
              <div>
                <Label htmlFor="templateCategory">Category</Label>
                <Input
                  id="templateCategory"
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  placeholder="e.g., Meetings, Notices, Events"
                />
              </div>
              
              <div>
                <Label htmlFor="templateContent">Template Content</Label>
                <Textarea
                  id="templateContent"
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  placeholder="Enter your message template. Use [PLACEHOLDER] for variables like [DATE], [TIME], etc."
                  className="min-h-32"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Use placeholders like [DATE], [TIME], [EVENT_NAME] that can be replaced when using the template.
                </p>
              </div>
              
              <Button 
                onClick={editingTemplate ? handleUpdateTemplate : handleAddTemplate} 
                className="w-full"
              >
                {editingTemplate ? 'Update Template' : 'Add Template'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates by Category */}
      {categories.map(category => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            {category}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates
              .filter(template => template.category === category)
              .map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary">{template.category}</Badge>
                          <span className="text-sm text-gray-500">
                            Used {template.usageCount} times
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCopyTemplate(template.content)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 line-clamp-4">
                      {template.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}

      {templates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
          <p className="text-gray-500">Create your first message template to get started.</p>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
