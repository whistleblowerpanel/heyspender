import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X as XIcon, Loader2 } from 'lucide-react';
import FileUpload from './FileUpload';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/**
 * EXACT modal structure - NO MODIFICATIONS
 */
const AddItemFormModal = ({ isOpen, onClose, onSave, type = 'item', initialData = {} }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    price: initialData.price || 0,
    quantity: initialData.quantity || 1,
    url: initialData.url || '',
    description: initialData.description || '',
    image: initialData.image || '',
    title: initialData.title || '',
    targetAmount: initialData.targetAmount || 0,
    deadline: initialData.deadline || null,
    ...initialData
  });
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  // EXACT number formatting - NO MODIFICATIONS
  const formatNumberWithCommas = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    const numericValue = Number(rawValue);
    if (!isNaN(numericValue)) {
      updateFormData({ price: numericValue });
    }
  };

  const handleTargetAmountChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    const numericValue = Number(rawValue);
    if (!isNaN(numericValue)) {
      updateFormData({ targetAmount: numericValue });
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-brand-purple-dark w-full max-w-2xl max-h-[90vh] overflow-hidden border-2 border-black">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">
              Add {type === 'item' ? 'Wishlist Item' : 'Cash Goal'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XIcon className="w-6 h-6 sm:w-7 sm:w-7 lg:w-8 lg:h-8 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            {type === 'item' ? (
              <>
                <div>
                  <Label className="text-white text-sm sm:text-base">Wishlist Item Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                    placeholder="Item name"
                    className="mt-1 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-brand-purple-dark"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white text-sm sm:text-base">Price (₦)</Label>
                    <Input
                      type="text"
                      value={formatNumberWithCommas(formData.price)}
                      onChange={handlePriceChange}
                      placeholder="0"
                      className="mt-1 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-brand-purple-dark"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm sm:text-base">Quantity</Label>
                    <Input
                      type="number"
                      value={formData.quantity || ''}
                      onChange={(e) => updateFormData({ quantity: Number(e.target.value) })}
                      placeholder="1"
                      className="mt-1 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-brand-purple-dark"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-white text-sm sm:text-base">Product URL</Label>
                  <Input
                    value={formData.url || ''}
                    onChange={(e) => updateFormData({ url: e.target.value })}
                    placeholder="https://..."
                    className="mt-1 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-brand-purple-dark"
                  />
                </div>
                
                <div>
                  <Label className="text-white text-sm sm:text-base">Wishlist Item Image</Label>
                  <div className="mt-1">
                    <FileUpload 
                      variant="purple"
                      value={formData.image}
                      onFileSelect={async (file) => {
                        if (!user?.id) {
                          console.error('User not authenticated');
                          return;
                        }
                        
                        setUploading(true);
                        try {
                          const { imageService } = await import('@/lib/wishlistService');
                          const url = await imageService.uploadItemImage(file, user.id);
                          updateFormData({ image: url });
                        } catch (error) {
                          console.error('Upload failed:', error);
                          updateFormData({ image: URL.createObjectURL(file) });
                        } finally {
                          setUploading(false);
                        }
                      }}
                      onRemove={() => updateFormData({ image: '' })}
                      acceptedTypes="PNG, JPG, WEBP"
                      maxSize="10MB"
                      uploading={uploading}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="text-white text-sm sm:text-base">Goal Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder="e.g. Vacation Fund"
                    className="mt-1 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-brand-purple-dark"
                  />
                </div>
                
                <div>
                  <Label className="text-white text-sm sm:text-base">Target Amount (₦)</Label>
                  <Input
                    type="text"
                    value={formatNumberWithCommas(formData.targetAmount)}
                    onChange={handleTargetAmountChange}
                    placeholder="0"
                    className="mt-1 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-brand-purple-dark"
                  />
                </div>
                
                <div>
                  <Label className="text-white text-sm sm:text-base">Description</Label>
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    placeholder="Describe this goal..."
                    className="mt-1 min-h-[60px] bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-brand-purple-dark"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-white/20">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-white border-2 border-black text-black hover:bg-gray-50 hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)] transition-all order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-brand-green border-2 border-black text-black hover:bg-brand-green/90 hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)] transition-all order-1 sm:order-2"
            >
              Add {type === 'item' ? 'Wishlist Item' : 'Cash Goal'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemFormModal;
