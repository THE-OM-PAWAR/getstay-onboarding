'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, CreditCard as Edit, DoorOpen, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { CreateRoomTypeDialog } from '@/components/room-types/create-room-type-dialog';
import { EditRoomTypeDialog } from '@/components/room-types/edit-room-type-dialog';

interface RoomComponent {
  _id: string;
  name: string;
  description: string;
}

interface RoomTypeImage {
  url: string;
  title: string;
  isCover: boolean;
}

interface RoomType {
  _id: string;
  name: string;
  description: string;
  components: RoomComponent[];
  rent: number;
  images: RoomTypeImage[];
  createdAt: string;
}

interface RoomTypesProps {
  blockId: string;
}

export default function RoomTypes({ blockId }: RoomTypesProps) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [availableComponents, setAvailableComponents] = useState<RoomComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);

  useEffect(() => {
    fetchData();
  }, [blockId]);

  const fetchData = async () => {
    try {
      const [typesRes, componentsRes] = await Promise.all([
        fetch(`/api/blocks/${blockId}/room-types`),
        fetch(`/api/blocks/${blockId}/components`),
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

  const handleCreateSuccess = () => {
    fetchData();
    setCreateDialogOpen(false);
  };

  const handleEditSuccess = () => {
    fetchData();
    setEditDialogOpen(false);
    setEditingRoomType(null);
  };

  const openEditDialog = (roomType: RoomType) => {
    setEditingRoomType(roomType);
    setEditDialogOpen(true);
  };

  const deleteRoomType = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room type?')) return;

    try {
      const response = await fetch(`/api/blocks/${blockId}/room-types/${id}`, {
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
        <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Room Type
        </Button>
      </div>

      {roomTypes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <DoorOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No room types yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create room types by combining components and setting rent prices.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-5 w-5" />
              Add Your First Room Type
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roomTypes.map((roomType) => {
            const coverImage = roomType.images?.find(img => img.isCover) || roomType.images?.[0];
            
            return (
              <Card key={roomType._id} className="overflow-hidden">
                {/* Cover Image */}
                {coverImage && (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={coverImage.url}
                      alt={coverImage.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                      <ImageIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
                
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <DoorOpen className="h-5 w-5 text-primary" />
                    {roomType.name}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(roomType)}
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
                  
                  {/* Images count */}
                  {roomType.images && roomType.images.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ImageIcon className="h-4 w-4" />
                      <span>{roomType.images.length} image{roomType.images.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  
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
            );
          })}
        </div>
      )}

      {/* Create Room Type Dialog */}
      <CreateRoomTypeDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
        blockId={blockId}
      />

      {/* Edit Room Type Dialog */}
      {editingRoomType && (
        <EditRoomTypeDialog
          isOpen={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingRoomType(null);
          }}
          onSuccess={handleEditSuccess}
          blockId={blockId}
          roomType={editingRoomType}
        />
      )}
    </div>
  );
}
