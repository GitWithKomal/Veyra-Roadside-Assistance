import { useEffect, useState } from "react";
import { Car, Plus, X, Fuel, CalendarDays, Palette } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { addVehicle, getMyVehicles } from "../../services/vehicleService";

const MyVehicles = ({ onVehiclesLoaded }) => {
  const { token } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    registrationNumber: "",
    make: "",
    model: "",
    year: "",
    vehicleType: "car",
    fuelType: "petrol",
    color: "",
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyVehicles(token);

      const loadedVehicles = data.vehicles || [];

      setVehicles(loadedVehicles);

      onVehiclesLoaded?.(loadedVehicles);
    } catch (error) {
      setError(error.message || "Unable to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchVehicles();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await addVehicle(formData, token);

      setFormData({
        registrationNumber: "",
        make: "",
        model: "",
        year: "",
        vehicleType: "car",
        fuelType: "petrol",
        color: "",
      });

      setShowForm(false);

      await fetchVehicles();
    } catch (error) {
      setError(error.message || "Unable to add vehicle");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-8">
      {/* HEADER */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--veyra-muted)]">
            Your garage
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight">
            My Vehicles
          </h2>

          <p className="mt-1 text-sm text-[var(--veyra-text-secondary)]">
            Keep your vehicles ready for roadside assistance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-2xl bg-[var(--veyra-lime)] px-4 py-3 text-sm font-black text-[#151714] transition hover:bg-[var(--veyra-lime-hover)]"
        >
          <Plus size={17} />
          <span className="hidden sm:inline">Add vehicle</span>
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="rounded-[24px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-8 text-center">
          <p className="text-sm text-[var(--veyra-muted)]">
            Loading your vehicles...
          </p>
        </div>
      ) : vehicles.length === 0 ? (
        /* EMPTY STATE */
        <div className="rounded-[28px] border border-dashed border-[var(--veyra-border-strong)] bg-[var(--veyra-surface)] p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--veyra-lime-soft)]">
            <Car size={25} />
          </div>

          <h3 className="text-lg font-black">No vehicles added yet</h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--veyra-text-secondary)]">
            Add your vehicle once and we'll make it easier to request roadside
            assistance.
          </p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-5 rounded-2xl bg-[var(--veyra-ink)] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 dark:bg-[var(--veyra-lime)] dark:text-[#151714]"
          >
            Add your first vehicle
          </button>
        </div>
      ) : (
        /* VEHICLE CARDS */
        <div className="grid gap-4 md:grid-cols-2">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="group rounded-[26px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-5 shadow-[var(--veyra-shadow-soft)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--veyra-shadow)]"
            >
              {/* TOP */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--veyra-lime-soft)]">
                    <Car size={22} />
                  </div>

                  <div>
                    <h3 className="font-black">
                      {vehicle.make} {vehicle.model}
                    </h3>

                    <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                      {vehicle.vehicleType}
                    </p>
                  </div>
                </div>

                <span className="rounded-xl bg-[var(--veyra-surface-soft)] px-3 py-2 text-xs font-black tracking-wide">
                  {vehicle.registrationNumber}
                </span>
              </div>

              {/* DETAILS */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-3">
                  <CalendarDays
                    size={15}
                    className="mb-2 text-[var(--veyra-muted)]"
                  />

                  <p className="text-[10px] font-bold uppercase text-[var(--veyra-muted)]">
                    Year
                  </p>

                  <p className="mt-1 text-sm font-bold">{vehicle.year}</p>
                </div>

                <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-3">
                  <Fuel size={15} className="mb-2 text-[var(--veyra-muted)]" />

                  <p className="text-[10px] font-bold uppercase text-[var(--veyra-muted)]">
                    Fuel
                  </p>

                  <p className="mt-1 text-sm font-bold capitalize">
                    {vehicle.fuelType}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-3">
                  <Palette
                    size={15}
                    className="mb-2 text-[var(--veyra-muted)]"
                  />

                  <p className="text-[10px] font-bold uppercase text-[var(--veyra-muted)]">
                    Color
                  </p>

                  <p className="mt-1 truncate text-sm font-bold">
                    {vehicle.color || "—"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-6 shadow-2xl sm:p-8">
            {/* MODAL HEADER */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--veyra-muted)]">
                  Your garage
                </p>

                <h2 className="mt-1 text-2xl font-black">Add a vehicle</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--veyra-border)] transition hover:bg-[var(--veyra-surface-soft)]"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* REGISTRATION */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Registration number
                </label>

                <input
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="MH 31 AB 1234"
                  required
                  className="w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 py-3.5 text-sm uppercase outline-none transition focus:border-[var(--veyra-lime)] focus:ring-2 focus:ring-[var(--veyra-lime)]/20"
                />
              </div>

              {/* MAKE + MODEL */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">Make</label>

                  <input
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    placeholder="Hyundai"
                    required
                    className="w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 py-3.5 text-sm outline-none focus:border-[var(--veyra-lime)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">Model</label>

                  <input
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Creta"
                    required
                    className="w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 py-3.5 text-sm outline-none focus:border-[var(--veyra-lime)]"
                  />
                </div>
              </div>

              {/* YEAR */}
              <div>
                <label className="mb-2 block text-sm font-bold">Year</label>

                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="2022"
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                  className="w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 py-3.5 text-sm outline-none focus:border-[var(--veyra-lime)]"
                />
              </div>

              {/* VEHICLE TYPE */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Vehicle type
                </label>

                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 py-3.5 text-sm outline-none focus:border-[var(--veyra-lime)]"
                >
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="truck">Truck</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* FUEL */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Fuel type
                </label>

                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 py-3.5 text-sm outline-none focus:border-[var(--veyra-lime)]"
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="cng">CNG</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* COLOR */}
              <div>
                <label className="mb-2 block text-sm font-bold">Color</label>

                <input
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Black"
                  className="w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 py-3.5 text-sm outline-none focus:border-[var(--veyra-lime)]"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-2xl border border-[var(--veyra-border)] px-5 py-3.5 text-sm font-bold transition hover:bg-[var(--veyra-surface-soft)]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-[var(--veyra-lime)] px-5 py-3.5 text-sm font-black text-[#151714] transition hover:bg-[var(--veyra-lime-hover)] disabled:opacity-50"
                >
                  {saving ? "Adding..." : "Add vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyVehicles;
