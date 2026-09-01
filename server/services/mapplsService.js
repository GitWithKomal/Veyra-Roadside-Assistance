const getDistanceAndETA = async (
  customerLatitude,
  customerLongitude,
  mechanics,
) => {
  try {
    const apiKey = process.env.MAPPLS_API_KEY;

    if (!apiKey) {
      throw new Error("MAPPLS_API_KEY is not configured");
    }

    const validMechanics = mechanics.filter(
      (mechanic) => mechanic.location?.coordinates?.length === 2,
    );

    if (validMechanics.length === 0) {
      return [];
    }

    const source = `${customerLongitude},${customerLatitude}`;

    const destinations = validMechanics
      .map((mechanic) => {
        const [longitude, latitude] = mechanic.location.coordinates;

        return `${longitude},${latitude}`;
      })
      .join(";");

    const url =
      `https://route.mappls.com/route/dm/distance_matrix/driving/` +
      `${source};${destinations}` +
      `?access_token=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`Mappls API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data.results || !data.results.distances || !data.results.durations) {
      throw new Error("Invalid response received from Mappls Distance Matrix");
    }

    const distances = data.results.distances[0];
    const durations = data.results.durations[0];

    return validMechanics.map((mechanic, index) => {
      const destinationIndex = index + 1;

      const distanceMeters = distances[destinationIndex];

      const durationSeconds = durations[destinationIndex];

      return {
        mechanicId: mechanic._id,
        distanceKm:
          typeof distanceMeters === "number"
            ? Number((distanceMeters / 1000).toFixed(1))
            : null,
        durationMinutes:
          typeof durationSeconds === "number"
            ? Math.max(1, Math.round(durationSeconds / 60))
            : null,
      };
    });
  } catch (error) {
    console.error("Mappls distance/ETA error:", error.message);

    return [];
  }
};

export const getDrivingRoute = async (
  customerLatitude,
  customerLongitude,
  mechanicLatitude,
  mechanicLongitude,
) => {
  try {
    const apiKey = process.env.MAPPLS_API_KEY;

    if (!apiKey) {
      throw new Error("MAPPLS_API_KEY is not configured");
    }

    const start = `${customerLongitude},${customerLatitude}`;
    const end = `${mechanicLongitude},${mechanicLatitude}`;

    const url =
      `https://route.mappls.com/route/direction/route_adv/driving/` +
      `${start};${end}` +
      `?steps=true&geometries=geojson&access_token=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Mappls Route API error ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();

    if (!data.routes || !data.routes.length) {
      throw new Error("No route found");
    }

    return data;
  } catch (error) {
    console.error("Mappls route error:", error.message);

    throw error;
  }
};

export default getDistanceAndETA;
