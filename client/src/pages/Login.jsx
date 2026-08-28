import { useState } from "react";
import Register from "./Register";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Moon,
  Sun,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("veyra-theme") === "dark";
  });

  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current;

      document.documentElement.classList.toggle("dark", next);

      localStorage.setItem("veyra-theme", next ? "dark" : "light");

      return next;
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      await login(formData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (registrationStep === "register") {
    return <Register onBackToLogin={() => setRegistrationStep(null)} />;
  }

  return (
    <div className="min-h-screen bg-[var(--veyra-bg)] text-[var(--veyra-text)] transition-colors duration-300">
      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--veyra-lime)]">
            <span className="text-lg font-black text-[var(--veyra-ink)]">
              V
            </span>
          </div>

          <div>
            <p className="text-lg font-black tracking-tight">VEYRA</p>

            <p className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--veyra-muted)] sm:block">
              Roadside assistance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--veyra-border)] bg-[var(--veyra-surface)] transition hover:border-[var(--veyra-border-strong)]"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main className="flex min-h-[calc(100vh-88px)] items-center justify-center px-4 pb-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] shadow-[var(--veyra-shadow)] lg:grid-cols-2">
          <section className="relative hidden overflow-hidden bg-[var(--veyra-ink)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[var(--veyra-lime)] opacity-15 blur-3xl" />

            <div className="relative">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--veyra-lime)]">
                <Wrench size={22} className="text-[var(--veyra-ink)]" />
              </div>

              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--veyra-lime)]">
                Roadside assistance
              </p>

              <h2 className="max-w-md text-4xl font-black leading-[1.05] tracking-tight">
                Help when you need it.
                <span className="text-[var(--veyra-lime)]">
                  {" "}
                  Right when you need it.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-6 text-white/60">
                Connect with verified mechanics nearby, request roadside
                assistance and get back on the road with confidence.
              </p>
            </div>

            <div className="relative mt-12 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold">Verified mechanics</p>

                  <p className="text-xs text-white/50">
                    Trusted roadside professionals
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Wrench size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold">Real-time assistance</p>

                  <p className="text-xs text-white/50">
                    Track your service request
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center p-6 sm:p-10 lg:p-12">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--veyra-muted)]">
                  Welcome back
                </p>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Sign in to Veyra
                </h1>

                <p className="mt-3 text-sm leading-6 text-[var(--veyra-text-secondary)]">
                  Access your roadside assistance dashboard.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 py-3.5 text-sm outline-none transition placeholder:text-[var(--veyra-muted)] focus:border-[var(--veyra-ink)] focus:ring-2 focus:ring-[var(--veyra-lime)]/30 dark:focus:border-[var(--veyra-lime)]"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-semibold">
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-[var(--veyra-muted)] focus:border-[var(--veyra-ink)] focus:ring-2 focus:ring-[var(--veyra-lime)]/30 dark:focus:border-[var(--veyra-lime)]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[var(--veyra-muted)] transition hover:text-[var(--veyra-text)]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--veyra-ink)] px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[var(--veyra-lime)] dark:text-[var(--veyra-ink)]"
                >
                  {loading ? "Signing in..." : "Continue"}

                  {!loading && (
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-[var(--veyra-border)]" />
                <span className="text-xs text-[var(--veyra-muted)]">
                  New to Veyra?
                </span>
                <div className="h-px flex-1 bg-[var(--veyra-border)]" />
              </div>

              <button
                type="button"
                onClick={() => setRegistrationStep("register")}
                className="w-full rounded-2xl border border-[var(--veyra-border)] px-5 py-3.5 text-sm font-bold transition hover:border-[var(--veyra-border-strong)] hover:bg-[var(--veyra-surface-soft)]"
              >
                Create an account
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Login;
