import { useEffect, useState } from "react";
import { socket } from "../services/socket";

const API_URL = import.meta.env.VITE_API_URL;

const MechanicDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [requestFilter, setRequestFilter] = useState("all");
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesSaving, setServicesSaving] = useState(false);

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

  const fetchServices = async () => {
    try {
      setServicesLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch(`${API_URL}/services`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch services");
      }

      setAvailableServices(data.services || []);
    } catch (error) {
      console.error("Fetch services error:", error);
      setError(error.message || "Unable to load services.");
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchMechanicProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const response = await fetch(`${API_URL}/mechanics/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch mechanic profile",
      );
    }

    const serviceIds =
      data.mechanic?.servicesOffered?.map((service) =>
        String(service._id || service),
      ) || [];

    setSelectedServices(serviceIds);
  } catch (error) {
    console.error("Fetch mechanic profile error:", error);
  }
};

const saveMechanicServices = async () => {
  try {
    setServicesSaving(true);
    setSuccessMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login again.");
    }

    const response = await fetch(`${API_URL}/mechanics/services`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        services: selectedServices,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update services",
      );
    }

    setSuccessMessage("Services updated successfully.");
  } catch (error) {
    console.error("Save mechanic services error:", error);
    setError(error.message || "Unable to update services.");
  } finally {
    setServicesSaving(false);
  }
};

  useEffect(() => {
    fetchRequests();
    fetchServices();
    fetchMechanicProfile();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) {
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      socket.emit("join", user.id);
    };

    const handleNewRequest = (request) => {
      setRequests((prevRequests) => {
        const alreadyExists = prevRequests.some(
          (existingRequest) => existingRequest._id === request._id,
        );

        if (alreadyExists) {
          return prevRequests;
        }

        return [request, ...prevRequests];
      });
    };

    const handleRequestUpdate = (updatedRequest) => {
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === updatedRequest._id ? updatedRequest : request,
        ),
      );
    };

    socket.on("connect", handleConnect);
    socket.on("newServiceRequest", handleNewRequest);
    socket.on("serviceRequestUpdated", handleRequestUpdate);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newServiceRequest", handleNewRequest);
      socket.off("serviceRequestUpdated", handleRequestUpdate);
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    const updateMechanicLocation = async (position) => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No authentication token found.");
          return;
        }

        const { latitude, longitude } = position.coords;

        const response = await fetch(`${API_URL}/mechanics/location`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude,
            longitude,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update mechanic location");
        }

        console.log("📍 Mechanic location updated:", data.location);
      } catch (error) {
        console.error("Mechanic location update error:", error);
      }
    };

    const handleLocationError = (error) => {
      console.error("Mechanic location error:", error);
    };

    navigator.geolocation.getCurrentPosition(
      updateMechanicLocation,
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
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
        method: "PATCH",
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

  const statusFilters = [
    {
      value: "all",
      label: "All",
      count: requests.length,
    },
    {
      value: "pending",
      label: "Pending",
      count: requests.filter((request) => request.status === "pending").length,
    },
    {
      value: "accepted",
      label: "Accepted",
      count: requests.filter((request) => request.status === "accepted").length,
    },
    {
      value: "on_the_way",
      label: "On The Way",
      count: requests.filter((request) => request.status === "on_the_way")
        .length,
    },
    {
      value: "arrived",
      label: "Arrived",
      count: requests.filter((request) => request.status === "arrived").length,
    },
    {
      value: "in_progress",
      label: "In Progress",
      count: requests.filter((request) => request.status === "in_progress")
        .length,
    },
    {
      value: "completed",
      label: "Completed",
      count: requests.filter((request) => request.status === "completed")
        .length,
    },
    {
      value: "rejected",
      label: "Rejected",
      count: requests.filter((request) => request.status === "rejected").length,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      count: requests.filter((request) => request.status === "cancelled")
        .length,
    },
  ];

  const filteredRequests =
    requestFilter === "all"
      ? requests
      : requests.filter((request) => request.status === requestFilter);

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
    <div className="min-h-screen bg-[var(--veyra-bg)] text-[var(--veyra-text)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--veyra-muted)]">
              Roadside assistance
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[var(--veyra-text)] sm:text-3xl">
              Mechanic Dashboard
            </h1>

            <p className="mt-1 text-sm text-[var(--veyra-text-secondary)]">
              Manage and respond to roadside assistance requests.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchRequests}
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-[var(--veyra-lime)] px-5 text-sm font-black text-[var(--veyra-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Refreshing..." : "Refresh Requests"}
          </button>
        </div>

        {successMessage && (
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-400">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mb-7 rounded-[24px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-5 shadow-[var(--veyra-shadow-soft)] sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-[var(--veyra-text)]">
                Services You Provide
              </h2>

              <p className="mt-1 text-xs text-[var(--veyra-muted)]">
                Select the roadside assistance services you offer to customers.
              </p>
            </div>

            <span className="text-xs font-semibold text-[var(--veyra-muted)]">
              {selectedServices.length} selected
            </span>
          </div>

          {servicesLoading ? (
            <p className="mt-5 text-sm text-[var(--veyra-text-secondary)]">
              Loading services...
            </p>
          ) : availableServices.length === 0 ? (
            <p className="mt-5 text-sm text-[var(--veyra-muted)]">
              No services are currently available.
            </p>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {availableServices.map((service) => {
                const isSelected = selectedServices.includes(
                  String(service._id),
                );

                return (
                  <button
                    key={service._id}
                    type="button"
                    onClick={() => {
                      setSelectedServices((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== String(service._id))
                          : [...prev, String(service._id)],
                      );
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-[var(--veyra-lime)] bg-[var(--veyra-lime-soft)]"
                        : "border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] hover:border-[var(--veyra-border-strong)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-[var(--veyra-text)]">
                          {service.name}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[var(--veyra-muted)]">
                          {service.description}
                        </p>

                        <p className="mt-2 text-xs font-bold text-[var(--veyra-text-secondary)]">
                          ₹{service.basePrice} • {service.estimatedDuration} min
                        </p>
                      </div>

                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                          isSelected
                            ? "bg-[var(--veyra-lime)] text-[var(--veyra-ink)]"
                            : "border border-[var(--veyra-border)] text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={saveMechanicServices}
            disabled={false}
            className="mt-5 w-full rounded-xl bg-[var(--veyra-lime)] px-5 py-3 text-sm font-black text-[var(--veyra-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {servicesSaving ? "Saving..." : "Save Services"}
          </button>
        </div>

        {!loading && !error && requests.length > 0 && (
          <div className="mb-7 rounded-[24px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-4 shadow-[var(--veyra-shadow-soft)] sm:p-5">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-[var(--veyra-text)]">
                  Service Requests
                </h2>

                <p className="mt-1 text-xs text-[var(--veyra-muted)]">
                  Filter requests by their current status.
                </p>
              </div>

              <span className="text-xs font-semibold text-[var(--veyra-muted)]">
                {filteredRequests.length}{" "}
                {filteredRequests.length === 1 ? "request" : "requests"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <div className="flex min-w-max gap-2 pb-1">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setRequestFilter(filter.value)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition ${
                      requestFilter === filter.value
                        ? "bg-[var(--veyra-lime)] text-[var(--veyra-ink)]"
                        : "border border-[var(--veyra-border)] bg-[var(--veyra-surface)] text-[var(--veyra-text-secondary)] hover:bg-[var(--veyra-surface-soft)]"
                    }`}
                  >
                    <span>{filter.label}</span>

                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        requestFilter === filter.value
                          ? "bg-black/10"
                          : "bg-[var(--veyra-surface-soft)] text-[var(--veyra-muted)]"
                      }`}
                    >
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="rounded-[28px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-10 text-center shadow-[var(--veyra-shadow-soft)]">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[var(--veyra-border)] border-t-[var(--veyra-lime)]" />

            <p className="mt-4 text-sm font-semibold text-[var(--veyra-text-secondary)]">
              Loading service requests...
            </p>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[var(--veyra-border-strong)] bg-[var(--veyra-surface)] p-10 text-center shadow-[var(--veyra-shadow-soft)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--veyra-lime-soft)]">
              <span className="text-2xl">🔧</span>
            </div>

            <h2 className="mt-4 text-xl font-black text-[var(--veyra-text)]">
              No service requests
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--veyra-text-secondary)]">
              New roadside assistance requests from customers will appear here.
            </p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[var(--veyra-border-strong)] bg-[var(--veyra-surface)] p-10 text-center shadow-[var(--veyra-shadow-soft)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--veyra-surface-soft)]">
              <span className="text-2xl">📋</span>
            </div>

            <h2 className="mt-4 text-lg font-black text-[var(--veyra-text)]">
              No {requestFilter} requests
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--veyra-text-secondary)]">
              There are currently no requests in this category.
            </p>

            <button
              type="button"
              onClick={() => setRequestFilter("all")}
              className="mt-5 rounded-xl bg-[var(--veyra-lime)] px-4 py-2.5 text-xs font-black text-[var(--veyra-ink)] transition hover:opacity-90"
            >
              View All Requests
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredRequests.map((request) => (
              <div
                key={request._id}
                className="overflow-hidden rounded-[28px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] shadow-[var(--veyra-shadow-soft)] transition hover:border-[var(--veyra-border-strong)]"
              >
                <div className="border-b border-[var(--veyra-border)] p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--veyra-muted)]">
                        Service Request
                      </p>

                      <h2 className="mt-1 text-xl font-black text-[var(--veyra-text)]">
                        {request.service?.name || "Roadside Assistance"}
                      </h2>

                      <p className="mt-1 break-all text-xs text-[var(--veyra-muted)]">
                        Request ID: {request._id}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                        request.status,
                      )}`}
                    >
                      {formatStatus(request.status)}
                    </span>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                        Customer
                      </p>

                      <p className="mt-2 font-black text-[var(--veyra-text)]">
                        {request.customer?.name || "N/A"}
                      </p>

                      <p className="mt-1 text-sm text-[var(--veyra-text-secondary)]">
                        {request.customer?.phone || "Phone unavailable"}
                      </p>

                      {request.customer?.phone && (
                        <a
                          href={`tel:${request.customer.phone}`}
                          className="mt-3 inline-flex rounded-xl bg-[var(--veyra-lime)] px-3 py-2 text-xs font-black text-[var(--veyra-ink)] transition hover:opacity-90"
                        >
                          Call Customer
                        </a>
                      )}
                    </div>

                    <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                        Service
                      </p>

                      <p className="mt-2 font-black text-[var(--veyra-text)]">
                        {request.service?.name || "N/A"}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                            Price
                          </p>

                          <p className="mt-1 text-sm font-black text-[var(--veyra-text)]">
                            ₹{request.estimatedPrice || 0}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                            Duration
                          </p>

                          <p className="mt-1 text-sm font-black text-[var(--veyra-text)]">
                            {request.service?.estimatedDuration || 0} min
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                        Vehicle
                      </p>

                      {request.vehicle ? (
                        <>
                          <p className="mt-2 font-black text-[var(--veyra-text)]">
                            {request.vehicle.make} {request.vehicle.model}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[var(--veyra-text-secondary)]">
                            {request.vehicle.registrationNumber}
                          </p>

                          <p className="mt-1 text-xs capitalize text-[var(--veyra-muted)]">
                            {request.vehicle.vehicleType} •{" "}
                            {request.vehicle.fuelType}
                            {request.vehicle.color
                              ? ` • ${request.vehicle.color}`
                              : ""}
                          </p>
                        </>
                      ) : (
                        <p className="mt-2 text-sm text-[var(--veyra-text-secondary)]">
                          Vehicle information unavailable
                        </p>
                      )}
                    </div>

                    <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                        Pickup Location
                      </p>

                      {request.pickupLocation?.coordinates ? (
                        <>
                          <p className="mt-2 text-sm text-[var(--veyra-text-secondary)]">
                            Latitude: {request.pickupLocation.coordinates[1]}
                          </p>

                          <p className="mt-1 text-sm text-[var(--veyra-text-secondary)]">
                            Longitude: {request.pickupLocation.coordinates[0]}
                          </p>
                        </>
                      ) : (
                        <p className="mt-2 text-sm text-[var(--veyra-muted)]">
                          Location unavailable
                        </p>
                      )}
                    </div>
                  </div>

                  {request.notes && (
                    <div className="mt-4 rounded-2xl border border-[var(--veyra-border)] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                        Customer Notes
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[var(--veyra-text-secondary)]">
                        {request.notes}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex flex-col gap-1 border-t border-[var(--veyra-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-[var(--veyra-muted)]">
                      Requested on{" "}
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleString()
                        : "Recently"}
                    </p>

                    <p className="text-xs font-semibold text-[var(--veyra-muted)]">
                      {formatStatus(request.status)}
                    </p>
                  </div>

                  {renderActions(request)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicDashboard;
