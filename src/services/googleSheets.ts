import { PickupStation } from "@/types/pickup-station";

export async function fetchPickupStations(): Promise<PickupStation[]> {
  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const url = `${API_URL}/api/pickup-stations`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();

    // Ensure the data matches PickupStation[]
    return data as PickupStation[];
  } catch (error) {
    console.error("Error fetching pickup stations:", error);

    // fallback sample
    return [
      {
        name: "Downtown Pickup Center",
        timeOpenedWeek: "8:00 AM - 8:00 PM",
        timeOpenedWeekend: "9:00 AM - 6:00 PM",
        number: "+1-555-0123",
        address: "123 Main Street, Downtown",
        state: "Lagos",
        email: "downtown@pickup.com",
        landmark: "Near Central Bank",
        latitude: 6.5244,
        longitude: 3.3792,
      },
      {
        name: "Ikeja Express Station",
        timeOpenedWeek: "7:00 AM - 9:00 PM",
        timeOpenedWeekend: "8:00 AM - 7:00 PM",
        number: "+1-555-0124",
        address: "45 Ikeja Way, Ikeja",
        state: "Lagos",
        email: "ikeja@pickup.com",
        landmark: "Opposite Shoprite Mall",
        latitude: 6.6018,
        longitude: 3.3515,
      },
      {
        name: "Victoria Island Hub",
        timeOpenedWeek: "9:00 AM - 7:00 PM",
        timeOpenedWeekend: "10:00 AM - 5:00 PM",
        number: "+1-555-0125",
        address: "78 Ahmadu Bello Way, Victoria Island",
        state: "Lagos",
        email: "vi@pickup.com",
        landmark: "Near Eko Hotel",
        latitude: 6.4281,
        longitude: 3.4219,
      },
    ];
  }
}

export async function createPickupStation(station: Partial<PickupStation>): Promise<PickupStation> {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const response = await fetch(`${API_URL}/api/pickup-stations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(station),
  });
  if (!response.ok) throw new Error("Failed to create station");
  return response.json();
}

export async function updatePickupStation(id: number, station: Partial<PickupStation>): Promise<PickupStation> {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const response = await fetch(`${API_URL}/api/pickup-stations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(station),
  });
  if (!response.ok) throw new Error("Failed to update station");
  return response.json();
}

export async function deletePickupStation(id: number): Promise<void> {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const response = await fetch(`${API_URL}/api/pickup-stations/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete station");
}

export async function syncGoogleSheets(): Promise<{ success: boolean; count: number }> {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const response = await fetch(`${API_URL}/api/sync`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to sync with Google Sheets");
  return response.json();
}
