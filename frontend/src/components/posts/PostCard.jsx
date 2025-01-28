// frontend/src/components/posts/PostCard.jsx
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export const PostCard = ({ post }) => {
  const [showFile, setShowFile] = useState(false);
  const [fileContent, setFileContent] = useState('');

  const handleFileView = async () => {
    try {
      const response = await fetch(`http://localhost:9002/${post.fileUrl}`);
      if (response.ok) {
        const content = await response.text(); // Read the file as text
        setFileContent(content);
        setShowFile(true);
      } else {
        console.error('Failed to load the file');
      }
    } catch (error) {
      console.error('Error fetching the file:', error);
    }
  };

  const handleFileClose = () => {
    setShowFile(false);
    setFileContent('');
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
      <p className="text-sm text-gray-600 mb-4">
        Posted by: <span className="font-medium text-gray-700">{post.userId.email}</span>
      </p>

      {post.codeSnippet && (
        <pre className="mt-4 bg-gray-100 text-gray-700 p-4 rounded-md text-sm font-mono">
          {post.codeSnippet}
        </pre>
      )}

      {post.fileUrl && (
        <div>
          {!showFile ? (
            <button
              onClick={handleFileView}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-center font-medium hover:bg-blue-700 transition"
            >
              View Attached File
            </button>
          ) : (
            <div className="mt-4 bg-gray-100 border border-gray-300 p-4 rounded-md">
              <pre className="text-sm font-mono whitespace-pre-wrap">{fileContent}</pre>
              <button
                onClick={handleFileClose}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition"
              >
                Close the File
              </button>
            </div>
          )}
        </div>
      )}

      <span className="text-xs text-gray-500 mt-4 block">
        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
      </span>
    </div>
  );
};
