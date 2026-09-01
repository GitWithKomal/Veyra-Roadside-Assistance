import { useCallback, useEffect, useRef, useState } from "react";
import { mappls } from "mappls-web-maps";
import useCustomerSocket from "../../hooks/useCustomerSocket";

const mapplsClassObject = new mappls();

const RoadsideMap = ({ vehicles }) => {
  const mapRef = useRef(null);
  const customerMarkerRef = useRef(null);
  const mechanicMarkersRef = useRef([]);
  const routeRef = useRef(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [location, setLocation] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [locationError, setLocationError] = useState("");
  const [mechanicError, setMechanicError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [activeRequest, setActiveRequest] = useState(null);

  const [problemSearch, setProblemSearch] = useState("");
  const [showMechanics, setShowMechanics] = useState(false);
  const [locationName, setLocationName] = useState("Your current location");

  const roadsideProblems = [
    {
      id: "battery",
      label: "Battery",
      icon: "🔋",
    },
    {
      id: "tyre",
      label: "Flat Tyre",
      icon: "🛞",
    },
    {
      id: "towing",
      label: "Towing",
      icon: "🚗",
    },
    {
      id: "fuel",
      label: "Fuel",
      icon: "⛽",
    },
    {
      id: "engine",
      label: "Engine Problem",
      icon: "🔧",
    },
  ];

  const requestStatusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-blue-100 text-blue-700",
    on_the_way: "bg-purple-100 text-purple-700",
    arrived: "bg-indigo-100 text-indigo-700",
    in_progress: "bg-orange-100 text-orange-700",
    completed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
setLocation({
          latitude,
          longitude,
        });
      },
      (error) => {
        console.error("Location error:", error);

        setLocationError(
          "Unable to access your location. Please allow location permission.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  useEffect(() => {
}, [selectedVehicle]);

  useEffect(() => {
    const loadObject = {
      map: true,
      version: "3.0",
    };

    mapplsClassObject.initialize(
      import.meta.env.VITE_MAPPLS_API_KEY,
      loadObject,
      () => {
const map = mapplsClassObject.Map({
          id: "roadside-map",
          properties: {
            center: [21.1458, 79.0882],
            zoom: 13,
            zoomControl: true,
            location: true,
          },
        });

        mapRef.current = map;

        map.on("load", () => {
mapplsClassObject.setStyle("standard-hybrid");

          setIsMapLoaded(true);
        });
      },
    );

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !location) {
      return;
    }

    const map = mapRef.current;

    if (customerMarkerRef.current) {
      customerMarkerRef.current.remove();
    }

    customerMarkerRef.current = mapplsClassObject.Marker({
      map,
      position: {
        lat: location.latitude,
        lng: location.longitude,
      },
      popupHtml: "<b>Your Location</b>",
      width: 35,
      height: 45,
    });
}, [isMapLoaded, location]);

  useEffect(() => {
    if (!location) {
      return;
    }

    let isMounted = true;

    const fetchNearbyMechanics = async () => {
      try {
        setMechanicError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setMechanicError("Please login to find nearby mechanics.");
          return;
        }

        const params = new URLSearchParams({
          latitude: location.latitude,
          longitude: location.longitude,
          radius: "10",
        });

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/mechanics/nearby?${params}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to find nearby mechanics");
        }

        if (isMounted) {
          const nearbyMechanics = data.mechanics || [];
setMechanics(nearbyMechanics);
        }
      } catch (error) {
        console.error("Nearby mechanics error:", error);

        if (isMounted) {
          setMechanicError(error.message || "Unable to find nearby mechanics.");
        }
      }
    };

    fetchNearbyMechanics();

    const interval = setInterval(() => {
      fetchNearbyMechanics();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [location]);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || mechanics.length === 0) {
      return;
    }

    const map = mapRef.current;

    mechanicMarkersRef.current.forEach((marker) => {
      marker.remove();
    });

    mechanicMarkersRef.current = [];

    mechanics.forEach((mechanic) => {
      if (!mechanic.location || !mechanic.location.coordinates) {
        return;
      }

      const [longitude, latitude] = mechanic.location.coordinates;

      const marker = mapplsClassObject.Marker({
        map,
        position: {
          lat: latitude,
          lng: longitude,
        },
        popupHtml: `
          <div style="padding: 8px;">
            <strong>${mechanic.businessName}</strong>
            <br />
            ${mechanic.experience} years experience
            <br />
            ⭐ ${mechanic.rating || 0}
          </div>
        `,
        width: 35,
        height: 45,
      });

      mechanicMarkersRef.current.push(marker);
    });
}, [isMapLoaded, mechanics]);

  const handleRequestUpdate = useCallback((request) => {
setActiveRequest(request);
  }, []);

  useCustomerSocket(handleRequestUpdate);

  const showMechanicRoute = async (mechanic) => {
    try {
      if (!location) {
        console.error("Customer location unavailable");
        return;
      }

      if (!mechanic?.location?.coordinates) {
        console.error("Mechanic location unavailable");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Authentication token missing");
        return;
      }

      setRouteLoading(true);

      const params = new URLSearchParams({
        customerLatitude: location.latitude,
        customerLongitude: location.longitude,
        mechanicId: mechanic._id,
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/mechanics/route?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to calculate route");
      }

      const route = data.route?.routes?.[0];

      if (!route?.legs?.length) {
        throw new Error("No route found");
      }

      const coordinates = route.legs.flatMap((leg) =>
        leg.steps.flatMap((step) => step.geometry?.coordinates || []),
      );

      if (coordinates.length < 2) {
        throw new Error("Route geometry contains insufficient coordinates");
      }

const map = mapRef.current;

      if (!map) {
        throw new Error("Map is not ready");
      }

      routeRef.current = null;

      const path = coordinates.map(([longitude, latitude]) => ({
        lat: latitude,
        lng: longitude,
      }));

      routeRef.current = mapplsClassObject.Polyline({
        map,
        path,
        strokeColor: "#7C3AED",
        strokeOpacity: 0.9,
        strokeWeight: 5,
      });
setRouteInfo({
        distanceKm: Number((route.distance / 1000).toFixed(1)),
        durationMinutes: Math.max(1, Math.round(route.duration / 60)),
      });
    } catch (error) {
      console.error("Route display error:", error);
    } finally {
      setRouteLoading(false);
    }
  };

  const requestAssistance = async () => {
    try {
      setRequestMessage("");

      if (!selectedMechanic) {
        setRequestMessage("Please select a mechanic.");
        return;
      }

      if (!selectedService) {
        setRequestMessage("Please select a service.");
        return;
      }

      if (!selectedVehicle) {
        setRequestMessage("Please select your vehicle.");
        return;
      }

      if (!location) {
        setRequestMessage("Customer location is not available.");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setRequestMessage("Please login first.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/service-requests`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mechanicId: selectedMechanic._id,
            serviceId: selectedService._id,
            vehicleId: selectedVehicle?._id,
            latitude: location.latitude,
            longitude: location.longitude,
            notes: "My vehicle broke down. Need roadside assistance.",
          }),
        },
      );

      const data = await response.json();
if (!response.ok) {
        throw new Error(data.message || "Failed to create service request");
      }

      setRequestMessage("✅ Assistance request sent successfully!");

      setActiveRequest(data.request);

      setTimeout(() => {
        setSelectedService(null);
        setSelectedMechanic(null);
        setSelectedVehicle(null);
        setRequestMessage("");
      }, 1500);
    } catch (error) {
      console.error("Request assistance error:", error);

      setRequestMessage(error.message || "Unable to send assistance request.");
    }
  };

  return (
    <section className="w-full">
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--veyra-muted)]">
          Roadside assistance
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--veyra-text)] sm:text-3xl">
          Hello 👋 How can we help?
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--veyra-text-secondary)]">
          Tell us where you are and what happened. We'll help you find the
          nearest available service point.
        </p>
      </div>

      <div className="mb-5 rounded-[24px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-4 shadow-[var(--veyra-shadow-soft)] sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
              Your location
            </label>

            <button
              type="button"
              onClick={() => {
                if (!navigator.geolocation) {
                  setLocationError("Geolocation is not supported.");
                  return;
                }

                setLocationError("");

                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setLocation({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    });
                  },
                  () => {
                    setLocationError(
                      "Unable to access your location. Please allow location permission.",
                    );
                  },
                  {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                  },
                );
              }}
              className="flex min-h-[52px] w-full items-center gap-3 rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 text-left transition hover:border-[var(--veyra-border-strong)]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--veyra-lime-soft)]">
                <span className="text-lg">📍</span>
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[var(--veyra-text)]">
                  {location
                    ? "Current location detected"
                    : "Use my current location"}
                </p>

                <p className="mt-0.5 text-xs text-[var(--veyra-muted)]">
                  {location
                    ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                    : "Tap to detect your location"}
                </p>
              </div>
            </button>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
              What's the problem?
            </label>

            <select
              value={selectedService?._id || ""}
              onChange={(e) => {
                const serviceId = e.target.value;

                if (!serviceId) {
                  setSelectedService(null);
                  return;
                }

                let foundService = null;

                for (const mechanic of mechanics) {
                  const service = mechanic.servicesOffered?.find(
                    (item) => item._id === serviceId,
                  );

                  if (service) {
                    foundService = service;
                    break;
                  }
                }

                setSelectedService(foundService);
                setRequestMessage("");
              }}
              className="min-h-[52px] w-full rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] px-4 text-sm font-semibold text-[var(--veyra-text)] outline-none transition focus:border-[var(--veyra-lime)]"
            >
              <option value="">Select your problem</option>

              {Array.from(
                new Map(
                  mechanics
                    .flatMap((mechanic) => mechanic.servicesOffered || [])
                    .map((service) => [service._id, service]),
                ).values(),
              ).map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!location) {
                setLocationError(
                  "Please allow location access before finding assistance.",
                );
                return;
              }

              if (!selectedService) {
                setRequestMessage("Please select your problem first.");
                return;
              }

              setRequestMessage("");
            }}
            className="min-h-[52px] rounded-2xl bg-[var(--veyra-lime)] px-6 text-sm font-black text-[var(--veyra-ink)] transition hover:opacity-90 active:scale-[0.98] md:whitespace-nowrap"
          >
            Find Assistance
          </button>
        </div>

        {locationError && (
          <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
            {locationError}
          </div>
        )}

        {mechanicError && (
          <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
            {mechanicError}
          </div>
        )}

        {requestMessage && !selectedMechanic && (
          <div className="mt-3 rounded-xl bg-[var(--veyra-lime-soft)] px-4 py-3 text-sm font-semibold text-[var(--veyra-text)]">
            {requestMessage}
          </div>
        )}
      </div>

      <div className="relative mb-6 h-[420px] w-full overflow-hidden rounded-[28px] border border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] shadow-[var(--veyra-shadow-soft)] sm:h-[500px] lg:h-[560px]">
        <div id="roadside-map" className="h-full w-full" />

        {!isMapLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--veyra-surface)]">
            <div className="text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[var(--veyra-border)] border-t-[var(--veyra-lime)]" />

              <p className="text-sm font-semibold text-[var(--veyra-text)]">
                Loading map...
              </p>
            </div>
          </div>
        )}

        {routeInfo && selectedMechanic && (
          <div className="absolute left-4 top-4 z-20 rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface)]/95 px-4 py-3 shadow-xl backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
              Route to {selectedMechanic.businessName}
            </p>

            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm font-black text-[var(--veyra-text)]">
                📍 {routeInfo.distanceKm} km
              </span>

              <span className="text-sm font-black text-[var(--veyra-text)]">
                ⏱ ~{routeInfo.durationMinutes} min
              </span>
            </div>
          </div>
        )}

        {location && (
          <div className="absolute bottom-4 left-4 z-20 max-w-[calc(100%-2rem)] rounded-2xl border border-white/20 bg-[var(--veyra-surface)]/95 px-4 py-3 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--veyra-lime)]">
                📍
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                  Your location
                </p>

                <p className="mt-0.5 text-sm font-black text-[var(--veyra-text)]">
                  {mechanics.length} nearby service point
                  {mechanics.length !== 1 ? "s" : ""}
                </p>

                {routeLoading && (
                  <div className="absolute right-4 top-4 z-20 rounded-2xl border border-[var(--veyra-border)] bg-[var(--veyra-surface)]/95 px-4 py-3 text-sm font-bold text-[var(--veyra-text)] shadow-xl backdrop-blur-md">
                    🛣️ Calculating route...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--veyra-muted)]">
              Nearby
            </p>

            <h3 className="mt-1 text-xl font-black text-[var(--veyra-text)] sm:text-2xl">
              Service Points
            </h3>

            <p className="mt-1 text-sm text-[var(--veyra-text-secondary)]">
              Verified mechanics near your current location.
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-[var(--veyra-lime-soft)] px-3 py-1.5 text-xs font-black text-[var(--veyra-text)]">
            {mechanics.length} found
          </span>
        </div>

        {mechanics.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[var(--veyra-border-strong)] bg-[var(--veyra-surface)] p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--veyra-surface-soft)] text-2xl">
              🔧
            </div>

            <h4 className="mt-4 font-black text-[var(--veyra-text)]">
              No service points found
            </h4>

            <p className="mt-1 text-sm text-[var(--veyra-text-secondary)]">
              Try checking your location or expanding the search area.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {mechanics.map((mechanic) => (
              <button
                key={mechanic._id}
                type="button"
                onClick={() => {
                  setSelectedMechanic(mechanic);
                  setSelectedService(null);
                  setRequestMessage("");
                  showMechanicRoute(mechanic);
                }}
                className="group rounded-[24px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-5 text-left shadow-[var(--veyra-shadow-soft)] transition duration-200 hover:-translate-y-1 hover:border-[var(--veyra-border-strong)] hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--veyra-forest)] text-lg font-black text-[var(--veyra-lime)]">
                      {(mechanic.businessName || "M").charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate font-black text-[var(--veyra-text)]">
                        {mechanic.businessName}
                      </h4>

                      <p className="mt-1 text-xs text-[var(--veyra-muted)]">
                        {mechanic.experience || 0} years experience
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${
                      mechanic.isAvailable
                        ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                    }`}
                  >
                    {mechanic.isAvailable ? "Available" : "Busy"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-[var(--veyra-text-secondary)]">
                  <span>⭐ {mechanic.rating || 0}</span>

                  <span>•</span>

                  <span>{mechanic.servicesOffered?.length || 0} services</span>
                </div>

                {(mechanic.distanceKm !== null ||
                  mechanic.estimatedArrivalMinutes !== null) && (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {mechanic.distanceKm !== null &&
                      mechanic.distanceKm !== undefined && (
                        <span className="rounded-lg bg-[var(--veyra-lime-soft)] px-2.5 py-1.5 text-xs font-black text-[var(--veyra-text)]">
                          📍 {mechanic.distanceKm} km away
                        </span>
                      )}

                    {mechanic.estimatedArrivalMinutes !== null &&
                      mechanic.estimatedArrivalMinutes !== undefined && (
                        <span className="rounded-lg bg-[var(--veyra-surface-soft)] px-2.5 py-1.5 text-xs font-black text-[var(--veyra-text)]">
                          ⏱ ~{mechanic.estimatedArrivalMinutes} min
                        </span>
                      )}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {(mechanic.servicesOffered || [])
                    .slice(0, 3)
                    .map((service) => (
                      <span
                        key={service._id}
                        className="rounded-lg bg-[var(--veyra-surface-soft)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--veyra-text-secondary)]"
                      >
                        {service.name}
                      </span>
                    ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[var(--veyra-border)] pt-4">
                  <span className="text-xs font-semibold text-[var(--veyra-muted)]">
                    View services & pricing
                  </span>

                  <span className="font-black text-[var(--veyra-text)] transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {activeRequest && (
        <div className="mb-8 rounded-[28px] border border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-5 shadow-[var(--veyra-shadow-soft)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--veyra-muted)]">
                Active Service Request
              </p>

              <h3 className="mt-1 text-xl font-black text-[var(--veyra-text)]">
                {activeRequest.service?.name || "Roadside Assistance"}
              </h3>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${
                requestStatusStyles[activeRequest.status] ||
                "bg-gray-100 text-gray-700"
              }`}
            >
              {activeRequest.status
                ?.replaceAll("_", " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                Mechanic
              </p>

              <p className="mt-1 font-black text-[var(--veyra-text)]">
                {activeRequest.mechanic?.businessName || "Mechanic"}
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                Vehicle
              </p>

              <p className="mt-1 font-black text-[var(--veyra-text)]">
                {activeRequest.vehicle
                  ? `${activeRequest.vehicle.make} ${activeRequest.vehicle.model}`
                  : "Vehicle"}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-[var(--veyra-lime-soft)] p-4">
            <p className="text-sm font-black text-[var(--veyra-text)]">
              {activeRequest.status === "pending" &&
                "⏳ Waiting for the mechanic to accept your request."}

              {activeRequest.status === "accepted" &&
                "✓ Your mechanic accepted the request."}

              {activeRequest.status === "on_the_way" &&
                "🚗 Your mechanic is on the way."}

              {activeRequest.status === "arrived" &&
                "📍 Your mechanic has arrived."}

              {activeRequest.status === "in_progress" &&
                "🔧 Your roadside service is in progress."}

              {activeRequest.status === "completed" &&
                "✓ Your roadside assistance is complete."}

              {activeRequest.status === "rejected" &&
                "✕ This mechanic rejected the request."}
            </p>
          </div>
        </div>
      )}

      {selectedMechanic && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-[28px] bg-[var(--veyra-surface)] shadow-2xl sm:max-w-lg sm:rounded-[28px]">
            <div className="sticky top-0 z-10 border-b border-[var(--veyra-border)] bg-[var(--veyra-surface)] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--veyra-muted)]">
                    Service Point
                  </p>

                  <h2 className="mt-1 truncate text-xl font-black text-[var(--veyra-text)] sm:text-2xl">
                    {selectedMechanic.businessName}
                  </h2>

                  <p className="mt-1 text-sm text-[var(--veyra-text-secondary)]">
                    ⭐ {selectedMechanic.rating || 0} •{" "}
                    {selectedMechanic.experience || 0} years experience
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedMechanic(null);
                    setSelectedService(null);
                    setRequestMessage("");

                    if (routeRef.current) {
                      routeRef.current = null;
                      setRouteInfo(null);
                    }
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--veyra-surface-soft)] text-lg text-[var(--veyra-muted)] transition hover:text-[var(--veyra-text)]"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div>
                <h3 className="font-black text-[var(--veyra-text)]">
                  Choose a service
                </h3>

                <p className="mt-1 text-xs text-[var(--veyra-muted)]">
                  Select the service you need.
                </p>

                <div className="mt-3 space-y-2">
                  {selectedMechanic.servicesOffered?.length > 0 ? (
                    selectedMechanic.servicesOffered.map((service) => (
                      <button
                        key={service._id}
                        type="button"
                        onClick={() => {
                          setSelectedService(service);
                          setRequestMessage("");
                        }}
                        className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                          selectedService?._id === service._id
                            ? "border-[var(--veyra-lime)] bg-[var(--veyra-lime-soft)]"
                            : "border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] hover:border-[var(--veyra-border-strong)]"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-black text-[var(--veyra-text)]">
                            {service.name}
                          </p>

                          <p className="mt-1 text-xs text-[var(--veyra-muted)]">
                            ~{service.estimatedDuration} min
                          </p>
                        </div>

                        <p className="font-black text-[var(--veyra-text)]">
                          ₹{service.basePrice}
                        </p>
                      </button>
                    ))
                  ) : (
                    <p className="rounded-xl bg-[var(--veyra-surface-soft)] p-4 text-sm text-[var(--veyra-muted)]">
                      No services available.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-black text-[var(--veyra-text)]">
                  Select your vehicle
                </h3>

                {vehicles.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {vehicles.map((vehicle) => (
                      <button
                        key={vehicle._id}
                        type="button"
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setRequestMessage("");
                        }}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          selectedVehicle?._id === vehicle._id
                            ? "border-[var(--veyra-lime)] bg-[var(--veyra-lime-soft)]"
                            : "border-[var(--veyra-border)] bg-[var(--veyra-surface-soft)] hover:border-[var(--veyra-border-strong)]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-black text-[var(--veyra-text)]">
                              {vehicle.make} {vehicle.model}
                            </p>

                            <p className="mt-1 text-xs font-semibold text-[var(--veyra-text-secondary)]">
                              {vehicle.registrationNumber}
                            </p>
                          </div>

                          <span className="text-lg">🚗</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 rounded-2xl bg-[var(--veyra-surface-soft)] p-4">
                    <p className="text-sm text-[var(--veyra-text-secondary)]">
                      No vehicles found. Please add a vehicle first.
                    </p>
                  </div>
                )}
              </div>

              {selectedService && (
                <div className="mt-5 rounded-2xl bg-[var(--veyra-lime-soft)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--veyra-muted)]">
                        Selected service
                      </p>

                      <p className="mt-1 font-black text-[var(--veyra-text)]">
                        {selectedService.name}
                      </p>
                    </div>

                    <p className="font-black text-[var(--veyra-text)]">
                      ₹{selectedService.basePrice}
                    </p>
                  </div>
                </div>
              )}

              {requestMessage && (
                <div className="mt-4 rounded-xl bg-[var(--veyra-surface-soft)] p-3 text-sm font-semibold text-[var(--veyra-text)]">
                  {requestMessage}
                </div>
              )}

              <button
                type="button"
                onClick={requestAssistance}
                className="mt-5 w-full rounded-2xl bg-[var(--veyra-lime)] px-4 py-3.5 text-sm font-black text-[var(--veyra-ink)] transition hover:opacity-90 active:scale-[0.98]"
              >
                Request Assistance
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RoadsideMap;

