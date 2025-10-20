import React, { useState, useRef } from 'react';

const FileUpload = ({ 
  onFileSelect, 
  acceptedTypes = "PNG, JPG, WEBP", 
  maxSize = "5MB",
  className = "",
  variant = "default", // default, purple, white, etc.
  uploading = false,
  disabled = false,
  value = null, // The uploaded image URL or file object
  onRemove = null // Function to call when removing the image
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'purple':
        return {
          container: "border-2 border-dashed border-purple-300 text-center bg-purple-200/30 h-[200px]",
          icon: "text-purple-600",
          primaryText: "text-purple-800 font-medium text-sm md:text-lg",
          secondaryText: "text-purple-700 text-xs md:text-sm mt-1 font-medium"
        };
      case 'white':
        return {
          container: "border-2 border-dashed border-gray-300 p-4 md:p-8 text-center bg-white",
          icon: "text-gray-500",
          primaryText: "text-gray-700 font-medium text-sm md:text-lg",
          secondaryText: "text-gray-500 text-xs md:text-sm mt-1"
        };
      case 'dark':
        return {
          container: "border-2 border-dashed border-gray-600 p-4 md:p-8 text-center bg-gray-800",
          icon: "text-gray-400",
          primaryText: "text-gray-200 font-medium text-sm md:text-lg",
          secondaryText: "text-gray-400 text-xs md:text-sm mt-1"
        };
      default:
        return {
          container: "border-2 border-dashed border-gray-300 p-4 md:p-8 text-center bg-gray-50",
          icon: "text-gray-500",
          primaryText: "text-gray-700 font-medium text-sm md:text-lg",
          secondaryText: "text-gray-500 text-xs md:text-sm mt-1"
        };
    }
  };

  const styles = getVariantStyles();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect && !uploading && !disabled) {
      onFileSelect(file);
    }
  };

  // Get image URL from value (could be a URL string or file object)
  const getImageUrl = () => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (value instanceof File) return URL.createObjectURL(value);
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div className={`${styles.container} ${className} relative cursor-pointer`}>
      {imageUrl ? (
        // Show image preview that fills the fixed height container like cover
        <div className="relative w-full h-full group overflow-hidden">
          <img
            src={imageUrl}
            alt="Uploaded image"
            className="w-full h-full object-cover select-none"
            draggable={false}
          />
          {/* Remove button overlay */}
          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove();
              }}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 z-10"
            >
              ×
            </button>
          )}
        </div>
      ) : (
        // Show upload interface (with padding)
        <div className="p-4 md:p-8 space-y-2 md:space-y-4">
          <div className="w-10 h-10 md:w-16 md:h-16 mx-auto flex items-center justify-center">
            <svg className={`w-8 h-8 md:w-12 md:h-12 ${styles.icon}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
          <div>
            <p className={styles.primaryText}>
              {uploading ? 'Uploading...' : 'Click to upload'}
            </p>
            <p className={styles.secondaryText}>{acceptedTypes} (MAX. {maxSize})</p>
          </div>
        </div>
      )}
      {!imageUrl && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading || disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
};

export default FileUpload;
