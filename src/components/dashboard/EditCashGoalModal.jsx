import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { getUserFriendlyError } from '@/lib/utils';

const EditCashGoalModal = ({ isOpen, onClose, goal, wishlists, onSave }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    deadline: null,
    deadlineType: 'flexible',
    wishlistId: ''
  });
  const [loading, setLoading] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    if (goal && isOpen) {
      // Handle different possible structures of wishlist_id
      let wishlistId = '';
      
      if (goal.wishlist_id) {
        // If it's a direct ID, handle both string and object cases
        wishlistId = typeof goal.wishlist_id === 'object' ? goal.wishlist_id.id : goal.wishlist_id;
      } else if (goal.wishlist?.id) {
        // If wishlist is nested
        wishlistId = goal.wishlist.id;
      }
      
      // Ensure wishlistId is a string for Select component matching
      wishlistId = wishlistId ? String(wishlistId) : '';
      
      const newFormData = {
        title: goal.title || '',
        targetAmount: goal.target_amount?.toString() || '',
        deadline: goal.deadline ? new Date(goal.deadline) : null,
        deadlineType: goal.deadline ? 'specific' : 'flexible',
        wishlistId: wishlistId
      };
      
      setFormData(newFormData);
    }
  }, [goal, isOpen]);

  const handleSave = async () => {
    if (!formData.title || !formData.targetAmount) {
      return;
    }

    // Get wishlist ID from form selection, or fallback to original goal's wishlist
    let wishlistId = formData.wishlistId;
    
    // If no wishlist selected in form, use the original goal's wishlist
    if (!wishlistId) {
      if (goal.wishlist_id) {
        wishlistId = goal.wishlist_id;
      } else if (goal.wishlist?.id) {
        wishlistId = goal.wishlist.id;
      }
    }

    setLoading(true);
    try {
      const cleanAmount = String(formData.targetAmount).replace(/,/g, '');
      const updates = {
        title: formData.title,
        target_amount: parseFloat(cleanAmount),
        deadline: formData.deadlineType === 'specific' ? formData.deadline?.toISOString() : null
      };

      // Only update wishlist_id if it was changed
      if (wishlistId) {
        updates.wishlist_id = wishlistId;
      }

      await onSave(goal.id, updates);
      onClose();
    } catch (error) {
      console.error('Error updating cash goal:', error);
      toast({ variant: 'destructive', title: 'Update Cash Goal Error', description: JSON.stringify(error) });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value) => {
    const numericValue = String(value).replace(/[^\d.]/g, '');
    const parts = numericValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white" fullscreenOnMobile={false}>
        <DialogHeader>
          <DialogTitle className="pr-8">Edit Cash Goal</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="edit-goal-title">Goal Title</Label>
            <Input
              id="edit-goal-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. To Carry Hoelosho For Idris"
              className="mt-2"
            />
          </div>

          {/* Target Amount */}
          <div>
            <Label htmlFor="edit-target-amount">Target Amount (₦)</Label>
            <Input
              id="edit-target-amount"
              inputMode="numeric"
              value={formData.targetAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: formatNumber(e.target.value) }))}
              placeholder="e.g., 150000"
              className="mt-2"
            />
          </div>

          {/* Wishlist Selection */}
          <div>
            <Label>
              Link to Wishlist
              <span className="text-red-600 ml-1">*</span>
            </Label>
            <Select 
              value={formData.wishlistId || ''} 
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, wishlistId: value }));
              }}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a wishlist" />
              </SelectTrigger>
              <SelectContent>
                {wishlists && wishlists.length > 0 ? (
                  wishlists.map(wishlist => (
                    <SelectItem key={wishlist.id} value={String(wishlist.id)}>
                      {wishlist.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-wishlists" disabled>
                    No wishlists available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Deadline */}
          <div>
            <Label>Deadline</Label>
            <RadioGroup 
              value={formData.deadlineType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, deadlineType: value }))}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="flexible" 
                  id="edit-goal-flexible"
                  className="w-4 h-4 border-2 border-black rounded-none data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green [&>span]:hidden"
                />
                <Label htmlFor="edit-goal-flexible" className="font-normal cursor-pointer">No specific deadline</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="specific" 
                  id="edit-goal-specific"
                  className="w-4 h-4 border-2 border-black rounded-none data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green [&>span]:hidden"
                />
                <Label htmlFor="edit-goal-specific" className="font-normal cursor-pointer">Specific deadline</Label>
              </div>
            </RadioGroup>

            {formData.deadlineType === 'specific' && (
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-2 border-2 border-black hover:bg-gray-50">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? format(formData.deadline, 'PPP') : 'Pick a deadline'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-2 border-black shadow-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={(date) => {
                      setFormData(prev => ({ ...prev, deadline: date }));
                      setDatePickerOpen(false);
                    }}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="bg-white"
                    classNames={{
                      months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                      month: 'space-y-4',
                      caption: 'flex justify-center pt-1 relative items-center',
                      caption_label: 'text-sm font-medium text-black',
                      nav: 'space-x-1 flex items-center',
                      nav_button: 'h-7 w-7 bg-transparent p-0 border-2 border-black hover:bg-gray-100 rounded-none',
                      nav_button_previous: 'absolute left-1',
                      nav_button_next: 'absolute right-1',
                      table: 'w-full border-collapse space-y-1',
                      head_row: 'flex',
                      head_cell: 'text-gray-600 rounded-md w-9 font-normal text-[0.8rem]',
                      row: 'flex w-full mt-2',
                      cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-brand-green first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                      day: 'h-9 w-9 p-0 font-normal text-black hover:bg-gray-100 aria-selected:opacity-100 rounded-none border-0',
                      day_selected: 'bg-brand-green text-white hover:bg-brand-green hover:text-white focus:bg-brand-green focus:text-white',
                      day_today: 'bg-gray-100 text-black font-semibold',
                      day_outside: 'text-gray-400 opacity-50',
                      day_disabled: 'text-gray-400 opacity-50',
                      day_range_middle: 'aria-selected:bg-brand-green aria-selected:text-white',
                      day_hidden: 'invisible',
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            type="button"
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
            disabled={loading || !formData.title?.trim() || !formData.targetAmount}
            className="bg-brand-green text-black border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCashGoalModal;

