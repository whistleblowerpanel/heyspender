"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { EmailService } from '@/lib/emailService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  Clock, 
  CheckCircle, 
  Mail, 
  Bell,
  Eye,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

const AdminNotifications = () => {
  const { toast } = useToast();
  
  // State
  const [notifications, setNotifications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [connectionError, setConnectionError] = useState(false);
  const [tablesMissing, setTablesMissing] = useState(false);

  // Note: Removed callback mechanism to avoid setState during render issues
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'reminder',
    title: '',
    subject: '',
    body: '',
    trigger: 'manual',
    status: 'active',
    interval_days: 2
  });

  // Notification types
  const notificationTypes = {
    reminder: 'Reminder Email',
    announcement: 'Announcement',
    welcome: 'Welcome Email',
    claim_confirmation: 'Claim Confirmation',
    payment_received: 'Payment Received',
    payout_status: 'Payout Status Update'
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist (PGRST205), just set empty array
        if (error.code === 'PGRST205' || error.code === '42P01') {
          console.warn('notification_templates table does not exist yet. Please create it.');
          setNotifications([]);
          return;
        }
        throw error;
      }
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // Handle different types of errors
      if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
        setConnectionError(true);
        toast({
          variant: 'destructive',
          title: 'Connection Error',
          description: 'Unable to connect to database. Please check your internet connection and try again.'
        });
      } else if (error.code === 'PGRST205' || error.code === '42P01') {
        // Table doesn't exist - this is expected for new installations
        console.warn('notification_templates table does not exist yet. Please run the database migration.');
        setTablesMissing(true);
        setNotifications([]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load notifications: ' + (error.message || 'Unknown error')
        });
      }
    }
  };

  // Fetch scheduled reminders
  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('scheduled_reminders')
        .select(`
          *,
          claims:claim_id (
            wishlist_items (
              name,
              wishlists (
                title,
                users (
                  username,
                  email
                )
              )
            )
          )
        `)
        .order('scheduled_at', { ascending: true });

      if (error) {
        // If table doesn't exist (PGRST205), just set empty array
        if (error.code === 'PGRST205' || error.code === '42P01') {
          console.warn('scheduled_reminders table does not exist yet. Please create it.');
          setReminders([]);
          setLoading(false);
          return;
        }
        throw error;
      }
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      
      // Handle different types of errors
      if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
        console.warn('Database connection failed for scheduled reminders');
        setConnectionError(true);
        setReminders([]);
      } else if (error.code === 'PGRST205' || error.code === '42P01') {
        // Table doesn't exist - this is expected for new installations
        console.warn('scheduled_reminders table does not exist yet. Please run the database migration.');
        setTablesMissing(true);
        setReminders([]);
      } else {
        console.error('Unexpected error fetching reminders:', error);
        setReminders([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchReminders();
  }, []);

  // Create notification template
  const handleCreateNotification = async () => {
    try {
      const { error } = await supabase
        .from('notification_templates')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: 'Notification created',
        description: 'Template has been saved successfully'
      });

      setShowCreateDialog(false);
      resetForm();
      fetchNotifications();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message
      });
    }
  };

  // Update notification template
  const handleUpdateNotification = async () => {
    try {
      const { error } = await supabase
        .from('notification_templates')
        .update(formData)
        .eq('id', selectedNotification.id);

      if (error) throw error;

      toast({
        title: 'Notification updated',
        description: 'Template has been updated successfully'
      });

      setShowEditDialog(false);
      setSelectedNotification(null);
      resetForm();
      fetchNotifications();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message
      });
    }
  };

  // Delete notification template
  const handleDeleteNotification = async () => {
    try {
      const { error } = await supabase
        .from('notification_templates')
        .delete()
        .eq('id', selectedNotification.id);

      if (error) throw error;

      toast({
        title: 'Notification deleted',
        description: 'Template has been removed'
      });

      setShowDeleteDialog(false);
      setSelectedNotification(null);
      fetchNotifications();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message
      });
    }
  };

  // Test send notification
  const handleTestSend = async (notification) => {
    try {
      // Get the first scheduled reminder to use as test data
      const testReminder = reminders.find(r => r.claims?.wishlist_items?.wishlists?.users?.email === 'expresscreo@gmail.com');
      
      if (!testReminder) {
        toast({
          variant: 'destructive',
          title: 'No test data found',
          description: 'No scheduled reminder found for expresscreo@gmail.com'
        });
        return;
      }

      // Prepare email data with template variables
      const emailData = {
        to: 'expresscreo@gmail.com',
        subject: notification.subject || 'Test Notification from HeySpender',
        html: generateTestEmailHTML(notification, testReminder),
        text: generateTestEmailText(notification, testReminder),
        templateKey: 'admin_test_notification',
        metadata: {
          notificationId: notification.id,
          testEmail: true,
          reminderId: testReminder.id
        }
      };

      // Send the email
      const result = await EmailService.sendEmail(emailData);

      if (result.success) {
        toast({
          title: 'Test email sent successfully!',
          description: 'Check expresscreo@gmail.com inbox for the test notification'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to send test email',
          description: result.error || 'Unknown error occurred'
        });
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        variant: 'destructive',
        title: 'Error sending test email',
        description: error.message || 'Unknown error occurred'
      });
    }
  };

  // Helper function to generate test email HTML
  const generateTestEmailHTML = (notification, reminder) => {
    const itemName = reminder.claims?.wishlist_items?.name || 'Test Item';
    const wishlistOwner = reminder.claims?.wishlist_items?.wishlists?.users?.username || 'Test User';
    const userEmail = reminder.claims?.wishlist_items?.wishlists?.users?.email || 'expresscreo@gmail.com';
    
    // Replace template variables in the notification body
    let emailBody = notification.body || 'This is a test notification from HeySpender admin panel.';
    emailBody = emailBody.replace(/\{user_name\}/g, 'Test User');
    emailBody = emailBody.replace(/\{item_name\}/g, itemName);
    emailBody = emailBody.replace(/\{days_left\}/g, '2');
    emailBody = emailBody.replace(/\{wishlist_owner\}/g, wishlistOwner);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Notification - HeySpender</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #161B47; margin-bottom: 10px;">📧 Test Notification</h1>
    <p style="color: #666; font-size: 16px;">This is a test email from HeySpender Admin Panel</p>
  </div>
  
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
    <h2 style="color: #161B47; margin-bottom: 15px;">Template: ${notification.title}</h2>
    <div style="white-space: pre-line; font-size: 16px; line-height: 1.6;">
      ${emailBody}
    </div>
  </div>

  <div style="background-color: #e8f4fd; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
    <h3 style="color: #161B47; margin-bottom: 10px;">Test Data Used:</h3>
    <ul style="margin: 0; padding-left: 20px;">
      <li><strong>User:</strong> Test User (${userEmail})</li>
      <li><strong>Item:</strong> ${itemName}</li>
      <li><strong>Wishlist Owner:</strong> ${wishlistOwner}</li>
      <li><strong>Days Left:</strong> 2</li>
    </ul>
  </div>

  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="color: #666; font-size: 14px;">
      This is a test email sent from the HeySpender Admin Panel.<br>
      Template ID: ${notification.id} | Sent at: ${new Date().toLocaleString()}
    </p>
  </div>
</body>
</html>`;
  };

  // Helper function to generate test email text
  const generateTestEmailText = (notification, reminder) => {
    const itemName = reminder.claims?.wishlist_items?.name || 'Test Item';
    const wishlistOwner = reminder.claims?.wishlist_items?.wishlists?.users?.username || 'Test User';
    
    // Replace template variables in the notification body
    let emailBody = notification.body || 'This is a test notification from HeySpender admin panel.';
    emailBody = emailBody.replace(/\{user_name\}/g, 'Test User');
    emailBody = emailBody.replace(/\{item_name\}/g, itemName);
    emailBody = emailBody.replace(/\{days_left\}/g, '2');
    emailBody = emailBody.replace(/\{wishlist_owner\}/g, wishlistOwner);

    return `
TEST NOTIFICATION - HeySpender Admin Panel

Template: ${notification.title}

${emailBody}

Test Data Used:
- User: Test User (expresscreo@gmail.com)
- Item: ${itemName}
- Wishlist Owner: ${wishlistOwner}
- Days Left: 2

This is a test email sent from the HeySpender Admin Panel.
Template ID: ${notification.id}
Sent at: ${new Date().toLocaleString()}
`;
  };

  const resetForm = () => {
    setFormData({
      type: 'reminder',
      title: '',
      subject: '',
      body: '',
      trigger: 'manual',
      status: 'active',
      interval_days: 2
    });
  };

  const openEditDialog = (notification) => {
    setSelectedNotification(notification);
    setFormData({
      type: notification.type,
      title: notification.title,
      subject: notification.subject,
      body: notification.body,
      trigger: notification.trigger,
      status: notification.status,
      interval_days: notification.interval_days || 2
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (notification) => {
    setSelectedNotification(notification);
    setShowDeleteDialog(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple-dark" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Connection Error Banner */}
      {connectionError && (
        <div className="border-2 border-red-500 bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-800">Database Connection Error</h3>
          </div>
          <p className="text-red-700 mt-2">
            Unable to connect to the database. This could be due to:
          </p>
          <ul className="text-red-700 mt-2 ml-4 list-disc">
            <li>Internet connectivity issues</li>
            <li>Supabase service being down</li>
            <li>Incorrect database configuration</li>
          </ul>
          <p className="text-red-700 mt-2">
            Please check your connection and try refreshing the page.
          </p>
        </div>
      )}

      {/* Missing Tables Banner */}
      {tablesMissing && !connectionError && (
        <div className="border-2 border-yellow-500 bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-bold text-yellow-800">Database Setup Required</h3>
          </div>
          <p className="text-yellow-700 mt-2">
            The notification system tables have not been created yet. To set up the notification system:
          </p>
          <ol className="text-yellow-700 mt-2 ml-4 list-decimal">
            <li>Run the database migration: <code className="bg-yellow-100 px-1 rounded">supabase/migrations/002_notification_system.sql</code></li>
            <li>Refresh this page after the migration is complete</li>
          </ol>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-brand-purple-dark">Notifications Management</h2>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-brand-green text-black border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
        >
          <Plus className="h-4 w-4 mr-2"/>
          Create Template
        </Button>
      </div>

      {/* Notification Templates Table */}
      <div className="border-2 border-black bg-white">
        <div className="p-4 border-b-2 border-black bg-brand-cream">
          <h3 className="font-bold text-lg">Email Templates</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Interval</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No notification templates yet</p>
                    <p className="text-sm">Create your first template to get started</p>
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {notificationTypes[notification.type] || notification.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize">{notification.trigger}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={notification.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {notification.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {notification.interval_days ? `Every ${notification.interval_days} days` : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {format(new Date(notification.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTestSend(notification)}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(notification)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDeleteDialog(notification)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Scheduled Reminders Table */}
      <div className="border-2 border-black bg-white">
        <div className="p-4 border-b-2 border-black bg-brand-purple-light">
          <h3 className="font-bold text-lg">Scheduled Reminders</h3>
          <p className="text-sm text-gray-600 mt-1">Auto-reminders for claims (every 2 days)</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Wishlist</TableHead>
                <TableHead>Scheduled For</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No scheduled reminders</p>
                    <p className="text-sm">Reminders will appear when users set them</p>
                  </TableCell>
                </TableRow>
              ) : (
                reminders.map((reminder) => (
                  <TableRow key={reminder.id}>
                    <TableCell className="font-medium">
                      {reminder.claims?.wishlist_items?.wishlists?.users?.email || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {reminder.claims?.wishlist_items?.name || 'Unknown Item'}
                    </TableCell>
                    <TableCell>
                      {reminder.claims?.wishlist_items?.wishlists?.title || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(reminder.scheduled_at), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Badge className={reminder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                        {reminder.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{reminder.sent_count || 0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setShowEditDialog(false);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {showEditDialog ? 'Edit Template' : 'Create Notification Template'}
            </DialogTitle>
            <DialogDescription>
              Design email notifications for various events and triggers
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Template Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="E.g., Reminder Email - 2 Days Before Expiry"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Notification Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(notificationTypes).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Trigger</Label>
                <Select value={formData.trigger} onValueChange={(value) => setFormData({ ...formData, trigger: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'reminder' && (
                <div>
                  <Label>Reminder Interval (days)</Label>
                  <Input
                    type="number"
                    value={formData.interval_days}
                    onChange={(e) => setFormData({ ...formData, interval_days: parseInt(e.target.value) })}
                    min="1"
                    max="30"
                  />
                </div>
              )}
            </div>

            <div>
              <Label>Email Subject</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Subject line for the email"
              />
            </div>

            <div>
              <Label>Email Body</Label>
              <Textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Write your email content here..."
                rows={8}
              />
              <p className="text-xs text-gray-500 mt-1">
                Available variables: {'{'}user_name{'}'}, {'{'}item_name{'}'}, {'{'}days_left{'}'}, {'{'}wishlist_owner{'}'}
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => {
                setShowCreateDialog(false);
                setShowEditDialog(false);
                resetForm();
              }}
              className="border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              variant="custom"
              onClick={showEditDialog ? handleUpdateNotification : handleCreateNotification}
              className="bg-brand-green text-black border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
            >
              {showEditDialog ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedNotification?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNotification}
              className="bg-brand-accent-red text-white border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminNotifications;

