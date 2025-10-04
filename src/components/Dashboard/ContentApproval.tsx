"use client";
import React, { useState } from 'react';

import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  User,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDatabase } from '@/context/Database';
import { Modal } from './Modal';

interface Submission {
  id: string;
  title: string;
  content: string;
  author: string;
  grade: string;
  category: string;
  submittedAt: string;
  featuredImage: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ContentApproval: React.FC = () => {
  const {studentArticles, setStudentArticles} = useDatabase();
  
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submissionToReject, setSubmissionToReject] = useState<string | null>(null);
  const [approvalMessage, setApprovalMessage] = useState('');

  const handleApproval = async (id: string, status: 'published' | 'rejected') => {
    setStudentArticles((prev: any[]) => prev.filter((sub: any) => sub.id !== id));

    const approvedArticle = studentArticles.find((sub: any) => sub.id === id);

    if (approvedArticle) {
      approvedArticle.status = status;
      await fetch(`/api/approve-articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(approvedArticle)
      }).then((res) => res.json()).then((data) => setApprovalMessage(data.message)).catch((err) => console.log(err));
    }
  };

  const handleRejectClick = (id: string): void => {
    setSubmissionToReject(id);
    setShowRejectModal(true);
    setRejectionReason('');
  };

  const confirmRejection = (): void => {
    if (submissionToReject && rejectionReason.trim()) {
      handleApproval(submissionToReject, 'rejected');
      setShowRejectModal(false);
      setSubmissionToReject(null);
      setRejectionReason('');
    }
  };

  const cancelRejection = (): void => {
    setShowRejectModal(false);
    setSubmissionToReject(null);
    setRejectionReason('');
  };

  const handleReview = (submission: Submission): void => {
    setSelectedSubmission(submission);
  };

  const getStatusIcon = (status: string): React.ReactNode => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = studentArticles.filter((sub: { status: string; }) => sub.status === 'pending').length;

  return (

    <>
    <Modal isOpen={approvalMessage !== ''} onClose={() => setApprovalMessage('')} type="success" message="Article Published Successfully" />
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Approval</h2>
          <p className="text-gray-600">Review and approve student-submitted articles</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 rounded-lg">
          <Clock className="w-5 h-5 text-yellow-600" />
          <span className="font-medium text-yellow-800">{pendingCount} pending approval</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentArticles.map((submission: Submission) => (
                  <div 
                    key={submission.id} 
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      selectedSubmission?.id === submission.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                        <span className={`px-3 py-1 rounded text-sm font-medium flex items-center ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          <span className="ml-1 capitalize">{submission.status}</span>
                        </span>
                      </div>
                        <h3 className="font-semibold text-lg mb-1">{submission.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {submission.author.split(' ')[0]} ({submission.grade.split(' ')[0].slice(0, 2) + submission.grade.split(' ')[1]})
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {submission.submittedAt.split(',')[0]}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {submission.category}
                          </span>
                        </div>
                        <p className="text-gray-700 line-clamp-2">{submission.content}</p>
                      </div>
                      
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReview(submission)}
                        className={selectedSubmission?.id === submission.id ? 'bg-blue-100 border-blue-300' : ''}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                      
                      {submission.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproval(submission.id, 'published')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectClick(submission.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {selectedSubmission ? (
            <Card>
              <CardHeader>
                <CardTitle>Article Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <img src={selectedSubmission.featuredImage} alt={selectedSubmission.title} className="w-full h-auto mb-4" />
                    <h3 className="text-xl font-bold mb-3">{selectedSubmission.title}</h3>
                    <div className="text-sm text-gray-600 mb-4 space-y-1">
                      <p><strong>Author:</strong> {selectedSubmission.author}</p>
                      <p><strong>Grade:</strong> {selectedSubmission.grade}</p>
                      <p><strong>Category:</strong> {selectedSubmission.category}</p>
                      <p><strong>Submitted:</strong> {selectedSubmission.submittedAt}</p>
                      <div className="flex items-center mt-2">
                        <strong className="mr-2">Status:</strong>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(selectedSubmission.status)}`}>
                          {getStatusIcon(selectedSubmission.status)}
                          <span className="ml-1 capitalize">{selectedSubmission.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedSubmission.content}
                    </div>
                  </div>
                  
                  {selectedSubmission.status === 'pending' && (
                    <div className="flex space-x-2 pt-4 border-t">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproval(selectedSubmission.id, 'published')}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve & Publish
                      </Button>
                      <Button
                        className="flex-1"
                        variant="destructive"
                        onClick={() => handleRejectClick(selectedSubmission.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select an Article</h3>
                <p className="text-gray-600">Choose an article from the list to review and preview it here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-red-800/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Article</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this article. This will help the student understand how to improve their submission.
            </p>
            <textarea
            
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              rows={4}
            />
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={cancelRejection}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmRejection}
                disabled={!rejectionReason.trim()}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ContentApproval;