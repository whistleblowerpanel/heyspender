-- =====================================================
-- NOTIFICATION SYSTEM TABLES
-- =====================================================
-- This migration creates tables for managing email notifications
-- and automated reminders in the HeySpender admin dashboard
-- =====================================================

-- =====================================================
-- 1. NOTIFICATION TEMPLATES TABLE
-- =====================================================
-- Stores email templates for various notification types
-- Used by admins to create, manage, and send automated emails

CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Template Information
  type TEXT NOT NULL CHECK (type IN (
    'reminder',
    'announcement',
    'welcome',
    'claim_confirmation',
    'payment_received',
    'payout_status',
    'contribution_received',
    'wishlist_completed',
    'goal_achieved',
    'custom'
  )),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  
  -- Trigger Settings
  trigger TEXT DEFAULT 'manual' CHECK (trigger IN (
    'manual',
    'automatic',
    'scheduled'
  )),
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN (
    'active',
    'inactive',
    'draft'
  )),
  
  -- Reminder Settings (for reminder type)
  interval_days INTEGER CHECK (interval_days > 0 AND interval_days <= 30),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Variables used in template (JSON array of variable names)
  variables JSONB DEFAULT '[]'::jsonb,
  
  -- Email settings
  from_name TEXT DEFAULT 'HeySpender',
  from_email TEXT DEFAULT 'noreply@heyspender.com',
  reply_to TEXT,
  
  -- Statistics
  sent_count INTEGER DEFAULT 0,
  last_sent_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notification_templates_type ON notification_templates(type);
CREATE INDEX IF NOT EXISTS idx_notification_templates_status ON notification_templates(status);
CREATE INDEX IF NOT EXISTS idx_notification_templates_created_at ON notification_templates(created_at DESC);

-- =====================================================
-- 2. SCHEDULED REMINDERS TABLE
-- =====================================================
-- Stores scheduled reminder emails for claims
-- Automatically sends reminders at specified intervals

CREATE TABLE IF NOT EXISTS scheduled_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Claim Reference
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  
  -- Scheduling
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',
    'sent',
    'failed',
    'cancelled'
  )),
  
  -- Tracking
  sent_count INTEGER DEFAULT 0,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  next_send_at TIMESTAMP WITH TIME ZONE,
  
  -- Template used (optional)
  template_id UUID REFERENCES notification_templates(id) ON DELETE SET NULL,
  
  -- Email details (if sent)
  email_to TEXT,
  email_subject TEXT,
  email_body TEXT,
  
  -- Error tracking
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_scheduled_reminders_claim_id ON scheduled_reminders(claim_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_reminders_status ON scheduled_reminders(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_reminders_scheduled_at ON scheduled_reminders(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_scheduled_reminders_next_send_at ON scheduled_reminders(next_send_at);

-- =====================================================
-- 3. NOTIFICATION LOGS TABLE (Optional - for tracking)
-- =====================================================
-- Tracks all notifications sent through the system

CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Reference
  template_id UUID REFERENCES notification_templates(id) ON DELETE SET NULL,
  reminder_id UUID REFERENCES scheduled_reminders(id) ON DELETE SET NULL,
  
  -- Recipient
  recipient_email TEXT NOT NULL,
  recipient_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Email Details
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',
    'sent',
    'failed',
    'bounced'
  )),
  
  -- Tracking
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  
  -- Error tracking
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notification_logs_recipient_email ON notification_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON notification_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_logs_template_id ON notification_logs(template_id);

-- =====================================================
-- 4. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for notification_templates
DROP TRIGGER IF EXISTS update_notification_templates_updated_at ON notification_templates;
CREATE TRIGGER update_notification_templates_updated_at
    BEFORE UPDATE ON notification_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for scheduled_reminders
DROP TRIGGER IF EXISTS update_scheduled_reminders_updated_at ON scheduled_reminders;
CREATE TRIGGER update_scheduled_reminders_updated_at
    BEFORE UPDATE ON scheduled_reminders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Policies for notification_templates
-- Admins can do everything
CREATE POLICY "Admins can do everything with notification_templates"
  ON notification_templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policies for scheduled_reminders
-- Admins can view all
CREATE POLICY "Admins can view all scheduled_reminders"
  ON scheduled_reminders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Users can view their own reminders
CREATE POLICY "Users can view their own reminders"
  ON scheduled_reminders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM claims
      JOIN wishlist_items ON claims.wishlist_item_id = wishlist_items.id
      JOIN wishlists ON wishlist_items.wishlist_id = wishlists.id
      WHERE claims.id = scheduled_reminders.claim_id
      AND (
        wishlists.user_id = auth.uid()
        OR claims.supporter_user_id = auth.uid()
      )
    )
  );

-- Admins can update reminders
CREATE POLICY "Admins can update scheduled_reminders"
  ON scheduled_reminders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policies for notification_logs
-- Admins can view all logs
CREATE POLICY "Admins can view all notification_logs"
  ON notification_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Users can view their own notification logs
CREATE POLICY "Users can view their own notification_logs"
  ON notification_logs
  FOR SELECT
  USING (
    recipient_user_id = auth.uid()
  );

-- =====================================================
-- 6. SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert a sample welcome email template
INSERT INTO notification_templates (type, title, subject, body, trigger, status, from_name, variables)
VALUES (
  'welcome',
  'Welcome Email - New User',
  'Welcome to HeySpender! 🎉',
  E'Hi {user_name},\n\nWelcome to HeySpender! We\'re thrilled to have you join our community.\n\nWith HeySpender, you can:\n• Create beautiful wishlists for any occasion\n• Accept contributions from friends and family\n• Track your goals and celebrate achievements\n\nGet started by creating your first wishlist!\n\nBest regards,\nThe HeySpender Team',
  'automatic',
  'active',
  'HeySpender Team',
  '["user_name", "email"]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Insert a sample contribution received template
INSERT INTO notification_templates (type, title, subject, body, trigger, status, interval_days, from_name, variables)
VALUES (
  'contribution_received',
  'Contribution Received Notification',
  'You received a contribution! 💝',
  E'Hi {user_name},\n\nGreat news! Someone just contributed ₦{amount} to your {item_name}!\n\nYou\'re now {percentage}% closer to your goal.\n\nView your wishlist: {wishlist_link}\n\nThank you for using HeySpender!\n\nBest regards,\nThe HeySpender Team',
  'automatic',
  'active',
  NULL,
  'HeySpender',
  '["user_name", "amount", "item_name", "percentage", "wishlist_link"]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Insert a sample reminder template
INSERT INTO notification_templates (type, title, subject, body, trigger, status, interval_days, from_name, variables)
VALUES (
  'reminder',
  'Claim Payment Reminder - 2 Days',
  'Reminder: Complete your payment for {item_name}',
  E'Hi {user_name},\n\nThis is a friendly reminder that you claimed "{item_name}" from {wishlist_owner}\'s wishlist.\n\nDays remaining: {days_left}\nAmount to pay: ₦{amount}\n\nPlease complete your payment soon to secure your claim.\n\nView item: {item_link}\n\nThank you!\nThe HeySpender Team',
  'scheduled',
  'active',
  2,
  'HeySpender Reminders',
  '["user_name", "item_name", "wishlist_owner", "days_left", "amount", "item_link"]'::jsonb
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 7. COMMENTS
-- =====================================================

COMMENT ON TABLE notification_templates IS 'Stores email templates for various notification types';
COMMENT ON TABLE scheduled_reminders IS 'Stores scheduled reminder emails for claims';
COMMENT ON TABLE notification_logs IS 'Tracks all notifications sent through the system';

COMMENT ON COLUMN notification_templates.type IS 'Type of notification: reminder, announcement, welcome, etc.';
COMMENT ON COLUMN notification_templates.trigger IS 'When to send: manual, automatic, or scheduled';
COMMENT ON COLUMN notification_templates.interval_days IS 'For reminder type: how many days between reminders';
COMMENT ON COLUMN notification_templates.variables IS 'JSON array of variable names used in the template';

COMMENT ON COLUMN scheduled_reminders.claim_id IS 'Reference to the claim this reminder is for';
COMMENT ON COLUMN scheduled_reminders.scheduled_at IS 'When the reminder should be sent';
COMMENT ON COLUMN scheduled_reminders.sent_count IS 'Number of times this reminder has been sent';
COMMENT ON COLUMN scheduled_reminders.next_send_at IS 'When the next reminder should be sent (for recurring)';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Tables created:
-- ✅ notification_templates (with RLS policies)
-- ✅ scheduled_reminders (with RLS policies)
-- ✅ notification_logs (with RLS policies)
-- ✅ Sample templates inserted
-- ✅ Indexes created for performance
-- ✅ Triggers for auto-updating timestamps
-- =====================================================

