import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, Mail, Navigation } from "lucide-react";
import { PickupStation } from "@/types/pickup-station";

interface PickupStationCardProps {
  station: PickupStation;
  onViewOnMap: (station: PickupStation) => void;
}

export function PickupStationCard({ station, onViewOnMap }: PickupStationCardProps) {
  return (
    <Card className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-jumia-orange/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-jumia-dark">{station.name}</CardTitle>
          <Badge variant="secondary" className="text-xs bg-jumia-orange/10 text-jumia-orange">
            {station.state}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-jumia-gray text-sm">
          <MapPin className="h-4 w-4" />
          <span>{station.address}</span>
        </div>
        {station.landmark && (
          <div className="text-sm text-jumia-gray">
            <span className="font-medium">Landmark:</span> {station.landmark}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-jumia-orange" />
            <div className="text-sm">
              <div className="font-medium text-jumia-dark">Weekdays</div>
              <div className="text-jumia-gray">{station.timeOpenedWeek}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-jumia-orange" />
            <div className="text-sm">
              <div className="font-medium text-jumia-dark">Weekends</div>
              <div className="text-jumia-gray">{station.timeOpenedWeekend}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Phone className="h-4 w-4 text-jumia-orange" />
            <a href={`tel:${station.number}`} className="text-sm hover:text-jumia-orange transition-colors">
              {station.number}
            </a>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Mail className="h-4 w-4 text-jumia-orange" />
            <a href={`mailto:${station.email}`} className="text-sm hover:text-jumia-orange transition-colors truncate">
              {station.email}
            </a>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={() => onViewOnMap?.(station)} // Safe check if handler exists
            className="flex-1 bg-black text-white hover:bg-black/90"
          >
            <Navigation className="h-4 w-4 mr-2" />
            View on Map
          </Button>
          <Button
            size="sm"
            asChild
            className="flex-1 bg-black text-white hover:bg-black/90"
          >
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions
            </a>
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}