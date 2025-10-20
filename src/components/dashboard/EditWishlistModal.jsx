import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { imageService } from '@/lib/wishlistService';
import { useToast } from '@/components/ui/use-toast';
import { getUserFriendlyError } from '@/lib/utils';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import FileUpload from '@/components/ui/file-upload';

const EditWishlistModal = ({ isOpen, onClose, wishlist, onSave }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    occasion: '',
    dateType: 'flexible',
    specificDate: null,
    story: '',
    visibility: 'unlisted',
    coverImage: ''
  });
  const [uploading, setUploading] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const occasions = [
    'birthday', 'wedding', 'graduation', 'burial', 'other', 'No occasion'
  ];

  const occasionLabels = {
    'birthday': 'Birthday',
    'wedding': 'Wedding', 
    'graduation': 'Graduation',
    'burial': 'Memorial',
    'other': 'Other',
    'No occasion': 'No occasion'
  };

  useEffect(() => {
    if (wishlist && isOpen) {
      setFormData({
        title: wishlist.title || '',
        occasion: wishlist.occasion || '',
        dateType: wishlist.wishlist_date ? 'specific' : 'flexible',
        specificDate: wishlist.wishlist_date ? new Date(wishlist.wishlist_date) : null,
        story: wishlist.story || '',
        visibility: wishlist.visibility || 'unlisted',
        coverImage: wishlist.cover_image_url || ''
      });
    }
  }, [wishlist, isOpen]);

  const handleImageUpload = async (file) => {
    if (!file || !user?.id) return;
    
    setUploading(true);
    try {
      const publicUrl = await imageService.uploadCoverImage(file, user.id);
      setFormData(prev => ({ ...prev, coverImage: publicUrl }));
      toast({
        title: 'Image uploaded successfully',
        description: 'Your cover image has been updated.'
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      
      toast({ 
        variant: 'destructive', 
        title: 'Upload Error', 
        description: error.message || 'Failed to upload image. Please try again.' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, coverImage: '' }));
  };

  const handleSave = async () => {
    try {
      const updates = {
        title: formData.title,
        occasion: formData.occasion === 'No occasion' ? null : formData.occasion,
        wishlist_date: formData.dateType === 'specific' ? formData.specificDate?.toISOString() : null,
        story: formData.story,
        cover_image_url: formData.coverImage,
        visibility: formData.visibility
      };

      await onSave(updates);
      onClose();
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({ variant: 'destructive', title: 'Update Wishlist Error', description: JSON.stringify(error) });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white" fullscreenOnMobile={true}>
        <DialogHeader>
          <DialogTitle className="pr-8">Edit Wishlist</DialogTitle>
          <DialogDescription>
            Update your wishlist details, cover image, and settings below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="edit-title">Wishlist Title</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter wishlist title"
              className="mt-2"
            />
          </div>

          {/* Occasion */}
          <div>
            <Label>Occasion</Label>
            <Select 
              value={formData.occasion} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, occasion: value }))}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select an occasion" />
              </SelectTrigger>
              <SelectContent>
                {occasions.map(occasion => (
                  <SelectItem key={occasion} value={occasion}>
                    {occasionLabels[occasion]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <Label>Due Date</Label>
            <RadioGroup 
              value={formData.dateType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, dateType: value }))}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flexible" id="edit-flexible" />
                <Label htmlFor="edit-flexible">No specific date</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="edit-specific" />
                <Label htmlFor="edit-specific">Specific date</Label>
              </div>
            </RadioGroup>

            {formData.dateType === 'specific' && (
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-2">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.specificDate ? format(formData.specificDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.specificDate}
                    onSelect={(date) => {
                      setFormData(prev => ({ ...prev, specificDate: date }));
                      setDatePickerOpen(false); // Close the popover when date is selected
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Story */}
          <div>
            <Label htmlFor="edit-story">Story</Label>
            <Textarea
              id="edit-story"
              value={formData.story}
              onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
              placeholder="Tell your supporters why this wishlist matters..."
              className="mt-2 min-h-[100px]"
            />
          </div>

          {/* Cover Photo */}
          <div>
            <Label>Cover Photo</Label>
            <FileUpload
              variant="default"
              value={formData.coverImage}
              onFileSelect={handleImageUpload}
              onRemove={handleRemoveImage}
              acceptedTypes="JPG, PNG, WEBP"
              maxSize="10MB"
              uploading={uploading}
              disabled={uploading}
              className="mt-2"
            />
          </div>

          {/* Visibility */}
          <div>
            <Label>Visibility</Label>
            <RadioGroup 
              value={formData.visibility} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}
              className="mt-2"
            >
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 border">
                  <RadioGroupItem value="public" id="edit-public" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="edit-public" className="font-medium">Public (Show on Explore Page)</Label>
                    <p className="text-sm text-gray-500">Anyone can find and view your wishlist</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border">
                  <RadioGroupItem value="unlisted" id="edit-unlisted" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="edit-unlisted" className="font-medium">Unlisted (Link-only)</Label>
                    <p className="text-sm text-gray-500">Only people with the link can view it</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="modal" onClick={onClose} className="bg-white">Cancel</Button>
          <Button onClick={handleSave} variant="modal" className="bg-brand-orange text-black">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditWishlistModal;
