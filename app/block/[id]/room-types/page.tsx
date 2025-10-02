"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, Search, Home, MoreHorizontal, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { CreateRoomTypeDialog } from "@/components/room-types/create-room-type-dialog";
import { EditRoomTypeDialog } from "@/components/room-types/edit-room-type-dialog";
import { DeleteRoomTypeDialog } from "@/components/room-types/delete-room-type-dialog";

interface RoomTypeImage {
  url: string;
  title: string;
  isCover: boolean;
}

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
  blockId: string;
  images: RoomTypeImage[];
}

export default function RoomTypesPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const response = await fetch(`/api/blocks/${params.id}/room-types`);
      const data = await response.json();
      
      if (data.success) {
        setRoomTypes(data.data);
      } else {
        toast.error("Failed to fetch room types");
      }
    } catch (error) {
      console.error("Error fetching room types:", error);
      toast.error("Failed to fetch room types");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomTypeId: string) => {
    try {
      const response = await fetch(`/api/blocks/${params.id}/room-types/${roomTypeId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete room type");
      }

      toast.success("Room type deleted successfully");
      fetchRoomTypes();
      setIsDeleteDialogOpen(false);
      setSelectedRoomType(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete room type");
    }
  };

  const filteredRoomTypes = roomTypes.filter((roomType) =>
    roomType.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCoverImage = (images: RoomTypeImage[]) => {
    return images.find(img => img.isCover) || images[0];
  };

  const RoomTypeCard = ({ roomType }: { roomType: RoomType }) => {
    const coverImage = getCoverImage(roomType.images);
    
    return (
      <div className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-all">
        {/* Cover Image */}
        <div className="aspect-video bg-muted relative">
          {coverImage ? (
            <img
              src={coverImage.url}
              alt={coverImage.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {coverImage?.isCover && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-yellow-100 text-yellow-800">
                <Star className="h-3 w-3 mr-1" />
                Cover
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg">{roomType.name}</h3>
              <p className="text-2xl font-bold text-primary">₹{roomType.rent.toLocaleString()}/month</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="flex items-center"
                  onClick={() => {
                    setSelectedRoomType(roomType);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center text-destructive focus:text-destructive"
                  onClick={() => {
                    setSelectedRoomType(roomType);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-muted-foreground text-sm mb-4">{roomType.description}</p>

          {/* Components */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Components:</h4>
            <div className="flex flex-wrap gap-1">
              {roomType.components.map((component) => (
                <Badge key={component._id} variant="secondary" className="text-xs">
                  {component.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Image count */}
          {roomType.images.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              {roomType.images.length} image{roomType.images.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Room Types</h1>
        <p className="text-muted-foreground mt-2">
          Manage different room configurations and pricing for your hostel
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search room types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <div className="hidden sm:block">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Room Type
          </Button>
        </div>
        <div className="sm:hidden">
          <Button size="icon" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : roomTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Home className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg">No room types yet</h3>
          <p className="text-muted-foreground mt-2 text-center max-w-sm">
            Create your first room type to start defining different room configurations and pricing
          </p>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="mt-6"
          >
            Create Room Type
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoomTypes.map((roomType) => (
            <RoomTypeCard key={roomType._id} roomType={roomType} />
          ))}
        </div>
      )}

      <CreateRoomTypeDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={fetchRoomTypes}
        blockId={Array.isArray(params.id) ? params.id[0] : params.id}
      />

      {selectedRoomType && (
        <>
          <EditRoomTypeDialog
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedRoomType(null);
            }}
            onSuccess={fetchRoomTypes}
            blockId={Array.isArray(params.id) ? params.id[0] : params.id}
            roomType={selectedRoomType}
          />

          <DeleteRoomTypeDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedRoomType(null);
            }}
            onConfirm={() => handleDelete(selectedRoomType._id)}
            roomTypeName={selectedRoomType.name}
          />
        </>
      )}
    </div>
  );
}
