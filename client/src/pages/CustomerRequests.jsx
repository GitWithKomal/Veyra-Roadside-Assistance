import { useEffect, useState, useCallback } from "react";
import {
  RefreshCw,
  Clock3,
  CheckCircle2,
  Navigation,
  MapPin,
  Wrench,
  XCircle,
  Car,
  Phone,
} from "lucide-react";

import useCustomerSocket from "../hooks/useCustomerSocket";
import NotificationToast from "../components/notifications/NotificationToast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

const steps = [
  "pending",
  "accepted",
  "on_the_way",
  "arrived",
  "in_progress",
  "completed",
];

const CustomerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);

  const [ratingRequest, setRatingRequest] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingMessage, setRatingMessage] = useState("");
  const [requestFilter, setRequestFilter] = useState("all");
  const [notification, setNotification] = useState(null);

  const handleRequestUpdate = useCallback((updatedRequest) => {
setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request._id === updatedRequest._id ? updatedRequest : request,
      ),
    );

    setNotification({
      status: updatedRequest.status,
      requestId: updatedRequest._id,
    });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, []);

  useCustomerSocket(handleRequestUpdate, setNotification);

  const submitRating = async () => {
    try {
      if (!ratingRequest) return;

      if (!selectedRating) {
        setRatingMessage("Please select a rating.");
        return;
      }

      setRatingLoading(true);
      setRatingMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/service-requests/${ratingRequest._id}/rate`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: selectedRating,
            review,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit rating");
      }

      setRatingMessage("⭐ Thank you! Your rating has been submitted.");

      await fetchRequests(true);

      setTimeout(() => {
        setRatingRequest(null);
        setSelectedRating(0);
        setReview("");
        setRatingMessage("");
      }, 1500);
    } catch (error) {
      console.error("Rating error:", error);

      setRatingMessage(error.message || "Unable to submit rating.");
    } finally {
      setRatingLoading(false);
    }
  };

  const fetchRequests = async (isBackground = false) => {
    try {
      if (isBackground) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login to view your requests.");
      }

      const response = await fetch(`${API_URL}/service-requests/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch service requests");
      }

      setRequests(data.requests || []);
    } catch (error) {
      console.error("Customer requests error:", error);

      if (!isBackground) {
        setError(error.message || "Unable to fetch service requests.");
      }
    } finally {
      if (isBackground) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRequests(false);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock3 size={22} />;

      case "accepted":
        return <CheckCircle2 size={22} />;

      case "on_the_way":
        return <Navigation size={22} />;

      case "arrived":
        return <MapPin size={22} />;

      case "in_progress":
        return <Wrench size={22} />;

      case "completed":
        return <CheckCircle2 size={22} />;

      case "rejected":
        return <XCircle size={22} />;

      default:
        return <Clock3 size={22} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400";

      case "accepted":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";

      case "on_the_way":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400";

      case "arrived":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400";

      case "in_progress":
        return "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400";

      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400";

      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusMessage = (request) => {
    switch (request.status) {
      case "pending":
        return {
          title: "Waiting for mechanic",
          message:
            "Your request has been sent. The mechanic needs to accept it.",
        };

      case "accepted":
        return {
          title: "Mechanic accepted your request",
          message: "Your mechanic is preparing to come to your location.",
        };

      case "on_the_way":
        return {
          title: "Your mechanic is on the way",
          message: "The mechanic is travelling to your location.",
        };

      case "arrived":
        return {
          title: "Your mechanic has arrived",
          message: "Please meet your mechanic at your vehicle.",
        };

      case "in_progress":
        return {
          title: "Service is in progress",
          message: "Your mechanic is currently working on your vehicle.",
        };

      case "completed":
        return {
          title: "Service completed",
          message: "Your roadside assistance service has been completed.",
        };

      case "rejected":
        return {
          title: "Request declined",
          message:
            "Unfortunately, this mechanic could not accept your request.",
        };

      case "cancelled":
        return {
          title: "Request cancelled",
          message: "This roadside assistance request has been cancelled.",
        };

      default:
        return {
          title: "Request status",
          message: "Your request status has been updated.",
        };
    }
  };

  const requestFilters = [
    {
      value: "all",
      label: "All",
      count: requests.length,
    },
    {
      value: "pending",
      label: "Pending",
      count: requests.filter((r) => r.status === "pending").length,
    },
    {
      value: "accepted",
      label: "Accepted",
      count: requests.filter((r) => r.status === "accepted").length,
    },
    {
      value: "on_the_way",
      label: "On the Way",
      count: requests.filter((r) => r.status === "on_the_way").length,
    },
    {
      value: "arrived",
      label: "Arrived",
      count: requests.filter((r) => r.status === "arrived").length,
    },
    {
      value: "in_progress",
      label: "In Progress",
      count: requests.filter((r) => r.status === "in_progress").length,
    },
    {
      value: "completed",
      label: "Completed",
      count: requests.filter((r) => r.status === "completed").length,
    },
    {
      value: "rejected",
      label: "Rejected",
      count: requests.filter((r) => r.status === "rejected").length,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      count: requests.filter((r) => r.status === "cancelled").length,
    },
  ];

  const filteredRequests =
    requestFilter === "all"
      ? requests
      : requests.filter((request) => request.status === requestFilter);

  const renderProgress = (request) => {
    const currentIndex = steps.indexOf(request.status);

    return (
      <div className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-bold text-[var(--veyra-text)]">
            Assistance Progress
          </p>

          {refreshing && (
            <span className="text-xs text-[var(--veyra-muted)]">
              Updating...
            </span>
          )}
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-[540px] items-center">
            {steps.map((step, index) => {
              const completed = currentIndex >= index;

              return (
                <div key={step} className="flex flex-1 items-center">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black transition ${
                      completed
                        ? "bg-[var(--veyra-lime)] text-[var(--veyra-ink)]"
                        : "bg-[var(--veyra-border)] text-[var(--veyra-muted)]"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 transition ${
                        currentIndex > index
                          ? "bg-[var(--veyra-lime)]"
                          : "bg-[var(--veyra-border)]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex min-w-[540px] justify-between text-[10px] font-semibold text-[var(--veyra-muted)]">
            <span>Request Sent</span>
            <span>Accepted</span>
            <span>On Way</span>
            <span>Arrived</span>
            <span>Service</span>
            <span>Completed</span>
          </div>
        </div>
      </div>
    );
  };

  const renderRequestCard = (request, active = true) => {
    const statusInfo = getStatusMessage(request);

    return (
      <div
        key={request._id}
        className={`overflow-hidden rounded-[28px] border bg-[var(--veyra-surface)] shadow-[var(--veyra-shadow-soft)] ${
          active
            ? "border-[var(--veyra-border)]"
            : "border-[var(--veyra-border)] opacity-90"
        }`}
      >
        <div className="border-b border-[var(--veyra-border)] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${getStatusColor(
                  request.status,
                )}`}
              >
                {getStatusIcon(request.status)}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--veyra-muted)]">
                  Service Request
                </p>

                <h3 className="mt-1 text-xl font-black text-[var(--veyra-text)]">
                  {request.service?.name || "Roadside Assistance"}
                </h3>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusColor(
                request.status,
              )}`}
            >
              {statusLabels[request.status] || request.status}
            </span>
          </div>

          <div className="mt-5">
            <h4 className="text-lg font-black text-[var(--veyra-text)]">
              {statusInfo.title}
            </h4>

            <p className="mt-1 text-sm leading-6 text-[var(--veyra-text-secondary)]">
              {statusInfo.message}
            </p>
          </div>

          {active &&
            !["rejected", "cancelled"].includes(request.status) &&
            renderProgress(request)}
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                Mechanic
              </p>

              <p className="mt-2 font-black text-[var(--veyra-text)]">
                {request.mechanic?.businessName || "Mechanic"}
              </p>

              {request.mechanic?.experience !== undefined && (
                <p className="mt-1 text-xs text-[var(--veyra-text-secondary)]">
                  {request.mechanic.experience} years experience
                </p>
              )}

              {request.status === "accepted" ||
              request.status === "on_the_way" ||
              request.status === "arrived" ||
              request.status === "in_progress" ? (
                request.mechanic?.phone ? (
                  <a
                    href={`tel:${request.mechanic.phone}`}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[var(--veyra-lime)] px-3 py-2 text-xs font-black text-[var(--veyra-ink)]"
                  >
                    <Phone size={14} />
                    Call Mechanic
                  </a>
                ) : null
              ) : null}
            </div>

            <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
              <div className="flex items-center gap-2">
                <Car size={15} className="text-[var(--veyra-muted)]" />

                <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                  Your Vehicle
                </p>
              </div>

              {request.vehicle ? (
                <>
                  <p className="mt-2 font-black text-[var(--veyra-text)]">
                    {request.vehicle.make} {request.vehicle.model}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[var(--veyra-text-secondary)]">
                    {request.vehicle.registrationNumber}
                  </p>

                  <p className="mt-1 text-xs capitalize text-[var(--veyra-muted)]">
                    {request.vehicle.vehicleType} • {request.vehicle.fuelType}
                    {request.vehicle.color ? ` • ${request.vehicle.color}` : ""}
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
                Estimated Price
              </p>

              <p className="mt-2 text-xl font-black text-[var(--veyra-text)]">
                ₹{request.estimatedPrice || 0}
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                Estimated Duration
              </p>

              <p className="mt-2 font-black text-[var(--veyra-text)]">
                {request.service?.estimatedDuration
                  ? `~${request.service.estimatedDuration} min`
                  : "Not available"}
              </p>
            </div>
          </div>

          {request.notes && (
            <div className="mt-4 rounded-2xl border border-[var(--veyra-border)] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                Your Notes
              </p>

              <p className="mt-2 text-sm leading-6 text-[var(--veyra-text-secondary)]">
                {request.notes}
              </p>
            </div>
          )}

          {request.status === "rejected" && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
              <p className="text-sm font-bold text-red-700 dark:text-red-400">
                This request was declined by the mechanic.
              </p>

              <p className="mt-1 text-xs text-red-600 dark:text-red-400/80">
                You can request assistance from another available mechanic.
              </p>
            </div>
          )}

          {request.status === "completed" && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-green-50 p-4 dark:bg-green-950/20">
              <CheckCircle2
                size={20}
                className="text-green-600 dark:text-green-400"
              />

              <div>
                <p className="text-sm font-black text-green-700 dark:text-green-400">
                  Service Completed
                </p>

                <p className="mt-1 text-xs text-green-600 dark:text-green-400/80">
                  Your roadside assistance request has been completed
                  successfully.
                </p>
              </div>
            </div>
          )}

          {request.status === "completed" && !request.rating && (
            <button
              type="button"
              onClick={() => {
                setRatingRequest(request);
                setSelectedRating(0);
                setReview("");
                setRatingMessage("");
              }}
              className="mt-4 w-full rounded-2xl bg-[var(--veyra-lime)] px-4 py-3 text-sm font-black text-[var(--veyra-ink)] transition hover:opacity-90"
            >
              ⭐ Rate Mechanic
            </button>
          )}

          <p className="mt-5 text-xs text-[var(--veyra-muted)]">
            Requested{" "}
            {request.createdAt
              ? new Date(request.createdAt).toLocaleString()
              : "Recently"}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <div className="h-7 w-56 animate-pulse rounded-lg bg-[var(--veyra-border)]" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-[var(--veyra-border)]" />
        </div>

        <div className="rounded-[28px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-48 rounded bg-[var(--veyra-border)]" />
            <div className="h-4 w-72 rounded bg-[var(--veyra-border)]" />
            <div className="h-24 rounded-2xl bg-[var(--veyra-surface-soft)]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          <p className="font-bold">Unable to load service requests</p>

          <p className="mt-1 text-sm">{error}</p>

          <button
            type="button"
            onClick={() => fetchRequests(false)}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl">
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />

      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--veyra-muted)]">
            Roadside assistance
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--veyra-text)]">
            My Assistance
          </h2>

          <p className="mt-1 text-sm text-[var(--veyra-text-secondary)]">
            Track your current and previous assistance requests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchRequests(true)}
          disabled={refreshing}
          className="flex h-10 items-center gap-2 rounded-xl border border-[var(--veyra-border)] bg-[var(--veyra-surface)] px-3 text-sm font-semibold text-[var(--veyra-text)] transition hover:bg-[var(--veyra-surface-soft)] disabled:opacity-60"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />

          <span className="hidden sm:inline">
            {refreshing ? "Updating..." : "Refresh"}
          </span>
        </button>
      </div>

      <div className="mb-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[var(--veyra-text)]">
              My Requests
            </h3>

            <p className="mt-1 text-xs text-[var(--veyra-muted)]">
              View and track all your roadside assistance requests.
            </p>
          </div>

          <div className="shrink-0 rounded-full bg-[var(--veyra-surface-soft)] px-3 py-1 text-xs font-bold text-[var(--veyra-muted)]">
            {filteredRequests.length} requests
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-2 pb-2">
            {requestFilters.map((filter) => (
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
                      : "bg-[var(--veyra-surface-soft)]"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="space-y-5">
          {filteredRequests.map((request) =>
            renderRequestCard(
              request,
              !["completed", "rejected", "cancelled"].includes(request.status),
            ),
          )}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--veyra-lime-soft)]">
            <Wrench size={24} />
          </div>

          <h3 className="mt-4 text-lg font-black text-[var(--veyra-text)]">
            No{" "}
            {requestFilter === "all"
              ? ""
              : statusLabels[requestFilter]?.toLowerCase()}{" "}
            requests
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--veyra-text-secondary)]">
            {requestFilter === "all"
              ? "Your roadside assistance requests will appear here."
              : `There are no ${statusLabels[
                  requestFilter
                ]?.toLowerCase()} requests at the moment.`}
          </p>
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-[var(--veyra-surface)] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--veyra-muted)]">
                  Request Details
                </p>

                <h3 className="mt-1 text-xl font-black text-[var(--veyra-text)]">
                  {selectedRequest.service?.name || "Roadside Assistance"}
                </h3>

                <p className="mt-1 text-xs text-[var(--veyra-muted)]">
                  {selectedRequest.createdAt
                    ? new Date(selectedRequest.createdAt).toLocaleString()
                    : "Recently"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--veyra-surface-soft)] text-xl text-[var(--veyra-muted)] transition hover:text-[var(--veyra-text)]"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center justify-between rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                    Status
                  </p>

                  <p className="mt-1 font-black text-[var(--veyra-text)]">
                    {statusLabels[selectedRequest.status] ||
                      selectedRequest.status}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusColor(
                    selectedRequest.status,
                  )}`}
                >
                  {statusLabels[selectedRequest.status] ||
                    selectedRequest.status}
                </span>
              </div>

              <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                  Mechanic
                </p>

                <p className="mt-2 font-black text-[var(--veyra-text)]">
                  {selectedRequest.mechanic?.businessName || "Mechanic"}
                </p>

                {selectedRequest.mechanic?.experience !== undefined && (
                  <p className="mt-1 text-xs text-[var(--veyra-text-secondary)]">
                    {selectedRequest.mechanic.experience} years experience
                  </p>
                )}

                {selectedRequest.mechanic?.phone && (
                  <a
                    href={`tel:${selectedRequest.mechanic.phone}`}
                    className="mt-3 inline-flex rounded-xl bg-[var(--veyra-lime)] px-3 py-2 text-xs font-black text-[var(--veyra-ink)]"
                  >
                    Call Mechanic
                  </a>
                )}
              </div>

              {selectedRequest.vehicle && (
                <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                    Vehicle
                  </p>

                  <p className="mt-2 font-black text-[var(--veyra-text)]">
                    {selectedRequest.vehicle.make}{" "}
                    {selectedRequest.vehicle.model}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[var(--veyra-text-secondary)]">
                    {selectedRequest.vehicle.registrationNumber}
                  </p>

                  <p className="mt-1 text-xs capitalize text-[var(--veyra-muted)]">
                    {selectedRequest.vehicle.vehicleType} •{" "}
                    {selectedRequest.vehicle.fuelType}
                    {selectedRequest.vehicle.color
                      ? ` • ${selectedRequest.vehicle.color}`
                      : ""}
                  </p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                    Estimated Price
                  </p>

                  <p className="mt-2 text-xl font-black text-[var(--veyra-text)]">
                    ₹{selectedRequest.estimatedPrice || 0}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                    Estimated Duration
                  </p>

                  <p className="mt-2 font-black text-[var(--veyra-text)]">
                    {selectedRequest.service?.estimatedDuration
                      ? `~${selectedRequest.service.estimatedDuration} min`
                      : "Not available"}
                  </p>
                </div>
              </div>

              {selectedRequest.notes && (
                <div className="rounded-2xl border border-[var(--veyra-border)] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                    Your Notes
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[var(--veyra-text-secondary)]">
                    {selectedRequest.notes}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="w-full rounded-2xl border border-[var(--veyra-border)] px-4 py-3 text-sm font-black text-[var(--veyra-text)] transition hover:bg-[var(--veyra-surface-soft)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {ratingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-[var(--veyra-surface)] p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                  Rate your experience
                </p>

                <h3 className="mt-1 text-xl font-black text-[var(--veyra-text)]">
                  Rate Mechanic
                </h3>

                <p className="mt-1 text-sm text-[var(--veyra-text-secondary)]">
                  {ratingRequest.mechanic?.businessName || "Mechanic"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRatingRequest(null);
                  setSelectedRating(0);
                  setReview("");
                  setRatingMessage("");
                }}
                className="text-xl text-[var(--veyra-muted)] hover:text-[var(--veyra-text)]"
              >
                ×
              </button>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-bold text-[var(--veyra-text)]">
                How was your experience?
              </p>

              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className={`text-4xl transition-transform hover:scale-110 ${
                      star <= selectedRating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              {selectedRating > 0 && (
                <p className="mt-2 text-center text-sm font-semibold text-[var(--veyra-text-secondary)]">
                  {selectedRating === 1 && "Poor"}
                  {selectedRating === 2 && "Fair"}
                  {selectedRating === 3 && "Good"}
                  {selectedRating === 4 && "Very Good"}
                  {selectedRating === 5 && "Excellent"}
                </p>
              )}
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-[var(--veyra-text)]">
                Review{" "}
                <span className="font-normal text-[var(--veyra-muted)]">
                  (optional)
                </span>
              </label>

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={4}
                maxLength={500}
                className="mt-2 w-full resize-none rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] p-3 text-sm text-[var(--veyra-text)] outline-none focus:border-[var(--veyra-lime)]"
              />

              <p className="mt-1 text-right text-xs text-[var(--veyra-muted)]">
                {review.length}/500
              </p>
            </div>

            {ratingMessage && (
              <div className="mt-4 rounded-xl bg-[var(--veyra-surface-soft)] p-3 text-sm text-[var(--veyra-text)]">
                {ratingMessage}
              </div>
            )}

            <button
              type="button"
              onClick={submitRating}
              disabled={ratingLoading}
              className="mt-5 w-full rounded-2xl bg-[var(--veyra-lime)] px-4 py-3 font-black text-[var(--veyra-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {ratingLoading ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomerRequests;

