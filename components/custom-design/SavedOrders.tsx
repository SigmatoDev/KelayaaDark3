"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SavedDesign {
  _id: string;
  designType: string;
  metalType: string;
  customImage?: string;
  budget: number;
  createdAt: string;
}

export default function SavedOrders() {
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSavedDesigns();
  }, []);

  const fetchSavedDesigns = async () => {
    try {
      const response = await fetch('/api/custom-design/saved');
      if (!response.ok) throw new Error('Failed to fetch saved designs');
      const data = await response.json();
      setSavedDesigns(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueDesign = (id: string) => {
    router.push(`/custom-design/edit/${id}`);
  };

  const handleDeleteSaved = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved design?')) return;
    
    try {
      const response = await fetch(`/api/custom-design/saved/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete design');
      fetchSavedDesigns(); // Refresh the list
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading saved designs...</div>;
  }

  if (savedDesigns.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No saved designs found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 mt-4">
      {savedDesigns.map((design) => (
        <Card key={design._id} className="overflow-hidden">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-lg">
              Saved Design - {new Date(design.createdAt).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Design Image */}
              <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                {design.customImage ? (
                  <Image
                    src={design.customImage}
                    alt="Design Reference"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">No image uploaded</p>
                  </div>
                )}
              </div>

              {/* Design Details */}
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Design Type</p>
                  <p>{design.designType || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Metal Type</p>
                  <p>{design.metalType || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Budget</p>
                  <p>{design.budget ? `₹${design.budget.toLocaleString()}` : 'Not specified'}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 justify-center">
                <Button 
                  onClick={() => handleContinueDesign(design._id)}
                  className="w-full"
                >
                  Continue Design
                </Button>
                <Button 
                  onClick={() => handleDeleteSaved(design._id)}
                  variant="destructive"
                  className="w-full"
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 