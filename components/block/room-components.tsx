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
import { Plus, Trash2, CreditCard as Edit, Package } from 'lucide-react';
import { toast } from 'sonner';

interface RoomComponent {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface RoomComponentsProps {
  blockId: string;
}

export default function RoomComponents({ blockId }: RoomComponentsProps) {
  const [components, setComponents] = useState<RoomComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<RoomComponent | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComponents();
  }, [blockId]);

  const fetchComponents = async () => {
    try {
      const response = await fetch(`/api/room-components?blockId=${blockId}`);
      const data = await response.json();

      if (data.success) {
        setComponents(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch components');
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (component?: RoomComponent) => {
    if (component) {
      setEditingComponent(component);
      setFormData({ name: component.name, description: component.description });
    } else {
      setEditingComponent(null);
      setFormData({ name: '', description: '' });
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingComponent(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingComponent
        ? `/api/room-components/${editingComponent._id}`
        : '/api/room-components';

      const method = editingComponent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, blockId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editingComponent
            ? 'Component updated successfully'
            : 'Component created successfully'
        );
        closeDialog();
        fetchComponents();
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComponent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this component?')) return;

    try {
      const response = await fetch(`/api/room-components/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Component deleted successfully');
        fetchComponents();
      } else {
        toast.error(data.error || 'Failed to delete component');
      }
    } catch (error) {
      toast.error('Failed to delete component');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Room Components</h2>
          <p className="text-muted-foreground">
            Manage components like beds, tables, chairs, etc.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => openDialog()}>
              <Plus className="h-4 w-4" />
              Add Component
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingComponent ? 'Edit Component' : 'Add New Component'}
                </DialogTitle>
                <DialogDescription>
                  {editingComponent
                    ? 'Update the component details'
                    : 'Create a new room component'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Component Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Single Bed, Study Table"
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
                    placeholder="Describe the component"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? editingComponent
                      ? 'Updating...'
                      : 'Creating...'
                    : editingComponent
                    ? 'Update'
                    : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {components.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No components yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Add room components like beds, tables, chairs that can be used in
              room types.
            </p>
            <Button onClick={() => openDialog()} className="gap-2">
              <Plus className="h-5 w-5" />
              Add Your First Component
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {components.map((component) => (
            <Card key={component._id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  {component.name}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDialog(component)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteComponent(component._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {component.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
