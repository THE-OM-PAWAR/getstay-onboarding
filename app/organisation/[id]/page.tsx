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
import { ArrowLeft, Plus, Building, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Hostel {
  _id: string;
  name: string;
  description?: string;
  city?: {
    _id: string;
    name: string;
    state: string;
    slug: string;
  };
  createdAt: string;
}

interface City {
  _id: string;
  name: string;
  state: string;
  slug: string;
}

interface Organisation {
  _id: string;
  name: string;
  joinCode: string;
}

export default function OrganisationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const organisationId = params.id as string;

  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', city: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (organisationId) {
      fetchOrganisationAndHostels();
      fetchCities();
    }
  }, [organisationId]);

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities');
      const data = await response.json();
      
      if (data.success) {
        setCities(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const fetchOrganisationAndHostels = async () => {
    try {
      const [organisationRes, hostelsRes] = await Promise.all([
        fetch(`/api/organisations/${organisationId}`),
        fetch(`/api/hostels?organisationId=${organisationId}`),
      ]);

      const organisationData = await organisationRes.json();
      const hostelsData = await hostelsRes.json();

      if (organisationData.success) {
        setOrganisation(organisationData.data);
      }

      if (hostelsData.success) {
        setHostels(hostelsData.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
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
        body: JSON.stringify({ ...formData, organisationId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Hostel created successfully');
        setDialogOpen(false);
        setFormData({ name: '', description: '', city: '' });
        fetchOrganisationAndHostels();
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
        fetchOrganisationAndHostels();
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
            {organisation?.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage hostels for this organisation
          </p>
        </div>

        <div className="flex gap-3">
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
                    Add a new hostel to this organisation
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
                    <Label htmlFor="city">City</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) =>
                        setFormData({ ...formData, city: value })
                      }
                    >
                      <SelectTrigger id="city">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city._id} value={city._id}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{city.name}, {city.state}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter hostel description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
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
      </div>

      {hostels.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hostels yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Get started by creating your first hostel. You can then add room
              types and components.
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
                  <Building className="h-5 w-5 text-primary" />
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
                  {hostel.description && (
                    <p className="text-sm text-muted-foreground">
                      {hostel.description}
                    </p>
                  )}
                  {hostel.city && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{hostel.city.name}, {hostel.city.state}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm pt-2">
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
