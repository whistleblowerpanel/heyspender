import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Cake, Heart, GraduationCap, Bird, Baby, Gift, Sparkles, Church } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getUserFriendlyError } from '@/lib/utils';

const OccasionBar = ({
  occasions,
  active,
  onSelect,
  onCreate,
  onRename,
  onDelete
}) => {
  const { toast } = useToast();
  const [editingOccasion, setEditingOccasion] = useState(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);

  // Get icon based on occasion title content
  const getOccasionIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('birthday') || lowerTitle.includes('bday')) return Cake;
    if (lowerTitle.includes('anniversary')) return Heart;
    if (lowerTitle.includes('wedding') || lowerTitle.includes('marriage')) return Church;
    if (lowerTitle.includes('graduation') || lowerTitle.includes('grad')) return GraduationCap;
    if (lowerTitle.includes('memorial') || lowerTitle.includes('burial') || lowerTitle.includes('funeral')) return Bird;
    if (lowerTitle.includes('baby') || lowerTitle.includes('shower')) return Baby;
    if (lowerTitle.includes('christmas') || lowerTitle.includes('holiday')) return Sparkles;
    if (lowerTitle.includes('new year')) return Sparkles;
    return Gift; // Default icon
  };

  useEffect(() => {
    if (editingOccasion && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingOccasion]);

  const handleEdit = (occasion) => {
    setEditingOccasion(occasion);
    setEditValue(occasion);
  };

  const handleSave = async () => {
    if (editValue.trim() && editingOccasion && editValue.trim() !== editingOccasion) {
      try {
        await onRename(editingOccasion, editValue.trim());
      } catch (error) {
        console.error('Failed to rename occasion:', error);
        toast({ 
          variant: 'destructive', 
          title: 'Rename Occasion Error', 
          description: JSON.stringify(error) 
        });
      }
    }
    setEditingOccasion(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingOccasion(null);
    setEditValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {occasions.map((occasion) => {
        const isActive = active === occasion;
        const isEditing = editingOccasion === occasion;
        const IconComponent = getOccasionIcon(occasion);
        const label = occasion; // Display the title directly

        return (
          <div
            key={occasion}
            className={`flex items-center gap-2 px-4 py-2 border-2 border-black transition-all flex-shrink-0 group ${
              isActive
                ? 'bg-brand-purple-dark text-white'
                : 'bg-white hover:bg-brand-purple-dark/5'
            }`}
          >
            {isEditing ? (
              <>
                <IconComponent className="w-4 h-4" />
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none outline-none text-sm font-medium min-w-0 flex-1"
                />
              </>
            ) : (
              <>
                <IconComponent className="w-4 h-4" />
                <button
                  onClick={() => onSelect(isActive ? null : occasion)}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {label}
                </button>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(occasion)}
                    className="p-1 hover:bg-black/10"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDelete(occasion)}
                    className="p-1 hover:bg-red-100 text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}

      <Button
        onClick={onCreate}
        variant="outline"
        className="flex-shrink-0 border-dashed border-gray-300 hover:border-brand-purple-dark hover:bg-brand-purple-dark/5"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Occasion
      </Button>
    </div>
  );
};

export default OccasionBar;
