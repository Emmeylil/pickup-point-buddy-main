import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PickupStationCardSkeleton() {
  return (
    <Card className="border-border/50 animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Skeleton className="h-6 w-3/4 rounded" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex items-center gap-1 mb-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-full rounded" />
        </div>
        <Skeleton className="h-4 w-1/2 rounded" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="space-y-1 w-full">
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-3 w-3/4 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-full rounded" />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-full rounded" />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 flex-1 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PickupStationGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <PickupStationCardSkeleton key={i} />
      ))}
    </div>
  );
}
