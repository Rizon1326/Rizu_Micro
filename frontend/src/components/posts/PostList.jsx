// frontend/src/components/posts/PostList.jsx
import React, { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import api from '../../utils/axios';
import { Search, Filter } from 'lucide-react';

export const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('http://localhost:5003/post');
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = posts.filter(post => 
      post.userId.email.toLowerCase().includes(term) ||
      post.title.toLowerCase().includes(term)
    );
    
    setFilteredPosts(filtered);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6 space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by username or post title"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
          <Filter className="text-gray-600" />
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Posts: {filteredPosts.length} / {posts.length}
      </h2>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No posts found matching your search</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};