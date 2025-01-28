// frontend/src/pages/CreatePostPage.jsx
import React from 'react';
import { CreatePost } from '../components/posts/CreatePost';
import { Layout } from '../components/layout/Layout';

export const CreatePostPage = () => {
  return (
    <Layout>
      <CreatePost />
    </Layout>
  );
};
