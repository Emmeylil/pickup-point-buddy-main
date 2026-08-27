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
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 min-w-0">
            {typeof index === 'number' && (
              <div className="w-7 h-7 rounded-full bg-jumia-orange text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                {index + 1}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <CardTitle className="text-base font-extrabold text-jumia-dark leading-tight">
                  {station.name}
                </CardTitle>
                {station.state && (
                  <Badge variant="secondary" className="text-[10px] bg-jumia-orange/10 text-jumia-orange font-semibold border-none shrink-0">
                    {station.state}
                  </Badge>
                )}
              </div>
              <div className="flex items-start gap-1 text-jumia-gray text-xs mt-1">
                <MapPin className="h-3.5 w-3.5 text-jumia-orange shrink-0 mt-0.5" />
                <span>{station.address}</span>
              </div>
              {station.landmark && (
                <div className="text-xs text-jumia-gray/90 mt-1">
                  <span className="font-semibold text-jumia-dark/70">Landmark:</span> {station.landmark}
                </div>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 shrink-0 self-center" />
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 pt-2 px-4 space-y-3">
        {/* Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
          {station.timeOpenedWeek && (
            <div className="flex items-center gap-1.5 text-jumia-gray">
              <Clock className="h-3.5 w-3.5 text-jumia-orange shrink-0" />
              <div>
                <span className="font-semibold text-jumia-dark block text-[11px]">Weekdays</span>
                <span className="text-[11px]">{station.timeOpenedWeek}</span>
              </div>
            </div>
          )}
          {station.timeOpenedWeekend && (
            <div className="flex items-center gap-1.5 text-jumia-gray">
              <Clock className="h-3.5 w-3.5 text-jumia-orange shrink-0" />
              <div>
                <span className="font-semibold text-jumia-dark block text-[11px]">Weekends</span>
                <span className="text-[11px]">{station.timeOpenedWeekend}</span>
              </div>
            </div>
          )}
        </div>

        {/* Contact Info (Phone & Email) */}
        {(station.number || station.email) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
            {station.number && (
              <div className="flex items-center gap-1.5 min-w-0">
                <Phone className="h-3.5 w-3.5 text-jumia-orange shrink-0" />
                <a 
                  href={`tel:${station.number}`}
                  onClick={(e) => e.stopPropagation()} 
                  className="text-jumia-dark hover:text-jumia-orange text-[11px] truncate font-medium"
                >
                  {station.number}
                </a>
              </div>
            )}
            {station.email && (
              <div className="flex items-center gap-1.5 min-w-0">
                <Mail className="h-3.5 w-3.5 text-jumia-orange shrink-0" />
                <a 
                  href={`mailto:${station.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-jumia-dark hover:text-jumia-orange text-[11px] truncate font-medium"
                >
                  {station.email}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewOnMap(station);
            }}
            className="flex-1 text-xs h-8.5 bg-jumia-orange text-white font-semibold hover:bg-jumia-orange/90 border-none shadow-xs transition-all active:scale-[0.98]"
          >
            <Navigation className="h-3.5 w-3.5 mr-1" />
            View Map
          </Button>
          <Button
            size="sm"
            asChild
            className="flex-1 text-xs h-8.5 bg-black text-white font-semibold hover:bg-black/90 border-none shadow-xs transition-all active:scale-[0.98]"
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



