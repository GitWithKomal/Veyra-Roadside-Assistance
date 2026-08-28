import { useEffect } from "react";
import { socket } from "../services/socket";

const useCustomerSocket = (onRequestUpdate, onNotification) => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) {
      console.log("❌ No logged-in user for socket");
      return;
    }

    const handleConnect = () => {
      console.log("🟢 Customer socket connected:", socket.id);

      console.log("Joining customer room:", `user:${user.id}`);

      socket.emit("join", user.id);
    };

    const handleDisconnect = (reason) => {
      console.log("🔴 Customer socket disconnected:", reason);
    };

    const handleConnectError = (error) => {
      console.error("❌ Customer socket connection error:", error.message);
    };

    const handleUpdate = (request) => {
      console.log("🚨 Customer received service request update:", request);

      onRequestUpdate(request);
    };

    const handleNotification = (notification) => {
      console.log("🔔 Customer received notification:", notification);

      onNotification?.(notification);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("serviceRequestUpdated", handleUpdate);
    socket.on("notification", handleNotification);

    if (!socket.connected) {
      console.log("Connecting customer socket...");
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("serviceRequestUpdated", handleUpdate);
      socket.off("notification", handleNotification);
    };
  }, [onRequestUpdate]);
};

export default useCustomerSocket;
