import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Users,
  Wrench,
  RefreshCw,
  CheckCircle2,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingMechanics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(`${API_URL}/admin/mechanics/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch pending mechanics");
      }

      setMechanics(data.mechanics || []);
    } catch (error) {
      console.error("Fetch pending mechanics error:", error);
      setError(error.message || "Unable to fetch mechanics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingMechanics();
  }, []);

  const verifyMechanic = async (mechanicId) => {
    try {
      setActionLoading(mechanicId);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/admin/mechanics/${mechanicId}/verify`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify mechanic");
      }

      setSuccessMessage(data.message || "Mechanic verified successfully.");

      setMechanics((current) =>
        current.filter((mechanic) => mechanic._id !== mechanicId),
      );
    } catch (error) {
      console.error("Verify mechanic error:", error);
      setError(error.message || "Unable to verify mechanic.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--veyra-bg)] text-[var(--veyra-text)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--veyra-muted)]">
              Platform administration
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[var(--veyra-text)] sm:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-[var(--veyra-text-secondary)]">
              Manage and verify mechanics before they serve Veyra customers.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPendingMechanics}
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--veyra-lime)] px-5 text-sm font-black text-[var(--veyra-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />

            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-5 shadow-[var(--veyra-shadow-soft)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--veyra-lime-soft)]">
                <Wrench size={20} className="text-[var(--veyra-forest)]" />
              </div>

              <span className="text-xs font-bold text-[var(--veyra-muted)]">
                CURRENT
              </span>
            </div>

            <p className="mt-5 text-3xl font-black">{mechanics.length}</p>

            <p className="mt-1 text-sm font-semibold text-[var(--veyra-text-secondary)]">
              Pending mechanics
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-5 shadow-[var(--veyra-shadow-soft)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950/30">
                <Users size={20} className="text-blue-600 dark:text-blue-400" />
              </div>

              <span className="text-xs font-bold text-[var(--veyra-muted)]">
                ROLE
              </span>
            </div>

            <p className="mt-5 text-3xl font-black">Mechanic</p>

            <p className="mt-1 text-sm font-semibold text-[var(--veyra-text-secondary)]">
              Verification queue
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-5 shadow-[var(--veyra-shadow-soft)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-950/30">
                <ShieldCheck
                  size={20}
                  className="text-green-600 dark:text-green-400"
                />
              </div>

              <span className="text-xs font-bold text-[var(--veyra-muted)]">
                ACTION
              </span>
            </div>

            <p className="mt-5 text-3xl font-black">Verify</p>

            <p className="mt-1 text-sm font-semibold text-[var(--veyra-text-secondary)]">
              Review mechanic profiles
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-400">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mb-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-black text-[var(--veyra-text)]">
                Mechanic Verification
              </h2>

              <p className="mt-1 text-sm text-[var(--veyra-muted)]">
                Review mechanics waiting for approval.
              </p>
            </div>

            {!loading && (
              <span className="hidden rounded-full bg-[var(--veyra-surface-soft)] px-3 py-1.5 text-xs font-bold text-[var(--veyra-muted)] sm:block">
                {mechanics.length} pending
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-12 text-center shadow-[var(--veyra-shadow-soft)]">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[var(--veyra-border)] border-t-[var(--veyra-lime)]" />

            <p className="mt-4 text-sm font-semibold text-[var(--veyra-text-secondary)]">
              Loading pending mechanics...
            </p>
          </div>
        ) : mechanics.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[var(--veyra-border-strong)] bg-[var(--veyra-surface)] p-12 text-center shadow-[var(--veyra-shadow-soft)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--veyra-lime-soft)]">
              <ShieldCheck size={26} className="text-[var(--veyra-forest)]" />
            </div>

            <h2 className="mt-4 text-xl font-black">All caught up</h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--veyra-text-secondary)]">
              There are currently no mechanics waiting for verification.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {mechanics.map((mechanic) => (
              <div
                key={mechanic._id}
                className="overflow-hidden rounded-[28px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] shadow-[var(--veyra-shadow-soft)] transition hover:border-[var(--veyra-border-strong)]"
              >
                <div className="border-b border-[var(--veyra-border)] p-5 sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--veyra-lime)]">
                          <Wrench
                            size={19}
                            className="text-[var(--veyra-forest)]"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-xl font-black">
                            {mechanic.businessName || "Unnamed Business"}
                          </h3>

                          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--veyra-muted)]">
                            Pending verification
                          </p>
                        </div>
                      </div>

                      {mechanic.description && (
                        <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--veyra-text-secondary)]">
                          {mechanic.description}
                        </p>
                      )}
                    </div>

                    <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400">
                      Pending
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                        Mechanic
                      </p>

                      <p className="mt-3 font-black">
                        {mechanic.user?.name || "N/A"}
                      </p>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-[var(--veyra-text-secondary)]">
                          <Mail size={15} />
                          <span className="break-all">
                            {mechanic.user?.email || "Email unavailable"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-[var(--veyra-text-secondary)]">
                          <Phone size={15} />
                          <span>
                            {mechanic.user?.phone || "Phone unavailable"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                        Experience
                      </p>

                      <div className="mt-3 flex items-center gap-3">
                        <Briefcase
                          size={20}
                          className="text-[var(--veyra-forest)] dark:text-[var(--veyra-lime)]"
                        />

                        <div>
                          <p className="text-xl font-black">
                            {mechanic.experience || 0} years
                          </p>

                          <p className="text-xs text-[var(--veyra-muted)]">
                            Professional experience
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {mechanic.servicesOffered?.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-[var(--veyra-border)] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                        Services Offered
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {mechanic.servicesOffered.map((service) => (
                          <span
                            key={service._id}
                            className="rounded-full bg-[var(--veyra-lime-soft)] px-3 py-1.5 text-xs font-bold text-[var(--veyra-forest)]"
                          >
                            {service.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex justify-end border-t border-[var(--veyra-border)] pt-5">
                    <button
                      type="button"
                      disabled={actionLoading === mechanic._id}
                      onClick={() => verifyMechanic(mechanic._id)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--veyra-lime)] px-6 py-3 text-sm font-black text-[var(--veyra-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      <ShieldCheck size={17} />

                      {actionLoading === mechanic._id
                        ? "Verifying..."
                        : "Verify Mechanic"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

