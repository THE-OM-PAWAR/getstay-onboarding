'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface BlockProfile {
  _id?: string;
  block: string;
  basicInfo: {
    name: string;
    description: string;
    address: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    contactNumber: string;
    email: string;
  };
  propertyDetails: {
    totalFloors: number;
    totalRooms: number;
    accommodationType: 'boys' | 'girls' | 'coed' | 'separate';
    buildingType: 'independent' | 'apartment' | 'commercial';
  };
}

export default function BlockProfilePage() {
  const router = useRouter();
  const params = useParams();
  const blockId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<BlockProfile>({
    block: blockId,
    basicInfo: {
      name: '',
      description: '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      contactNumber: '',
      email: '',
    },
    propertyDetails: {
      totalFloors: 1,
      totalRooms: 1,
      accommodationType: 'boys',
      buildingType: 'independent',
    },
  });

  useEffect(() => {
    fetchProfile();
  }, [blockId]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/block-profile/${blockId}`);
      const data = await response.json();

      if (data.success) {
        setFormData(data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/block-profile/${blockId}`, {
        method: formData._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Profile saved successfully');
        router.push(`/block/${blockId}`);
      } else {
        toast.error(data.error || 'Failed to save profile');
      }
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setSubmitting(false);
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
    <div className="container mx-auto p-6 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => router.push(`/block/${blockId}`)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Block
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Block Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage block profile information
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Block Name</Label>
              <Input
                id="name"
                value={formData.basicInfo.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basicInfo: { ...formData.basicInfo, name: e.target.value },
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.basicInfo.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basicInfo: { ...formData.basicInfo, description: e.target.value },
                  })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.basicInfo.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      basicInfo: { ...formData.basicInfo, email: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={formData.basicInfo.contactNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      basicInfo: {
                        ...formData.basicInfo,
                        contactNumber: e.target.value,
                      },
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.basicInfo.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basicInfo: { ...formData.basicInfo, address: e.target.value },
                  })
                }
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.basicInfo.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      basicInfo: { ...formData.basicInfo, city: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.basicInfo.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      basicInfo: { ...formData.basicInfo, state: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.basicInfo.pincode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      basicInfo: { ...formData.basicInfo, pincode: e.target.value },
                    })
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalFloors">Total Floors</Label>
                <Input
                  id="totalFloors"
                  type="number"
                  min="1"
                  value={formData.propertyDetails.totalFloors}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      propertyDetails: {
                        ...formData.propertyDetails,
                        totalFloors: parseInt(e.target.value),
                      },
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalRooms">Total Rooms</Label>
                <Input
                  id="totalRooms"
                  type="number"
                  min="1"
                  value={formData.propertyDetails.totalRooms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      propertyDetails: {
                        ...formData.propertyDetails,
                        totalRooms: parseInt(e.target.value),
                      },
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accommodationType">Accommodation Type</Label>
                <Select
                  value={formData.propertyDetails.accommodationType}
                  onValueChange={(value: any) =>
                    setFormData({
                      ...formData,
                      propertyDetails: {
                        ...formData.propertyDetails,
                        accommodationType: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boys">Boys Only</SelectItem>
                    <SelectItem value="girls">Girls Only</SelectItem>
                    <SelectItem value="coed">Co-ed</SelectItem>
                    <SelectItem value="separate">Separate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="buildingType">Building Type</Label>
                <Select
                  value={formData.propertyDetails.buildingType}
                  onValueChange={(value: any) =>
                    setFormData({
                      ...formData,
                      propertyDetails: {
                        ...formData.propertyDetails,
                        buildingType: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="independent">Independent</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/block/${blockId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="gap-2">
            <Save className="h-4 w-4" />
            {submitting ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
