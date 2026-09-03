import { useEffect, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import useCustomerSocket from "../hooks/useCustomerSocket";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleNotification = (notification) => {
    setNotifications((current) => [
      notification,
      ...current,
    ]);
  };

  // We don't need request updates here,
  // but the hook expects the first callback.
  const handleRequestUpdate = () => {};

  useCustomerSocket(
    handleRequestUpdate,
    handleNotification
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* BELL BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--veyra-border)] bg-[var(--veyra-surface)] transition hover:border-[var(--veyra-border-strong)]"
        aria-label="Notifications"
      >
        <Bell size={18} />

        {/* UNREAD BADGE */}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--veyra-lime)] px-1 text-[10px] font-black text-[var(--veyra-ink)]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-80 overflow-hidden rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface)] shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--veyra-border)] px-4 py-3">
            <div>
              <h3 className="text-sm font-black">
                Notifications
              </h3>

              {unreadCount > 0 && (
                <p className="mt-0.5 text-xs text-[var(--veyra-muted)]">
                  {unreadCount} unread
                </p>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="rounded-lg p-2 text-[var(--veyra-muted)] transition hover:bg-[var(--veyra-surface-soft)] hover:text-[var(--veyra-text)]"
                  title="Mark all as read"
                >
                  <Check size={15} />
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="rounded-lg p-2 text-[var(--veyra-muted)] transition hover:bg-[var(--veyra-surface-soft)] hover:text-[var(--veyra-text)]"
                  title="Clear notifications"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Bell
                  size={24}
                  className="mx-auto mb-3 text-[var(--veyra-muted)]"
                />

                <p className="text-sm font-semibold">
                  No notifications
                </p>

                <p className="mt-1 text-xs text-[var(--veyra-muted)]">
                  You'll see updates about your roadside requests here.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    setNotifications((current) =>
                      current.map((item) =>
                        item.id === notification.id
                          ? { ...item, read: true }
                          : item
                      )
                    );
                  }}
                  className={`cursor-pointer border-b border-[var(--veyra-border)] px-4 py-4 transition hover:bg-[var(--veyra-surface-soft)] ${
                    !notification.read
                      ? "bg-[var(--veyra-lime-soft)]"
                      : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--veyra-lime)]" />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">
                        {notification.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[var(--veyra-text-secondary)]">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-[10px] text-[var(--veyra-muted)]">
                        {new Date(
                          notification.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;


