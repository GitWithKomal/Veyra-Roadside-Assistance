import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  CarFront,
  Wrench,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = ({ onBackToLogin }) => {
  const { register } = useAuth();

  const [selectedRole, setSelectedRole] = useState("user");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,

        role: selectedRole,
      });

      window.location.href = "/";
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--veyra-bg)] px-4 py-8 text-[var(--veyra-text)] sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center">
        <div className="w-full">
          <button
            type="button"
            onClick={onBackToLogin}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-[var(--veyra-text-secondary)] transition hover:text-[var(--veyra-text)]"
          >
            <ArrowLeft size={17} />
            Back to login
          </button>

          <div className="rounded-[28px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-6 shadow-[var(--veyra-shadow)] sm:p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--veyra-lime)]">
              {selectedRole === "mechanic" ? (
                <Wrench size={22} className="text-[#151714]" />
              ) : (
                <CarFront size={22} className="text-[#151714]" />
              )}
            </div>

            <div className="mb-7">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--veyra-muted)]">
                Welcome to Veyra
              </p>

              <h1 className="text-3xl font-black tracking-tight">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-[var(--veyra-text-secondary)]">
                {selectedRole === "mechanic"
                  ? "Create your mechanic account and start helping customers."
                  : "Create your customer account and get roadside assistance whenever you need it."}
              </p>
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-bold">
                I want to register as
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange("user")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedRole === "user"
                      ? "border-[var(--veyra-lime)] bg-[var(--veyra-lime-soft)]"
                      : "border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] hover:border-[var(--veyra-border-strong)]"
                  }`}
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
                      selectedRole === "user"
                        ? "bg-[var(--veyra-lime)]"
                        : "bg-[var(--veyra-card)]"
                    }`}
                  >
                    <UserRound size={19} />
                  </div>

                  <p className="text-sm font-black">Customer</p>

                  <p className="mt-1 text-xs leading-5 text-[var(--veyra-muted)]">
                    Get roadside assistance
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange("mechanic")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedRole === "mechanic"
                      ? "border-[var(--veyra-lime)] bg-[var(--veyra-lime-soft)]"
                      : "border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] hover:border-[var(--veyra-border-strong)]"
                  }`}
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
                      selectedRole === "mechanic"
                        ? "bg-[var(--veyra-lime)]"
                        : "bg-[var(--veyra-card)]"
                    }`}
                  >
                    <Wrench size={19} />
                  </div>

                  <p className="text-sm font-black">Mechanic</p>

                  <p className="mt-1 text-xs leading-5 text-[var(--veyra-muted)]">
                    Provide roadside assistance
                  </p>
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Full name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 py-3.5 text-sm outline-none transition placeholder:text-[var(--veyra-muted)] focus:border-[var(--veyra-lime)] focus:ring-2 focus:ring-[var(--veyra-lime)]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Email address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 py-3.5 text-sm outline-none transition placeholder:text-[var(--veyra-muted)] focus:border-[var(--veyra-lime)] focus:ring-2 focus:ring-[var(--veyra-lime)]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Phone number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 py-3.5 text-sm outline-none transition placeholder:text-[var(--veyra-muted)] focus:border-[var(--veyra-lime)] focus:ring-2 focus:ring-[var(--veyra-lime)]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">Password</label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-[var(--veyra-muted)] focus:border-[var(--veyra-lime)] focus:ring-2 focus:ring-[var(--veyra-lime)]/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--veyra-muted)] hover:text-[var(--veyra-text)]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    required
                    className="w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-[var(--veyra-muted)] focus:border-[var(--veyra-lime)] focus:ring-2 focus:ring-[var(--veyra-lime)]/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--veyra-muted)] hover:text-[var(--veyra-text)]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-2xl bg-[var(--veyra-lime)] px-5 py-3.5 text-sm font-black text-[#151714] transition hover:bg-[var(--veyra-lime-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating account..."
                  : selectedRole === "mechanic"
                    ? "Create mechanic account"
                    : "Create customer account"}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[var(--veyra-border)]" />

              <span className="text-xs text-[var(--veyra-muted)]">
                Already have an account?
              </span>

              <div className="h-px flex-1 bg-[var(--veyra-border)]" />
            </div>

            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full rounded-2xl border border-[var(--veyra-border)] px-5 py-3.5 text-sm font-bold transition hover:border-[var(--veyra-border-strong)] hover:bg-[var(--veyra-surface-soft)]"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

