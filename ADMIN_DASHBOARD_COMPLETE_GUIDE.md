# ADMIN DASHBOARD - COMPLETE IMPLEMENTATION GUIDE

## 🚨 CRITICAL: Complete Admin Dashboard Design, Structure, Functionality & Implementation

This guide provides the **EXACT** specifications for implementing the Admin Dashboard with all design elements, functionality, tables, modals, and complete implementation details.

---

## 1. OVERALL ARCHITECTURE & STRUCTURE

### **1.1 Dashboard Structure Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    HEADER SECTION                       │   │
│  │                                                         │   │
│  │  • Page Title (Dynamic)                                │   │
│  │  • Refresh Data Button                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  STATS CARDS (3)                        │   │
│  │                                                         │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐          │   │
│  │  │  Card 1   │  │  Card 2   │  │  Card 3   │          │   │
│  │  │  (Dynamic)│  │  (Dynamic)│  │  (Dynamic)│          │   │
│  │  └───────────┘  └───────────┘  └───────────┘          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   MAIN CONTENT                          │   │
│  │                                                         │   │
│  │  • Users Table                                          │   │
│  │  • Wishlists Table                                      │   │
│  │  • Payouts Management                                   │   │
│  │  • Transactions List                                    │   │
│  │  • Notifications Center                                 │   │
│  │  • Admin Settings                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              BOTTOM NAVIGATION BAR                      │   │
│  │                                                         │   │
│  │  [Users] [Wishlists] [Payouts] [Trans] [Notif] [Set]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **1.2 Route Structure**

```typescript
// EXACT route structure - NO MODIFICATIONS
const adminRoutes = [
  '/admin/dashboard',           // Default route redirects to /users
  '/admin/dashboard/users',     // Users management
  '/admin/dashboard/wishlists', // Wishlists management
  '/admin/dashboard/payouts',   // Payouts management
  '/admin/dashboard/transactions', // Transactions view
  '/admin/dashboard/notifications', // Notifications center
  '/admin/dashboard/settings'   // Admin settings
];
```

### **1.3 Tab Configuration**

```typescript
// EXACT tab configuration - NO MODIFICATIONS
const tabs = [
  { value: 'users', label: 'Users', icon: Users, path: '/admin/dashboard/users' },
  { value: 'wishlists', label: 'Wishlists', icon: Gift, path: '/admin/dashboard/wishlists' },
  { value: 'payouts', label: 'Payouts', icon: DollarSign, path: '/admin/dashboard/payouts' },
  { value: 'transactions', label: 'Transactions', icon: ArrowUpDown, path: '/admin/dashboard/transactions' },
  { value: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/dashboard/notifications' },
  { value: 'settings', label: 'Settings', icon: Settings, path: '/admin/dashboard/settings' }
];
```

---

## 2. STATS CARDS SPECIFICATIONS

### **2.1 StatCard Component**

```tsx
// EXACT StatCard component - NO MODIFICATIONS
const StatCard = ({ title, value, icon, loading, bgColor = 'bg-brand-cream', textColor = 'text-black' }) => (
  <div className={`border-2 border-black p-4 ${bgColor} relative after:absolute after:left-[-8px] after:bottom-[-8px] after:w-full after:h-full after:bg-black after:z-[-1]`}>
    <div className="relative">
      <div className="flex justify-between items-center">
        <p className={`text-sm font-semibold uppercase ${textColor}`}>{title}</p>
        <div className={textColor}>{icon}</div>
      </div>
      <div className="mt-2">
        {loading ? (
          <Loader2 className={`h-6 w-6 animate-spin ${textColor}`} />
        ) : (
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        )}
      </div>
    </div>
  </div>
);
```

### **2.2 Dynamic Card Data by Tab**

```typescript
// EXACT dynamic card configuration - NO MODIFICATIONS
const dynamicCardData = useMemo(() => {
  switch (activeTab) {
    case 'users':
      return {
        card1: { title: 'Total Users', value: stats.users, icon: <Users className="w-5 h-5" />, bgColor: 'bg-brand-cream', textColor: 'text-black' },
        card2: { title: 'Active Users', value: data.users.filter(u => u.is_active).length, icon: <CheckCircle className="w-5 h-5" />, bgColor: 'bg-brand-green', textColor: 'text-black' },
        card3: { title: 'Suspended', value: data.users.filter(u => !u.is_active).length, icon: <XCircle className="w-5 h-5" />, bgColor: 'bg-brand-accent-red', textColor: 'text-white' }
      };
    case 'wishlists':
      return {
        card1: { title: 'Total Wishlists', value: stats.wishlists, icon: <Gift className="w-5 h-5" />, bgColor: 'bg-brand-cream', textColor: 'text-black' },
        card2: { title: 'Active', value: data.wishlists.filter(w => w.status === 'active').length, icon: <CheckCircle className="w-5 h-5" />, bgColor: 'bg-brand-green', textColor: 'text-black' },
        card3: { title: 'Flagged', value: data.wishlists.filter(w => w.status === 'flagged').length, icon: <Flag className="w-5 h-5" />, bgColor: 'bg-brand-orange', textColor: 'text-black' }
      };
    case 'payouts':
      return {
        card1: { title: 'Pending Payouts', value: stats.pendingPayouts, icon: <DollarSign className="w-5 h-5" />, bgColor: 'bg-brand-orange', textColor: 'text-black' },
        card2: { title: 'Processing', value: data.payouts.filter(p => p.status === 'processing').length, icon: <Clock className="w-5 h-5" />, bgColor: 'bg-brand-purple-light', textColor: 'text-black' },
        card3: { title: 'Completed', value: data.payouts.filter(p => p.status === 'paid').length, icon: <CheckCircle className="w-5 h-5" />, bgColor: 'bg-brand-green', textColor: 'text-black' }
      };
    case 'transactions':
      return {
        card1: { title: 'Total Transactions', value: data.walletTransactions.length + data.contributions.length, icon: <ArrowUpDown className="w-5 h-5" />, bgColor: 'bg-brand-cream', textColor: 'text-black' },
        card2: { title: 'Contributions', value: data.contributions.length, icon: <ArrowUp className="w-5 h-5" />, bgColor: 'bg-brand-green', textColor: 'text-black' },
        card3: { title: 'Payouts', value: data.walletTransactions.filter(t => t.type === 'debit').length, icon: <ArrowDown className="w-5 h-5" />, bgColor: 'bg-brand-orange', textColor: 'text-black' }
      };
    default:
      return {
        card1: { title: 'Total Users', value: stats.users, icon: <Users className="w-5 h-5" />, bgColor: 'bg-brand-cream', textColor: 'text-black' },
        card2: { title: 'Total Wishlists', value: stats.wishlists, icon: <Gift className="w-5 h-5" />, bgColor: 'bg-brand-green', textColor: 'text-black' },
        card3: { title: 'Pending Payouts', value: stats.pendingPayouts, icon: <DollarSign className="w-5 h-5" />, bgColor: 'bg-brand-orange', textColor: 'text-black' }
      };
  }
}, [activeTab, stats, data]);
```

---

## 3. USERS MANAGEMENT TAB

### **3.1 Users Table Structure**

```tsx
// EXACT users table - NO MODIFICATIONS
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Full Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Wishlist Items</TableHead>
      <TableHead>Cash Goals</TableHead>
      <TableHead>Joined</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.users.map(u => (
      <TableRow key={u.id}>
        <TableCell>{u.full_name}</TableCell>
        <TableCell>{u.email}</TableCell>
        <TableCell>{u.role}</TableCell>
        <TableCell>
          <span className={`px-2 py-1 text-xs font-semibold ${u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {u.is_active ? 'Active' : 'Suspended'}
          </span>
        </TableCell>
        <TableCell className="text-center font-medium">{u.wishlist_items_count || 0}</TableCell>
        <TableCell className="text-center font-medium">{u.goals_count || 0}</TableCell>
        <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
        <TableCell className="flex gap-2 justify-end">
          {/* Action buttons */}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### **3.2 User Actions**

```tsx
// EXACT user action buttons - NO MODIFICATIONS
<Tooltip>
  <TooltipTrigger asChild>
    <Button 
      variant="flat" 
      size="icon" 
      className={`text-black border-2 border-black hover:shadow-[-2px_2px_0px_#161B47] ${
        u.is_active 
          ? 'bg-brand-green' 
          : u.suspended_by === 'admin'
            ? 'bg-brand-accent-red' 
            : 'bg-brand-orange'
      }`} 
      onClick={() => handleUserStatusUpdate(u.id, !u.is_active)}
    >
      <EyeOff className="w-4 h-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>{u.is_active ? 'Suspend User' : 'Activate User'}</p>
  </TooltipContent>
</Tooltip>

<AlertDialog>
  <Tooltip>
    <TooltipTrigger asChild>
      <AlertDialogTrigger asChild>
        <Button 
          variant="flat" 
          size="icon" 
          className="bg-brand-accent-red text-white border-2 border-black hover:shadow-[-2px_2px_0px_#161B47]" 
          disabled={u.id === user.id}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
    </TooltipTrigger>
    <TooltipContent><p>Delete User</p></TooltipContent>
  </Tooltip>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete User?</AlertDialogTitle>
      <AlertDialogDescription>This action is irreversible. Are you sure?</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={() => handleDeleteUser(u.id)}>Delete User</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### **3.3 User Status Update Handler**

```typescript
// EXACT user status update handler - NO MODIFICATIONS
const handleUserStatusUpdate = async (userId, isActive) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        is_active: isActive,
        suspended_by: isActive ? null : 'admin'
      })
      .eq('id', userId);

    if (error) throw error;

    toast({
      title: `User ${isActive ? 'activated' : 'suspended'} successfully`,
      description: `The user has been ${isActive ? 'activated' : 'suspended'}.`
    });

    fetchData();
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Error updating user status',
      description: error.message
    });
  }
};
```

### **3.4 User Delete Handler**

```typescript
// EXACT user delete handler - NO MODIFICATIONS
const handleDeleteUser = async (userId) => {
  try {
    // Call Supabase Edge Function to delete user
    const { data, error } = await supabase.functions.invoke('delete-user', {
      body: { userId }
    });

    if (error) throw error;

    toast({
      title: 'User deleted successfully',
      description: 'The user and all associated data have been removed.'
    });

    fetchData();
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Error deleting user',
      description: error.message
    });
  }
};
```

---

## 4. WISHLISTS MANAGEMENT TAB

### **4.1 Wishlists Table Structure**

```tsx
// EXACT wishlists table - NO MODIFICATIONS
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Title</TableHead>
      <TableHead>Owner</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Created</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.wishlists.map(w => (
      <TableRow key={w.id}>
        <TableCell>{w.title}</TableCell>
        <TableCell>{w.user.full_name}</TableCell>
        <TableCell>
          <span className={`px-2 py-1 text-xs font-semibold ${
            w.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {w.status}
          </span>
        </TableCell>
        <TableCell>{new Date(w.created_at).toLocaleDateString()}</TableCell>
        <TableCell className="flex gap-2 justify-end">
          {/* Action buttons */}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### **4.2 Wishlist Actions**

```tsx
// EXACT wishlist action buttons - NO MODIFICATIONS
<Tooltip>
  <TooltipTrigger asChild>
    <Button 
      variant="flat" 
      size="icon" 
      className="bg-white border-2 border-black hover:shadow-[-2px_2px_0px_#161B47]" 
      onClick={() => window.open(`/${w.user.username}/${w.slug}`, '_blank')}
    >
      <ExternalLink className="w-4 h-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent><p>View Wishlist</p></TooltipContent>
</Tooltip>

<Tooltip>
  <TooltipTrigger asChild>
    <Button 
      variant="flat" 
      size="icon" 
      className="bg-yellow-400 text-black border-2 border-black hover:shadow-[-2px_2px_0px_#161B47]" 
      onClick={() => handleWishlistStatusUpdate(w.id, w.status === 'active' ? 'suspended' : 'active')}
    >
      <EyeOff className="w-4 h-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent><p>{w.status === 'active' ? 'Suspend Wishlist' : 'Activate Wishlist'}</p></TooltipContent>
</Tooltip>

<Tooltip>
  <TooltipTrigger asChild>
    <Button 
      variant="flat" 
      size="icon" 
      className="bg-brand-orange text-black border-2 border-black hover:shadow-[-2px_2px_0px_#161B47]" 
      onClick={() => handleWishlistStatusUpdate(w.id, 'flagged')}
    >
      <Flag className="w-4 h-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent><p>Flag for Review</p></TooltipContent>
</Tooltip>
```

### **4.3 Wishlist Status Update Handler**

```typescript
// EXACT wishlist status update handler - NO MODIFICATIONS
const handleWishlistStatusUpdate = async (wishlistId, newStatus) => {
  try {
    const { error } = await supabase
      .from('wishlists')
      .update({ status: newStatus })
      .eq('id', wishlistId);

    if (error) throw error;

    toast({
      title: 'Wishlist updated successfully',
      description: `The wishlist status has been changed to ${newStatus}.`
    });

    fetchData();
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Error updating wishlist',
      description: error.message
    });
  }
};
```

---

## 5. PAYOUTS MANAGEMENT TAB

### **5.1 Payouts Filters & Search**

```tsx
// EXACT payouts filters - NO MODIFICATIONS
<div className="flex flex-wrap items-center gap-2 mb-2 p-4 bg-gray-50 border-2 border-gray-200">
  {/* Search Box */}
  <div className="flex items-center gap-2">
    <Input 
      placeholder="Search by user email or account..." 
      className="w-64 border-2 border-gray-300 bg-white"
      value={payoutSearchTerm}
      onChange={(e) => setPayoutSearchTerm(e.target.value)}
    />
  </div>

  {/* Bulk Actions Dropdown */}
  <div className="flex items-center gap-2">
    <Select value={bulkAction} onValueChange={setBulkAction}>
      <SelectTrigger className="w-40 border-2 border-gray-300 bg-white">
        <SelectValue placeholder="Bulk actions" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="approve">Approve</SelectItem>
        <SelectItem value="reject">Reject</SelectItem>
        <SelectItem value="complete">Mark Complete</SelectItem>
      </SelectContent>
    </Select>
    
    <Button
      variant="custom" 
      className="bg-blue-500 text-white border-2 border-blue-600 shadow-none hover:shadow-[-2px_2px_0px_#161B47] px-4"
      onClick={handleBulkAction}
      disabled={selectedPayouts.length === 0 || !bulkAction}
    >
      Apply
    </Button>
  </div>

  {/* Date Filter Dropdown */}
  <div className="flex items-center gap-2">
    <Select value={dateFilter} onValueChange={setDateFilter}>
      <SelectTrigger className="w-32 border-2 border-gray-300 bg-white">
        <SelectValue placeholder="All dates" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All dates</SelectItem>
        <SelectItem value="today">Today</SelectItem>
        <SelectItem value="week">This week</SelectItem>
        <SelectItem value="month">This month</SelectItem>
        <SelectItem value="year">This year</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Category Filter Dropdown */}
  <div className="flex items-center gap-2">
    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
      <SelectTrigger className="w-36 border-2 border-gray-300 bg-white">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        <SelectItem value="requested">Pending</SelectItem>
        <SelectItem value="processing">Processing</SelectItem>
        <SelectItem value="paid">Completed</SelectItem>
        <SelectItem value="failed">Failed</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Selection Counter */}
  {selectedPayouts.length > 0 && (
    <div className="ml-auto text-sm text-gray-600">
      {selectedPayouts.length} selected
    </div>
  )}
</div>
```

### **5.2 Payouts Table (Desktop)**

```tsx
// EXACT payouts table - NO MODIFICATIONS
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-12">
        <Checkbox 
          checked={selectedPayouts.length === filteredPayouts.length && filteredPayouts.length > 0}
          onCheckedChange={handleSelectAllPayouts}
        />
      </TableHead>
      <TableHead>User</TableHead>
      <TableHead>Amount</TableHead>
      <TableHead>Bank Details</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Requested</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredPayouts.map((payout) => (
      <TableRow key={payout.id}>
        <TableCell>
          <Checkbox 
            checked={selectedPayouts.includes(payout.id)}
            onCheckedChange={(checked) => handleSelectPayout(payout.id, checked)}
          />
        </TableCell>
        <TableCell className="whitespace-nowrap">
          <div>
            <div className="font-semibold">{payout.wallet?.user?.full_name || 'Unknown'}</div>
            <div className="text-sm text-gray-600">{payout.wallet?.user?.email || 'No email'}</div>
          </div>
        </TableCell>
        <TableCell className="whitespace-nowrap font-semibold text-brand-accent-red">
          -₦{Number(payout.amount).toLocaleString()}
        </TableCell>
        <TableCell className="max-w-[200px] truncate">
          <div className="text-sm">
            <div>{payout.destination_bank_code || 'N/A'}</div>
            <div className="text-gray-600">{payout.destination_account || 'N/A'}</div>
          </div>
        </TableCell>
        <TableCell className="whitespace-nowrap">
          <span className={`px-2 py-1 text-xs font-semibold ${
            payout.status === 'requested' ? 'bg-brand-orange text-black' :
            payout.status === 'processing' ? 'bg-brand-purple-light text-black' :
            payout.status === 'paid' ? 'bg-brand-green text-black' :
            'bg-brand-accent-red text-white'
          }`}>
            {payout.status?.toUpperCase() || 'UNKNOWN'}
          </span>
        </TableCell>
        <TableCell className="whitespace-nowrap text-xs text-gray-600">
          {new Date(payout.created_at).toLocaleString()}
        </TableCell>
        <TableCell className="whitespace-nowrap">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setSelectedPayoutForDetails(payout)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            {payout.status === 'requested' && (
              <>
                <Button 
                  size="sm" 
                  variant="custom" 
                  className="bg-brand-green text-black"
                  onClick={() => handlePayoutStatusUpdate(payout.id, 'processing')}
                >
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="custom" 
                  className="bg-brand-accent-red text-white"
                  onClick={() => handlePayoutStatusUpdate(payout.id, 'failed')}
                >
                  Reject
                </Button>
              </>
            )}
            {payout.status === 'processing' && (
              <>
                <Button 
                  size="sm" 
                  variant="custom" 
                  className="bg-brand-green text-black"
                  onClick={() => handlePayoutStatusUpdate(payout.id, 'paid')}
                >
                  Mark Paid
                </Button>
                <Button 
                  size="sm" 
                  variant="custom" 
                  className="bg-brand-accent-red text-white"
                  onClick={() => handlePayoutStatusUpdate(payout.id, 'failed')}
                >
                  Mark Failed
                </Button>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### **5.3 Payouts Mobile List View**

```tsx
// EXACT payouts mobile view - NO MODIFICATIONS
<div className="md:hidden">
  {filteredPayouts.map((payout) => (
    <div key={payout.id} className="py-6 px-0 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-1">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-orange flex items-center justify-center">
          <CreditCard className="w-7 h-7 text-black" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-black truncate">
                {payout.wallet?.user?.full_name || 'Unknown'}
              </div>
              <div className="text-xs text-gray-600 mt-1">Withdrawal</div>
            </div>
            <div className="text-right ml-2 whitespace-nowrap">
              <div className="text-sm font-semibold text-brand-accent-red">
                -₦{Number(payout.amount).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {payout.status?.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
```

### **5.4 Payout Status Update Handler**

```typescript
// EXACT payout status update handler - NO MODIFICATIONS
const handlePayoutStatusUpdate = async (payoutId, newStatus) => {
  try {
    // Use RPC function to update payout status with admin tracking
    const { error } = await supabase.rpc('update_payout_status', {
      p_payout_id: payoutId,
      p_new_status: newStatus,
      p_admin_id: user.id
    });

    if (error) throw error;

    // If approved (processing), send notifications
    if (newStatus === 'processing') {
      const payout = data.payouts.find(p => p.id === payoutId);
      if (payout) {
        await sendWithdrawalNotifications(
          payout.wallet?.user?.email,
          payout.wallet?.user?.full_name,
          payout.amount,
          'approved'
        );
      }
    }

    toast({
      title: 'Payout updated successfully',
      description: `The payout status has been changed to ${newStatus}.`
    });

    fetchData();
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Error updating payout',
      description: error.message
    });
  }
};
```

### **5.5 Bulk Action Handler**

```typescript
// EXACT bulk action handler - NO MODIFICATIONS
const handleBulkAction = async () => {
  if (selectedPayouts.length === 0 || !bulkAction) return;
  
  try {
    let newStatus = '';
    switch (bulkAction) {
      case 'approve':
        newStatus = 'processing';
        break;
      case 'reject':
        newStatus = 'failed';
        break;
      case 'complete':
        newStatus = 'paid';
        break;
      default:
        return;
    }
    
    const promises = selectedPayouts.map(payoutId => 
      supabase.rpc('update_payout_status', { 
        p_payout_id: payoutId, 
        p_new_status: newStatus, 
        p_admin_id: user.id 
      })
    );
    
    await Promise.all(promises);
    
    toast({ 
      title: 'Bulk action successful', 
      description: `${selectedPayouts.length} payouts ${bulkAction}d` 
    });
    
    setSelectedPayouts([]);
    setBulkAction('');
    fetchData();
  } catch (error) {
    toast({ 
      variant: 'destructive', 
      title: 'Bulk Action Error', 
      description: error.message 
    });
  }
};
```

### **5.6 Payout Details Modal**

```tsx
// EXACT payout details modal - NO MODIFICATIONS
{selectedPayoutForDetails && (
  <AlertDialog open={!!selectedPayoutForDetails} onOpenChange={() => setSelectedPayoutForDetails(null)}>
    <AlertDialogContent className="max-w-2xl">
      <AlertDialogHeader>
        <AlertDialogTitle>Payout Details</AlertDialogTitle>
        <AlertDialogDescription>
          Detailed information about this withdrawal request
        </AlertDialogDescription>
      </AlertDialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-sm font-semibold">User Information</Label>
            <div className="mt-1 space-y-1">
              <div className="text-sm">
                <strong>Name:</strong> {selectedPayoutForDetails.wallet?.user?.full_name || 'Unknown'}
              </div>
              <div className="text-sm">
                <strong>Email:</strong> {selectedPayoutForDetails.wallet?.user?.email || 'No email'}
              </div>
              <div className="text-sm">
                <strong>User ID:</strong> {selectedPayoutForDetails.wallet?.user_id || 'Unknown'}
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-semibold">Withdrawal Details</Label>
            <div className="mt-1 space-y-1">
              <div className="text-sm">
                <strong>Amount:</strong> ₦{Number(selectedPayoutForDetails.amount).toLocaleString()}
              </div>
              <div className="text-sm">
                <strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 text-xs font-semibold ${
                  selectedPayoutForDetails.status === 'requested' ? 'bg-brand-orange text-black' :
                  selectedPayoutForDetails.status === 'processing' ? 'bg-brand-purple-light text-black' :
                  selectedPayoutForDetails.status === 'paid' ? 'bg-brand-green text-black' :
                  'bg-brand-accent-red text-white'
                }`}>
                  {selectedPayoutForDetails.status?.toUpperCase() || 'UNKNOWN'}
                </span>
              </div>
              <div className="text-sm">
                <strong>Requested:</strong> {new Date(selectedPayoutForDetails.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-semibold">Bank Details</Label>
          <div className="mt-1 space-y-1">
            <div className="text-sm">
              <strong>Bank Code:</strong> {selectedPayoutForDetails.destination_bank_code || 'Not provided'}
            </div>
            <div className="text-sm">
              <strong>Account Number:</strong> {selectedPayoutForDetails.destination_account || 'Not provided'}
            </div>
          </div>
        </div>
      </div>
      
      <AlertDialogFooter>
        <AlertDialogCancel>Close</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)}
```

---

## 6. TRANSACTIONS TAB

### **6.1 Transaction Filters**

```tsx
// EXACT transaction filters - NO MODIFICATIONS
<div className="flex flex-col sm:flex-row justify-between items-center mb-2">
  <h3 className="text-2xl sm:text-3xl font-bold text-brand-purple-dark whitespace-nowrap">
    All Transactions
  </h3>
  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
    <Input 
      placeholder="Search by user, amount, or description..." 
      className="w-full sm:w-64"
      value={transactionSearchTerm}
      onChange={(e) => setTransactionSearchTerm(e.target.value)}
    />
    <div className="flex gap-2 w-full sm:w-auto">
      <Button
        variant={filterType === 'all' ? 'custom' : 'outline'}
        className={`${filterType === 'all' ? 'bg-brand-purple-dark text-white' : ''} border-2 border-black`}
        onClick={() => setFilterType('all')}
      >
        All
      </Button>
      <Button
        variant={filterType === 'contributions' ? 'custom' : 'outline'}
        className={`${filterType === 'contributions' ? 'bg-brand-green text-black' : ''} border-2 border-black`}
        onClick={() => setFilterType('contributions')}
      >
        Contributions
      </Button>
      <Button
        variant={filterType === 'payments' ? 'custom' : 'outline'}
        className={`${filterType === 'payments' ? 'bg-brand-purple-dark text-white' : ''} border-2 border-black`}
        onClick={() => setFilterType('payments')}
      >
        Payments
      </Button>
      <Button
        variant={filterType === 'payouts' ? 'custom' : 'outline'}
        className={`${filterType === 'payouts' ? 'bg-brand-orange text-black' : ''} border-2 border-black`}
        onClick={() => setFilterType('payouts')}
      >
        Payouts
      </Button>
    </div>
  </div>
</div>
```

### **6.2 Transactions Mobile List View**

```tsx
// EXACT transactions mobile view - NO MODIFICATIONS
<div className="md:hidden">
  {Object.entries(regrouped).map(([date, transactions]) => (
    <div key={date} className="mb-2">
      <div className="text-sm font-medium text-gray-600 mb-3">
        {new Date(date).toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}
      </div>
      {transactions.map((t) => (
        <div key={t.id} className="py-6 px-0 border-b border-gray-200 last:border-b-0">
          <div className="flex items-center gap-1">
            {getIconBadge(t)}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-black truncate">
                    {getTitleDisplay(t) || (t.description || '')}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {getCategoryLabel(t)}
                  </div>
                </div>
                <div className="text-right ml-2 whitespace-nowrap">
                  <div className="text-sm font-semibold">
                    {getAmountDisplay(t)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {getRelationLabel(t)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ))}
</div>
```

### **6.3 Transactions Desktop Table**

```tsx
// EXACT transactions desktop table - NO MODIFICATIONS
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Category</TableHead>
      <TableHead>{filterType === 'payments' ? 'Users' : 'Username'}</TableHead>
      <TableHead>Title</TableHead>
      <TableHead>Amount</TableHead>
      <TableHead>Date</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredTransactions.map((t) => (
      <TableRow key={t.id}>
        <TableCell className="whitespace-nowrap">{getDesktopBadge(t)}</TableCell>
        <TableCell className="whitespace-nowrap">
          {getUserInfo(t)}
        </TableCell>
        <TableCell className="max-w-[300px] truncate">
          {getTitleDisplay(t) || (t.description || '')}
        </TableCell>
        <TableCell className="whitespace-nowrap font-semibold">
          {getAmountDisplay(t)}
        </TableCell>
        <TableCell className="whitespace-nowrap text-xs text-gray-600">
          {new Date(t.created_at).toLocaleString()}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### **6.4 Transaction Helper Functions**

```typescript
// EXACT transaction helper functions - NO MODIFICATIONS
const getIconBadge = (transaction) => {
  if (transaction.type === 'contribution') {
    return (
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-green flex items-center justify-center">
        <ArrowUp className="w-7 h-7 text-black" />
      </div>
    );
  } else if (transaction.type === 'payment') {
    return (
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-purple-dark flex items-center justify-center">
        <CreditCard className="w-7 h-7 text-white" />
      </div>
    );
  } else {
    return (
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-orange flex items-center justify-center">
        <ArrowDown className="w-7 h-7 text-black" />
      </div>
    );
  }
};

const getAmountDisplay = (transaction) => {
  const amount = Number(transaction.amount);
  const formatted = `₦${amount.toLocaleString()}`;
  
  if (transaction.type === 'debit' || transaction.type === 'payment') {
    return <span className="text-brand-accent-red">-{formatted}</span>;
  } else {
    return <span className="text-brand-green">+{formatted}</span>;
  }
};

const getCategoryLabel = (transaction) => {
  if (transaction.type === 'contribution') return 'Contribution';
  if (transaction.type === 'payment') return 'Payment';
  if (transaction.type === 'debit') return 'Withdrawal';
  return transaction.type || 'Unknown';
};
```

---

## 7. ADMIN SETTINGS TAB

### **7.1 Settings Sections**

```tsx
// EXACT settings structure - NO MODIFICATIONS
const AdminSettings = ({ user }) => {
  const [expandedSections, setExpandedSections] = useState({
    profile: false,
    email: false,
    password: false,
    global: false,
    developer: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-4">
      {/* Profile Settings Section */}
      <div className="border-2 border-black bg-white">
        <button
          onClick={() => toggleSection('profile')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-brand-purple-dark" />
            <div className="text-left">
              <h3 className="font-semibold text-lg">Profile Settings</h3>
              <p className="text-sm text-gray-600">Update your admin profile information</p>
            </div>
          </div>
          {expandedSections.profile ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
        
        {expandedSections.profile && (
          <div className="p-4 border-t-2 border-black bg-gray-50">
            {/* Profile form fields */}
          </div>
        )}
      </div>

      {/* Email Settings Section */}
      <div className="border-2 border-black bg-white">
        {/* Similar structure */}
      </div>

      {/* Password Settings Section */}
      <div className="border-2 border-black bg-white">
        {/* Similar structure */}
      </div>

      {/* Global Settings Section */}
      <div className="border-2 border-black bg-white">
        {/* Similar structure */}
      </div>

      {/* Developer Mode Section */}
      <div className="border-2 border-black bg-white">
        {/* Similar structure */}
      </div>
    </div>
  );
};
```

### **7.2 Profile Settings Form**

```tsx
// EXACT profile settings form - NO MODIFICATIONS
{expandedSections.profile && (
  <div className="p-4 border-t-2 border-black bg-gray-50">
    <form onSubmit={handleProfileUpdate} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          value={profile.full_name}
          onChange={(e) => setProfile({...profile, full_name: e.target.value})}
          className="border-2 border-black"
        />
      </div>
      
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={profile.username}
          onChange={(e) => {
            setProfile({...profile, username: e.target.value});
            debouncedUsernameCheck(e.target.value);
          }}
          className="border-2 border-black"
        />
        {usernameStatus === 'checking' && (
          <p className="text-xs text-gray-500 mt-1">Checking availability...</p>
        )}
        {usernameStatus === 'available' && (
          <p className="text-xs text-green-600 mt-1">✓ Username available</p>
        )}
        {usernameStatus === 'taken' && (
          <p className="text-xs text-red-600 mt-1">✗ Username already taken</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={profile.phone}
          onChange={(e) => setProfile({...profile, phone: e.target.value})}
          className="border-2 border-black"
        />
      </div>
      
      <Button 
        type="submit" 
        variant="custom" 
        className="bg-brand-green text-black"
        disabled={loading}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Save Changes
      </Button>
    </form>
  </div>
)}
```

### **7.3 Password Change Form**

```tsx
// EXACT password change form - NO MODIFICATIONS
{expandedSections.password && (
  <div className="p-4 border-t-2 border-black bg-gray-50">
    <form onSubmit={handlePasswordChange} className="space-y-4">
      <div>
        <Label htmlFor="current_password">Current Password</Label>
        <Input
          id="current_password"
          type="password"
          value={passwordData.currentPassword}
          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
          className="border-2 border-black"
        />
      </div>
      
      <div>
        <Label htmlFor="new_password">New Password</Label>
        <div className="relative">
          <Input
            id="new_password"
            type={showNewPassword ? 'text' : 'password'}
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
            className="border-2 border-black pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="confirm_password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirm_password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
            className="border-2 border-black pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <Button 
        type="submit" 
        variant="custom" 
        className="bg-brand-orange text-black"
        disabled={passwordLoading}
      >
        {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Update Password
      </Button>
    </form>
  </div>
)}
```

### **7.4 Developer Mode Toggle**

```tsx
// EXACT developer mode section - NO MODIFICATIONS
{expandedSections.developer && (
  <div className="p-4 border-t-2 border-black bg-gray-50">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base">Developer Mode</Label>
          <p className="text-sm text-gray-600">
            Enable developer tools and advanced debugging features
          </p>
        </div>
        <Switch
          checked={developerMode}
          onCheckedChange={(checked) => {
            setDeveloperMode(checked);
            localStorage.setItem('devMode', checked.toString());
            toast({
              title: checked ? 'Developer mode enabled' : 'Developer mode disabled',
              description: checked 
                ? 'Advanced debugging features are now available.' 
                : 'Developer tools have been disabled.'
            });
          }}
        />
      </div>
      
      {developerMode && (
        <div className="mt-4 p-4 bg-brand-purple-light/20 border-2 border-brand-purple-dark rounded">
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="w-5 h-5 text-brand-purple-dark" />
            <h4 className="font-semibold">Developer Tools</h4>
          </div>
          <p className="text-sm text-gray-700">
            Console logging, API debugging, and advanced features are now enabled.
          </p>
        </div>
      )}
    </div>
  </div>
)}
```

---

## 8. DATA FETCHING & STATE MANAGEMENT

### **8.1 Data Fetching Function**

```typescript
// EXACT data fetching function - NO MODIFICATIONS
const fetchData = useCallback(async () => {
  setLoadingData(true);
  
  try {
    // Fetch users with counts
    const usersPromise = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    // Fetch wishlists
    const wishlistsPromise = supabase
      .from('wishlists')
      .select('*, user:users!inner(username, full_name)', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    // Fetch payouts
    const payoutsPromise = supabase
      .from('payouts')
      .select('*, wallet:wallets(user:users(full_name, email))')
      .order('created_at', { ascending: false });
    
    // Fetch pending payouts count
    const pendingPayoutsPromise = supabase
      .from('payouts')
      .select('id', { count: 'exact' })
      .eq('status', 'requested');
    
    // Fetch contributions
    const contributionsPromise = supabase
      .from('contributions')
      .select('*, goal:goals(wishlist:wishlists(title, user:users(username, full_name)))')
      .order('created_at', { ascending: false });
    
    // Fetch wallet transactions
    const walletTransactionsPromise = supabase
      .from('wallet_transactions')
      .select('*, wallet:wallets(user:users(full_name, username, email))')
      .order('created_at', { ascending: false });

    // Execute all promises
    const [
      usersRes,
      wishlistsRes,
      payoutsRes,
      pendingPayoutsRes,
      contributionsRes,
      walletTransactionsRes
    ] = await Promise.all([
      usersPromise,
      wishlistsPromise,
      payoutsPromise,
      pendingPayoutsPromise,
      contributionsPromise,
      walletTransactionsPromise
    ]);

    // Handle errors
    if (usersRes.error) throw usersRes.error;
    if (wishlistsRes.error) throw wishlistsRes.error;
    if (payoutsRes.error) throw payoutsRes.error;
    if (pendingPayoutsRes.error) throw pendingPayoutsRes.error;
    if (contributionsRes.error) throw contributionsRes.error;
    if (walletTransactionsRes.error) throw walletTransactionsRes.error;

    // Update stats
    setStats({
      users: usersRes.count,
      wishlists: wishlistsRes.count,
      pendingPayouts: pendingPayoutsRes.count
    });

    // Update data
    setData({
      users: usersRes.data || [],
      wishlists: wishlistsRes.data || [],
      payouts: payoutsRes.data || [],
      contributions: contributionsRes.data || [],
      walletTransactions: walletTransactionsRes.data || []
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    toast({
      variant: 'destructive',
      title: 'Error loading data',
      description: error.message
    });
  } finally {
    setLoadingData(false);
  }
}, []);
```

### **8.2 Initial Load Effect**

```typescript
// EXACT initial load effect - NO MODIFICATIONS
useEffect(() => {
  if (user && user.user_metadata?.role === 'admin') {
    fetchData();
  }
}, [user, fetchData]);
```

---

## 9. BOTTOM NAVIGATION BAR

### **9.1 Navigation Configuration**

```tsx
// EXACT bottom navigation - NO MODIFICATIONS
<BottomNavbar tabs={tabs} />

// In AdminDashboardLayout.jsx
const tabs = [
  { value: 'users', label: 'Users', icon: Users, path: '/admin/dashboard/users' },
  { value: 'wishlists', label: 'Wishlists', icon: Gift, path: '/admin/dashboard/wishlists' },
  { value: 'payouts', label: 'Payouts', icon: DollarSign, path: '/admin/dashboard/payouts' },
  { value: 'transactions', label: 'Transactions', icon: ArrowUpDown, path: '/admin/dashboard/transactions' },
  { value: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/dashboard/notifications' },
  { value: 'settings', label: 'Settings', icon: Settings, path: '/admin/dashboard/settings' }
];
```

---

## 10. AUTHENTICATION & AUTHORIZATION

### **10.1 Admin Check**

```typescript
// EXACT admin authentication check - NO MODIFICATIONS
if (authLoading || !user || user.user_metadata?.role !== 'admin') {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-16 w-16 animate-spin text-brand-purple-dark" />
    </div>
  );
}
```

### **10.2 Protected Route Setup**

```tsx
// EXACT protected route configuration - NO MODIFICATIONS
// In App.jsx or routing configuration
<Route 
  path="/admin/dashboard/*" 
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboardLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Navigate to="/admin/dashboard/users" replace />} />
  <Route path="users" element={<AdminDashboardPage />} />
  <Route path="wishlists" element={<AdminDashboardPage />} />
  <Route path="payouts" element={<AdminDashboardPage />} />
  <Route path="transactions" element={<AdminDashboardPage />} />
  <Route path="notifications" element={<AdminDashboardPage />} />
  <Route path="settings" element={<AdminDashboardPage />} />
</Route>
```

---

## 11. STYLING & DESIGN SPECIFICATIONS

### **11.1 Color Scheme**

```css
/* EXACT color specifications - NO MODIFICATIONS */
--brand-cream: #fef3c7;        /* Stats cards default */
--brand-green: #86E589;        /* Success/Active states */
--brand-orange: #FFA500;       /* Warning/Pending states */
--brand-purple-dark: #7c3bed;  /* Primary brand color */
--brand-purple-light: #c4b5fd; /* Secondary purple */
--brand-accent-red: #ef4444;   /* Danger/Failed states */
--black: #161B47;              /* Borders and text */
```

### **11.2 Shadow System**

```css
/* EXACT shadow specifications - NO MODIFICATIONS */
.shadow-brutalist {
  box-shadow: -2px 2px 0px #161B47;
}

.shadow-brutalist-hover:hover {
  box-shadow: -4px 4px 0px #161B47;
}

.shadow-brutalist-active:active {
  box-shadow: 0px 0px 0px #161B47;
}

/* Stats card shadow */
.after\:absolute::after {
  content: '';
  position: absolute;
  left: -8px;
  bottom: -8px;
  width: 100%;
  height: 100%;
  background-color: #161B47;
  z-index: -1;
}
```

### **11.3 Border Specifications**

```css
/* EXACT border specifications - NO MODIFICATIONS */
.border-2 {
  border-width: 2px;
  border-style: solid;
  border-color: #161B47;
}

/* NO BORDER RADIUS - All elements must have sharp corners */
* {
  border-radius: 0 !important;
}
```

---

## 12. RESPONSIVE DESIGN SPECIFICATIONS

### **12.1 Breakpoints**

```css
/* EXACT responsive breakpoints - NO MODIFICATIONS */
/* Mobile (default) */
.admin-container {
  @apply px-4 pt-[33px] pb-28;
}

.stats-grid {
  @apply grid-cols-1;
}

/* Small screens (sm: 640px+) */
@media (min-width: 640px) {
  .admin-container {
    @apply pb-36;
  }
}

/* Medium screens (md: 768px+) */
@media (min-width: 768px) {
  .stats-grid {
    @apply grid-cols-3;
  }
  
  .mobile-list {
    @apply hidden;
  }
  
  .desktop-table {
    @apply block;
  }
}

/* Large screens (lg: 1024px+) */
@media (min-width: 1024px) {
  .admin-container {
    @apply max-w-7xl mx-auto;
  }
}
```

---

## 13. ERROR HANDLING & LOADING STATES

### **13.1 Loading States**

```tsx
// EXACT loading states - NO MODIFICATIONS
{loadingData ? (
  <Loader2 className="mx-auto my-16 h-8 w-8 animate-spin" />
) : (
  // Content
)}

// Button loading state
<Button disabled={loading}>
  {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
  {loading ? 'Processing...' : 'Save Changes'}
</Button>
```

### **13.2 Error Display**

```tsx
// EXACT error handling - NO MODIFICATIONS
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  toast({
    variant: 'destructive',
    title: 'Operation Failed',
    description: error.message || 'An error occurred. Please try again.'
  });
}
```

### **13.3 Empty States**

```tsx
// EXACT empty state display - NO MODIFICATIONS
{filteredPayouts.length === 0 ? (
  <div className="text-center py-8">
    <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-4 text-lg font-semibold text-gray-600">No payouts found</h3>
    <p className="mt-2 text-sm text-gray-500">
      {payoutFilter === 'all' 
        ? "No withdrawal requests have been made yet." 
        : `No ${payoutFilter} payouts found.`
      }
    </p>
  </div>
) : (
  // Content
)}
```

---

## 🚨 CRITICAL IMPLEMENTATION REQUIREMENTS

### **ABSOLUTE REQUIREMENTS:**
1. **EXACT Layout Structure** - Follow the precise responsive layout shown
2. **EXACT Tab Configuration** - Use only the specified 6 tabs with exact icons and paths
3. **EXACT Color Scheme** - Use only the specified brand colors
4. **EXACT Shadow System** - Use the brutalist shadow system shown
5. **EXACT Table Structure** - Follow the precise table layouts for each tab
6. **EXACT Action Buttons** - Use the specified button colors and actions
7. **EXACT Data Fetching** - Use the specified Supabase queries
8. **ZERO BORDER RADIUS** - All elements must have sharp corners

### **FORBIDDEN MODIFICATIONS:**
- ❌ NO border radius anywhere
- ❌ NO color changes
- ❌ NO layout structure changes
- ❌ NO tab order changes
- ❌ NO icon substitutions
- ❌ NO shadow modifications
- ❌ NO table structure changes
- ❌ NO action button changes

### **MANDATORY IMPLEMENTATION:**
- ✅ Use EXACT tab configuration provided
- ✅ Use EXACT responsive layout provided
- ✅ Use EXACT color scheme provided
- ✅ Use EXACT shadow system provided
- ✅ Use EXACT table structures provided
- ✅ Use EXACT action handlers provided
- ✅ Use EXACT authentication checks provided
- ✅ Use EXACT data fetching logic provided

**IMPLEMENT EXACTLY AS SPECIFIED. NO DEVIATIONS. NO "IMPROVEMENTS". NO "MODERNIZATIONS".**

This guide provides **everything needed** to implement the Admin Dashboard with pixel-perfect accuracy, including all design elements, functionality, tables, filters, modals, actions, and complete implementation details! 🎉
