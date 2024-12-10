import React, { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';

function Notifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const handleExpand = (notificationId) => {
    setExpandedNotification(
      expandedNotification === notificationId ? null : notificationId
    );
  };

  useEffect(() => {
    // Fetch the notifications when the component mounts

    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    // Call API to fetch the notifications

    try {
      const res = await fetch(`/api/notifications/${userId.userId}`);
      const result = await res.json();
      setNotifications(result.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }

  const handleNotificationClick = async (notification) => {
    // Expand/Collapse the notification
    const notificationId = notification._id;

    setExpandedNotification(
      expandedNotification === notificationId ? null : notificationId
    );

    // Mark the notification as read

    try {
      const res = await fetch(
        `/api/notifications/notificationId/${notificationId}`
      );
      const result = await res.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="flex flex-col justify-center text-center">
      <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}></div>
      <h2>
        <strong>Notifications</strong>
      </h2>
      {notifications.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {notifications.map((notification) => (
            <li
              key={notification._id}
              style={{
                marginBottom: '10px',
                backgroundColor: notification.read ? '#f9f9f9' : '#e6f7ff',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
              onClick={() => handleNotificationClick(notification)}
            >
              <div>
                <strong>{notification.message.substring(0, 30)}...</strong>
                <span
                  style={{ float: 'right', fontSize: '12px', color: '#888' }}
                >
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
              {expandedNotification === notification._id && (
                <div style={{ marginTop: '10px' }}>
                  <p>{notification.message}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div>You have no notifications yet</div>
      )}
    </div>
  );
}

export default Notifications;
