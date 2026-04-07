import { PickupStation } from "@/types/pickup-station";

export async function fetchPickupStations(): Promise<PickupStation[]> {
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxzlmIKMT0beysDKKgcTat_grcgOt8bHRw_yDhFJi74EBuwPkeKBclJPtaS9ScivWBF/exec";

  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    
    const data = await response.json();
    
    // Map data to ensure consistency (sheet uses week/weekend)
    return data.map((s: any) => ({
      ...s,
      timeOpenedWeek: s.week || s.timeOpenedWeek,
      timeOpenedWeekend: s.weekend || s.timeOpenedWeekend
    })) as PickupStation[];
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    
    // Return initial sample data as last resort
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
