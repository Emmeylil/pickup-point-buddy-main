import { PickupStation } from "@/types/pickup-station";

export async function fetchPickupStations(): Promise<PickupStation[]> {
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxzlmIKMT0beysDKKgcTat_grcgOt8bHRw_yDhFJi74EBuwPkeKBclJPtaS9ScivWBF/exec";
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  try {
    // 1. Try local backend first
    console.log("Attempting to fetch from backend...");
    const response = await fetch(`${BACKEND_URL}/api/pickup-stations`);
    if (!response.ok) throw new Error(`Backend error ${response.status}`);
    return await response.json();
  } catch (backendError) {
    console.warn("Backend unreachable, falling back to Google Sheets:", backendError);
    
    try {
      // 2. Fallback to Google Sheets directly
      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) throw new Error(`Google Sheets error ${response.status}`);
      
      const data = await response.json();
      
      // 3. Map data to ensure consistency (backend uses timeOpenedWeek, sheet might use week)
      return data.map((s: any) => ({
        ...s,
        timeOpenedWeek: s.timeOpenedWeek || s.week,
        timeOpenedWeekend: s.timeOpenedWeekend || s.weekend
      })) as PickupStation[];
    } catch (sheetError) {
      console.error("Both backend and Google Sheets failed:", sheetError);
      
      // 4. Return initial sample data as last resort
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
