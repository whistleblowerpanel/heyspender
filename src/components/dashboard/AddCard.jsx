import React from 'react';
import { Plus } from 'lucide-react';

const AddCard = ({ label, onClick, viewMode = 'grid' }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full border-2 border-dashed border-gray-300 bg-white hover:border-brand-purple-dark hover:bg-brand-purple-dark/5 transition-all duration-200 flex items-center justify-center gap-3 group ${
        viewMode === 'grid' 
          ? 'h-48 flex-col' 
          : 'h-32 flex-row px-4'
      }`}
    >
      <div className={`bg-gray-100 group-hover:bg-brand-purple-dark/10 flex items-center justify-center transition-colors ${
        viewMode === 'grid' 
          ? 'w-12 h-12' 
          : 'w-8 h-8'
      }`}>
        <Plus className={`text-gray-400 group-hover:text-brand-purple-dark ${
          viewMode === 'grid' 
            ? 'w-6 h-6' 
            : 'w-4 h-4'
        }`} />
      </div>
      <span className={`font-medium text-gray-600 group-hover:text-brand-purple-dark ${
        viewMode === 'grid' 
          ? 'text-sm' 
          : 'text-xs'
      }`}>
        {label}
      </span>
    </button>
  );
};

export default AddCard;
