import { useState, useEffect, useMemo, lazy, Suspense, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Loader2, ChevronLeft, ChevronRight, Layers, List, Map as MapIcon } from "lucide-react";
import { PickupStation } from "@/types/pickup-station";
import { PickupStationCard } from "./PickupStationCard";
import { JumiaInfoSection } from "./JumiaInfoSection";
import { PickupStationGridSkeleton } from "./PickupStationSkeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchPickupStations, getCachedPickupStations } from "@/services/googleSheets";

const PickupStationMap = lazy(() => import("./PickupStationMap"));

export function PickupStationLocator() {
  const { 
    data: stations = [], 
    isLoading, 
    isFetching,
  } = useQuery({
    queryKey: ['pickup-stations'],
    queryFn: fetchPickupStations,
    staleTime: 5 * 60 * 1000,
    placeholderData: () => getCachedPickupStations() || undefined,
    refetchOnWindowFocus: false,
  });

  const [selectedStation, setSelectedStation] = useState<PickupStation>();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredStations = useMemo(() => {
    let filtered = stations;

    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(station =>
        station.name.toLowerCase().includes(query) ||
        station.address.toLowerCase().includes(query) ||
        station.landmark.toLowerCase().includes(query)
      );
    }

    if (selectedState) {
      filtered = filtered.filter(station => station.state === selectedState);
    }

    return filtered;
  }, [debouncedSearchQuery, selectedState, stations]);

  const uniqueStates = useMemo(() => 
    Array.from(new Set(stations.map(station => station.state))).filter(Boolean),
    [stations]
  );

  const handleViewOnMap = (station: PickupStation) => {
    setSelectedStation(station);
    // On small screens, switch to map view when clicking view on map if in list mode
    if (window.innerWidth < 1024 && viewMode === 'list') {
      setViewMode('map');
    }
  };

  const scrollRegions = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Full page loader if NO data at all
  if (isLoading && stations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex flex-col pt-20 items-center">
        <Loader2 className="h-10 w-10 animate-spin text-jumia-orange mb-4" />
        <h2 className="text-xl font-semibold text-jumia-dark mb-2">Preparing pickup stations</h2>
        <p className="text-jumia-gray">Fetching nearby pickup locations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Banner */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-jumia-orange rounded-xl flex items-center justify-center shadow-sm">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-jumia-dark tracking-tight">
                  Find the stations close to you
                </h1>
                <p className="text-xs text-jumia-gray">
                  Locate the most convenient Jumia pickup station near you for hassle-free order collection
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by area, station name, landmark..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-jumia-orange text-sm rounded-lg"
                />
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex bg-gray-100 p-1 rounded-lg border border-gray-200 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('split')}
                  className={`h-8 text-xs px-2.5 ${viewMode === 'split' ? 'bg-white text-jumia-dark shadow-xs font-semibold' : 'text-gray-600'}`}
                >
                  <Layers className="h-3.5 w-3.5 mr-1" />
                  Split
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-8 text-xs px-2.5 ${viewMode === 'list' ? 'bg-white text-jumia-dark shadow-xs font-semibold' : 'text-gray-600'}`}
                >
                  <List className="h-3.5 w-3.5 mr-1" />
                  List
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className={`h-8 text-xs px-2.5 ${viewMode === 'map' ? 'bg-white text-jumia-dark shadow-xs font-semibold' : 'text-gray-600'}`}
                >
                  <MapIcon className="h-3.5 w-3.5 mr-1" />
                  Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="container mx-auto px-4 py-4 flex-1 flex flex-col">
        {/* Jumia Information & Benefits Section (Positioned FIRST before region controls, station list & map) */}
        <section className="mb-6">
          <JumiaInfoSection />
        </section>

        {/* Region Selection Controls - Directly above station list and map */}
        <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-jumia-dark tracking-wide uppercase flex items-center gap-2">
              <span>Select your region</span>
              {selectedState && (
                <Badge variant="outline" className="text-xs font-normal text-jumia-orange border-jumia-orange/30">
                  {selectedState}
                </Badge>
              )}
            </h2>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollRegions('left')}
                className="h-7 w-7 rounded-full border-gray-200 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollRegions('right')}
                className="h-7 w-7 rounded-full border-gray-200 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Scrollable Pill Bar */}
          <div 
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <Button
              variant={selectedState === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedState("")}
              className={`rounded-full px-5 text-xs font-medium shrink-0 h-9 transition-all ${
                selectedState === "" 
                  ? "bg-black text-white hover:bg-black/90 shadow-xs" 
                  : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              All States
            </Button>
            {uniqueStates.map(state => (
              <Button
                key={state}
                variant={selectedState === state ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedState(state)}
                className={`rounded-full px-5 text-xs font-medium shrink-0 h-9 transition-all ${
                  selectedState === state 
                    ? "bg-black text-white hover:bg-black/90 shadow-xs" 
                    : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {state}
              </Button>
            ))}
          </div>
        </section>

        {/* Station Results Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-jumia-dark">
              Pickup stations in {selectedState || "All States"}
            </h3>
            {isFetching && !isLoading && (
              <div className="flex items-center gap-1 text-xs text-jumia-orange animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Updating...</span>
              </div>
            )}
          </div>
          <span className="text-xs font-semibold text-jumia-gray bg-gray-200/60 px-2.5 py-1 rounded-full">
            {filteredStations.length} locations found
          </span>
        </div>

        {/* Mobile View Toggle Bar (visible only on small screens) */}
        <div className="sm:hidden flex bg-gray-200 p-1 rounded-lg border border-gray-300 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('list')}
            className={`flex-1 text-xs h-8 ${viewMode === 'list' || viewMode === 'split' ? 'bg-white text-jumia-dark shadow-xs font-semibold' : 'text-gray-600'}`}
          >
            <List className="h-3.5 w-3.5 mr-1" />
            List ({filteredStations.length})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('map')}
            className={`flex-1 text-xs h-8 ${viewMode === 'map' ? 'bg-white text-jumia-dark shadow-xs font-semibold' : 'text-gray-600'}`}
          >
            <MapIcon className="h-3.5 w-3.5 mr-1" />
            Map View
          </Button>
        </div>

        {/* Content Section: Station List & Interactive Map side-by-side or toggled */}
        {isLoading && stations.length > 0 ? (
          <PickupStationGridSkeleton />
        ) : filteredStations.length === 0 ? (
          <Card className="text-center py-12 border-dashed border-gray-300 bg-white">
            <CardContent>
              <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold mb-1 text-jumia-dark">No stations found</h3>
              <p className="text-xs text-jumia-gray mb-4">
                Try selecting a different region or clearing search query
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedState("");
                  setSearchQuery("");
                }}
                className="text-xs"
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[500px] mb-8">
            {/* List Column */}
            {(viewMode === 'split' || viewMode === 'list') && (
              <div className={`${
                viewMode === 'list' 
                  ? 'lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                  : 'lg:col-span-5 space-y-3 overflow-y-auto max-h-[650px] pr-1 scrollbar-thin'
              }`}>
                {filteredStations.map((station, index) => (
                  <PickupStationCard
                    key={`${station.name}-${index}`}
                    station={station}
                    index={index}
                    isSelected={selectedStation?.name === station.name}
                    onViewOnMap={handleViewOnMap}
                  />
                ))}
              </div>
            )}

            {/* Map Column */}
            {(viewMode === 'split' || viewMode === 'map') && (
              <div className={`${
                viewMode === 'map' 
                  ? 'lg:col-span-12 h-[600px]' 
                  : 'lg:col-span-7 h-[650px]'
              } rounded-xl overflow-hidden shadow-xs sticky top-20`}>
                <Suspense fallback={
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-xl">
                    <Loader2 className="h-8 w-8 animate-spin text-jumia-orange mb-2" />
                    <p className="text-xs text-jumia-gray">Loading map...</p>
                  </div>
                }>
                  <PickupStationMap
                    stations={filteredStations}
                    selectedStation={selectedStation}
                    onSelectStation={setSelectedStation}
                  />
                </Suspense>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}