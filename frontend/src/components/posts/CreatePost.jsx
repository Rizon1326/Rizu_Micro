// src/components/posts/CreatePost.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { FaFileCode, FaFileCsv, FaFileAlt, FaFilePdf, FaFileExcel, FaPython, FaJs, FaJava, FaFile } from 'react-icons/fa';

export const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [file, setFile] = useState(null);
  const [fileExtension, setFileExtension] = useState('cpp'); // Default extension
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('codeSnippet', codeSnippet);
    formData.append('fileExtension', fileExtension);

    if (file) {
      formData.append('file', file);
    }

    try {
      await api.post('http://localhost:5003/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
  };

  const renderFileIcon = () => {
    switch (fileExtension) {
      case 'cpp':
      case 'c':
        return <FaFileCode className="text-gray-600 text-lg" />;
      case 'java':
        return <FaJava className="text-gray-600 text-lg" />;
      case 'python':
        return <FaPython className="text-gray-600 text-lg" />;
      case 'js':
        return <FaJs className="text-gray-600 text-lg" />;
      case 'rb':
        return <FaFileCode className="text-gray-600 text-lg" />;
      case 'txt':
        return <FaFileAlt className="text-gray-600 text-lg" />;
      case 'csv':
        return <FaFileCsv className="text-gray-600 text-lg" />;
      default:
        return <FaFile className="text-gray-600 text-lg" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Post</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={codeSnippet}
          onChange={(e) => setCodeSnippet(e.target.value)}
          placeholder="Code Snippet (optional)"
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {/* Dropdown for File Extension */}
        <div className="flex items-center space-x-2">
          <select
            value={fileExtension}
            onChange={(e) => setFileExtension(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cpp">C++ (.cpp)</option>
            <option value="c">C (.c)</option>
            <option value="java">Java (.java)</option>
            <option value="python">Python (.py)</option>
            <option value="js">JavaScript (.js)</option>
            <option value="rb">Ruby (.rb)</option>
            <option value="txt">Text (.txt)</option>
            <option value="csv">CSV (.csv)</option>
          </select>
          
          {/* File Icon based on extension */}
          <span>{renderFileIcon()}</span>
        </div>

        <input
          type="file"
          onChange={handleFileChange}
          accept=".txt,.js,.jsx,.json,.cpp,.c,.java,.py,.rb,.csv"
          className="w-full p-2 text-sm text-gray-500 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-md font-medium hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};
