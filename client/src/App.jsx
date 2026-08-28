import { useEffect, useState } from "react";
import Register from "./pages/Register";
import MyVehicles from "./components/vehicle/MyVehicles";
import { Bell, ChevronDown, LogOut, Moon, Sun, UserRound } from "lucide-react";

import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import RoadsideMap from "./components/map/RoadsideMap";
import MechanicDashboard from "./pages/MechanicDashboard";
import CustomerRequests from "./pages/CustomerRequests";

function App() {
  const { isAuthenticated, user, logout } = useAuth();

  const [vehicles, setVehicles] = useState([]);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("veyra-theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("veyra-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

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
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[var(--veyra-border)] bg-[var(--veyra-bg)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* BRAND */}
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

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* NOTIFICATION */}
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--veyra-border)] transition hover:bg-[var(--veyra-card)]"
              aria-label="Notifications"
            >
              <Bell size={18} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--veyra-lime)]" />
            </button>

            {/* THEME */}
            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--veyra-border)] transition hover:bg-[var(--veyra-card)]"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* PROFILE */}
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

            {/* LOGOUT */}
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

      {/* MAIN */}
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* CUSTOMER */}
        {user?.role === "user" && (
          <>
            <section className="mb-8">
              <div className="relative overflow-hidden rounded-[28px] bg-[var(--veyra-forest)] p-6 text-white sm:p-8 lg:p-10">
                {/* Decorative glow */}
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

        {/* MECHANIC */}
        {user?.role === "mechanic" && <MechanicDashboard />}

        {/* ADMIN */}
        {user?.role === "admin" && <AdminDashboard />}
      </main>
    </div>
  );
}

export default App;
