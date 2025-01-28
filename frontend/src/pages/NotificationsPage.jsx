// frontend/src/pages/NotificationsPage.jsx
import React from 'react';
import { NotificationList } from '../components/notifications/NotificationList';
import { Layout } from '../components/layout/Layout';

export const NotificationsPage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <NotificationList />
      </div>
    </Layout>
  );
};
