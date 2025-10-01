'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Settings } from 'lucide-react';
import { toast } from 'sonner';
import RoomComponents from '@/components/block/room-components';
import RoomTypes from '@/components/block/room-types';

interface Block {
  _id: string;
  name: string;
  description?: string;
  hostel: {
    _id: string;
    name: string;
  };
}

export default function BlockDetailPage() {
  const router = useRouter();
  const params = useParams();
  const blockId = params.id as string;

  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blockId) {
      fetchBlock();
    }
  }, [blockId]);

  const fetchBlock = async () => {
    try {
      const response = await fetch(`/api/blocks/${blockId}`);
      const data = await response.json();

      if (data.success) {
        setBlock(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch block data');
    } finally {
      setLoading(false);
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
        onClick={() => router.push(`/hostel/${block?.hostel._id}`)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {block?.hostel.name}
      </Button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            {block?.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage room components and room types
          </p>
        </div>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => router.push(`/block/${blockId}/profile`)}
        >
          <Settings className="h-4 w-4" />
          Manage Block Profile
        </Button>
      </div>

      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="components">Room Components</TabsTrigger>
          <TabsTrigger value="types">Room Types</TabsTrigger>
        </TabsList>
        <TabsContent value="components" className="mt-6">
          <RoomComponents blockId={blockId} />
        </TabsContent>
        <TabsContent value="types" className="mt-6">
          <RoomTypes blockId={blockId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
