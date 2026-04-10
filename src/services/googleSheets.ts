import { PickupStation } from "@/types/pickup-station";

const CACHE_KEY = "pickup_stations_cache";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CacheData {
  timestamp: number;
  data: PickupStation[];
}

export async function fetchPickupStations(): Promise<PickupStation[]> {
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxzlmIKMT0beysDKKgcTat_grcgOt8bHRw_yDhFJi74EBuwPkeKBclJPtaS9ScivWBF/exec";

  // Try to get cached data first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { timestamp, data }: CacheData = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
      
      // If data is fresh, we could return it immediately.
      // But we will mostly rely on TanStack Query for the "stale-while-revalidate" pattern.
      if (!isExpired) {
        console.log("Using fresh cached data");
        // return data; // We'll let the query hook handle this
      }
    } catch (e) {
      console.error("Failed to parse cache", e);
    }
  }

  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    
    const rawData = await response.json();
    
    // Map data to ensure consistency
    const data = rawData.map((s: any) => ({
      ...s,
      timeOpenedWeek: s.week || s.timeOpenedWeek,
      timeOpenedWeekend: s.weekend || s.timeOpenedWeekend
    })) as PickupStation[];

    // Update cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data
    }));

    return data;
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    
    // Fallback to cache on error if available
    const fallbackCached = localStorage.getItem(CACHE_KEY);
    if (fallbackCached) {
      try {
        const { data }: CacheData = JSON.parse(fallbackCached);
        console.log("Using cached data as fallback after fetch error");
        return data;
      } catch (e) {}
    }

    // Ultimate fallback to initial sample data
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

export function getCachedPickupStations(): PickupStation[] | null {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  try {
    const { data }: CacheData = JSON.parse(cached);
    return data;
  } catch (e) {
    return null;
  }
}
