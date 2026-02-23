'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, MapPin, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { INDIAN_STATES } from '@/lib/constants/indian-states';

interface City {
  _id: string;
  name: string;
  slug: string;
  state: string;
  introContent?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
}


export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    introContent: '',
    metaTitle: '',
    metaDescription: '',
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    state: '',
    introContent: '',
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities');
      const data = await response.json();
      if (data.success) {
        setCities(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch cities');
      }
    } catch (error) {
      toast.error('Failed to fetch cities');
    } finally {
      setLoading(false);
    }
  };

  const createCity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('City created successfully');
        setDialogOpen(false);
        setFormData({
          name: '',
          state: '',
          introContent: '',
          metaTitle: '',
          metaDescription: '',
        });
        fetchCities();
      } else {
        toast.error(data.error || 'Failed to create city');
      }
    } catch (error) {
      toast.error('Failed to create city');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (city: City) => {
    setEditingCity(city);
    setEditFormData({
      name: city.name,
      state: city.state,
      introContent: city.introContent || '',
      metaTitle: city.metaTitle || '',
      metaDescription: city.metaDescription || '',
    });
    setEditDialogOpen(true);
  };

  const updateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCity) return;
    setSubmitting(true);

    try {
      const response = await fetch(`/api/cities/${editingCity._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('City updated successfully');
        setEditDialogOpen(false);
        setEditingCity(null);
        fetchCities();
      } else {
        toast.error(data.error || 'Failed to update city');
      }
    } catch (error) {
      toast.error('Failed to update city');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCity = async (city: City) => {
    if (!confirm(`Delete city "${city.name}"? This cannot be undone.`)) return;

    try {
      const response = await fetch(`/api/cities/${city._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('City deleted successfully');
        fetchCities();
      } else {
        toast.error(data.error || 'Failed to delete city');
      }
    } catch (error) {
      toast.error('Failed to delete city');
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
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
            <MapPin className="h-8 w-8 text-primary" />
            Cities
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage cities and their SEO information for your hostels.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add City
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={createCity}>
              <DialogHeader>
                <DialogTitle>Add New City</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">City Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter city name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) =>
                      setFormData({ ...formData, state: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="introContent">Intro Content (SEO Text)</Label>
                  <Textarea
                    id="introContent"
                    placeholder="Short introduction or SEO text for this city"
                    value={formData.introContent}
                    onChange={(e) =>
                      setFormData({ ...formData, introContent: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    placeholder="SEO meta title"
                    value={formData.metaTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, metaTitle: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    placeholder="SEO meta description"
                    value={formData.metaDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metaDescription: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create City'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {cities.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No cities yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Get started by adding your first city. You can use SEO fields to help
              your hostels rank better for city-based searches.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-5 w-5" />
              Add Your First City
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <Card key={city._id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <CardTitle className="text-xl flex flex-col gap-1">
                  <span>{city.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {city.state}
                  </span>
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(city)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => deleteCity(city)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Slug:</span>
                  <span className="font-mono text-xs">{city.slug}</span>
                </div>
                {city.metaTitle && (
                  <div>
                    <span className="block text-muted-foreground">Meta Title:</span>
                    <span className="font-medium">{city.metaTitle}</span>
                  </div>
                )}
                {city.metaDescription && (
                  <div>
                    <span className="block text-muted-foreground">
                      Meta Description:
                    </span>
                    <p className="line-clamp-3">{city.metaDescription}</p>
                  </div>
                )}
                {city.introContent && (
                  <div>
                    <span className="block text-muted-foreground">Intro:</span>
                    <p className="line-clamp-3">{city.introContent}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <form onSubmit={updateCity}>
            <DialogHeader>
              <DialogTitle>Edit City</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">City Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter city name"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-state">State</Label>
                <Select
                  value={editFormData.state}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, state: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-introContent">Intro Content (SEO Text)</Label>
                <Textarea
                  id="edit-introContent"
                  placeholder="Short introduction or SEO text for this city"
                  value={editFormData.introContent}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      introContent: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-metaTitle">Meta Title</Label>
                <Input
                  id="edit-metaTitle"
                  placeholder="SEO meta title"
                  value={editFormData.metaTitle}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      metaTitle: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-metaDescription">Meta Description</Label>
                <Textarea
                  id="edit-metaDescription"
                  placeholder="SEO meta description"
                  value={editFormData.metaDescription}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      metaDescription: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

