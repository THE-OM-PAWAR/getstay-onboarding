'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Plus, Building2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Hostel {
  _id: string;
  name: string;
  joinCode: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', ownerName: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const response = await fetch('/api/hostels');
      const data = await response.json();
      if (data.success) {
        setHostels(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch hostels');
    } finally {
      setLoading(false);
    }
  };

  const createHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/hostels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Hostel created successfully');
        setDialogOpen(false);
        setFormData({ name: '', ownerName: '' });
        fetchHostels();
      } else {
        toast.error(data.error || 'Failed to create hostel');
      }
    } catch (error) {
      toast.error('Failed to create hostel');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteHostel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hostel?')) return;

    try {
      const response = await fetch(`/api/hostels/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Hostel deleted successfully');
        fetchHostels();
      } else {
        toast.error(data.error || 'Failed to delete hostel');
      }
    } catch (error) {
      toast.error('Failed to delete hostel');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Hostel Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your hostels, blocks, and room configurations
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create Hostel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={createHostel}>
              <DialogHeader>
                <DialogTitle>Create New Hostel</DialogTitle>
                <DialogDescription>
                  Add a new hostel to your management system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hostel Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter hostel name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    placeholder="Enter owner name"
                    value={formData.ownerName}
                    onChange={(e) =>
                      setFormData({ ...formData, ownerName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Hostel'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {hostels.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hostels yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Get started by creating your first hostel. You can then add blocks
              and manage room configurations.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-5 w-5" />
              Create Your First Hostel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((hostel) => (
            <Card
              key={hostel._id}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => router.push(`/hostel/${hostel._id}`)}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {hostel.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHostel(hostel._id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Join Code:</span>
                    <span className="font-mono font-semibold">{hostel.joinCode}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(hostel.createdAt).toLocaleDateString()}</span>
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
