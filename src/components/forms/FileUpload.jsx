import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * File upload component with drag & drop support
 */
const FileUpload = ({
  value,
  onFileSelect,
  onRemove,
  acceptedTypes = 'PNG, JPG, WEBP',
  maxSize = '10MB',
  uploading = false,
  disabled = false,
  variant = 'default',
  className,
  ...props
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || uploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    console.log('FileUpload: handleFileInput triggered', { filesCount: e.target.files?.length });
    if (disabled || uploading) return;
    
    const files = e.target.files;
    if (files && files[0]) {
      console.log('FileUpload: File selected', { name: files[0].name, type: files[0].type });
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert(`Please select a valid image file (${acceptedTypes})`);
      return;
    }

    // Validate file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`File size must be less than ${maxSize}`);
      return;
    }

    onFileSelect?.(file);
  };


  const removeFile = () => {
    if (disabled || uploading) return;
    onRemove?.();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'purple':
        return {
          container: 'border-brand-purple-dark bg-brand-purple-light/10',
          button: 'bg-brand-purple-dark text-white hover:bg-brand-purple-dark/90',
          text: 'text-brand-purple-dark'
        };
      default:
        return {
          container: 'border-gray-300 bg-gray-50',
          button: 'bg-gray-900 text-white hover:bg-gray-800',
          text: 'text-gray-600'
        };
    }
  };

  const styles = getVariantStyles();

  if (value) {
    return (
      <div className={cn('relative', className)}>
        <div className="relative w-full h-32 bg-gray-100 border-2 border-black overflow-hidden">
          <img
            src={value}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
          {!disabled && !uploading && (
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-32', className)}>
      <div
        className={cn(
          'relative w-full h-full border-2 border-dashed transition-colors cursor-pointer',
          styles.container,
          dragActive && 'border-brand-purple-dark bg-brand-purple-light/20',
          disabled && 'opacity-50 cursor-not-allowed',
          uploading && 'opacity-50 cursor-not-allowed'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => {
          console.log('FileUpload: Upload area clicked');
          if (!disabled && !uploading) {
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          onClick={() => console.log('FileUpload: File input clicked')}
          className="hidden"
          disabled={disabled || uploading}
          {...props}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {acceptedTypes} up to {maxSize}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
