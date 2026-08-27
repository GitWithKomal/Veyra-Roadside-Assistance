import { useEffect, useRef, useState } from "react";
import { mappls } from "mappls-web-maps";

const mapplsClassObject = new mappls();

const RoadsideMap = () => {
  const mapRef = useRef(null);
  const customerMarkerRef = useRef(null);
  const mechanicMarkersRef = useRef([]);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [location, setLocation] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [locationError, setLocationError] = useState("");
  const [mechanicError, setMechanicError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        console.log("Customer location:", {
          latitude,
          longitude,
        });

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
    const loadObject = {
      map: true,
      version: "3.0",
    };

    console.log("Starting Mappls initialization");
    console.log(
      "Mappls API key exists:",
      Boolean(import.meta.env.VITE_MAPPLS_API_KEY),
    );

    mapplsClassObject.initialize(
      import.meta.env.VITE_MAPPLS_API_KEY,
      loadObject,
      () => {
        console.log("Mappls initialize callback fired");
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
          console.log("Mappls map loaded successfully");

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

    console.log("Customer marker added");
  }, [isMapLoaded, location]);

  useEffect(() => {
    if (!location) {
      return;
    }

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

        console.log("Nearby mechanics:", data);

        setMechanics(data.mechanics || []);
      } catch (error) {
        console.error("Nearby mechanics error:", error);

        setMechanicError(error.message || "Unable to find nearby mechanics.");
      }
    };

    fetchNearbyMechanics();
  }, [location]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/vehicles/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch vehicles");
        }

        console.log("Customer vehicles:", data);

        setVehicles(data.vehicles || []);
      } catch (error) {
        console.error("Fetch vehicles error:", error);
      }
    };

    fetchVehicles();
  }, []);

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

    console.log(`${mechanics.length} mechanic marker(s) added`);
  }, [isMapLoaded, mechanics]);

  // --------------------------------------------------
  // 6. Request service
  // --------------------------------------------------

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

      console.log("Service request response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create service request");
      }

      setRequestMessage("✅ Assistance request sent successfully!");

      setSelectedService(null);
    } catch (error) {
      console.error("Request assistance error:", error);

      setRequestMessage(error.message || "Unable to send assistance request.");
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border">
      {/* Map */}
      <div id="roadside-map" className="w-full h-full" />

      {/* Map loading */}
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          Loading Map...
        </div>
      )}

      {/* Location error */}
      {locationError && (
        <div className="absolute top-4 left-4 right-4 z-20 bg-white rounded-lg shadow p-3 text-sm text-red-600">
          {locationError}
        </div>
      )}

      {/* Mechanic error */}
      {mechanicError && (
        <div className="absolute top-20 left-4 right-4 z-20 bg-white rounded-lg shadow p-3 text-sm text-red-600">
          {mechanicError}
        </div>
      )}

      {/* Customer location */}
      {location && (
        <div className="absolute bottom-4 left-4 z-20 bg-white rounded-lg shadow px-4 py-3 text-sm">
          <p className="font-semibold">Your Location</p>

          <p>Lat: {location.latitude.toFixed(6)}</p>

          <p>Lng: {location.longitude.toFixed(6)}</p>

          <p className="mt-1">
            Nearby mechanics: <strong>{mechanics.length}</strong>
          </p>
        </div>
      )}

      {/* Nearby mechanics */}
      {mechanics.length > 0 && (
        <div className="absolute top-4 right-4 z-20 w-80 max-w-[calc(100%-2rem)]">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-bold text-lg">Nearby Mechanics</h2>

              <p className="text-sm text-gray-500">
                {mechanics.length} mechanic
                {mechanics.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {mechanics.map((mechanic) => (
                <button
                  key={mechanic._id}
                  type="button"
                  onClick={() => {
                    console.log("Selected mechanic:", mechanic);

                    setSelectedMechanic(mechanic);

                    setSelectedService(null);
                    setRequestMessage("");
                  }}
                  className="w-full text-left p-4 border-b hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {mechanic.businessName}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {mechanic.experience} years experience
                      </p>
                    </div>

                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Available
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    ⭐ {mechanic.rating || 0}
                  </p>

                  <p className="text-sm text-purple-600 font-medium mt-2">
                    View services →
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected mechanic modal */}
      {selectedMechanic && (
        <div className="absolute inset-0 z-30 flex items-end justify-center pointer-events-none">
          <div className="pointer-events-auto w-full max-w-md mb-4 mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedMechanic.businessName}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {selectedMechanic.experience} years experience
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedMechanic(null);
                    setSelectedService(null);
                    setRequestMessage("");
                  }}
                  className="text-gray-500 hover:text-gray-900 text-xl"
                >
                  ×
                </button>
              </div>

              {/* Status */}
              <div className="flex gap-4 mt-3 text-sm">
                <span>⭐ {selectedMechanic.rating || 0}</span>

                <span className="text-green-600 font-medium">● Available</span>
              </div>

              {/* Description */}
              {selectedMechanic.description && (
                <p className="text-sm text-gray-600 mt-3">
                  {selectedMechanic.description}
                </p>
              )}

              {/* Services */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Select a Service</h3>

                {selectedMechanic.servicesOffered?.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedMechanic.servicesOffered.map((service) => (
                      <button
                        key={service._id}
                        type="button"
                        onClick={() => {
                          setSelectedService(service);

                          setRequestMessage("");
                        }}
                        className={`w-full flex items-center justify-between rounded-lg p-3 text-left border transition ${
                          selectedService?._id === service._id
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div>
                          <p className="font-medium text-sm">{service.name}</p>

                          <p className="text-xs text-gray-500">
                            ~{service.estimatedDuration} min
                          </p>
                        </div>

                        <span className="font-semibold text-purple-600">
                          ₹{service.basePrice}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No services available.
                  </p>
                )}
              </div>

              {/* Selected service */}
              {selectedService && (
                <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm font-medium">Selected:</p>

                  <p className="text-sm text-purple-700">
                    {selectedService.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    Estimated price: ₹{selectedService.basePrice}
                  </p>
                </div>
              )}

              {/* Request message */}
              {requestMessage && (
                <div className="mt-3 text-sm bg-gray-50 rounded-lg p-3">
                  {requestMessage}
                </div>
              )}

              {/* Select vehicle */}
              <div className="mt-5">
                <h3 className="font-semibold mb-2">Select Your Vehicle</h3>

                {vehicles.length > 0 ? (
                  <div className="space-y-2">
                    {vehicles.map((vehicle) => (
                      <button
                        key={vehicle._id}
                        type="button"
                        onClick={() => setSelectedVehicle(vehicle)}
                        className={`w-full text-left rounded-lg p-3 border transition ${
                          selectedVehicle?._id === vehicle._id
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <p className="font-medium">
                          {vehicle.make} {vehicle.model}
                        </p>

                        <p className="text-sm text-gray-500">
                          {vehicle.registrationNumber}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {vehicle.vehicleType} • {vehicle.fuelType}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No vehicles found. Please add a vehicle first.
                  </p>
                )}
              </div>

              {/* Request assistance */}
              <button
                type="button"
                onClick={requestAssistance}
                className="w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Request Assistance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadsideMap;
