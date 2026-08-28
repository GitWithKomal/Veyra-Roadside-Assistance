export const sendNotification = ({
  io,
  userId,
  title,
  message,
  type = "info",
  data = {},
}) => {
  if (!io || !userId) {
    return;
  }

  const notification = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    message,
    type,
    data,
    createdAt: new Date().toISOString(),
    read: false,
  };

  io.to(`user:${userId}`).emit("notification", notification);

  console.log(
    `🔔 Notification sent to user:${userId} - ${title}`
  );
};

export default sendNotification;