"use client";
import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  User,
  Calendar,
  Plus,
  Image,
  Trash2,
  Save,
  Delete
} from 'lucide-react';
import { useDatabase } from '@/context/Database';
const voucher_codes = require("voucher-code-generator");

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  submittedAt: string;
  status: string;
  featuredImage: string;
}

interface NewArticle {
  title: string;
  author: string;
  category: string;
  featuredImage: any;
  paragraphs: string[];
}
const generateUniqueCode = (prefix: string):string => {
  return voucher_codes
    .generate({
      count: 1,
      length: 10,
      prefix: prefix,
      charset: "alphabetic",
    })[0]
    .toUpperCase();
};
const NewsComponent: React.FC = () => {
  const {posts, setPosts} = useDatabase();
  const [articles, setArticles] = useState<Article[]>(posts);


  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [newArticle, setNewArticle] = useState<NewArticle>({
    title: '',
    author: '',
    category: '',
    featuredImage: '',
    paragraphs: ['']
  });

const uploadImage = async (): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const imageFile = newArticle.featuredImage;
  
  if (!imageFile || !(imageFile instanceof File)) {
    throw new Error('No valid image file selected');
  }
  
  console.log('Uploading file:', imageFile.name, 'Size:', imageFile.size, 'Type:', imageFile.type);
  
  // Convert File to base64 (matching the docs format)
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

  const handleAddParagraph = () => {
    setNewArticle(prev => ({
      ...prev,
      paragraphs: [...prev.paragraphs, '']
    }));
  };

  const handleRemoveParagraph = (index: number): void => {
    if (newArticle.paragraphs.length > 1) {
      setNewArticle(prev => ({
        ...prev,
        paragraphs: prev.paragraphs.filter((_, i) => i !== index)
      }));
    }
  };

  const handleParagraphChange = (index: number, value: string): void => {
    setNewArticle(prev => ({
      ...prev,
      paragraphs: prev.paragraphs.map((para, i) => i === index ? value : para)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // Store the actual File object, NOT the path
    setNewArticle({ ...newArticle, featuredImage: file });
  }
};

 const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const res = await fetch('/api/delete-article', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: articleId })
      });

      if (res.ok) {
        setArticles(prev => prev.filter(article => article.id !== articleId));
        if (selectedArticle?.id === articleId) {
          setSelectedArticle(null);
        }
      } else {
        console.error('Delete failed:', await res.text());
        alert('Failed to delete article');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete article');
    }
  };

  const handleSaveArticle = async () => {
    if (newArticle.title && newArticle.author && newArticle.paragraphs[0]) {
      let imageURL = await uploadImage();
      const article = {
        id: generateUniqueCode("ARTICLE-"),
        title: newArticle.title,
        content: newArticle.paragraphs.join('\n\n'),
        author: newArticle.author,
        category: newArticle.category || 'General',
        submittedAt: new Date().toLocaleString(),
        status: 'published',
        featuredImage: imageURL || 'https://via.placeholder.com/300x200/6b7280/white?text=No+Image'
      };

      console.log(imageURL)

      const res = await fetch('/api/upload-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(article)
      });
      
      if (res.ok){
      setArticles(prev => [article, ...prev]);
      setNewArticle({
        title: '',
        author: '',
        category: '',
        featuredImage: '',
        paragraphs: ['']
      });
      setShowAddForm(false);

    }
    else{
      console.log('error')
    }
    }
  };

  const getStatusIcon = (status: Article['status']): React.ReactNode => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Article['status']): string => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">School News</h2>
          <p className="text-gray-600">Manage and publish school news articles</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 rounded-lg">
          <Clock className="w-5 h-5 text-yellow-600" />
          <span className="font-medium text-yellow-800">{articles.length} articles published</span>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Article</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Create New Article</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter article title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={newArticle.author}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewArticle(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter author name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newArticle.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewArticle(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="Sports">Sports</option>
                  <option value="Academic">Academic</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Community">Community</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Article Content</label>
                <button
                  onClick={handleAddParagraph}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Paragraph
                </button>
              </div>
              
              {newArticle.paragraphs.map((paragraph, index) => (
                <div key={index} className="flex space-x-2 mb-3">
                  <textarea
                    value={paragraph}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleParagraphChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Paragraph ${index + 1}...`}
                    rows={3}
                  />
                  {newArticle.paragraphs.length > 1 && (
                    <button
                      onClick={() => handleRemoveParagraph(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3 pt-4 border-t">
              <button
                onClick={handleSaveArticle}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save className="w-4 h-4" />
                <span>Publish Article</span>
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Published Articles</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex space-x-4">
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-40 h-40 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {article.author}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {article.submittedAt}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {article.category}
                              </span>
                            </div>
                            <p className="text-gray-700 line-clamp-2">{article.content}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(article.status)} ml-4`}>
                            {getStatusIcon(article.status)}
                            <span className="ml-1 capitalize">{article.status}</span>
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedArticle(article)}
                            className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>

                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                          >
                            <Delete className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          {selectedArticle ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Article Preview</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <img
                    src={selectedArticle.featuredImage}
                    alt={selectedArticle.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{selectedArticle.title}</h3>
                    <div className="text-sm text-gray-600 mb-4">
                      <p>By: {selectedArticle.author}</p>
                      <p>Category: {selectedArticle.category}</p>
                      <p>Published: {selectedArticle.submittedAt}</p>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm">
                    <p className="text-gray-700 leading-relaxed">{selectedArticle.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Article</h3>
                <p className="text-gray-600">Choose an article from the list to preview it here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsComponent;