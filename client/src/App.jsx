import { useEffect, useState } from "react";
import Register from "./pages/Register";
import MyVehicles from "./components/vehicle/MyVehicles";
import {
  Bell,
  X,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  UserRound,
} from "lucide-react";

import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import RoadsideMap from "./components/map/RoadsideMap";
import MechanicDashboard from "./pages/MechanicDashboard";
import CustomerRequests from "./pages/CustomerRequests";
import { socket } from "./services/socket";

function App() {
  const { isAuthenticated, user, logout } = useAuth();

  const [vehicles, setVehicles] = useState([]);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("veyra-theme") === "dark";
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("veyra-notifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("veyra-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    if (!socket.connected) {
      socket.connect();
    }

    const joinUserRoom = () => {
      console.log("🟢 App socket connected:", socket.id);
      console.log("Joining user room:", `user:${user.id}`);

      socket.emit("join", user.id);
    };

    const handleNotification = (notification) => {
      console.log("🔔 Notification received in App:", notification);

      setNotifications((current) => [notification, ...current]);
    };

    socket.on("connect", joinUserRoom);
    socket.on("notification", handleNotification);

    if (socket.connected) {
      joinUserRoom();
    }

    return () => {
      socket.off("connect", joinUserRoom);
      socket.off("notification", handleNotification);
    };
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    localStorage.setItem("veyra-notifications", JSON.stringify(notifications));
  }, [notifications]);

  if (!isAuthenticated) {
    const isRegisterPage = window.location.pathname === "/register";

    return isRegisterPage ? <Register /> : <Login />;
  }

  const roleLabel =
    user?.role === "admin"
      ? "Administrator"
      : user?.role === "mechanic"
        ? "Mechanic"
        : "Customer";

  return (
    <div className="min-h-screen bg-[var(--veyra-bg)] text-[var(--veyra-text)] transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-[var(--veyra-border)] bg-[var(--veyra-bg)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--veyra-lime)]">
              <span className="text-lg font-black text-[var(--veyra-forest)]">
                V
              </span>
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">VEYRA</h1>

              <p className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--veyra-muted)] sm:block">
                Roadside assistance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications((prev) => !prev)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--veyra-border)] transition hover:bg-[var(--veyra-card)]"
                aria-label="Notifications"
              >
                <Bell size={18} />

                {notifications.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--veyra-lime)] px-1 text-[10px] font-black text-[var(--veyra-ink)]">
                    {notifications.length > 9 ? "9+" : notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface)] shadow-xl">
                  <div className="flex items-center justify-between border-b border-[var(--veyra-border)] p-4">
                    <div>
                      <h3 className="font-black text-[var(--veyra-text)]">
                        Notifications
                      </h3>

                      <p className="text-xs text-[var(--veyra-muted)]">
                        {notifications.length} new
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--veyra-muted)] hover:bg-[var(--veyra-surface-soft)]"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Bell
                          size={24}
                          className="mx-auto text-[var(--veyra-muted)]"
                        />

                        <p className="mt-3 text-sm font-semibold text-[var(--veyra-text)]">
                          No notifications
                        </p>

                        <p className="mt-1 text-xs text-[var(--veyra-muted)]">
                          You're all caught up.
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="border-b border-[var(--veyra-border)] p-4 last:border-b-0 hover:bg-[var(--veyra-surface-soft)]"
                        >
                          <p className="text-sm font-black text-[var(--veyra-text)]">
                            {notification.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-[var(--veyra-text-secondary)]">
                            {notification.message}
                          </p>

                          <p className="mt-2 text-[10px] text-[var(--veyra-muted)]">
                            {notification.createdAt
                              ? new Date(
                                  notification.createdAt,
                                ).toLocaleString()
                              : "Just now"}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setNotifications([])}
                      className="w-full border-t border-[var(--veyra-border)] p-3 text-xs font-bold text-[var(--veyra-text-secondary)] hover:bg-[var(--veyra-surface-soft)]"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--veyra-border)] transition hover:bg-[var(--veyra-card)]"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden items-center gap-3 border-l border-[var(--veyra-border)] pl-4 sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--veyra-forest)] text-[var(--veyra-lime)]">
                <UserRound size={18} />
              </div>

              <div className="hidden lg:block">
                <p className="text-sm font-bold">{user?.name}</p>

                <p className="text-xs text-[var(--veyra-muted)]">{roleLabel}</p>
              </div>

              <ChevronDown size={16} className="text-[var(--veyra-muted)]" />
            </div>

            <button
              type="button"
              onClick={logout}
              className="group flex h-10 items-center gap-2 rounded-full border border-[var(--veyra-border)] px-3 text-sm font-semibold transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
            >
              <LogOut size={16} />

              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {user?.role === "user" && (
          <>
            <section className="mb-8">
              <div className="relative overflow-hidden rounded-[28px] bg-[var(--veyra-forest)] p-6 text-white sm:p-8 lg:p-10">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--veyra-lime)] opacity-20 blur-3xl" />

                <div className="relative max-w-2xl">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--veyra-lime)]">
                    Roadside assistance
                  </p>

                  <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                    Need help on the road?
                  </h2>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
                    Find a verified mechanic near you and get back on the road
                    without the hassle.
                  </p>
                </div>
              </div>
            </section>

            <RoadsideMap vehicles={vehicles} />

            <MyVehicles onVehiclesLoaded={setVehicles} />

            <div className="mt-8">
              <CustomerRequests />
            </div>
          </>
        )}

        {user?.role === "mechanic" && <MechanicDashboard />}

        {user?.role === "admin" && <AdminDashboard />}
      </main>
    </div>
  );
}

export default App;
