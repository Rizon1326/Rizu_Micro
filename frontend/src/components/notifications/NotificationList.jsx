// frontend/src/components/notifications/NotificationList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/axios';
import { Bell, CheckCircle2, MailOpen, MailWarning } from 'lucide-react';

export const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isNotificationPage = location.pathname === '/notifications';

  const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

  const filterExpiredNotifications = (notifs) => {
    const currentTime = new Date().getTime();
    return notifs.filter(notification => {
      const createdAt = new Date(notification.createdAt).getTime();
      return currentTime - createdAt < TWO_DAYS_MS;
    });
  };

  const calculateUnreadCount = (notifs) => {
    return notifs.filter(n => !n.isRead).length;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('http://localhost:5004/notification');
        const activeNotifications = filterExpiredNotifications(response.data);
        setNotifications(activeNotifications);
        
        if (!isNotificationPage) {
          setUnreadCount(calculateUnreadCount(activeNotifications));
        } else {
          // Mark all as read when entering notifications page
          activeNotifications.forEach(notification => {
            if (!notification.isRead) {
              markAsRead(notification._id, false); // false means don't update state immediately
            }
          });
          setUnreadCount(0);
        }
      } catch (err) {
        setError('Failed to fetch notifications');
      }
    };

    fetchNotifications();
    
    // Set up periodic check for expired notifications
    const cleanupInterval = setInterval(() => {
      setNotifications(prev => filterExpiredNotifications(prev));
    }, 60000); // Check every minute

    return () => clearInterval(cleanupInterval);
  }, [isNotificationPage]);

  const toggleNotificationList = (e) => {
    e.stopPropagation();
    if (!isNotificationPage) {
      navigate('/notifications');
    }
  };

  const markAsRead = async (notificationId, updateState = true) => {
    try {
      await api.patch(`http://localhost:5004/notification/${notificationId}/read`);
      if (updateState) {
        const updatedNotifications = notifications.map(n => 
          n._id === notificationId ? { ...n, isRead: true } : n
        );
        setNotifications(updatedNotifications);
        setUnreadCount(calculateUnreadCount(updatedNotifications));
      }
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const markAsUnread = async (notificationId) => {
    try {
      await api.patch(`http://localhost:5004/notification/${notificationId}/unread`);
      const updatedNotifications = notifications.map(n => 
        n._id === notificationId ? { ...n, isRead: false } : n
      );
      setNotifications(updatedNotifications);
      setUnreadCount(calculateUnreadCount(updatedNotifications));
    } catch (err) {
      setError('Failed to mark notification as unread');
    }
  };

  const formatTimestamp = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  if (error) return <div className="text-red-600">{error}</div>;

  const renderNotifications = () => (
    <div className="space-y-3">
      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <CheckCircle2 className="mx-auto mb-4 text-green-500" size={48} />
          <p>All caught up! No new notifications</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-3 rounded-lg border transition ${
              !notification.isRead 
                ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <p className="text-gray-700">{notification.message}</p>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(notification.createdAt)}
                </span>
              </div>
              <div className="flex space-x-2">
                {!notification.isRead ? (
                  <button 
                    onClick={() => markAsRead(notification._id)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Mark as read"
                  >
                    <MailOpen size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={() => markAsUnread(notification._id)}
                    className="text-orange-500 hover:text-orange-700"
                    title="Mark as unread"
                  >
                    <MailWarning size={16} />
                  </button>
                )}
              </div>
            </div>
            {notification.postId && (
              <a
                href={`/post/${notification.postId._id}`}
                className="text-blue-500 hover:underline text-sm mt-1 block"
              >
                View Related Post
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div id="notification-container" className="relative">
      <div 
        onClick={toggleNotificationList} 
        className="cursor-pointer relative inline-block"
      >
        <Bell className={`text-blue-500 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
            {unreadCount}
          </span>
        )}
      </div>

      {isNotificationPage && (
        <div className="mt-4 max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border">
            <div className="bg-gray-100 p-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Bell className="text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              </div>
            </div>
            <div className="p-4">
              {renderNotifications()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};