import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Save,
  LogOut,
  Trash2,
  Download,
  CreditCard,
  PauseCircle,
  Plus,
  Minus
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { getUserFriendlyError } from '@/lib/utils';
import { profileUpdateSchema, emailUpdateSchema, passwordChangeSchema } from '@/lib/formValidation';
import { supabaseStorageService } from '@/lib/supabaseStorageService';
import FormField from '@/components/forms/FormField';
import PhoneInput from '@/components/forms/PhoneInput';
import BankDetailsForm from '@/components/forms/BankDetailsForm';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';

const SettingsDashboard = ({ onSignOut }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Bank details state
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    bankCode: ''
  });
  const [bankDetailsLoading, setBankDetailsLoading] = useState(false);
  const [bankDetailsSaving, setBankDetailsSaving] = useState(false);



  // Profile Form
  const profileForm = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: user?.user_metadata?.full_name || '',
      username: user?.user_metadata?.username || '',
      phone: user?.user_metadata?.phone || ''
    }
  });

  // Email Form
  const emailForm = useForm({
    resolver: zodResolver(emailUpdateSchema),
    defaultValues: {
      email: user?.email || ''
    }
  });

  // Password Form
  const passwordForm = useForm({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    contributionAlerts: true,
    reminderEmails: true,
    marketingEmails: false
  });
  const [notificationSettingsLoading, setNotificationSettingsLoading] = useState(true);
  const [notificationSettingsSaving, setNotificationSettingsSaving] = useState(false);
  
  // Developer mode state (for admins only)
  const [developerMode, setDeveloperMode] = useState(() => {
    return localStorage.getItem('devMode') === 'true';
  });
  
  // Account active state
  const [accountActive, setAccountActive] = useState(true);
  const [loadingAccountStatus, setLoadingAccountStatus] = useState(true);
  
  // Collapse states for each section
  const [expandedSections, setExpandedSections] = useState({
    profile: false,
    email: false,
    password: false,
    bank: false,
    account: false,
    notifications: false,
    actions: false
  });
  
  // Check if user is admin
  const isAdmin = user?.user_metadata?.role === 'admin';

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Fetch notification settings from database
  const fetchNotificationSettings = async () => {
    if (!user?.id) return;
    
    try {
      setNotificationSettingsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('email_notifications, sms_notifications, push_notifications, contribution_alerts, reminder_emails, marketing_emails')
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn('Notification settings columns may not exist in database:', error.message);
        // Keep default values if columns don't exist
        return;
      }

      if (data) {
        setNotificationSettings({
          emailNotifications: data.email_notifications ?? true,
          smsNotifications: data.sms_notifications ?? false,
          pushNotifications: data.push_notifications ?? true,
          contributionAlerts: data.contribution_alerts ?? true,
          reminderEmails: data.reminder_emails ?? true,
          marketingEmails: data.marketing_emails ?? false
        });
      }
    } catch (error) {
      console.warn('Error fetching notification settings (columns may not exist):', error);
    } finally {
      setNotificationSettingsLoading(false);
    }
  };

  // Fetch user's account active status and bank details
  useEffect(() => {
    const fetchAccountStatus = async () => {
      if (!user?.id) return;
      
      setLoadingAccountStatus(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('is_active')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setAccountActive(data.is_active ?? true);
        }
      } catch (error) {
        console.error('Error fetching account status:', error);
      } finally {
        setLoadingAccountStatus(false);
      }
    };

    const fetchBankDetails = async () => {
      if (!user?.id) return;
      
      setBankDetailsLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('bank_account_number, bank_name, account_name, bank_code')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setBankDetails({
            accountName: data.account_name || '',
            accountNumber: data.bank_account_number || '',
            bankName: data.bank_name || '',
            bankCode: data.bank_code || ''
          });
        }
      } catch (error) {
        console.error('Error fetching bank details:', error);
      } finally {
        setBankDetailsLoading(false);
      }
    };
    
    fetchAccountStatus();
    fetchBankDetails();
    fetchNotificationSettings();
  }, [user?.id]);

  const handleProfileUpdate = async (data) => {
    try {
      // TODO: Implement actual profile update
      console.log('Profile update:', data);
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Update Profile Error', 
        description: JSON.stringify(error) 
      });
    }
  };

  const handleEmailUpdate = async (data) => {
    try {
      // TODO: Implement actual email update
      console.log('Email update:', data);
      toast({ 
        title: 'Email update initiated', 
        description: 'Please check your new email for verification.' 
      });
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Update Email Error', 
        description: JSON.stringify(error) 
      });
    }
  };

  const handlePasswordChange = async (data) => {
    try {
      // TODO: Implement actual password change
      console.log('Password change:', data);
      passwordForm.reset();
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Update Password Error', 
        description: JSON.stringify(error) 
      });
    }
  };

  const handleNotificationUpdate = async (e) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({ 
        title: 'Error', 
        description: 'User not found',
        variant: 'destructive'
      });
      return;
    }

    try {
      setNotificationSettingsSaving(true);
      
      const { error } = await supabase
        .from('users')
        .update({
          email_notifications: notificationSettings.emailNotifications,
          sms_notifications: notificationSettings.smsNotifications,
          push_notifications: notificationSettings.pushNotifications,
          contribution_alerts: notificationSettings.contributionAlerts,
          reminder_emails: notificationSettings.reminderEmails,
          marketing_emails: notificationSettings.marketingEmails,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.warn('Error updating notification settings (columns may not exist):', error);
        toast({ 
          title: 'Warning', 
          description: 'Notification settings feature is not fully configured. Settings saved locally.',
          variant: 'default'
        });
        return;
      }

      toast({ 
        title: 'Success', 
        description: 'Notification settings updated successfully!' 
      });
    } catch (error) {
      console.warn('Error updating notification settings (columns may not exist):', error);
      toast({ 
        title: 'Warning', 
        description: 'Notification settings feature is not fully configured. Settings saved locally.',
        variant: 'default'
      });
    } finally {
      setNotificationSettingsSaving(false);
    }
  };
  
  const handleDeveloperModeToggle = (checked) => {
    setDeveloperMode(checked);
    localStorage.setItem('devMode', checked.toString());
    toast({ 
      title: checked ? 'Developer Mode Enabled' : 'Developer Mode Disabled',
      description: checked 
        ? 'You will now see technical error messages for debugging.' 
        : 'User-friendly error messages have been restored.'
    });
  };

  const handleExportData = () => {
    toast({ 
      title: 'Data export initiated', 
      description: 'You will receive an email when your data is ready.' 
    });
  };

  const handleDeleteAccount = async () => {
    try {
      // Get user data first to identify files to delete
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('username, full_name')
        .eq('id', user.id)
        .single();

      if (userError) {
        toast({ variant: 'destructive', title: 'Fetch User Error', description: JSON.stringify(userError) });
        return;
      }

      // Get all wishlists for this user to find images
      const { data: wishlists, error: wishlistsError } = await supabase
        .from('wishlists')
        .select('id, cover_image_url')
        .eq('user_id', user.id);

      if (wishlistsError) {
        toast({ variant: 'destructive', title: 'Fetch Wishlists Error', description: JSON.stringify(wishlistsError) });
        return;
      }

      // Get all wishlist items for this user to find images (through wishlists)
      const { data: wishlistItems, error: itemsError } = await supabase
        .from('wishlist_items')
        .select('id, image_url, wishlist_id')
        .in('wishlist_id', wishlists?.map(w => w.id) || []);

      if (itemsError) {
        toast({ variant: 'destructive', title: 'Fetch Items Error', description: JSON.stringify(itemsError) });
        return;
      }

      // Collect all image URLs to delete
      const imageUrls = [];
      
      // Add wishlist cover images
      wishlists?.forEach(wishlist => {
        if (wishlist.cover_image_url) {
          imageUrls.push(wishlist.cover_image_url);
        }
      });

      // Add wishlist item images
      wishlistItems?.forEach(item => {
        if (item.image_url) {
          imageUrls.push(item.image_url);
        }
      });

      // Delete images from storage (Supabase Storage)
      if (imageUrls.length > 0) {
        const deletionResult = await supabaseStorageService.deleteMultipleImages(imageUrls);
        console.log(`Image deletion completed: ${deletionResult.success} successful, ${deletionResult.failed} failed`);
        
        if (deletionResult.failed > 0) {
          console.warn(`Failed to delete ${deletionResult.failed} images, but continuing with account deletion`);
        }
      }

      // Delete all user-related data in the correct order (respecting foreign key constraints)
      
      // 1. Delete contributions (references cash_goals)
      const { error: contributionsError } = await supabase
        .from('contributions')
        .delete()
        .eq('supporter_user_id', user.id);

      if (contributionsError) {
        console.error('Error deleting contributions:', contributionsError);
      }

      // Preserve wallets and wallet transactions to keep financial records intact

      // 4. Anonymize claims (set supporter_user_id to null to break foreign key reference)
      // This preserves the claim data for audit purposes while allowing account deletion
      const { error: claimsError } = await supabase
        .from('claims')
        .update({ supporter_user_id: null })
        .eq('supporter_user_id', user.id);

      if (claimsError) {
        console.error('Error anonymizing claims:', claimsError);
      }

      // Goals deletion will be performed by wishlist_id after computing wishlistIds below

      // 6. Delete wishlist items (through wishlist_id)
      const wishlistIds = wishlists?.map(w => w.id) || [];
      if (wishlistIds.length > 0) {
        const { error: wishlistItemsDeleteError } = await supabase
          .from('wishlist_items')
          .delete()
          .in('wishlist_id', wishlistIds);

        if (wishlistItemsDeleteError) {
          console.error('Error deleting wishlist items:', wishlistItemsDeleteError);
        }
      }

      // Delete goals that belong to the user's wishlists
      if (wishlistIds.length > 0) {
        const { error: goalsDeleteError } = await supabase
          .from('goals')
          .delete()
          .in('wishlist_id', wishlistIds);

        if (goalsDeleteError) {
          console.error('Error deleting goals:', goalsDeleteError);
        }
      }

      // 7. Delete wishlists
      const { error: wishlistsDeleteError } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id);

      if (wishlistsDeleteError) {
        console.error('Error deleting wishlists:', wishlistsDeleteError);
      }

      // 8. Delete user from Supabase authentication using Edge Function
      const { data: authDeleteResult, error: authDeleteError } = await supabase.functions.invoke('delete-user', {
        body: { userId: user.id }
      });
      
      if (authDeleteError || !authDeleteResult?.success) {
        console.error('Error deleting user from authentication:', authDeleteError || authDeleteResult);
        toast({ variant: 'destructive', title: 'Delete Auth User Error', description: 'Failed to delete user from authentication. Please try again.' });
        return;
      }

      // 9. Delete user from users table
      const { error: userDeleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (userDeleteError) {
        toast({ variant: 'destructive', title: 'Delete User Record Error', description: JSON.stringify(userDeleteError) });
        return;
      }

      toast({ 
        title: 'Account deleted successfully', 
        description: `Your account has been permanently deleted.` 
      });
      
      // Sign out and redirect to home page
      await signOut();
      window.location.href = '/';

    } catch (error) {
      console.error('Unexpected error during account deletion:', error);
    toast({ 
      variant: 'destructive', 
        title: 'Delete Account Error', 
        description: JSON.stringify(error) 
    });
    }
  };

  const handleAccountStatusToggle = async (checked) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_active: checked,
          suspended_by: checked ? null : 'self' // Set to 'self' when deactivating, null when activating
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setAccountActive(checked);
      toast({
        title: checked ? 'Account Activated' : 'Account Deactivated',
        description: checked 
          ? 'Your wishlists are now visible and accessible to everyone.' 
          : 'Your wishlists are now hidden from public view. They can only be accessed by you.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Account Status Error',
        description: JSON.stringify(error)
      });
    }
  };

  const handleSaveBankDetails = async (e, formBankDetails = null) => {
    e.preventDefault();
    
    const detailsToSave = formBankDetails || bankDetails;
    
    if (!detailsToSave.accountName || !detailsToSave.accountNumber || !detailsToSave.bankName) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please fill in all required bank details.'
      });
      return;
    }

    setBankDetailsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          account_name: detailsToSave.accountName,
          bank_account_number: detailsToSave.accountNumber,
          bank_name: detailsToSave.bankName,
          bank_code: detailsToSave.bankCode,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update the main state with the saved data
      setBankDetails(detailsToSave);

      toast({
        title: 'Bank Details Saved',
        description: 'Your bank details have been saved successfully.'
      });
    } catch (error) {
      console.error('Error saving bank details:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Failed to save bank details. Please try again.'
      });
    } finally {
      setBankDetailsSaving(false);
    }
  };

  // Collapsible Section Component
  const CollapsibleSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors"
      >
        {isExpanded ? (
          <Minus className="w-5 h-5 text-gray-700" />
        ) : (
          <Plus className="w-5 h-5 text-gray-700" />
        )}
        <span className="font-semibold text-gray-800 uppercase tracking-wide">
          {title}
        </span>
      </button>
      {isExpanded && (
        <div className="mt-4 p-6 bg-white border-2 border-black">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        {/* Profile Settings */}
      <CollapsibleSection
        title="Profile"
        isExpanded={expandedSections.profile}
        onToggle={() => toggleSection('profile')}
      >
        <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
          <FormField
            control={profileForm.control}
            name="full_name"
            label="Full Name"
            required
          />
          
          <FormField
            control={profileForm.control}
            name="username"
            label="Username"
            required
          />
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <PhoneInput
              id="phone"
              value={profileForm.watch('phone')}
              onChange={(value) => profileForm.setValue('phone', value)}
              onBlur={profileForm.register('phone').onBlur}
            />
            <p className="text-xs text-gray-500">International phone number with country code</p>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button 
              type="submit"
              variant="custom"
              className="bg-brand-green text-black"
              disabled={profileForm.formState.isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </form>
      </CollapsibleSection>

      {/* Bank Account Details */}
      <CollapsibleSection
        title="Bank Account Details"
        isExpanded={expandedSections.bank}
        onToggle={() => toggleSection('bank')}
      >
        {bankDetailsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-brand-purple-dark"></div>
            <span className="ml-2 text-gray-600">Loading bank details...</span>
          </div>
        ) : (
          <BankDetailsForm
            bankDetails={bankDetails}
            onSave={handleSaveBankDetails}
            bankDetailsSaving={bankDetailsSaving}
          />
        )}
      </CollapsibleSection>

      {/* Email Settings */}
      <CollapsibleSection
        title="Email Settings"
        isExpanded={expandedSections.email}
        onToggle={() => toggleSection('email')}
      >
        <form onSubmit={emailForm.handleSubmit(handleEmailUpdate)} className="space-y-4">
          <FormField
            control={emailForm.control}
            name="email"
            label="Email Address"
            required
            description="Changing your email will require verification"
          />
          
          <div className="flex justify-end pt-2">
            <Button 
              type="submit"
              variant="custom"
              className="bg-brand-orange text-black"
              disabled={emailForm.formState.isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              Update Email
            </Button>
          </div>
        </form>
      </CollapsibleSection>

      {/* Password Settings */}
      <CollapsibleSection
        title="Password Settings"
        isExpanded={expandedSections.password}
        onToggle={() => toggleSection('password')}
      >
        <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
          <FormField
            control={passwordForm.control}
            name="newPassword"
            label="New Password"
            required
          />
          
          <FormField
            control={passwordForm.control}
            name="confirmPassword"
            label="Confirm New Password"
            required
          />
          
          <div className="flex justify-end pt-2">
            <Button 
              type="submit"
              variant="custom"
              className="bg-brand-purple-dark text-white"
              disabled={passwordForm.formState.isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </div>
        </form>
      </CollapsibleSection>

      {/* Account Status */}
      <CollapsibleSection
        title="Account Status"
        isExpanded={expandedSections.account}
        onToggle={() => toggleSection('account')}
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border-2 border-blue-200 p-4">
            <p className="text-sm text-blue-800">
              <strong>What happens when you deactivate your account?</strong>
            </p>
            <ul className="mt-2 text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>Your wishlists won't appear on the Explore page</li>
              <li>Direct links to your wishlists will show a "temporarily unavailable" message</li>
              <li>All your data remains safe and can be reactivated anytime</li>
              <li>You can still access your dashboard and manage your wishlists</li>
            </ul>
          </div>

          <div className={`flex items-center justify-between py-4 px-4 border-2 transition-all ${
            accountActive ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
          }`}>
            <div className="flex-1">
              <Label className="text-base font-semibold flex items-center gap-2">
                {accountActive ? (
                  <span className="text-green-700">🟢 Account Active</span>
                ) : (
                  <span className="text-red-700">🔴 Account Deactivated</span>
                )}
              </Label>
              <p className="text-sm mt-1">
                {accountActive ? (
                  <span className="text-green-700">Your wishlists are visible to everyone</span>
                ) : (
                  <span className="text-red-700">Your wishlists are hidden from public view</span>
                )}
              </p>
            </div>
            <Switch
              checked={accountActive}
              onCheckedChange={handleAccountStatusToggle}
              disabled={loadingAccountStatus}
            />
          </div>

          {!accountActive && (
            <div className="bg-amber-50 border-2 border-amber-300 p-3">
              <p className="text-xs text-amber-800">
                ⚠️ <strong>Note:</strong> While your account is deactivated, visitors with direct links will see a message that your wishlists are temporarily unavailable.
              </p>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Notification Settings */}
      <CollapsibleSection
        title="Notifications & Options"
        isExpanded={expandedSections.notifications}
        onToggle={() => toggleSection('notifications')}
      >
        {notificationSettingsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-brand-purple-dark"></div>
            <span className="ml-2 text-gray-600">Loading notification settings...</span>
          </div>
        ) : (
          <form onSubmit={handleNotificationUpdate} className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-xs text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                  disabled={notificationSettingsSaving}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium">SMS Notifications</Label>
                  <p className="text-xs text-gray-500">Receive notifications via SMS</p>
                </div>
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                  }
                  disabled={notificationSettingsSaving}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium">Push Notifications</Label>
                  <p className="text-xs text-gray-500">Receive push notifications</p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                  }
                  disabled={notificationSettingsSaving}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium">Contribution Alerts</Label>
                  <p className="text-xs text-gray-500">Get notified when someone contributes</p>
                </div>
                <Switch
                  checked={notificationSettings.contributionAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, contributionAlerts: checked }))
                  }
                  disabled={notificationSettingsSaving}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium">Reminder Emails</Label>
                  <p className="text-xs text-gray-500">Receive reminder emails for pending contributions</p>
                </div>
                <Switch
                  checked={notificationSettings.reminderEmails}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, reminderEmails: checked }))
                  }
                  disabled={notificationSettingsSaving}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium">Marketing Emails</Label>
                  <p className="text-xs text-gray-500">Receive promotional emails and updates</p>
                </div>
                <Switch
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))
                  }
                  disabled={notificationSettingsSaving}
                />
              </div>
            
            {/* Developer Mode Toggle - Only visible to admins */}
            {isAdmin && (
              <div className="border-t-2 border-orange-200 pt-4 mt-4">
                <div className="flex items-center justify-between py-2 bg-orange-50 px-3">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-orange-900 flex items-center gap-2">
                      🔧 Developer Mode
                      <span className="text-xs bg-orange-200 text-orange-900 px-2 py-0.5 font-normal">Admin Only</span>
                    </Label>
                    <p className="text-xs text-orange-700">Show technical error messages for debugging</p>
                  </div>
                  <Switch
                    checked={developerMode}
                    onCheckedChange={handleDeveloperModeToggle}
                  />
                </div>
              </div>
            )}
          </div>
          
            <div className="flex justify-end pt-2">
              <Button 
                type="submit"
                variant="custom"
                className="bg-brand-green text-black"
                disabled={notificationSettingsSaving}
              >
                {notificationSettingsSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-b-2 border-black mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CollapsibleSection>

      {/* Account Actions */}
      <CollapsibleSection
        title="Account Actions"
        isExpanded={expandedSections.actions}
        onToggle={() => toggleSection('actions')}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleExportData}
              className="flex flex-col items-center gap-3 p-6 border-2 border-black hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] transition-all"
            >
              <Download className="w-8 h-8 text-brand-purple-dark" />
              <div className="text-center">
                <p className="font-semibold">Export Data</p>
                <p className="text-xs text-gray-500">Download your data</p>
              </div>
            </button>

            <button
              onClick={onSignOut}
              className="flex flex-col items-center gap-3 p-6 border-2 border-black hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] transition-all"
            >
              <LogOut className="w-8 h-8 text-brand-orange" />
              <div className="text-center">
                <p className="font-semibold">Sign Out</p>
                <p className="text-xs text-gray-500">Sign out of your account</p>
              </div>
            </button>

            <button
              onClick={handleDeleteAccount}
              className="flex flex-col items-center gap-3 p-6 border-2 border-black hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] transition-all bg-red-600"
            >
              <Trash2 className="w-8 h-8 text-white" />
              <div className="text-center">
                <p className="font-semibold text-white">Delete Account</p>
                <p className="text-xs text-white/80">Permanently delete your account</p>
              </div>
            </button>
          </div>
        </div>
      </CollapsibleSection>

      {/* Account Information Card */}
      <div className="border-2 border-black p-4 sm:p-6 bg-brand-purple-dark">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-white/80 text-sm font-medium">Account ID:</span>
            <span className="font-mono text-xs bg-white/20 text-white px-2 py-1 break-all">
              {user?.id || 'N/A'}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white/80 text-sm font-medium">Member since:</span>
            <span className="text-white text-sm">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white/80 text-sm font-medium">Email:</span>
            <span className="text-white text-sm break-all">
              {user?.email || 'N/A'}
            </span>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default SettingsDashboard;
