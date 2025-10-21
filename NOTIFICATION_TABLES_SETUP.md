# 📧 Notification System - Database Setup Guide

## Quick Setup (2 Methods)

### **Method 1: Supabase Dashboard (Recommended - Easiest)**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `heyspender`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/002_notification_system.sql`
6. Paste into the SQL editor
7. Click **Run** (or press `Cmd+Enter`)
8. ✅ Done! Tables will be created instantly

### **Method 2: Using Supabase CLI**

```bash
# Make sure you're in the project directory
cd /Users/gq/Projects/heyspender-nextjs

# Link to your project (if not already linked)
npx supabase link --project-ref YOUR_PROJECT_REF

# Run the migration
npx supabase db push

# Or run the specific migration file
npx supabase db execute --file supabase/migrations/002_notification_system.sql
```

---

## ✅ What Gets Created

### **3 Tables:**

1. **`notification_templates`**
   - Stores email templates for different notification types
   - Fields: type, title, subject, body, trigger, status, interval_days
   - RLS enabled (admins can manage)
   
2. **`scheduled_reminders`**
   - Stores scheduled reminder emails for claims
   - Fields: claim_id, scheduled_at, status, sent_count, etc.
   - RLS enabled (admins can view all, users can view their own)
   
3. **`notification_logs`** (Bonus - for tracking)
   - Tracks all notifications sent
   - Fields: recipient, subject, status, sent_at, opened_at
   - RLS enabled (admins can view all, users can view their own)

### **Indexes Created:**
- Performance indexes on all key columns
- Optimized for fast queries

### **Triggers:**
- Auto-update `updated_at` timestamps

### **Sample Templates:**
1. Welcome Email - sent to new users
2. Contribution Received - sent when someone contributes
3. Claim Payment Reminder - sent every 2 days for incomplete payments

---

## 🧪 Verify Installation

After running the migration, check in Supabase Dashboard:

1. Go to **Database** → **Tables**
2. You should see:
   - ✅ `notification_templates` (with 3 sample rows)
   - ✅ `scheduled_reminders`
   - ✅ `notification_logs`

---

## 🎯 What This Enables in Admin Dashboard

Once tables are created, the **Notifications** tab will allow you to:

### **Email Templates Management:**
- ✅ View all notification templates
- ✅ Create new templates
- ✅ Edit existing templates
- ✅ Delete templates
- ✅ Test send emails
- ✅ Activate/deactivate templates

### **Scheduled Reminders:**
- ✅ View all scheduled reminders for claims
- ✅ See when reminders will be sent
- ✅ Track sent count
- ✅ Manage reminder status

### **Template Types Available:**
- `reminder` - Payment reminders for claims
- `announcement` - Platform announcements
- `welcome` - Welcome emails for new users
- `claim_confirmation` - Claim confirmation emails
- `payment_received` - Payment received notifications
- `payout_status` - Payout status updates
- `contribution_received` - Contribution notifications
- `wishlist_completed` - Wishlist completion alerts
- `goal_achieved` - Goal achievement celebrations
- `custom` - Custom templates

---

## 📊 Sample Data Included

The migration includes 3 sample templates to get you started:

1. **Welcome Email**
   - Type: `welcome`
   - Trigger: `automatic`
   - Sent automatically to new users

2. **Contribution Received**
   - Type: `contribution_received`
   - Trigger: `automatic`
   - Sent when someone contributes to a wishlist

3. **Claim Payment Reminder**
   - Type: `reminder`
   - Trigger: `scheduled`
   - Interval: Every 2 days
   - Sent to users who claimed items but haven't paid

---

## 🔐 Security (Row Level Security)

All tables have RLS policies:

- **Admins**: Full access to all tables
- **Users**: Can view their own reminders and notification logs
- **Public**: No access

---

## 🚀 Next Steps

1. **Run the migration** using Method 1 or 2 above
2. **Refresh your admin dashboard** notifications tab
3. **You'll see**:
   - ✅ 3 sample templates in the Email Templates table
   - ✅ Empty Scheduled Reminders table (will populate when users claim items)
   - ✅ "Create Template" button functional
   - ✅ Edit/Delete buttons on sample templates

4. **Test the functionality**:
   - Click "Create Template" to add new email templates
   - Edit sample templates to customize
   - Test send functionality
   - View scheduled reminders (will appear when users claim items)

---

## 💡 Tips

- The migration is **idempotent** (safe to run multiple times)
- Sample data uses `ON CONFLICT DO NOTHING` (won't create duplicates)
- All timestamps use `TIMESTAMP WITH TIME ZONE` (timezone-aware)
- Variables in templates use `{variable_name}` syntax
- Templates support rich formatting and multiple variables

---

## 📝 File Locations

- **Migration SQL**: `supabase/migrations/002_notification_system.sql`
- **Component**: `src/components/admin/AdminNotifications.jsx`
- **This Guide**: `NOTIFICATION_TABLES_SETUP.md`

---

**Ready to go!** Just run the SQL in Supabase Dashboard and your notifications system will be live! 🎉

