import { PickupStation } from "@/types/pickup-station";

export async function fetchPickupStations(): Promise<PickupStation[]> {
  try {
    // Convert Google Sheets URL to CSV export URL
    const csvUrl = 'https://docs.google.com/spreadsheets/d/19_ER7XMk2DSo_iTFL7RY1Hk_KRwkbuMEh6AEd5TypqM/export?format=csv&gid=0';
    
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    
    // Parse CSV data
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    
    const stations: PickupStation[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Simple CSV parsing - for production, consider using a proper CSV parser
      const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
      
      if (values.length >= 10) {
        const station: PickupStation = {
          name: values[0] || '',
          timeOpenedWeek: values[1] || '',
          timeOpenedWeekend: values[2] || '',
          number: values[3] || '',
          address: values[4] || '',
          state: values[5] || '',
          email: values[6] || '',
          landmark: values[7] || '',
          latitude: parseFloat(values[8]) || 0,
          longitude: parseFloat(values[9]) || 0,
        };
        
        stations.push(station);
      }
    }
    
    return stations;
  } catch (error) {
    console.error('Error fetching pickup stations:', error);
    
    // Return sample data as fallback
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
        longitude: 3.3792
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
        longitude: 3.3515
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
        longitude: 3.4219
      }
    ];
  }
}