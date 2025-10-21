import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import FileUpload from '@/components/ui/file-upload';
import { useToast } from '@/components/ui/use-toast';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { imageService } from '@/lib/wishlistService';
import { getUserFriendlyError } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const AddWishlistItemModal = ({ isOpen, onClose, wishlists, defaultWishlistId, onSave }) => {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    unit_price_estimate: '',
    qty_total: '1',
    product_url: '',
    wishlist_id: '',
    image_url: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Check if user has no wishlists and redirect to onboarding
      if (!wishlists || wishlists.length === 0) {
        toast({
          title: 'Create your first occasion',
          description: 'You need to create an occasion first to organize your wishlist items.'
        });
        onClose(); // Close the modal
        router.push('/dashboard/get-started/welcome'); // Redirect to onboarding
        return;
      }
    }
  }, [isOpen, wishlists, router, onClose, toast]);

  // Separate effect to reset form data only when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        unit_price_estimate: '',
        qty_total: '1',
        product_url: '',
        wishlist_id: defaultWishlistId || '',
        image_url: ''
      });
    }
  }, [isOpen, defaultWishlistId]);

  const handleImageUpload = async (file) => {
    if (!file || !user?.id) return;
    setUploading(true);
    try {
      const url = await imageService.uploadItemImage(file, user.id);
      setFormData(prev => ({ ...prev, image_url: url }));
    } catch (e) {
      console.error('Upload failed', e);
      toast({ 
        variant: 'destructive', 
        title: 'Upload Error', 
        description: e.message || 'Failed to upload image. Please try again.' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.wishlist_id) {
      toast({ variant: 'destructive', title: 'Validation Error', description: JSON.stringify(formData) });
      return;
    }

    setLoading(true);
    try {
      const cleanAmount = String(formData.unit_price_estimate).replace(/,/g, '');
      const payload = {
        name: formData.name.trim(),
        wishlist_id: formData.wishlist_id,
        unit_price_estimate: formData.unit_price_estimate ? parseFloat(cleanAmount) : null,
        qty_total: formData.qty_total ? parseInt(formData.qty_total) : 1,
        product_url: formData.product_url?.trim() || null,
        image_url: formData.image_url || null
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error('Error creating wishlist item:', err);
      toast({ variant: 'destructive', title: 'Create Item Error', description: JSON.stringify(err) });
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.name.trim() && formData.wishlist_id;

  const formatNumber = (value) => {
    const numericValue = String(value).replace(/[^\d.]/g, '');
    const parts = numericValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg sm:max-h-[95vh] bg-white" fullscreenOnMobile={true}>
        <DialogHeader>
          <DialogTitle className="pr-8">Add New Wishlist Item</DialogTitle>
          <DialogDescription>
            Add a new item to your wishlist. Fill in the details below to create your wishlist item.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <Label>Item Image</Label>
            <div className="mt-2">
              {formData.image_url ? (
                <div className="space-y-2">
                  <img 
                    alt="Item" 
                    src={formData.image_url} 
                    className="h-24 w-24 object-cover border-2 border-black"
                  />
                  <Button variant="outline" onClick={() => setFormData(p => ({ ...p, image_url: '' }))} className="text-xs">
                    <X className="w-3 h-3 mr-1"/>Remove Image
                  </Button>
                </div>
              ) : (
                <FileUpload 
                  variant="white"
                  onFileSelect={handleImageUpload}
                  acceptedTypes="PNG, JPG, WEBP"
                  maxSize="10MB"
                  uploading={uploading}
                  disabled={uploading}
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="item-name">Item Name</Label>
            <Input id="item-name" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., iPhone 15 Pro" className="mt-2" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="item-price">Estimated Price (₦)</Label>
              <Input id="item-price" inputMode="numeric" value={formData.unit_price_estimate} onChange={(e) => setFormData(p => ({ ...p, unit_price_estimate: formatNumber(e.target.value) }))} className="mt-2" />
            </div>

            <div>
              <Label htmlFor="item-qty">Quantity</Label>
              <Input id="item-qty" type="number" min="1" step="1" value={formData.qty_total} onChange={(e) => setFormData(p => ({ ...p, qty_total: e.target.value }))} className="mt-2" />
            </div>
          </div>

          <div>
            <Label htmlFor="item-url">Product URL (optional)</Label>
            <Input id="item-url" type="url" value={formData.product_url} onChange={(e) => setFormData(p => ({ ...p, product_url: e.target.value }))} placeholder="https://example.com/product" className="mt-2" />
          </div>

          <div>
            <Label>Link to Wishlist</Label>
            <Select value={formData.wishlist_id} onValueChange={(v) => setFormData(p => ({ ...p, wishlist_id: v }))}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a wishlist" />
              </SelectTrigger>
              <SelectContent>
                {wishlists?.length ? (
                  wishlists.map(w => (
                    <SelectItem key={w.id} value={w.id}>{w.title}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-wl" disabled>No wishlists available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button 
            type="button"
            variant="outline" 
            onClick={onClose} 
            disabled={loading}
            className="border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            variant="custom"
            onClick={handleSave} 
            disabled={loading || !isValid}
            className="bg-brand-green text-black border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
          >
            {loading ? 'Creating...' : 'Create Item'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWishlistItemModal;
