'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { ArrowLeft, Plus, Building, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface Block {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}

interface Hostel {
  _id: string;
  name: string;
  joinCode: string;
}

export default function HostelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const hostelId = params.id as string;

  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hostelId) {
      fetchHostelAndBlocks();
    }
  }, [hostelId]);

  const fetchHostelAndBlocks = async () => {
    try {
      const [hostelRes, blocksRes] = await Promise.all([
        fetch(`/api/hostels/${hostelId}`),
        fetch(`/api/blocks?hostelId=${hostelId}`),
      ]);

      const hostelData = await hostelRes.json();
      const blocksData = await blocksRes.json();

      if (hostelData.success) {
        setHostel(hostelData.data);
      }

      if (blocksData.success) {
        setBlocks(blocksData.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const createBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, hostelId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Block created successfully');
        setDialogOpen(false);
        setFormData({ name: '', description: '' });
        fetchHostelAndBlocks();
      } else {
        toast.error(data.error || 'Failed to create block');
      }
    } catch (error) {
      toast.error('Failed to create block');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBlock = async (id: string) => {
    if (!confirm('Are you sure you want to delete this block?')) return;

    try {
      const response = await fetch(`/api/blocks/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Block deleted successfully');
        fetchHostelAndBlocks();
      } else {
        toast.error(data.error || 'Failed to delete block');
      }
    } catch (error) {
      toast.error('Failed to delete block');
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
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => router.push('/')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            {hostel?.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage blocks for this hostel
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.push(`/hostel/${hostelId}/profile`)}
          >
            <Settings className="h-4 w-4" />
            Manage Profile
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Block
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={createBlock}>
                <DialogHeader>
                  <DialogTitle>Create New Block</DialogTitle>
                  <DialogDescription>
                    Add a new block to this hostel
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Block Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter block name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter block description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Block'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {blocks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No blocks yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Get started by creating your first block. You can then add room
              types and components.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-5 w-5" />
              Create Your First Block
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocks.map((block) => (
            <Card
              key={block._id}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => router.push(`/block/${block._id}`)}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  {block.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBlock(block._id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {block.description && (
                    <p className="text-sm text-muted-foreground">
                      {block.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(block.createdAt).toLocaleDateString()}</span>
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
