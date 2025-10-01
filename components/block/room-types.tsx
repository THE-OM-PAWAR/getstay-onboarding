'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, CreditCard as Edit, DoorOpen } from 'lucide-react';
import { toast } from 'sonner';

interface RoomComponent {
  _id: string;
  name: string;
  description: string;
}

interface RoomType {
  _id: string;
  name: string;
  description: string;
  components: RoomComponent[];
  rent: number;
  images: Array<{ url: string; title: string; isCover: boolean }>;
  createdAt: string;
}

interface RoomTypesProps {
  blockId: string;
}

export default function RoomTypes({ blockId }: RoomTypesProps) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [availableComponents, setAvailableComponents] = useState<RoomComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rent: '',
    components: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [blockId]);

  const fetchData = async () => {
    try {
      const [typesRes, componentsRes] = await Promise.all([
        fetch(`/api/room-types?blockId=${blockId}`),
        fetch(`/api/room-components?blockId=${blockId}`),
      ]);

      const typesData = await typesRes.json();
      const componentsData = await componentsRes.json();

      if (typesData.success) {
        setRoomTypes(typesData.data);
      }

      if (componentsData.success) {
        setAvailableComponents(componentsData.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (roomType?: RoomType) => {
    if (roomType) {
      setEditingRoomType(roomType);
      setFormData({
        name: roomType.name,
        description: roomType.description,
        rent: roomType.rent.toString(),
        components: roomType.components.map((c) => c._id),
      });
    } else {
      setEditingRoomType(null);
      setFormData({
        name: '',
        description: '',
        rent: '',
        components: [],
      });
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRoomType(null);
    setFormData({
      name: '',
      description: '',
      rent: '',
      components: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.components.length === 0) {
      toast.error('Please select at least one component');
      return;
    }

    setSubmitting(true);

    try {
      const url = editingRoomType
        ? `/api/room-types/${editingRoomType._id}`
        : '/api/room-types';

      const method = editingRoomType ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rent: parseFloat(formData.rent),
          blockId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editingRoomType
            ? 'Room type updated successfully'
            : 'Room type created successfully'
        );
        closeDialog();
        fetchData();
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRoomType = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room type?')) return;

    try {
      const response = await fetch(`/api/room-types/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Room type deleted successfully');
        fetchData();
      } else {
        toast.error(data.error || 'Failed to delete room type');
      }
    } catch (error) {
      toast.error('Failed to delete room type');
    }
  };

  const toggleComponent = (componentId: string) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.includes(componentId)
        ? prev.components.filter((id) => id !== componentId)
        : [...prev.components, componentId],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (availableComponents.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <DoorOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No components available</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Please create room components first before adding room types.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Room Types</h2>
          <p className="text-muted-foreground">
            Define different room configurations with components and pricing
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => openDialog()}>
              <Plus className="h-4 w-4" />
              Add Room Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingRoomType ? 'Edit Room Type' : 'Add New Room Type'}
                </DialogTitle>
                <DialogDescription>
                  {editingRoomType
                    ? 'Update the room type details'
                    : 'Create a new room type with components'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Room Type Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Single AC Room, Double Room"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the room type"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rent">Monthly Rent</Label>
                  <Input
                    id="rent"
                    type="number"
                    placeholder="Enter rent amount"
                    value={formData.rent}
                    onChange={(e) =>
                      setFormData({ ...formData, rent: e.target.value })
                    }
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Select Components</Label>
                  <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
                    {availableComponents.map((component) => (
                      <div
                        key={component._id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={component._id}
                          checked={formData.components.includes(component._id)}
                          onCheckedChange={() => toggleComponent(component._id)}
                        />
                        <label
                          htmlFor={component._id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {component.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? editingRoomType
                      ? 'Updating...'
                      : 'Creating...'
                    : editingRoomType
                    ? 'Update'
                    : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {roomTypes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <DoorOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No room types yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create room types by combining components and setting rent prices.
            </p>
            <Button onClick={() => openDialog()} className="gap-2">
              <Plus className="h-5 w-5" />
              Add Your First Room Type
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roomTypes.map((roomType) => (
            <Card key={roomType._id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <DoorOpen className="h-5 w-5 text-primary" />
                  {roomType.name}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDialog(roomType)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRoomType(roomType._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {roomType.description}
                </p>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Monthly Rent:</span>
                  <span className="text-lg font-bold">₹{roomType.rent}</span>
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium">Components:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {roomType.components.map((component) => (
                      <span
                        key={component._id}
                        className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {component.name}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
