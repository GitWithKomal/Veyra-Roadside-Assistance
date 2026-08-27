import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const MechanicDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(`${API_URL}/service-requests/mechanic`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch service requests");
      }

      setRequests(data.requests || []);
    } catch (error) {
      console.error("Fetch mechanic requests error:", error);
      setError(error.message || "Unable to fetch requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRequestStatus = async (requestId, action, status = null) => {
    try {
      setActionLoading(requestId);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      let url;
      let body = undefined;

      if (action === "accept") {
        url = `${API_URL}/service-requests/${requestId}/accept`;
      } else if (action === "reject") {
        url = `${API_URL}/service-requests/${requestId}/reject`;
      } else {
        url = `${API_URL}/service-requests/${requestId}/status`;

        body = JSON.stringify({
          status,
        });
      }

      const response = await fetch(url, {
        method: action === "status" ? "PATCH" : "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        ...(body && { body }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update request");
      }

      console.log("Request updated:", data);

      setSuccessMessage(data.message);

      await fetchRequests();
    } catch (error) {
      console.error("Request action error:", error);

      setError(error.message || "Unable to update service request.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "accepted":
        return "bg-blue-100 text-blue-700";

      case "on_the_way":
        return "bg-purple-100 text-purple-700";

      case "arrived":
        return "bg-indigo-100 text-indigo-700";

      case "in_progress":
        return "bg-orange-100 text-orange-700";

      case "completed":
        return "bg-green-100 text-green-700";

      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => {
    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const renderActions = (request) => {
    const { _id, status } = request;

    if (actionLoading === _id) {
      return <p className="text-sm text-gray-500 mt-4">Updating request...</p>;
    }

    if (status === "pending") {
      return (
        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={() => updateRequestStatus(_id, "accept")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Accept Request
          </button>

          <button
            type="button"
            onClick={() => updateRequestStatus(_id, "reject")}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Reject
          </button>
        </div>
      );
    }

    if (status === "accepted") {
      return (
        <button
          type="button"
          onClick={() => updateRequestStatus(_id, "status", "on_the_way")}
          className="w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Start Journey
        </button>
      );
    }

    if (status === "on_the_way") {
      return (
        <button
          type="button"
          onClick={() => updateRequestStatus(_id, "status", "arrived")}
          className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Mark Arrived
        </button>
      );
    }

    if (status === "arrived") {
      return (
        <button
          type="button"
          onClick={() => updateRequestStatus(_id, "status", "in_progress")}
          className="w-full mt-5 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Start Service
        </button>
      );
    }

    if (status === "in_progress") {
      return (
        <button
          type="button"
          onClick={() => updateRequestStatus(_id, "status", "completed")}
          className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Complete Service
        </button>
      );
    }

    if (status === "completed") {
      return (
        <div className="mt-5 bg-green-50 text-green-700 rounded-lg p-3 text-center font-medium">
          Service Completed
        </div>
      );
    }

    if (status === "rejected") {
      return (
        <div className="mt-5 bg-red-50 text-red-700 rounded-lg p-3 text-center font-medium">
          Request Rejected
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mechanic Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your roadside assistance requests
            </p>
          </div>

          <button
            type="button"
            onClick={fetchRequests}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
          >
            Refresh Requests
          </button>
        </div>

        {/* Success */}
        {successMessage && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
            {successMessage}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-500">Loading service requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              No service requests
            </h2>

            <p className="text-gray-500 mt-2">
              New roadside assistance requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {request.service?.name || "Roadside Assistance"}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Request ID: {request._id}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                      request.status,
                    )}`}
                  >
                    {formatStatus(request.status)}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Customer */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Customer
                    </h3>

                    <p className="text-sm text-gray-700">
                      <strong>Name:</strong> {request.customer?.name || "N/A"}
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Phone:</strong> {request.customer?.phone || "N/A"}
                    </p>
                  </div>

                  {/* Service */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Service
                    </h3>

                    <p className="text-sm text-gray-700">
                      <strong>Service:</strong> {request.service?.name || "N/A"}
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Price:</strong> ₹{request.estimatedPrice || 0}
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Duration:</strong>{" "}
                      {request.service?.estimatedDuration || 0} minutes
                    </p>
                  </div>

                  {/* Vehicle */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Vehicle
                    </h3>

                    {request.vehicle ? (
                      <>
                        <p className="text-sm text-gray-700">
                          <strong>Vehicle:</strong> {request.vehicle.make}{" "}
                          {request.vehicle.model}
                        </p>

                        <p className="text-sm text-gray-700 mt-1">
                          <strong>Registration:</strong>{" "}
                          {request.vehicle.registrationNumber}
                        </p>

                        <p className="text-sm text-gray-700 mt-1">
                          <strong>Type:</strong> {request.vehicle.vehicleType}
                        </p>

                        <p className="text-sm text-gray-700 mt-1">
                          <strong>Fuel:</strong> {request.vehicle.fuelType}
                        </p>

                        {request.vehicle.color && (
                          <p className="text-sm text-gray-700 mt-1">
                            <strong>Color:</strong> {request.vehicle.color}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Vehicle information not available
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {request.notes && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800">
                      Customer Notes
                    </h3>

                    <p className="text-sm text-gray-600 mt-1">
                      {request.notes}
                    </p>
                  </div>
                )}

                {/* Pickup */}
                {request.pickupLocation?.coordinates && (
                  <div className="mt-4 bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800">
                      Pickup Location
                    </h3>

                    <p className="text-sm text-gray-600 mt-1">
                      Latitude: {request.pickupLocation.coordinates[1]}
                    </p>

                    <p className="text-sm text-gray-600">
                      Longitude: {request.pickupLocation.coordinates[0]}
                    </p>
                  </div>
                )}

                {/* Time */}
                <p className="text-xs text-gray-400 mt-5">
                  Requested on {new Date(request.createdAt).toLocaleString()}
                </p>

                {/* Actions */}
                {renderActions(request)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicDashboard;
