"use client";
import React, { useState } from 'react';

import { 
  Upload, 
  Image as ImageIcon, 
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { useDatabase } from '@/context/Database';

interface Gallery {
  id: number;
  title: string;
  description: string;
  imageCount: number;
  coverImage: string;
  date: string;
  category: string;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  image: File | null;
}

const GalleryManagement = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const {gallery, setGallery} = useDatabase();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'sports',
    image: null
  });
  const [isUploading, setIsUploading] = useState(false);
  
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'sports', label: 'Sports' },
    { value: 'arts', label: 'Arts' },
    { value: 'academics', label: 'Academics' },
    { value: 'graduation', label: 'Graduation' },
    { value: 'community', label: 'Community' }
  ];
  

  // Generate unique ID using voucher_codes style format
  const generateGalleryId = (prefix: string = "GAL"): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = prefix;
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const uploadImageToImgBB = async (imageFile: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    
    if (!imageFile || !(imageFile instanceof File)) {
      throw new Error('No valid image file selected');
    }
    
    console.log('Uploading file:', imageFile.name, 'Size:', imageFile.size, 'Type:', imageFile.type);
    
    // Convert File to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove the data:image/...;base64, prefix to get pure base64
        const base64Data = result.replace(/^data:image\/\w+;base64,/, '');
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
    
    // Create FormData exactly as shown in docs
    const formData = new FormData();
    formData.append('image', base64);
    
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('ImgBB error response:', data);
        throw new Error(`Upload failed: ${data.error?.message || response.statusText}`);
      }
      
      // Return the direct image URL (not the viewer URL)
      return data.data.url;
      
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.image) {
      alert('Please fill in all required fields and select an image');
      return;
    }

    setIsUploading(true);
    
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const galleryId = generateGalleryId("GAL"); // Generate unique ID
      
      // Upload image to ImgBB
      console.log('Uploading image to ImgBB...');
      const imageUrl = await uploadImageToImgBB(formData.image);
      
      console.log('Image uploaded successfully:', imageUrl);
      
      // Validate imageUrl
      if (!imageUrl || typeof imageUrl !== 'string') {
        throw new Error('Invalid image URL received from ImgBB');
      }
      
      // Now send the data with image URL to your API
      const payload = {
        id: galleryId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        eventDate: currentDate,
        category: formData.category,
        imageUrl: imageUrl
      };
      
      console.log('Sending payload to API:', payload);
      
      const response = await fetch('/api/upload-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Gallery created successfully:', result);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'sports',
        image: null
      });
      
      // Reset file input
      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      setShowUploadForm(false);
      
      alert('Gallery created successfully!');
    } catch (error) {
      console.error('Error uploading gallery:', error);
      alert(`Failed to create gallery: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredGalleries = selectedCategory === 'all' 
    ? gallery 
    : gallery.filter((g: any) => g.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
          <p className="text-gray-600">Manage school event photos and galleries</p>
        </div>
        <Button 
          onClick={() => setShowUploadForm(!showUploadForm)} 
          className="bg-red-800 text-white hover:bg-red-900"
        >
          <Upload className="w-4 h-4 mr-2" />
          Create Gallery
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            variant={selectedCategory === cat.value ? "default" : "outline"}
            className={selectedCategory === cat.value 
              ? "bg-red-800 text-white hover:bg-red-900" 
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Gallery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Gallery Title *</Label>
              <input 
                id="title" 
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter gallery title" 
                className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
              >
                {categories.filter(cat => cat.value !== 'all').map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                placeholder="Describe the event or gallery content..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Upload Image *</Label>
              <input 
                id="image" 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full px-4 py-2 border outline-none border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
              />
              <p className="text-sm text-gray-500">
                Supported formats: JPEG, PNG, GIF. Max size: 5MB.
                {formData.image && ` Selected: ${formData.image.name}`}
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={handleSubmit}
                disabled={isUploading}
                className="bg-red-800 text-white hover:bg-red-900"
              >
                {isUploading ? 'Uploading...' : 'Create Gallery'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowUploadForm(false)}  
                className="bg-gray-200 text-gray-800 border-none hover:bg-gray-300 cursor-pointer"
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Galleries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGalleries.map((gall: any) => (
          <Card key={gall.id} className="hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
              <img src={gall.imageUrl} alt={gall.title} className="w-full h-full object-fit-cover" />
            </div>
            <CardContent className="p-4">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold">{gall.title}</h3>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                    {categories.find(c => c.value === gall.category)?.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{gall.description}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
  
                <span>{gall.date}</span>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGalleries.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No galleries found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;