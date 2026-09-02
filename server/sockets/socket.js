import { Server } from "socket.io";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH"],
    },
  });

  io.on("connection", (socket) => {
    
    socket.on("join", (userId) => {
  console.log("JOIN:", userId, socket.id);

  if (!userId) return;

  socket.join(`user:${userId}`);
  console.log("ROOMS:", [...socket.rooms]);
});

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export default initializeSocket;