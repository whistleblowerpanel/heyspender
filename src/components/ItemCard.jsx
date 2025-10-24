import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ImagePreviewModal from './ImagePreviewModal';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';

const ItemCard = ({ item, onClaimed, username, slug, viewMode }) => {
  const isFullyClaimed = (item.qty_claimed || 0) >= item.qty_total;
  const router = useRouter();

  // Typing animation for claim button
  const claimButtonText = useTypingAnimation(
    ['Hey Spender', 'Claim This Item'], 
    80, // typing speed
    1500, // pause duration
    60, // delete speed
    !isFullyClaimed // only animate when not fully claimed
  );

  const getPaidStatus = () => {
    if (!item.claims || item.claims.length === 0) {
      return { isPaid: false, spenders: [] };
    }
    
    const totalAmountNeeded = (item.unit_price_estimate || 0) * (item.qty_total || 1);
    
    if (!item.unit_price_estimate || totalAmountNeeded === 0) {
      return { isPaid: false, spenders: [] };
    }
    
    const totalAmountPaid = item.claims.reduce((sum, claim) => {
      return sum + (claim.amount_paid || 0);
    }, 0);
    
    const isFullyPaid = totalAmountPaid >= totalAmountNeeded;
    
    if (!isFullyPaid) {
      return { isPaid: false, spenders: [] };
    }
    
    const paidClaims = item.claims.filter(claim => 
      claim.amount_paid > 0 && claim.supporter_user?.username
    );
    
    if (paidClaims.length === 0) {
      return { isPaid: false, spenders: [] };
    }
    
    const spenderUsernames = [...new Set(paidClaims.map(c => c.supporter_user.username))];
    
    return { 
      isPaid: true, 
      spenders: spenderUsernames,
      count: spenderUsernames.length
    };
  };

  const paidStatus = getPaidStatus();

  const handleClaimClick = () => {
    if (!isFullyClaimed) {
      router.push(`/${username}/${slug}/${item.id}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className={`bg-white overflow-hidden ${viewMode === 'grid' ? 'border-2 border-black' : ''}`}
    >
      {viewMode === 'grid' ? (
        <div className="flex flex-col h-full">
          <div className="relative h-48 bg-gray-100">
            <ImagePreviewModal item={item} trigger={
              <button className="w-full h-full">
                {item.image_url ? 
                  <img alt={item.name} src={item.image_url} className="absolute inset-0 w-full h-full object-cover" /> :
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400"><ImageIcon className="w-12 h-12"/></div>
                }
              </button>
            } />
          </div>

          <div className="p-4 flex flex-col">
            <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] flex-shrink-0">
              {item.name}
            </h3>
            
            <div className="text-sm font-semibold text-gray-900 mb-3 flex-shrink-0">
              {item.unit_price_estimate ? `₦${Number(item.unit_price_estimate).toLocaleString()}` : 'Price TBD'} — <span className="text-gray-500 font-normal">{item.qty_claimed || 0}/{item.qty_total} claimed</span>
            </div>
            
            <Button 
              variant="custom" 
              className="bg-brand-green text-black disabled:bg-gray-300 w-full text-sm h-10 px-4 py-2 truncate border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90" 
              disabled={isFullyClaimed} 
              onClick={handleClaimClick}
            >
              {isFullyClaimed ? 
                (paidStatus.isPaid ? 
                  (paidStatus.count === 1 ? 
                    <><strong>@{paidStatus.spenders[0]}</strong>&nbsp;Paid For This!</> :
                    <><strong>{paidStatus.count} Spenders</strong>&nbsp;Paid For This!</>
                  ) : 
                  'Claimed This!'
                ) : 
                claimButtonText
              }
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="relative w-[116px] h-[116px] bg-gray-100 flex-shrink-0">
            <ImagePreviewModal item={item} trigger={
              <button className="w-full h-full">
                {item.image_url ? 
                  <img alt={item.name} src={item.image_url} className="absolute inset-0 w-full h-full object-cover" /> :
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8"/></div>
                }
              </button>
            } />
          </div>

          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
              {item.name}
            </h3>
            
            <div className="text-sm font-semibold text-gray-900 mb-2">
              {item.unit_price_estimate ? `₦${Number(item.unit_price_estimate).toLocaleString()}` : 'Price TBD'} — <span className="text-gray-500 font-normal">{item.qty_claimed || 0}/{item.qty_total} claimed</span>
            </div>
            
            <Button 
              variant="custom" 
              className="bg-brand-green text-black disabled:bg-gray-300 w-full text-xs py-2 h-auto truncate border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90" 
              disabled={isFullyClaimed} 
              onClick={handleClaimClick}
            >
              {isFullyClaimed ? 
                (paidStatus.isPaid ? 
                  (paidStatus.count === 1 ? 
                    <><strong>@{paidStatus.spenders[0]}</strong>&nbsp;Paid For This!</> :
                    <><strong>{paidStatus.count} Spenders</strong>&nbsp;Paid For This!</>
                  ) : 
                  'Claimed This!'
                ) : 
                claimButtonText
              }
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ItemCard;
