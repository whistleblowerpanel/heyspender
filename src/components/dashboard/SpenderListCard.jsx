import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { initializePaystackPayment } from '@/lib/paystackService';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ExternalLink, 
  Wallet, 
  Loader2,
  MoreHorizontal,
  CheckCircle2,
  X,
  Edit3,
  Gift,
  Eye,
  Trash2,
  Archive,
  ArchiveRestore
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { NotificationService } from '@/lib/notificationService';
import { ReminderService } from '@/lib/reminderService';
import { format, formatDistanceToNow } from 'date-fns';

const SpenderListCard = ({ claim, onUpdateStatus, onUpdateClaim, onDelete, onViewWishlist }) => {
  
  const item = claim?.wishlist_items || {};
  const wishlist = item?.wishlists || {};
  const wishlistOwner = wishlist?.users || {};
  
  // NEW PAYMENT TRACKING LOGIC - Complete Rebuild
  const itemPrice = Number(item?.unit_price_estimate) || 0;
  const amountPaid = claim?.amount_paid || 0;
  
  // Calculate quantity purchased first
  let quantityPurchased = 1; // default to 1 item
  
  // Try to extract quantity from note field first (for "Send Cash" claims)
  if (claim?.note && claim.note.startsWith('Quantity:')) {
    const qtyMatch = claim.note.match(/Quantity:\s*(\d+)/);
    if (qtyMatch) {
      quantityPurchased = parseInt(qtyMatch[1]);
    }
  }
  // For "I bought this already" claims, calculate from amount_paid
  // But ensure it's at least 1 item (don't allow 0 quantity for partial payments)
  else if (amountPaid > 0 && itemPrice > 0) {
    const calculatedQty = Math.round(amountPaid / itemPrice);
    quantityPurchased = Math.max(1, calculatedQty); // Ensure at least 1 item
  }
  
  // Calculate total estimated price based on quantity
  const estimatedPrice = itemPrice * quantityPurchased;
  
  // Get wallet transactions for this claim
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [localPayments, setLocalPayments] = useState([]);
  
  // Calculate total paid from wallet transactions (only positive amounts)
  const totalPaidFromTransactions = walletTransactions.reduce((sum, tx) => {
    const amount = tx.amount || 0;
    return sum + (amount > 0 ? amount : 0);
  }, 0);
  
  // Calculate total paid from local payments (for immediate UI updates)
  const totalPaidFromLocal = localPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  
  // Effective amount paid (use wallet transactions if available, otherwise use claims.amount_paid, plus any local payments for immediate UI feedback)
  const baseAmountPaid = totalPaidFromTransactions > 0 ? totalPaidFromTransactions : amountPaid;
  const effectiveAmountPaid = baseAmountPaid + totalPaidFromLocal;
  
  // Check if fully paid
  const isFullyPaid = estimatedPrice > 0 && effectiveAmountPaid >= estimatedPrice;
  
  // Fetch wallet transactions for this claim
  useEffect(() => {
    const fetchWalletTransactions = async () => {
      if (!claim?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('wallet_transactions')
          .select('*')
          .eq('claim_id', claim.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching wallet transactions:', error);
        } else {
          setWalletTransactions(data || []);
        }
      } catch (error) {
        console.error('Error in fetchWalletTransactions:', error);
      }
    };
    
    fetchWalletTransactions();
  }, [claim?.id]);
  
  // Clear local payments when wallet transactions are updated
  useEffect(() => {
    if (walletTransactions.length > 0) {
      setLocalPayments([]);
    }
  }, [walletTransactions]);

  
  const remainingAmount = estimatedPrice - effectiveAmountPaid;
  const isFulfilled = claim?.status === 'fulfilled' || isFullyPaid;
  
  // Debug logging removed for production
  
  
  // Modal states
  const [showCashDialog, setShowCashDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quantityToRemove, setQuantityToRemove] = useState(quantityPurchased);
  
  // Form states
  const [reminderDate, setReminderDate] = useState();
  const [reminderTime, setReminderTime] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [cashAmount, setCashAmount] = useState(
    estimatedPrice > 0 && effectiveAmountPaid > 0 
      ? estimatedPrice - effectiveAmountPaid 
      : estimatedPrice || ''
  );
  // Initialize notes, filtering out internal "Quantity: X" note
  const [notes, setNotes] = useState(
    claim?.note && claim.note.startsWith('Quantity:') ? '' : (claim?.note || '')
  );
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [savedReminderDateTime, setSavedReminderDateTime] = useState(null);
  const [reminderCountdown, setReminderCountdown] = useState('');
  const [databaseReminder, setDatabaseReminder] = useState(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Load reminder from database
  React.useEffect(() => {
    const loadReminder = async () => {
      if (!claim?.id) return;
      
      try {
        const result = await ReminderService.getReminderForClaim({ claimId: claim.id });
        
        if (result.success && result.data) {
          setDatabaseReminder(result.data);
          setSavedReminderDateTime(new Date(result.data.scheduled_at));
          
          // Pre-populate the reminder form with existing reminder data
          const existingDate = new Date(result.data.scheduled_at);
          setReminderDate(existingDate);
          setReminderTime(existingDate.toTimeString().slice(0, 5)); // HH:MM format
        }
      } catch (error) {
        console.error('Error loading reminder:', error);
      }
    };
    
    loadReminder();
  }, [claim?.id]);

  // Reset quantity to remove when delete dialog opens
  React.useEffect(() => {
    if (showDeleteDialog) {
      setQuantityToRemove(quantityPurchased);
    }
  }, [showDeleteDialog, quantityPurchased]);

  // Reset cash amount when cash dialog opens to reflect total price
  React.useEffect(() => {
    if (showCashDialog) {
      const defaultAmount = remainingAmount > 0 && effectiveAmountPaid > 0 
        ? remainingAmount 
        : estimatedPrice;
      setCashAmount(defaultAmount || '');
    }
  }, [showCashDialog, estimatedPrice, remainingAmount, effectiveAmountPaid]);

  // Update countdown every minute
  React.useEffect(() => {
    if (!savedReminderDateTime || typeof window === 'undefined') return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = savedReminderDateTime - now;

      if (diff <= 0) {
        setReminderCountdown('Now!');
        // Don't remove from database - let the cron job handle it
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setReminderCountdown(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setReminderCountdown(`${hours}h ${minutes}m`);
      } else {
        setReminderCountdown(`${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [savedReminderDateTime, claim?.id]);

  // Status colors matching other cards
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    fulfilled: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800'
  };

  const handleSendCash = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to send cash'
      });
      return;
    }

    if (!cashAmount || cashAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid amount'
      });
      return;
    }

    setIsProcessingPayment(true);
    setShowCashDialog(false);
    
    try {
      await handlePaystackPayment();
    } catch (error) {
      console.error('Payment initialization error:', error);
      
      // Show fallback options
      toast({
        variant: 'destructive',
        title: 'Payment System Unavailable',
        description: 'Paystack is currently unavailable. Please try again later or contact support.',
        action: (
          <button 
            onClick={() => showFallbackPaymentOptions()}
            className="text-white underline"
          >
            Alternative Options
          </button>
        )
      });
      setIsProcessingPayment(false);
    }
  };

  const showFallbackPaymentOptions = () => {
    toast({
      title: 'Alternative Payment Options',
      description: 'Please contact support for manual payment processing or try again later.',
      duration: 10000
    });
  };

  const handlePaystackPayment = async () => {
    const amount = parseFloat(cashAmount) * 100; // Convert to kobo
    const paymentRef = `payment_${Date.now()}_${claim.id}`;
    
    try {
      const paymentData = {
        email: user.email,
        amount: amount,
        currency: 'NGN',
        reference: paymentRef,
        metadata: {
          claim_id: claim.id,
          item_name: item.name,
          supporter_id: user.id,
          recipient_id: wishlistOwner.id
        },
        callback: (response) => {
          console.log('Paystack callback received:', response);
          handlePaymentSuccess(response, response.reference);
        },
        onClose: () => {
          console.log('Paystack modal closed');
          handlePaymentCancellation();
        }
      };

      const result = await initializePaystackPayment(paymentData);
      
      if (result.error) {
        console.log('Payment initialization result:', result.error.message);
        // The service handles fallback automatically
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      setIsProcessingPayment(false);
      toast({
        variant: 'destructive',
        title: 'Payment Error',
        description: 'Failed to initialize payment. Please try again or contact support.'
      });
    }
  };


  const handlePaymentCancellation = () => {
    setIsProcessingPayment(false);
    toast({
      title: 'Payment Cancelled',
      description: 'Payment was cancelled. You can try again anytime.'
    });
  };


  const handlePaymentSuccess = async (response, paymentRef) => {
    try {
      // Credit the recipient's wallet
      await creditRecipientWallet(wishlistOwner.id, parseFloat(cashAmount), paymentRef);
      
      // Create payment status record (optional - don't let this break payment)
      try {
        await createPaymentStatusRecord(parseFloat(cashAmount), paymentRef);
      } catch (notificationError) {
        console.warn('Failed to create payment notification (payment still successful):', notificationError);
      }
      
      // Update the claim's amount_paid field to reflect the payment
      const newAmountPaid = (claim?.amount_paid || 0) + parseFloat(cashAmount);
      const { error: updateError } = await supabase
        .from('claims')
        .update({ amount_paid: newAmountPaid })
        .eq('id', claim.id);
      
      if (updateError) {
        console.error('Error updating claim amount_paid:', updateError);
      }
      
      // Calculate updated amounts for success message
      const updatedAmountPaid = effectiveAmountPaid + parseFloat(cashAmount);
      const isNowFullyPaid = updatedAmountPaid >= estimatedPrice;
      const remainingAfterPayment = estimatedPrice - updatedAmountPaid;
      const itemName = item?.name || 'this item';
      
      
      // Show success message
      toast({
        title: 'Payment successful!',
        description: isNowFullyPaid 
          ? `₦${Number(cashAmount).toLocaleString()} sent! You have successfully paid for ${itemName}.`
          : `₦${Number(cashAmount).toLocaleString()} sent for ${itemName}! ₦${remainingAfterPayment.toLocaleString()} remaining.`
      });
      
      // Clear local payments to prevent double-counting
      setLocalPayments([]);
      
      // Trigger data refresh with a small delay to ensure database update is complete
      setTimeout(() => {
        if (onUpdateClaim) {
          onUpdateClaim();
        }
      }, 500);
      
      setIsProcessingPayment(false);
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Payment Processing Error',
        description: 'Failed to process payment. Please contact support.'
      });
      setIsProcessingPayment(false);
    }
  };

  const createPaymentStatusRecord = async (amount, paymentRef) => {
    try {
      console.log('Creating payment notification for:', {
        user_id: wishlistOwner.id,
        type: 'payment_received',
        title: 'Payment Received',
        message: `You received ₦${amount.toLocaleString()} for "${item.name}" from ${user.user_metadata?.username || user.email?.split('@')[0]}`,
        data: {
          claim_id: claim.id,
          item_name: item.name,
          amount: amount,
          payment_ref: paymentRef,
          sender_id: user.id,
          sender_username: user.user_metadata?.username || user.email?.split('@')[0]
        }
      });

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: wishlistOwner.id,
          type: 'payment_received',
          title: 'Payment Received',
          message: `You received ₦${amount.toLocaleString()} for "${item.name}" from ${user.user_metadata?.username || user.email?.split('@')[0]}`,
          data: {
            claim_id: claim.id,
            item_name: item.name,
            amount: amount,
            payment_ref: paymentRef,
            sender_id: user.id,
            sender_username: user.user_metadata?.username || user.email?.split('@')[0]
          }
        })
        .select();
      
      if (error) {
        console.error('Error creating payment status record:', {
          error,
          errorCode: error.code,
          errorMessage: error.message,
          errorDetails: error.details,
          errorHint: error.hint
        });
        // Don't throw the error - notification creation failure shouldn't break payment
      } else {
        console.log('Payment notification created successfully:', data);
      }
    } catch (error) {
      console.error('Error in createPaymentStatusRecord:', {
        error,
        errorMessage: error.message,
        errorStack: error.stack
      });
      // Don't throw the error - notification creation failure shouldn't break payment
    }
  };

  const creditRecipientWallet = async (recipientId, amount, paymentRef) => {
    // First, handle the recipient's wallet (credit)
    let { data: recipientWallet, error: recipientWalletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', recipientId)
      .single();

    if (recipientWalletError && recipientWalletError.code === 'PGRST116') {
      const { data: newWallet, error: createError } = await supabase
        .from('wallets')
        .insert({ user_id: recipientId, balance: amount, currency_default: 'NGN' })
        .select()
        .single();
      if (createError) throw createError;
      recipientWallet = newWallet;
    } else if (recipientWalletError) {
      throw recipientWalletError;
    } else {
      await supabase
        .from('wallets')
        .update({ balance: (recipientWallet.balance || 0) + amount })
        .eq('id', recipientWallet.id);
    }

    // Create credit transaction for recipient
    const { error: recipientTxError } = await supabase.from('wallet_transactions').insert({
      wallet_id: recipientWallet.id,
      type: 'credit',
      source: 'cash_payment',
      amount: amount,
      description: `Cash payment for "${item.name}" - Ref: ${paymentRef}`
    });
    
    if (recipientTxError) {
      console.error('❌ Error creating recipient wallet transaction:', recipientTxError);
      throw recipientTxError;
    }

    // Now, handle the sender's wallet (debit) - this is the current user making the payment
    let { data: senderWallet, error: senderWalletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (senderWalletError && senderWalletError.code === 'PGRST116') {
      // Create sender wallet if it doesn't exist
      const { data: newSenderWallet, error: createSenderError } = await supabase
        .from('wallets')
        .insert({ user_id: user.id, balance: 0, currency_default: 'NGN' })
        .select()
        .single();
      if (createSenderError) throw createSenderError;
      senderWallet = newSenderWallet;
    } else if (senderWalletError) {
      throw senderWalletError;
    }

    // Create debit transaction for sender (this will show in their wallet history)
    const { error: senderTxError } = await supabase.from('wallet_transactions').insert({
      wallet_id: senderWallet.id,
      type: 'debit',
      source: 'cash_payment',
      amount: -amount, // Negative amount for debit
      description: `Payment sent for "${item.name}" to @${wishlistOwner.username} - Ref: ${paymentRef}`
    });
    
    if (senderTxError) {
      console.error('❌ Error creating sender wallet transaction:', senderTxError);
      throw senderTxError;
    }
    
    console.log('✅ Wallet transactions created successfully for both sender and recipient');
  };

  const handleSetReminder = async () => {
    if (!reminderDate || !reminderTime) {
      toast({ variant: 'destructive', title: 'Missing information', description: `date: ${reminderDate}, time: ${reminderTime}` });
      return;
    }
    const reminderDateTime = new Date(`${format(reminderDate, 'yyyy-MM-dd')}T${reminderTime}`);
    if (reminderDateTime <= new Date()) {
      toast({ variant: 'destructive', title: 'Invalid date/time', description: `reminder: ${reminderDateTime}, now: ${new Date()}` });
      return;
    }
    
    try {
      // Update reminder in database
      const result = await ReminderService.updateReminderSchedule({
        claimId: claim.id,
        newScheduleDate: reminderDateTime,
        spenderEmail: user?.email,
        spenderUsername: user?.user_metadata?.username || user?.email?.split('@')[0],
        itemName: item.name
      });
      
      if (result.success) {
        setSavedReminderDateTime(reminderDateTime);
        setDatabaseReminder(result.data);
        toast({ title: 'Reminder updated!', description: `You'll be reminded on ${format(reminderDate, 'PPP')} at ${reminderTime}` });
        setShowReminderDialog(false);
        setReminderDate(undefined);
        setReminderTime('');
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to update reminder' });
      }
    } catch (error) {
      console.error('Error setting reminder:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update reminder' });
    }
  };

  const handleAddToCalendar = () => {
    const eventTitle = `Purchase: ${item.name}`;
    const eventDescription = `Don't forget to purchase "${item.name}" from ${wishlistOwner.username}'s wishlist.`;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
    const formatDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(eventDescription)}`;
    try {
      window.open(googleCalendarUrl, '_blank');
      toast({ title: 'Calendar event created' });
    } catch (error) {
      navigator.clipboard.writeText(googleCalendarUrl);
      toast({ title: 'Calendar link copied' });
    }
  };

  const handleSaveNotes = async () => {
    try {
      if (onUpdateClaim) {
        // Preserve internal quantity note if it exists
        let noteToSave = notes;
        if (claim?.note && claim.note.startsWith('Quantity:')) {
          // Append user note to quantity info
          noteToSave = notes ? `${claim.note}\n${notes}` : claim.note;
        }
        
        await onUpdateClaim(claim.id, { note: noteToSave });
        toast({ title: 'Note saved' });
        setShowNotesDialog(false);
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Save Note Error', description: JSON.stringify(error) });
    }
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      // Validate quantity only for multiple items
      if (quantityPurchased > 1) {
        if (quantityToRemove < 1 || quantityToRemove > quantityPurchased) {
          toast({
            variant: 'destructive',
            title: 'Invalid Quantity',
            description: `Please enter a quantity between 1 and ${quantityPurchased}`
          });
          return;
        }
      }
      
      onDelete(claim.id, quantityToRemove);
      setShowDeleteDialog(false);
    }
  };

  const handleToggleArchive = async () => {
    try {
      const newArchivedStatus = !claim?.archived;
      
      if (onUpdateClaim) {
        await onUpdateClaim(claim.id, { archived: newArchivedStatus });
        toast({ 
          title: newArchivedStatus ? 'Item archived' : 'Item unarchived',
          description: newArchivedStatus ? 'Item moved to archive' : 'Item restored to active list'
        });
      }
    } catch (error) {
      console.error('Error toggling archive:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Archive Error', 
        description: error.message || 'Failed to update archive status'
      });
    }
  };

  // Client-side only calculations to prevent hydration mismatches
  const [isExpired, setIsExpired] = React.useState(false);
  const [daysUntilExpiry, setDaysUntilExpiry] = React.useState(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const eventDate = wishlist?.wishlist_date;
    if (eventDate) {
      const now = new Date();
      const expiryDate = new Date(eventDate);
      setIsExpired(expiryDate < now);
      setDaysUntilExpiry(Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)));
    } else {
      setIsExpired(false);
      setDaysUntilExpiry(null);
    }
  }, [wishlist?.wishlist_date]);

  return (
    <div className="bg-white border-2 border-black overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Section */}
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gift className="w-16 h-16 text-gray-300" />
          </div>
        )}
        
        {/* 3-Dot Menu */}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-brand-purple-dark hover:bg-brand-purple-dark/90">
                <MoreHorizontal className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(`/${wishlistOwner.username}/${wishlist.slug}`, '_blank')}>
                <Eye className="mr-2 h-4 w-4" />
                View Wishlist
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowNotesDialog(true)}>
                <Edit3 className="mr-2 h-4 w-4" />
                {claim?.note ? 'Edit Note' : 'Add Note'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!isFullyPaid && claim?.status === 'pending' && (
                <DropdownMenuItem onClick={() => onUpdateStatus && onUpdateStatus(claim.id, 'confirmed')}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm
                </DropdownMenuItem>
              )}
              {!isFullyPaid && claim?.status === 'confirmed' && (
                <DropdownMenuItem onClick={() => onUpdateStatus && onUpdateStatus(claim.id, 'fulfilled')}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark Fulfilled
                </DropdownMenuItem>
              )}
              {!isFullyPaid && claim?.status === 'pending' && (
                <DropdownMenuItem onClick={() => onUpdateStatus && onUpdateStatus(claim.id, 'cancelled')}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleToggleArchive}>
                {claim?.archived ? (
                  <>
                    <ArchiveRestore className="mr-2 h-4 w-4" />
                    Unarchive
                  </>
                ) : (
                  <>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => !isFullyPaid && setShowDeleteDialog(true)}
                className={`${isFullyPaid ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 focus:text-red-600 focus:bg-red-50'}`}
                disabled={isFullyPaid}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isFullyPaid ? 'Fully Paid' : 'Remove Item'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <div className="mb-4">
          <Link href={`/${wishlistOwner.username}/${wishlist.slug}`}>
            <h3 className="font-semibold text-lg hover:text-brand-purple-dark transition-colors truncate">
              {item.name || 'Unnamed Item'}
            </h3>
          </Link>
        </div>

        {/* Price */}
        {item.unit_price_estimate && (
          <div className="mb-4">
            {effectiveAmountPaid > 0 && !isFullyPaid ? (
              // Partial payment made
              <div className="text-[15px] text-gray-600">
                <div className="flex items-center gap-2 mb-1">
                  <span>Est. Price —</span>
                  <span className="font-black text-brand-purple-dark">₦{remainingAmount.toLocaleString()}{quantityPurchased > 1 ? ` (${quantityPurchased})` : ''}</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1">Remaining</span>
                </div>
                <div className="text-xs text-green-600">
                  ₦{effectiveAmountPaid.toLocaleString()} already paid
                </div>
              </div>
            ) : isFullyPaid ? (
              // Fully paid
              <div className="text-[15px] text-gray-600">
                Est. Price — <span className="font-black text-green-600">₦{estimatedPrice.toLocaleString()}{quantityPurchased > 1 ? ` (${quantityPurchased})` : ''} (Fully Paid)</span>
              </div>
            ) : (
              // No payment yet
              <div className="text-[15px] text-gray-600">
                Est. Price — <span className="font-black text-brand-purple-dark">₦{estimatedPrice.toLocaleString()}{quantityPurchased > 1 ? ` (${quantityPurchased})` : ''}</span>
              </div>
            )}
          </div>
        )}

        {/* Note */}
        {(() => {
          // Extract user note (excluding internal quantity tracking)
          let userNote = claim?.note || '';
          if (userNote.startsWith('Quantity:')) {
            // Extract everything after the quantity line
            const lines = userNote.split('\n');
            userNote = lines.slice(1).join('\n').trim();
          }
          
          return userNote && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Note</div>
              <div className="text-sm text-gray-800 line-clamp-2">{userNote}</div>
            </div>
          );
        })()}

        {/* Actions */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCashDialog(true)}
              className={`flex-1 ${isFullyPaid ? 'bg-gray-300 text-gray-600 hover:bg-gray-300' : 'bg-brand-green text-black hover:bg-brand-green/90'}`}
              size="sm"
              disabled={isFullyPaid}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isFullyPaid ? 'Fully Paid' : 'Send Cash'}
            </Button>
            {item.product_url && (
              <Button
                onClick={() => window.open(item.product_url, '_blank')}
                className={`flex-1 ${isFullyPaid ? 'bg-gray-300 text-gray-600 hover:bg-gray-300' : 'bg-brand-orange text-black hover:bg-brand-orange/90'}`}
                size="sm"
                disabled={isFullyPaid}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isFullyPaid ? 'Fully Paid' : 'Purchase'}
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowReminderDialog(true)}
              variant={savedReminderDateTime && !isFullyPaid ? "default" : "outline"}
              size="sm"
              className={`flex-1 ${isFullyPaid ? 'bg-gray-300 text-gray-600 hover:bg-gray-300 border-gray-300' : savedReminderDateTime ? (databaseReminder ? 'bg-brand-purple-dark text-white hover:bg-brand-purple-dark/90' : 'bg-brand-purple-dark text-white hover:bg-brand-purple-dark/90') : ''}`}
              disabled={isFullyPaid}
            >
              <Clock className="w-4 h-4 mr-2" />
              {isFullyPaid ? 'Fully Paid' : (savedReminderDateTime ? (databaseReminder ? `Auto: ${reminderCountdown}` : reminderCountdown) : 'Reminder')}
            </Button>
            <Button
              onClick={handleAddToCalendar}
              variant="outline"
              size="sm"
              className={`flex-1 ${isFullyPaid ? 'bg-gray-300 text-gray-600 hover:bg-gray-300 border-gray-300' : ''}`}
              disabled={isFullyPaid}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              {isFullyPaid ? 'Fully Paid' : 'Calendar'}
            </Button>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-4 text-xs text-gray-500">
          {wishlist?.wishlist_date && !isExpired && daysUntilExpiry !== null && daysUntilExpiry > 0 && (
            <span>Event in <strong>{daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}</strong> | </span>
          )}
          {isExpired && <span className="text-red-600">Event Passed | </span>}
          <span>For: <strong>@{wishlistOwner.username || 'Unknown'}</strong></span>
        </div>
      </div>

      {/* Modals */}
      <Dialog open={showCashDialog} onOpenChange={setShowCashDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pr-8">Send Cash</DialogTitle>
            <DialogDescription>
              Send money to @{wishlistOwner.username} for "{item.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="text"
                value={cashAmount ? Number(cashAmount).toLocaleString() : ''}
                onChange={(e) => {
                  // Remove commas and non-numeric characters
                  const numericValue = e.target.value.replace(/,/g, '').replace(/[^\d]/g, '');
                  setCashAmount(numericValue);
                }}
                placeholder="Enter amount"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => setShowCashDialog(false)}
              className="border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              variant="custom"
              onClick={(e) => {
                e.preventDefault();
                handleSendCash();
              }} 
              disabled={isProcessingPayment}
              className="bg-brand-green text-black border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
            >
              {isProcessingPayment ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
              ) : (
                'Send Cash'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pr-8">
              {savedReminderDateTime 
                ? (databaseReminder ? 'Update Auto-Reminder' : 'Update Reminder') 
                : 'Set Reminder'
              }
            </DialogTitle>
            <DialogDescription>
              {savedReminderDateTime 
                ? databaseReminder 
                  ? `Automatic reminder set for ${format(savedReminderDateTime, 'PPP')} at ${format(savedReminderDateTime, 'HH:mm')}. You'll receive reminders every 2 days until payment is complete.`
                  : `Current reminder: ${format(savedReminderDateTime, 'PPP')} at ${format(savedReminderDateTime, 'HH:mm')}`
                : `Get reminded to purchase "${item.name}"`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Date</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {reminderDate ? format(reminderDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={reminderDate}
                    onSelect={(date) => {
                      setReminderDate(date);
                      setDatePickerOpen(false);
                    }}
                    disabled={(date) => {
                      const today = new Date(new Date().setHours(0, 0, 0, 0));
                      if (date < today) return true;
                      if (wishlist?.wishlist_date) {
                        const eventDate = new Date(wishlist.wishlist_date);
                        if (date > eventDate) return true;
                      }
                      return false;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Time</Label>
              <Input 
                type="time" 
                value={reminderTime} 
                onChange={(e) => setReminderTime(e.target.value)}
                min={
                  reminderDate && 
                  new Date(reminderDate).toDateString() === new Date().toDateString()
                    ? new Date().toTimeString().slice(0, 5)
                    : undefined
                }
                max={
                  reminderDate && wishlist?.wishlist_date &&
                  new Date(reminderDate).toDateString() === new Date(wishlist.wishlist_date).toDateString()
                    ? new Date(wishlist.wishlist_date).toTimeString().slice(0, 5)
                    : undefined
                }
              />
              {reminderDate && new Date(reminderDate).toDateString() === new Date().toDateString() && (
                <p className="text-xs text-gray-500 mt-1">Must be after current time</p>
              )}
              {reminderDate && wishlist?.wishlist_date && new Date(reminderDate).toDateString() === new Date(wishlist.wishlist_date).toDateString() && (
                <p className="text-xs text-gray-500 mt-1">Must be before event time</p>
              )}
            </div>
            
            {databaseReminder && (
              <div className="bg-blue-50 border border-blue-200  p-3">
                <p className="text-sm text-blue-800">
                  <strong>Automatic Reminder Active:</strong> You're currently receiving automatic reminders every 2 days. 
                  Updating this will change your reminder schedule, but you can always return to automatic reminders by clearing and re-claiming the item.
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="mt-6">
            <div className="flex justify-between w-full items-center">
              {savedReminderDateTime && (
                <Button 
                  variant="ghost" 
                  type="button"
                  onClick={async () => {
                    try {
                      const result = await ReminderService.cancelReminder({ claimId: claim.id });
                      if (result.success) {
                        setSavedReminderDateTime(null);
                        setReminderCountdown('');
                        setDatabaseReminder(null);
                        setShowReminderDialog(false);
                        toast({ title: 'Reminder cleared' });
                      } else {
                        toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to clear reminder' });
                      }
                    } catch (error) {
                      console.error('Error clearing reminder:', error);
                      toast({ variant: 'destructive', title: 'Error', description: 'Failed to clear reminder' });
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:underline"
                >
                  Clear Reminder
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => setShowReminderDialog(false)}
                  className="border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  variant="custom"
                  onClick={handleSetReminder}
                  className="bg-brand-green text-black border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
                >
                  {savedReminderDateTime 
                    ? (databaseReminder ? 'Update Auto-Reminder' : 'Update Reminder') 
                    : 'Set Reminder'
                  }
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pr-8">{claim?.note ? 'Edit Note' : 'Add Note'}</DialogTitle>
            <DialogDescription>Keep track of additional information</DialogDescription>
          </DialogHeader>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., Color preference, size, delivery instructions..."
            rows={4}
          />
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => setShowNotesDialog(false)}
              className="border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              variant="custom"
              onClick={handleSaveNotes}
              className="bg-brand-green text-black border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
            >
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pr-8">Remove Item from Your List?</DialogTitle>
            <DialogDescription>
              {quantityPurchased > 1 
                ? `Choose how many items of "${item.name}" you want to remove from your spender list.`
                : `Are you sure you want to remove "${item.name}" from your spender list?`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {quantityPurchased > 1 ? (
              <>
                <div>
                  <Label htmlFor="quantity-to-remove" className="text-sm font-medium">
                    Quantity to Remove
                  </Label>
                  <Input
                    id="quantity-to-remove"
                    type="number"
                    min="1"
                    max={quantityPurchased}
                    value={quantityToRemove}
                    onChange={(e) => setQuantityToRemove(parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You purchased {quantityPurchased} item{quantityPurchased > 1 ? 's' : ''}. Remove 1 to {quantityPurchased}.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3">
                  <p className="text-sm text-blue-800">
                    💡 {quantityToRemove} item{quantityToRemove > 1 ? 's' : ''} will be returned to {wishlistOwner.username}'s wishlist and become available for others to claim.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-blue-50 border border-blue-200  p-3">
                <p className="text-sm text-blue-800">
                  This will make the item available again on {wishlistOwner.username}'s wishlist for others to claim.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => setShowDeleteDialog(false)}
              className="border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              variant="custom"
              onClick={handleDeleteConfirm}
              className="bg-brand-accent-red hover:bg-brand-accent-red/90 text-white border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove {quantityToRemove > 1 ? `${quantityToRemove} Items` : 'Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default SpenderListCard;
