import { useEffect, useState } from "react";

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

      const response = await fetch(
        `${API_URL}/admin/mechanics/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch pending mechanics"
        );
      }

      setMechanics(data.mechanics || []);
    } catch (error) {
      console.error("Fetch pending mechanics error:", error);
      setError(error.message);
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
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to verify mechanic"
        );
      }

      setSuccessMessage(data.message);

      setMechanics((current) =>
        current.filter(
          (mechanic) => mechanic._id !== mechanicId
        )
      );
    } catch (error) {
      console.error("Verify mechanic error:", error);
      setError(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and verify roadside mechanics
          </p>
        </div>

        <button
          type="button"
          onClick={fetchPendingMechanics}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
        >
          Refresh
        </button>
      </div>

      {successMessage && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <p className="text-gray-500">
            Loading pending mechanics...
          </p>
        </div>
      ) : mechanics.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            No Pending Mechanics
          </h2>

          <p className="text-gray-500 mt-2">
            There are no mechanics waiting for verification.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {mechanics.map((mechanic) => (
            <div
              key={mechanic._id}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {mechanic.businessName}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {mechanic.description}
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-gray-700">
                    <p>
                      <strong>Name:</strong>{" "}
                      {mechanic.user?.name || "N/A"}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {mechanic.user?.email || "N/A"}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {mechanic.user?.phone || "N/A"}
                    </p>

                    <p>
                      <strong>Experience:</strong>{" "}
                      {mechanic.experience || 0} years
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={actionLoading === mechanic._id}
                  onClick={() =>
                    verifyMechanic(mechanic._id)
                  }
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold"
                >
                  {actionLoading === mechanic._id
                    ? "Verifying..."
                    : "Verify Mechanic"}
                </button>
              </div>

              {mechanic.servicesOffered?.length > 0 && (
                <div className="mt-5 pt-5 border-t">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Services Offered
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {mechanic.servicesOffered.map((service) => (
                      <span
                        key={service._id}
                        className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                      >
                        {service.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;