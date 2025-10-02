"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";
import { RoomTypeImageGallery } from "./room-type-image-gallery";

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

interface CreateRoomTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blockId: string;
}

export function CreateRoomTypeDialog({
  isOpen,
  onClose,
  onSuccess,
  blockId,
}: CreateRoomTypeDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rent: "",
    components: [] as string[],
    images: [] as RoomTypeImage[],
  });
  const [availableComponents, setAvailableComponents] = useState<RoomComponent[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchComponents();
    }
  }, [isOpen, blockId]);

  const fetchComponents = async () => {
    try {
      const response = await fetch(`/api/blocks/${blockId}/components`);
      const data = await response.json();
      
      if (data.success) {
        setAvailableComponents(data.data);
      }
    } catch (error) {
      console.error("Error fetching components:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.components.length === 0) {
      toast.error("Please select at least one component");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/blocks/${blockId}/room-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          rent: parseFloat(formData.rent),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create room type");
      }

      toast.success("Room type created successfully");
      handleClose();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create room type");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      rent: "",
      components: [],
      images: [],
    });
    onClose();
  };

  const handleComponentSelect = (componentId: string) => {
    if (!formData.components.includes(componentId)) {
      setFormData(prev => ({
        ...prev,
        components: [...prev.components, componentId]
      }));
    }
  };

  const handleComponentRemove = (componentId: string) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.filter(id => id !== componentId)
    }));
  };

  const getSelectedComponents = () => {
    return availableComponents.filter(comp => formData.components.includes(comp._id));
  };

  const getAvailableComponents = () => {
    return availableComponents.filter(comp => !formData.components.includes(comp._id));
  };

  const handleAddImage = (image: RoomTypeImage) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, image]
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSetCoverImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isCover: i === index
      }))
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isSubmitting && !isUploadingImage ? handleClose : undefined}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Room Type</DialogTitle>
          <DialogDescription>
            Define a new room type with components, pricing, and images.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Room Type Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Room Type Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter room type name (e.g., Single AC, Double Non-AC)"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the room type and its features"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            {/* Room Components */}
            <div className="space-y-2">
              <Label>
                Room Components <span className="text-red-500">*</span>
              </Label>
              
              {/* Component Dropdown */}
              <Select onValueChange={handleComponentSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select components" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableComponents().length > 0 ? (
                    getAvailableComponents().map((component) => (
                      <SelectItem key={component._id} value={component._id}>
                        {component.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-components" disabled>
                      No components available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              
              <p className="text-sm text-muted-foreground">
                Select at least one component for this room type
              </p>

              {/* Selected Components */}
              {getSelectedComponents().length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {getSelectedComponents().map((component) => (
                    <Badge key={component._id} variant="secondary" className="flex items-center gap-1">
                      {component.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleComponentRemove(component._id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Monthly Rent */}
            <div className="space-y-2">
              <Label htmlFor="rent">
                Monthly Rent (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rent"
                type="number"
                placeholder="Enter monthly rent amount"
                value={formData.rent}
                onChange={(e) =>
                  setFormData({ ...formData, rent: e.target.value })
                }
                required
                min="0"
                step="100"
              />
            </div>

            {/* Room Images */}
            <div className="space-y-2">
              <Label>Room Images (Optional)</Label>
              <RoomTypeImageGallery
                images={formData.images}
                onAddImage={handleAddImage}
                onRemoveImage={handleRemoveImage}
                onSetCoverImage={handleSetCoverImage}
                onUploadStateChange={setIsUploadingImage}
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting || isUploadingImage}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || isUploadingImage}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Creating..." : "Create Room Type"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
