import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const statusLabels = {
  pending: "Pending",
  accepted: "Accepted",
  on_the_way: "On the Way",
  arrived: "Arrived",
  in_progress: "Service in Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  on_the_way: "bg-purple-100 text-purple-700",
  arrived: "bg-indigo-100 text-indigo-700",
  in_progress: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
  rejected: "bg-red-100 text-red-700",
};

const CustomerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login to view your requests.");
      }

      const response = await fetch(
        `${API_URL}/service-requests/my`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch service requests"
        );
      }

      console.log("Customer service requests:", data);

      setRequests(data.requests || []);
    } catch (error) {
      console.error("Customer requests error:", error);
      setError(
        error.message || "Unable to fetch service requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchRequests();

  const interval = setInterval(() => {
    fetchRequests();
  }, 5000);

  return () => clearInterval(interval);
}, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">
          Loading your requests...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            My Service Requests
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Track your roadside assistance requests
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRequests}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h3 className="font-semibold text-lg">
            No service requests yet
          </h3>

          <p className="text-gray-500 text-sm mt-2">
            Your roadside assistance requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {requests.map((request) => {
            const status =
              statusLabels[request.status] ||
              request.status;

            const statusClass =
              statusColors[request.status] ||
              "bg-gray-100 text-gray-700";

            return (
              <div
                key={request._id}
                className="bg-white rounded-2xl shadow p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">
                      {request.service?.name ||
                        "Roadside Assistance"}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Requested{" "}
                      {request.createdAt
                        ? new Date(
                            request.createdAt
                          ).toLocaleString()
                        : "Recently"}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusClass}`}
                  >
                    {status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">
                      Mechanic
                    </p>

                    <p className="font-semibold mt-1">
                      {request.mechanic?.businessName ||
                        "Mechanic"}
                    </p>

                    {request.mechanic?.experience !==
                      undefined && (
                      <p className="text-xs text-gray-500 mt-1">
                        {request.mechanic.experience} years
                        experience
                      </p>
                    )}
                  </div>
                    <div className="bg-gray-50 rounded-lg p-3">
  <p className="text-xs text-gray-500">
    Vehicle
  </p>

  {request.vehicle ? (
    <>
      <p className="font-semibold mt-1">
        {request.vehicle.make} {request.vehicle.model}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        {request.vehicle.registrationNumber}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {request.vehicle.vehicleType} •{" "}
        {request.vehicle.fuelType}
      </p>
    </>
  ) : (
    <p className="text-sm text-gray-500 mt-1">
      Vehicle not available
    </p>
  )}
</div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">
                      Estimated Price
                    </p>

                    <p className="font-semibold text-purple-600 mt-1">
                      ₹{request.estimatedPrice || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">
                      Estimated Duration
                    </p>

                    <p className="font-semibold mt-1">
                      {request.service?.estimatedDuration
                        ? `~${request.service.estimatedDuration} min`
                        : "Not available"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">
                      Request ID
                    </p>

                    <p className="font-mono text-xs mt-1 break-all">
                      {request._id}
                    </p>
                  </div>
                </div>

                {request.notes && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">
                      Notes
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      {request.notes}
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <p className="text-sm font-semibold mb-3">
                    Request Progress
                  </p>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {[
                      "pending",
                      "accepted",
                      "on_the_way",
                      "arrived",
                      "in_progress",
                      "completed",
                    ].map((step, index) => {
                      const steps = [
                        "pending",
                        "accepted",
                        "on_the_way",
                        "arrived",
                        "in_progress",
                        "completed",
                      ];

                      const currentIndex =
                        steps.indexOf(request.status);

                      const completed =
                        currentIndex >= index;

                      return (
                        <div
                          key={step}
                          className="flex items-center shrink-0"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              completed
                                ? "bg-purple-600 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {index + 1}
                          </div>

                          {index < steps.length - 1 && (
                            <div
                              className={`w-8 h-1 ${
                                currentIndex > index
                                  ? "bg-purple-600"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-4 text-xs text-gray-500 overflow-x-auto">
                    <span>Pending</span>
                    <span>Accepted</span>
                    <span>On Way</span>
                    <span>Arrived</span>
                    <span>In Progress</span>
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerRequests;
