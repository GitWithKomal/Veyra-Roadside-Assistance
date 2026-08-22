import { useEffect, useRef, useState } from "react";
import { mappls } from "mappls-web-maps";

const mapplsClassObject = new mappls();

const RoadsideMap = () => {
  const mapRef = useRef(null);
  const customerMarkerRef = useRef(null);
  const mechanicMarkersRef = useRef([]);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [location, setLocation] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [locationError, setLocationError] = useState("");
  const [mechanicError, setMechanicError] = useState("");

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

  // --------------------------------------------------
  // 2. Initialize Mappls
  // --------------------------------------------------

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

  // --------------------------------------------------
  // 3. Add customer marker
  // --------------------------------------------------

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

    // map.panTo([
    //   location.latitude,
    //   location.longitude,
    // ]);

    console.log("Customer marker added");
  }, [isMapLoaded, location]);

  // --------------------------------------------------
  // 4. Get nearby mechanics from backend
  // --------------------------------------------------

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

  // --------------------------------------------------
  // 5. Add mechanic markers
  // --------------------------------------------------

  useEffect(() => {
  if (
    !isMapLoaded ||
    !mapRef.current ||
    mechanics.length === 0
  ) {
    return;
  }

  const map = mapRef.current;

  // Remove old mechanic markers
  mechanicMarkersRef.current.forEach((marker) => {
    marker.remove();
  });

  mechanicMarkersRef.current = [];

  mechanics.forEach((mechanic) => {
    if (
      !mechanic.location ||
      !mechanic.location.coordinates
    ) {
      return;
    }

    const [longitude, latitude] =
      mechanic.location.coordinates;

    const marker = mapplsClassObject.Marker({
      map,
      position: {
        lat: latitude,
        lng: longitude,
      },
      popupHtml: `
        <div style="padding: 10px; min-width: 180px;">
          <strong>${mechanic.businessName}</strong>
          <br />
          <span>${mechanic.experience} years experience</span>
          <br />
          <span>⭐ ${mechanic.rating || 0}</span>
          <br />
          <span style="color: green;">
            ● Available
          </span>
        </div>
      `,
      width: 35,
      height: 45,
    });

    mechanicMarkersRef.current.push(marker);
  });

  console.log(
    `${mechanics.length} mechanic marker(s) added`
  );
}, [isMapLoaded, mechanics]);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border">
      <div id="roadside-map" className="w-full h-full" />

      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          Loading Map...
        </div>
      )}

      {locationError && (
        <div className="absolute top-4 left-4 right-4 z-10 bg-white rounded-lg shadow p-3 text-sm text-red-600">
          {locationError}
        </div>
      )}

      {mechanicError && (
        <div className="absolute top-20 left-4 right-4 z-10 bg-white rounded-lg shadow p-3 text-sm text-red-600">
          {mechanicError}
        </div>
      )}

      {location && (
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow px-4 py-3 text-sm">
          <p className="font-semibold">Your Location</p>

          <p>Lat: {location.latitude.toFixed(6)}</p>

          <p>Lng: {location.longitude.toFixed(6)}</p>

          <p className="mt-1">
            Nearby mechanics: <strong>{mechanics.length}</strong>
          </p>

          {selectedMechanic && (
            <div className="absolute inset-0 z-30 flex items-end justify-center pointer-events-none">
              <div className="pointer-events-auto w-full max-w-md mb-4 mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-5">
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
                      onClick={() => setSelectedMechanic(null)}
                      className="text-gray-500 hover:text-gray-900 text-xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex gap-3 mt-3 text-sm">
                    <span>⭐ {selectedMechanic.rating || 0}</span>

                    <span className="text-green-600 font-medium">
                      ● Available
                    </span>
                  </div>

                  {selectedMechanic.description && (
                    <p className="text-sm text-gray-600 mt-3">
                      {selectedMechanic.description}
                    </p>
                  )}

                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Services</h3>

                    {selectedMechanic.servicesOffered?.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedMechanic.servicesOffered.map((service) => (
                          <div
                            key={service._id}
                            className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                          >
                            <div>
                              <p className="font-medium text-sm">
                                {service.name}
                              </p>

                              <p className="text-xs text-gray-500">
                                ~{service.estimatedDuration} min
                              </p>
                            </div>

                            <span className="font-semibold text-purple-600">
                              ₹{service.basePrice}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No services available.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      alert(
                        `Request assistance from ${selectedMechanic.businessName}`,
                      );
                    }}
                    className="w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    Request Assistance
                  </button>
                </div>
              </div>
            </div>
          )}
          {selectedMechanic && (
            <div className="absolute inset-0 z-30 flex items-end justify-center pointer-events-none">
              <div className="pointer-events-auto w-full max-w-md mb-4 mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-5">
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
                      onClick={() => setSelectedMechanic(null)}
                      className="text-gray-500 hover:text-gray-900 text-xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex gap-3 mt-3 text-sm">
                    <span>⭐ {selectedMechanic.rating || 0}</span>

                    <span className="text-green-600 font-medium">
                      ● Available
                    </span>
                  </div>

                  {selectedMechanic.description && (
                    <p className="text-sm text-gray-600 mt-3">
                      {selectedMechanic.description}
                    </p>
                  )}

                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Services</h3>

                    {selectedMechanic.servicesOffered?.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedMechanic.servicesOffered.map((service) => (
                          <div
                            key={service._id}
                            className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                          >
                            <div>
                              <p className="font-medium text-sm">
                                {service.name}
                              </p>

                              <p className="text-xs text-gray-500">
                                ~{service.estimatedDuration} min
                              </p>
                            </div>

                            <span className="font-semibold text-purple-600">
                              ₹{service.basePrice}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No services available.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      alert(
                        `Request assistance from ${selectedMechanic.businessName}`,
                      );
                    }}
                    className="w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    Request Assistance
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoadsideMap;
