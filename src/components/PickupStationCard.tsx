import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, Mail, Navigation, ChevronRight } from "lucide-react";
import { PickupStation } from "@/types/pickup-station";

interface PickupStationCardProps {
  station: PickupStation;
  index?: number;
  isSelected?: boolean;
  onViewOnMap: (station: PickupStation) => void;
}

export function PickupStationCard({ station, index, isSelected, onViewOnMap }: PickupStationCardProps) {
  return (
    <Card 
      className={`transition-all duration-300 border-border/60 hover:border-jumia-orange hover:shadow-md cursor-pointer ${
        isSelected ? 'ring-2 ring-jumia-orange bg-orange-50/30 border-jumia-orange' : 'bg-white'
      }`}
      onClick={() => onViewOnMap(station)}
    >
      <CardHeader className="pb-1.5 pt-3 px-2.5 sm:px-4">
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex items-start gap-2 min-w-0">
            {typeof index === 'number' && (
              <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-jumia-orange text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                {index + 1}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 flex-wrap mb-0.5">
                <CardTitle className="text-xs sm:text-base font-extrabold text-jumia-dark leading-tight">
                  {station.name}
                </CardTitle>
                {station.state && (
                  <Badge variant="secondary" className="text-[9px] sm:text-[10px] bg-jumia-orange/10 text-jumia-orange font-semibold border-none shrink-0 px-1 py-0">
                    {station.state}
                  </Badge>
                )}
              </div>
              <div className="flex items-start gap-1 text-jumia-gray text-[10px] sm:text-xs mt-0.5">
                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-jumia-orange shrink-0 mt-0.5" />
                <span className="line-clamp-2">{station.address}</span>
              </div>
              {station.landmark && (
                <div className="text-[10px] sm:text-xs text-jumia-gray/90 mt-0.5 line-clamp-1">
                  <span className="font-semibold text-jumia-dark/70">Landmark:</span> {station.landmark}
                </div>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0 self-center" />
        </div>
      </CardHeader>
      
      <CardContent className="pb-3 pt-1 px-2.5 sm:px-4 space-y-2">
        {/* Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs pt-1.5 border-t border-gray-100">
          {station.timeOpenedWeek && (
            <div className="flex items-center gap-1 text-jumia-gray text-[10px] sm:text-[11px]">
              <Clock className="h-3 w-3 text-jumia-orange shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-jumia-dark hidden sm:inline">Weekdays: </span>
                <span>{station.timeOpenedWeek}</span>
              </div>
            </div>
          )}
          {station.timeOpenedWeekend && (
            <div className="flex items-center gap-1 text-jumia-gray text-[10px] sm:text-[11px]">
              <Clock className="h-3 w-3 text-jumia-orange shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-jumia-dark hidden sm:inline">Weekends: </span>
                <span>{station.timeOpenedWeekend}</span>
              </div>
            </div>
          )}
        </div>

        {/* Contact Info (Phone & Email) */}
        {(station.number || station.email) && (
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs pt-1 border-t border-gray-100">
            {station.number && (
              <div className="flex items-center gap-1 min-w-0">
                <Phone className="h-3 w-3 text-jumia-orange shrink-0" />
                <a 
                  href={`tel:${station.number}`}
                  onClick={(e) => e.stopPropagation()} 
                  className="text-jumia-dark hover:text-jumia-orange text-[10px] sm:text-[11px] truncate font-medium"
                >
                  {station.number}
                </a>
              </div>
            )}
            {station.email && (
              <div className="flex items-center gap-1 min-w-0">
                <Mail className="h-3 w-3 text-jumia-orange shrink-0" />
                <a 
                  href={`mailto:${station.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-jumia-dark hover:text-jumia-orange text-[10px] sm:text-[11px] truncate font-medium"
                >
                  {station.email}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-1 pt-1">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewOnMap(station);
            }}
            className="flex-1 text-[10px] sm:text-xs h-7 sm:h-8.5 bg-jumia-orange text-white font-semibold hover:bg-jumia-orange/90 border-none shadow-xs transition-all px-1"
          >
            <Navigation className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-0.5" />
            Map
          </Button>
          <Button
            size="sm"
            asChild
            className="flex-1 text-[10px] sm:text-xs h-7 sm:h-8.5 bg-black text-white font-semibold hover:bg-black/90 border-none shadow-xs transition-all px-1"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Directions
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
