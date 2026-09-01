const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const addVehicle = async (vehicleData, token) => {
  const response = await fetch(`${API_URL}/vehicles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(vehicleData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add vehicle");
  }

  return data;
};

export const getMyVehicles = async (token) => {
  const response = await fetch(`${API_URL}/vehicles/my`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch vehicles");
  }

  return data;
};
