// frontend/src/pages/HomePage.jsx
import React from 'react';
import { PostList } from '../components/posts/PostList';
import { Layout } from '../components/layout/Layout';

export const HomePage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Recent Posts</h1>
        <PostList />
      </div>
    </Layout>
  );
};
