import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Loader2 } from "lucide-react";
import { PickupStation } from "@/types/pickup-station";
import { PickupStationCard } from "./PickupStationCard";
import { PickupStationMap } from "./PickupStationMap";
import { JumiaInfoSection } from "./JumiaInfoSection";
import { fetchPickupStations } from "@/services/googleSheets";

export function PickupStationLocator() {
  const [stations, setStations] = useState<PickupStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<PickupStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<PickupStation>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      setLoading(true);
      const data = await fetchPickupStations();
      setStations(data);
      setFilteredStations(data);
    } catch (error) {
      console.error('Failed to load stations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = stations;

    if (searchQuery) {
      filtered = filtered.filter(station =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.landmark.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedState) {
      filtered = filtered.filter(station => station.state === selectedState);
    }

    setFilteredStations(filtered);
  }, [searchQuery, selectedState, stations]);

  const uniqueStates = Array.from(new Set(stations.map(station => station.state)));

  const handleViewOnMap = (station: PickupStation) => {
    setSelectedStation(station);
    setViewMode('map');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-jumia-orange" />
          <p className="text-jumia-gray">Loading pickup stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-card border-b border-border/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-jumia rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-jumia-dark">
                Find the stations close to you
              </h1>
            </div>
            <p className="text-jumia-gray max-w-2xl mx-auto">
              Locate the most convenient Jumia pickup station near you for hassle-free order collection
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jumia-gray h-4 w-4" />
              <Input
                placeholder="Search by name, address, or landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border/50 focus:ring-jumia-orange"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedState === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedState("")}
                className={selectedState === "" ? "bg-jumia-orange hover:bg-jumia-orange/90" : ""}
              >
                All States
              </Button>
              {uniqueStates.map(state => (
                <Button
                  key={state}
                  variant={selectedState === state ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedState(state)}
                  className={selectedState === state ? "bg-jumia-orange hover:bg-jumia-orange/90" : ""}
                >
                  {state}
                </Button>
              ))}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center mt-6">
            <div className="flex gap-1 p-1 bg-jumia-light-gray rounded-lg">
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? "bg-jumia-orange hover:bg-jumia-orange/90" : "hover:bg-white"}
              >
                List View
              </Button>
              <Button
                variant={viewMode === 'map' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? "bg-jumia-orange hover:bg-jumia-orange/90" : "hover:bg-white"}
              >
                Map View
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Jumia Info Section */}
      <JumiaInfoSection />

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-jumia-orange" />
            <span className="text-sm text-jumia-gray">
              {filteredStations.length} pickup station{filteredStations.length !== 1 ? 's' : ''} found
            </span>
          </div>
          {selectedStation && viewMode === 'map' && (
            <Badge variant="secondary" className="bg-jumia-orange/10 text-jumia-orange">
              Viewing: {selectedStation.name}
            </Badge>
          )}
        </div>

        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStations.map((station, index) => (
              <PickupStationCard
                key={`${station.name}-${index}`}
                station={station}
                onViewOnMap={handleViewOnMap}
              />
            ))}
          </div>
        ) : (
          <div className="h-[600px]">
            <PickupStationMap
              stations={filteredStations}
              selectedStation={selectedStation}
            />
          </div>
        )}

        {filteredStations.length === 0 && (
          <Card className="text-center py-12 border-border/50">
            <CardContent>
              <MapPin className="h-12 w-12 text-jumia-gray mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-jumia-dark">No stations found</h3>
              <p className="text-jumia-gray">
                Try adjusting your search criteria or clearing filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}