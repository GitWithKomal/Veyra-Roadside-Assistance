import { useEffect } from "react";
import { socket } from "../services/socket";

const useCustomerSocket = (onRequestUpdate, onNotification) => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) {
      return;
    }

    const handleConnect = () => {
      socket.emit("join", user.id);
    };

    const handleDisconnect = (reason) => {};

    const handleConnectError = (error) => {
      console.error("❌ Customer socket connection error:", error.message);
    };

    const handleUpdate = (request) => {
      onRequestUpdate(request);
    };

    const handleNotification = (notification) => {
      onNotification?.(notification);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("serviceRequestUpdated", handleUpdate);
    socket.on("notification", handleNotification);

    if (!socket.connected) {
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
