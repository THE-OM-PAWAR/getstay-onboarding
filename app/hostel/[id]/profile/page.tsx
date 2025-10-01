'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Plus, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Facility {
  name: string;
  available: boolean;
  details?: string;
}

interface LocationFactor {
  name: string;
  distance: string;
  description?: string;
}

interface HostelProfile {
  _id?: string;
  hostel: string;
  isOnlinePresenceEnabled: boolean;
  basicInfo: {
    name: string;
    address: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    contactNumber: string;
    email: string;
  };
  propertyDetails: {
    type: 'boys' | 'girls' | 'coed' | 'separate';
    facilities: Facility[];
    foodService: {
      available: boolean;
      type?: 'veg' | 'nonveg' | 'both';
      details?: string;
    };
  };
  rulesAndPolicies: string;
  media: {
    bannerImage?: string;
    profileImage?: string;
    galleryImages: string[];
  };
  locationFactors: {
    nearbyLandmarks: LocationFactor[];
    googleMapLink?: string;
    coachingCenters: LocationFactor[];
  };
}

export default function HostelProfilePage() {
  const router = useRouter();
  const params = useParams();
  const hostelId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<HostelProfile>({
    hostel: hostelId,
    isOnlinePresenceEnabled: false,
    basicInfo: {
      name: '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      contactNumber: '',
      email: '',
    },
    propertyDetails: {
      type: 'boys',
      facilities: [
        { name: 'Wi-Fi', available: false, details: '' },
        { name: 'Laundry Service', available: false, details: '' },
        { name: 'AC Rooms', available: false, details: '' },
        { name: 'Non-AC Rooms', available: false, details: '' },
        { name: 'Power Backup', available: false, details: '' },
        { name: 'Housekeeping', available: false, details: '' },
        { name: 'RO Water', available: false, details: '' },
        { name: 'CCTV Security', available: false, details: '' },
        { name: 'Security Guard', available: false, details: '' },
        { name: 'Warden', available: false, details: '' },
        { name: 'Parking', available: false, details: '' },
        { name: 'Common Room', available: false, details: '' },
        { name: 'Study Room', available: false, details: '' },
        { name: 'Gym', available: false, details: '' },
        { name: 'Recreation Area', available: false, details: '' },
        { name: 'Medical Facility', available: false, details: '' },
      ],
      foodService: {
        available: false,
        type: 'veg',
        details: '',
      },
    },
    rulesAndPolicies: '',
    media: {
      bannerImage: '',
      profileImage: '',
      galleryImages: [],
    },
    locationFactors: {
      nearbyLandmarks: [],
      googleMapLink: '',
      coachingCenters: [],
    },
  });

  useEffect(() => {
    fetchProfile();
  }, [hostelId]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/hostel-profile/${hostelId}`);
      const data = await response.json();

      if (data.success) {
        setFormData(data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const updateFacility = (index: number, field: keyof Facility, value: any) => {
    const updatedFacilities = [...formData.propertyDetails.facilities];
    updatedFacilities[index] = { ...updatedFacilities[index], [field]: value };
    setFormData({
      ...formData,
      propertyDetails: {
        ...formData.propertyDetails,
        facilities: updatedFacilities,
      },
    });
  };

  const addLandmark = () => {
    setFormData({
      ...formData,
      locationFactors: {
        ...formData.locationFactors,
        nearbyLandmarks: [
          ...formData.locationFactors.nearbyLandmarks,
          { name: '', distance: '', description: '' },
        ],
      },
    });
  };

  const removeLandmark = (index: number) => {
    const updatedLandmarks = formData.locationFactors.nearbyLandmarks.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      locationFactors: {
        ...formData.locationFactors,
        nearbyLandmarks: updatedLandmarks,
      },
    });
  };

  const addCoachingCenter = () => {
    setFormData({
      ...formData,
      locationFactors: {
        ...formData.locationFactors,
        coachingCenters: [
          ...formData.locationFactors.coachingCenters,
          { name: '', distance: '', description: '' },
        ],
      },
    });
  };

  const removeCoachingCenter = (index: number) => {
    const updatedCenters = formData.locationFactors.coachingCenters.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      locationFactors: {
        ...formData.locationFactors,
        coachingCenters: updatedCenters,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/hostel-profile/${hostelId}`, {
        method: formData._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Profile saved successfully');
        router.push(`/hostel/${hostelId}`);
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
        onClick={() => router.push(`/hostel/${hostelId}`)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Hostel
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Hostel Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage hostel profile information
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Online Presence */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Online Presence</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Make your hostel visible online with a public profile page
                </p>
              </div>
              <Switch
                checked={formData.isOnlinePresenceEnabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isOnlinePresenceEnabled: checked })
                }
              />
            </div>
          </CardHeader>
        </Card>

        {/* Basic Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hostel Name</Label>
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
                <Label htmlFor="landmark">Landmark/Area</Label>
                <Input
                  id="landmark"
                  value={formData.basicInfo.landmark}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      basicInfo: { ...formData.basicInfo, landmark: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code</Label>
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
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Hostel Type</Label>
              <Select
                value={formData.propertyDetails.type}
                onValueChange={(value: any) =>
                  setFormData({
                    ...formData,
                    propertyDetails: { ...formData.propertyDetails, type: value },
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
                  <SelectItem value="separate">Separate Buildings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Facilities & Amenities</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.propertyDetails.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Checkbox
                      checked={facility.available}
                      onCheckedChange={(checked) =>
                        updateFacility(index, 'available', checked)
                      }
                    />
                    <div className="flex-1">
                      <Label className="text-sm font-medium">{facility.name}</Label>
                      {facility.available && (
                        <Input
                          placeholder="Details"
                          value={facility.details || ''}
                          onChange={(e) =>
                            updateFacility(index, 'details', e.target.value)
                          }
                          className="mt-1"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Food/Mess Service</Label>
                <Switch
                  checked={formData.propertyDetails.foodService.available}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      propertyDetails: {
                        ...formData.propertyDetails,
                        foodService: {
                          ...formData.propertyDetails.foodService,
                          available: checked,
                        },
                      },
                    })
                  }
                />
              </div>
              {formData.propertyDetails.foodService.available && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Food Type</Label>
                    <Select
                      value={formData.propertyDetails.foodService.type}
                      onValueChange={(value: any) =>
                        setFormData({
                          ...formData,
                          propertyDetails: {
                            ...formData.propertyDetails,
                            foodService: {
                              ...formData.propertyDetails.foodService,
                              type: value,
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="veg">Vegetarian Only</SelectItem>
                        <SelectItem value="nonveg">Non-Vegetarian Only</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Food Service Details</Label>
                    <Textarea
                      placeholder="Describe your food service..."
                      value={formData.propertyDetails.foodService.details || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propertyDetails: {
                            ...formData.propertyDetails,
                            foodService: {
                              ...formData.propertyDetails.foodService,
                              details: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rules & Policies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Rules & Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="rules">Rules & Policies (Markdown supported)</Label>
              <Textarea
                id="rules"
                placeholder="Enter your hostel rules and policies..."
                value={formData.rulesAndPolicies}
                onChange={(e) =>
                  setFormData({ ...formData, rulesAndPolicies: e.target.value })
                }
                rows={6}
              />
              <p className="text-sm text-muted-foreground">
                You can use Markdown syntax for formatting (e.g., **bold**, *italic*, bullet points)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Photos & Media */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Photos & Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Banner Image (3:1 ratio)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Upload banner image</p>
                <Input
                  type="file"
                  accept="image/*"
                  className="mt-2"
                  onChange={(e) => {
                    // Handle file upload logic here
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Profile Image (1:1 ratio)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Upload profile image</p>
                <Input
                  type="file"
                  accept="image/*"
                  className="mt-2"
                  onChange={(e) => {
                    // Handle file upload logic here
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Factors */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Location Factors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="googleMaps">Google Maps Link</Label>
              <div className="flex space-x-2">
                <Input
                  id="googleMaps"
                  placeholder="https://maps.google.com/..."
                  value={formData.locationFactors.googleMapLink || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      locationFactors: {
                        ...formData.locationFactors,
                        googleMapLink: e.target.value,
                      },
                    })
                  }
                />
                <Button type="button" variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Nearby Landmarks</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLandmark}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Landmark
                </Button>
              </div>
              {formData.locationFactors.nearbyLandmarks.map((landmark, index) => (
                <div key={index} className="flex space-x-2 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Landmark name"
                      value={landmark.name}
                      onChange={(e) => {
                        const updatedLandmarks = [...formData.locationFactors.nearbyLandmarks];
                        updatedLandmarks[index] = { ...landmark, name: e.target.value };
                        setFormData({
                          ...formData,
                          locationFactors: {
                            ...formData.locationFactors,
                            nearbyLandmarks: updatedLandmarks,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      placeholder="Distance"
                      value={landmark.distance}
                      onChange={(e) => {
                        const updatedLandmarks = [...formData.locationFactors.nearbyLandmarks];
                        updatedLandmarks[index] = { ...landmark, distance: e.target.value };
                        setFormData({
                          ...formData,
                          locationFactors: {
                            ...formData.locationFactors,
                            nearbyLandmarks: updatedLandmarks,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="w-32">
                    <Select
                      value={landmark.description || ''}
                      onValueChange={(value) => {
                        const updatedLandmarks = [...formData.locationFactors.nearbyLandmarks];
                        updatedLandmarks[index] = { ...landmark, description: value };
                        setFormData({
                          ...formData,
                          locationFactors: {
                            ...formData.locationFactors,
                            nearbyLandmarks: updatedLandmarks,
                          },
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="College">College</SelectItem>
                        <SelectItem value="Hospital">Hospital</SelectItem>
                        <SelectItem value="Mall">Mall</SelectItem>
                        <SelectItem value="Station">Station</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeLandmark(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Nearby Coaching Centers/Colleges</Label>
                <Button type="button" variant="outline" size="sm" onClick={addCoachingCenter}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Center
                </Button>
              </div>
              {formData.locationFactors.coachingCenters.map((center, index) => (
                <div key={index} className="flex space-x-2 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Center name"
                      value={center.name}
                      onChange={(e) => {
                        const updatedCenters = [...formData.locationFactors.coachingCenters];
                        updatedCenters[index] = { ...center, name: e.target.value };
                        setFormData({
                          ...formData,
                          locationFactors: {
                            ...formData.locationFactors,
                            coachingCenters: updatedCenters,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      placeholder="Distance"
                      value={center.distance}
                      onChange={(e) => {
                        const updatedCenters = [...formData.locationFactors.coachingCenters];
                        updatedCenters[index] = { ...center, distance: e.target.value };
                        setFormData({
                          ...formData,
                          locationFactors: {
                            ...formData.locationFactors,
                            coachingCenters: updatedCenters,
                          },
                        });
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeCoachingCenter(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/hostel/${hostelId}`)}
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
