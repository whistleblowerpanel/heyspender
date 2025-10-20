import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MoreHorizontal, Edit, Eye, Share2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const CashGoalCard = ({ goal, onEdit, onView, onShare }) => {
  const progress = goal.target_amount > 0 ? (goal.amount_raised / goal.target_amount) * 100 : 0;
  const visibilityLabel = {
    public: 'Public',
    unlisted: 'Unlisted',
    private: 'Private'
  }[goal.visibility];

  const visibilityColor = {
    public: 'bg-green-100 text-green-800',
    unlisted: 'bg-yellow-100 text-yellow-800',
    private: 'bg-gray-100 text-gray-800'
  }[goal.visibility];

  return (
    <div className="relative bg-white border-2 border-black p-6 overflow-hidden group">
      {/* Water fill animation */}
      <div className="absolute inset-0 bg-brand-purple-dark/10 opacity-0 translate-y-full group-hover:translate-y-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:transition-all group-hover:duration-700 ease-in-out pointer-events-none" 
           style={{ transformOrigin: 'bottom' }} />
      
      {/* Content wrapper with relative positioning to stay above the water fill */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 text-black min-h-[4rem]" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>{goal.title}</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 text-xs font-medium ${visibilityColor}`}>
                {visibilityLabel}
              </span>
              {goal.deadline && (
                <span className="text-xs text-black">
                  Due {new Date(goal.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-brand-purple-dark hover:bg-brand-purple-dark/90">
                <MoreHorizontal className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress section - fixed height for alignment */}
        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold">Raised: ₦{goal.amount_raised.toLocaleString()}</span>
            <span className="font-semibold">Target: ₦{goal.target_amount.toLocaleString()}</span>
          </div>
          <div className="relative h-3 w-full overflow-hidden border-2 border-black bg-gray-200">
            <div className="h-full bg-brand-green transition-all" style={{width: `${progress}%`, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(22, 27, 71, 0.1) 10px, rgba(22, 27, 71, 0.1) 20px)'}}></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashGoalCard;
