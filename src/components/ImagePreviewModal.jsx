import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Image as ImageIcon } from 'lucide-react';

const ImagePreviewModal = ({ item, trigger }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {React.cloneElement(trigger, { onClick: () => setOpen(true) })}
      <DialogContent className="max-w-4xl w-full p-0">
        <div className="relative">
          {item.image_url ? (
            <img 
              alt={item.name} 
              src={item.image_url} 
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center text-gray-400">
              <ImageIcon className="w-16 h-16" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;
