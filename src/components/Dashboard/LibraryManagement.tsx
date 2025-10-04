"use client";
import React, { useState } from "react";

import { Upload, FileText, Download, Trash2, Edit, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";


const LibraryManagement = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [resources] = useState([
    {
      id: 1,
      title: "June Revision Pack",
      description:
        "Mathematics and Science revision materials for Grades 10-12",
      type: "PDF",
      size: "2.3 MB",
      downloads: 45,
      uploadDate: "2024-01-10",
    },
    {
      id: 2,
      title: "2024 School Calendar",
      description: "Important dates, holidays, and school events for the year",
      type: "PDF",
      size: "1.1 MB",
      downloads: 123,
      uploadDate: "2024-01-05",
    },
    {
      id: 3,
      title: "Uniform Policy Guide",
      description: "Complete guidelines for school uniform requirements",
      type: "PDF",
      size: "0.8 MB",
      downloads: 67,
      uploadDate: "2024-01-01",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Digital Library Management
          </h2>
          <p className="text-gray-600">
            Upload and manage downloadable resources
          </p>
        </div>
        <Button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-red-800 hover:bg-red-900 text-white cursor-poiter"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Resource
        </Button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Resource</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resourceTitle">Resource Title</Label>
                <input
                  id="resourceTitle"
                  placeholder="Enter resource title"
                  className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                 className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                >
                  <option value="">Select category</option>
                  <option value="academic">Academic Resources</option>
                  <option value="policies">School Policies</option>
                  <option value="forms">Forms & Documents</option>
                  <option value="calendar">Calendar & Events</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={3}
                className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                placeholder="Describe the resource content..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload File</Label>
              <input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
              />
              <p className="text-sm text-gray-500">
                Supported formats: PDF, Word, Excel, PowerPoint (Max 10MB)
              </p>
            </div>

            <div className="flex space-x-4">
              <Button className="bg-red-800 text-white hover:bg-red-900">
                Upload Resource
              </Button>
              <Button
                variant="default"
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
                onClick={() => setShowUploadForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources List */}
      <div className="grid gap-4">
        {resources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FileText className="w-5 h-5 text-red-800" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {resource.title}
                      </h3>
                      <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                        {resource.type}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3">{resource.description}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Size: {resource.size}</span>
                    <span>Downloads: {resource.downloads}</span>
                    <span>Uploaded: {resource.uploadDate}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LibraryManagement;
