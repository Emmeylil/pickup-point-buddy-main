import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, ArrowLeft, Loader2, RotateCw } from "lucide-react";
import { Link } from "react-router-dom";
import { PickupStation } from "@/types/pickup-station";
import { fetchPickupStations, createPickupStation, updatePickupStation, deletePickupStation, syncGoogleSheets } from "@/services/googleSheets";
import { toast } from "sonner";

export default function Admin() {
  const [stations, setStations] = useState<PickupStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<PickupStation | null>(null);
  const [formData, setFormData] = useState<Partial<PickupStation>>({});

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    setLoading(true);
    try {
      const data = await fetchPickupStations();
      setStations(data);
    } catch (error) {
      toast.error("Failed to load stations");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "latitude" || name === "longitude" ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStation) {
        await updatePickupStation((editingStation as any).id, formData);
        toast.success("Station updated successfully");
      } else {
        await createPickupStation(formData);
        toast.success("Station created successfully");
      }
      setIsDialogOpen(false);
      setEditingStation(null);
      setFormData({});
      loadStations();
    } catch (error) {
      toast.error("An error occurred while saving");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this station?")) return;

    try {
      await deletePickupStation(id);
      toast.success("Station deleted successfully");
      loadStations();
    } catch (error) {
      toast.error("An error occurred while deleting");
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncGoogleSheets();
      if (result.success) {
        toast.success(`Synced ${result.count} stations from Google Sheets`);
        loadStations();
      }
    } catch (error) {
      toast.error("Failed to sync with Google Sheets");
    } finally {
      setSyncing(false);
    }
  };

  const openAddDialog = () => {
    setEditingStation(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (station: PickupStation) => {
    setEditingStation(station);
    setFormData(station);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-jumia-orange" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-jumia-dark">Admin Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSync} 
            disabled={syncing}
            className="border-jumia-orange text-jumia-orange hover:bg-jumia-orange/10"
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RotateCw className="h-4 w-4 mr-2" />
            )}
            Sync from Google Sheet
          </Button>
          <Button onClick={openAddDialog} className="bg-jumia-orange hover:bg-jumia-orange/90">
            <Plus className="h-4 w-4 mr-2" /> Add Station
          </Button>
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Pickup Stations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map((station) => (
                <TableRow key={(station as any).id}>
                  <TableCell className="font-medium">{station.name}</TableCell>
                  <TableCell>{station.state}</TableCell>
                  <TableCell className="max-w-xs truncate">{station.address}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(station)}>
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete((station as any).id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStation ? "Edit Station" : "Add New Station"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name || ""} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" value={formData.state || ""} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="number">Phone Number</Label>
                <Input id="number" name="number" value={formData.number || ""} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address || ""} onChange={handleInputChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="landmark">Landmark</Label>
              <Input id="landmark" name="landmark" value={formData.landmark || ""} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="timeOpenedWeek">Weekday Hours</Label>
                <Input id="timeOpenedWeek" name="timeOpenedWeek" value={formData.timeOpenedWeek || ""} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timeOpenedWeekend">Weekend Hours</Label>
                <Input id="timeOpenedWeekend" name="timeOpenedWeekend" value={formData.timeOpenedWeekend || ""} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" name="latitude" type="number" step="any" value={formData.latitude || ""} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" name="longitude" type="number" step="any" value={formData.longitude || ""} onChange={handleInputChange} required />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full bg-jumia-orange hover:bg-jumia-orange/90">
                {editingStation ? "Update Station" : "Create Station"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
