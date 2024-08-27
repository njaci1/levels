import React, { useEffect, useState } from 'react';

function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch the notifications when the component mounts
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    // Call your API to fetch the notifications
    // Set the notifications in state
  }

  async function markNotificationAsRead(notificationId) {
    // Call your API to mark the notification as read
    // Remove the notification from state
  }

  return (
    <div>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => markNotificationAsRead(notification.id)}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
}

export default Notifications;
