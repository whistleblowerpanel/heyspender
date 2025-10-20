import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContributeModal from './ContributeModal';

const GoalCard = ({ goal, index, recipientEmail, onContributed }) => {
  const progress = goal.target_amount > 0 ? Math.round(((goal.amount_raised || 0) / goal.target_amount) * 100) : 0;
  const successfulContributions = goal.contributions?.filter(c => c.status === 'success') || [];

  const getProgressBarColor = (percentage) => {
    if (percentage >= 100) return 'bg-brand-green';
    if (percentage >= 75) return 'bg-brand-orange';
    if (percentage >= 50) return 'bg-brand-salmon';
    if (percentage >= 25) return 'bg-brand-accent-red';
    return 'bg-brand-purple-light';
  };

  const progressColor = getProgressBarColor(progress);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="border-2 border-black p-6 bg-white flex flex-col h-full"
    >
      <h3 className="text-2xl font-bold text-brand-purple-dark mb-4 min-h-[4rem] line-clamp-2">
        {goal.title}
      </h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-semibold">Raised: ₦{Number(goal.amount_raised || 0).toLocaleString()}</span>
          <span className="font-semibold">Target: ₦{Number(goal.target_amount).toLocaleString()}</span>
        </div>
        <div className="relative h-3 w-full overflow-hidden border-2 border-black bg-gray-200">
          <div 
            className={`h-full transition-all ${progressColor}`} 
            style={{
              width: `${progress}%`, 
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.1) 10px, rgba(0, 0, 0, 0.1) 20px)'
            }}
          ></div>
        </div>
        <div className="text-left text-xs mt-1 text-gray-600">
          <span>{progress}% Complete</span>
        </div>
      </div>

      <div className="mb-4">
        <ContributeModal 
          goal={goal} 
          recipientEmail={recipientEmail} 
          onContributed={onContributed} 
          trigger={
            <Button 
              variant="custom" 
              className="w-full bg-brand-green text-black text-sm h-10 px-4 py-2 border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
            >
              Contribute to this Goal
            </Button>
          } 
        />
      </div>

      {successfulContributions.length > 0 && (
        <div className="mt-auto">
          <h4 className="font-semibold mb-2">Recent Spenders:</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
            {successfulContributions.map(c => (
              <div key={c.id} className="flex items-center gap-2 text-sm bg-gray-50 p-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{c.is_anonymous ? 'Anonymous Spender' : c.display_name} contributed ₦{Number(c.amount).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GoalCard;
