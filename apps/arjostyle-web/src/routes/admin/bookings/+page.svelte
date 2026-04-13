<script lang="ts">
  import { Search, X, Eye, Calendar, Mail, Phone, MapPin, Palette, Zap, Type, User, AlertCircle, CheckCircle, Clock } from 'lucide-svelte';
  import type { Booking } from '$lib/db/schema';

  let { data } = $props();

  let searchQuery = $state('');
  let statusFilter = $state('all');
  let selectedBooking = $state<Booking | null>(null);
  let showDetail = $state(false);
  let sortBy = $state<'createdAt' | 'status' | 'name'>('createdAt');
  let sortOrder = $state<'asc' | 'desc'>('desc');

  const statusColors: Record<string, string> = {
    Available: 'background: rgba(16,185,129,0.1); color: #34d399; border: 1px solid rgba(16,185,129,0.3);',
    Pending: 'background: rgba(234,179,8,0.1); color: #facc15; border: 1px solid rgba(234,179,8,0.3);',
    Confirmed: 'background: rgba(34,197,94,0.1); color: #4ade80; border: 1px solid rgba(34,197,94,0.3);',
    Completed: 'background: rgba(59,130,246,0.1); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3);',
    Rejected: 'background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.3);',
    'Needs Info': 'background: rgba(249,115,22,0.1); color: #fb923c; border: 1px solid rgba(249,115,22,0.3);',
    Conflict: 'background: rgba(113,113,122,0.1); color: #a1a1aa; border: 1px solid rgba(113,113,122,0.3);',
  };

  let filteredBookings = $derived.by(() => {
    let result = (data.bookings as Booking[]).filter((b) => {
      const matchesSearch =
        !searchQuery ||
        b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.placement?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      if (sortBy === 'createdAt') {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      } else {
        aVal = (a[sortBy] ?? '') as string;
        bVal = (b[sortBy] ?? '') as string;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  });

  function formatDate(d: string | Date | null | undefined): string {
    if (!d) return 'N/A';
    const date = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(date.getTime())) return 'Invalid';
    return new Intl.DateTimeFormat('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  function formatCurrency(n: number | null | undefined): string {
    if (n == null || isNaN(n)) return '—';
    return `₱${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
  }

  function truncateEmail(email: string | null | undefined): string {
    if (!email) return '—';
    if (email.length <= 30) return email;
    return email.substring(0, 27) + '...';
  }

  function openDetail(booking: Booking) {
    selectedBooking = booking;
    showDetail = true;
  }

  type BookingStatus = Booking['status'];

  async function updateStatus(bookingId: string, newStatus: BookingStatus) {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const idx = (data.bookings as Booking[]).findIndex((b) => b.id === bookingId);
        if (idx >= 0) {
          (data.bookings as Booking[])[idx] = { ...(data.bookings as Booking[])[idx], status: newStatus };
        }
        if (selectedBooking?.id === bookingId) {
          selectedBooking = { ...selectedBooking, status: newStatus };
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  }

  function toggleSort(column: 'createdAt' | 'status' | 'name') {
    if (sortBy === column) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortBy = column;
      sortOrder = 'desc';
    }
  }
</script>

<div class="min-h-screen bg-[var(--bg-dark)] p-4 sm:p-8">
  <!-- Header -->
  <div class="mb-6 sm:mb-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl sm:text-4xl font-bold text-[var(--text-primary)] mb-1 sm:mb-2">Bookings</h1>
        <p class="text-sm sm:text-base text-[var(--text-secondary)]">Manage tattoo booking requests</p>
      </div>
      <div class="bg-[var(--ink)]/20 border border-[var(--ink)]/30 rounded px-4 py-2 self-start sm:self-auto">
        <span class="text-[var(--ink)] font-semibold text-base sm:text-lg">{filteredBookings.length} bookings</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <!-- Search -->
      <div class="flex-1 relative">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name, email, or placement..."
          bind:value={searchQuery}
          class="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded pl-12 pr-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--tech)] transition-colors"
        />
      </div>

      <!-- Status Filter -->
      <div class="flex gap-2">
        <select
          bind:value={statusFilter}
          class="bg-[var(--bg-surface)] border border-[var(--border)] rounded px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--tech)] transition-colors cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
          <option value="Needs Info">Needs Info</option>
          <option value="Conflict">Conflict</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="bg-[var(--bg-surface)] border border-[var(--border)] rounded overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-[var(--border)] bg-[var(--bg-dark)]/50">
            <th class="px-6 py-4 text-left">
              <button
                onclick={() => toggleSort('status')}
                class="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-semibold"
              >
                Status
                {#if sortBy === 'status'}
                  <span class="text-[var(--tech)]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </button>
            </th>
            <th class="px-6 py-4 text-left">
              <button
                onclick={() => toggleSort('name')}
                class="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-semibold"
              >
                Client
                {#if sortBy === 'name'}
                  <span class="text-[var(--tech)]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </button>
            </th>
            <th class="px-6 py-4 text-left font-semibold text-[var(--text-secondary)]">Tattoo Details</th>
            <th class="px-6 py-4 text-left font-semibold text-[var(--text-secondary)]">Price</th>
            <th class="px-6 py-4 text-left">
              <button
                onclick={() => toggleSort('createdAt')}
                class="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-semibold"
              >
                Date Requested
                {#if sortBy === 'createdAt'}
                  <span class="text-[var(--tech)]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                {/if}
              </button>
            </th>
            <th class="px-6 py-4 text-left font-semibold text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--border)]">
          {#each filteredBookings as booking (booking.id)}
            <tr class="hover:bg-[var(--bg-dark)]/50 transition-colors">
              <td class="px-6 py-4">
                <span
                  class="inline-block px-3 py-1 rounded border text-xs font-medium" style={statusColors[booking.status] || statusColors['Pending']}
                >
                  {booking.status}
                </span>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="text-[var(--text-primary)] font-medium">{booking.name || '—'}</p>
                  <p class="text-sm text-[var(--text-secondary)]">{truncateEmail(booking.email)}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm">
                  <p class="text-[var(--text-primary)]">
                    {booking.placement || '—'} ({booking.tattooSize || '?'} cm²)
                  </p>
                  <p class="text-[var(--text-secondary)]">{booking.primaryTattooStyle || 'Style TBD'}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-[var(--text-primary)] font-semibold">
                  {formatCurrency(booking.pricingDetails?.total ?? 0)}
                </p>
              </td>
              <td class="px-6 py-4">
                <p class="text-[var(--text-primary)] text-sm">{formatDate(booking.createdAt)}</p>
              </td>
              <td class="px-6 py-4">
                <button
                  onclick={() => openDetail(booking)}
                  class="inline-flex items-center gap-2 px-3 py-2 bg-[var(--tech)]/10 hover:bg-[var(--tech)]/20 border border-[var(--tech)]/30 hover:border-[var(--tech)]/50 text-[var(--tech)] rounded transition-all text-sm font-medium"
                >
                  <Eye class="w-4 h-4" />
                  View
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if filteredBookings.length === 0}
      <div class="px-6 py-12 text-center">
        <AlertCircle class="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
        <p class="text-[var(--text-secondary)]">No bookings found</p>
      </div>
    {/if}
  </div>

  <!-- Detail Slide-Over Panel -->
  {#if showDetail && selectedBooking}
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="fixed inset-0 bg-black/40 z-40" onclick={() => (showDetail = false)} role="presentation"></div>
    <div class="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-[var(--bg-surface)] border-l border-[var(--border)] shadow-2xl z-50 flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--bg-dark)]/50">
        <h2 class="text-xl font-bold text-[var(--text-primary)]">Booking Details</h2>
        <button
          onclick={() => (showDetail = false)}
          class="p-2 hover:bg-[var(--bg-elevated)] rounded transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Client Info -->
        <div class="p-6 border-b border-zinc-700">
          <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
            <User class="w-5 h-5 text-tech-500" />
            Client Information
          </h3>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Name</p>
                <p class="text-white mt-1">{selectedBooking.name || '—'}</p>
              </div>
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Date of Birth</p>
                <p class="text-white mt-1">{selectedBooking.dob || '—'}</p>
              </div>
            </div>
            <div>
              <p class="text-xs text-zinc-500 uppercase font-semibold">Email</p>
              <p class="text-white mt-1 break-all">{selectedBooking.email || '—'}</p>
            </div>
            <div>
              <p class="text-xs text-zinc-500 uppercase font-semibold">Phone</p>
              <p class="text-white mt-1">{selectedBooking.phone || '—'}</p>
            </div>
            <div>
              <p class="text-xs text-zinc-500 uppercase font-semibold">Preferred Contact</p>
              <p class="text-white mt-1 capitalize">{selectedBooking.preferredContact || '—'}</p>
            </div>
            {#if selectedBooking.instagramHandle}
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Instagram</p>
                <p class="text-tech-500 mt-1">@{selectedBooking.instagramHandle}</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Tattoo Details -->
        <div class="p-6 border-b border-zinc-700">
          <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin class="w-5 h-5 text-ink-500" />
            Tattoo Details
          </h3>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Placement</p>
                <p class="text-white mt-1">{selectedBooking.placement || '—'}</p>
              </div>
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Size (cm²)</p>
                <p class="text-white mt-1">{selectedBooking.tattooSize || '—'}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Category</p>
                <p class="text-white mt-1 capitalize">{selectedBooking.category || '—'}</p>
              </div>
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Style</p>
                <p class="text-white mt-1">{selectedBooking.primaryTattooStyle || '—'}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Color</p>
                <p class="text-white mt-1">{selectedBooking.isColor ? 'Yes' : 'Black & Gray'}</p>
              </div>
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Cover-up</p>
                <p class="text-white mt-1">{selectedBooking.isCoverUp ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Complexity</p>
                <p class="text-white mt-1">{selectedBooking.complexity || '—'}/5</p>
              </div>
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Visual Complexity</p>
                <p class="text-white mt-1">{selectedBooking.visualComplexityScore || '—'}/10</p>
              </div>
            </div>
            <div>
              <p class="text-xs text-zinc-500 uppercase font-semibold">Description</p>
              <p class="text-white mt-1 text-sm">{selectedBooking.styleDescription || '—'}</p>
            </div>
          </div>
        </div>

        <!-- Pricing Breakdown -->
        <div class="p-6 border-b border-zinc-700">
          <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
            <Zap class="w-5 h-5 text-ink-500" />
            Pricing Breakdown
          </h3>
          <div class="space-y-2 bg-surface-900/50 rounded-lg p-4">
            <div class="flex justify-between text-sm">
              <span class="text-zinc-400">Base Price</span>
              <span class="text-white">{formatCurrency(selectedBooking.pricingDetails?.basePriceRaw)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-zinc-400">Complexity Addon</span>
              <span class="text-white">+{formatCurrency(selectedBooking.pricingDetails?.complexityPrice ?? 0)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-zinc-400">Placement Addon</span>
              <span class="text-white">+{formatCurrency(selectedBooking.pricingDetails?.placementPrice ?? 0)}</span>
            </div>
            {#if selectedBooking.isColor}
              <div class="flex justify-between text-sm">
                <span class="text-zinc-400">Color Upcharge</span>
                <span class="text-white">+{formatCurrency(selectedBooking.pricingDetails?.colorPrice ?? 0)}</span>
              </div>
            {/if}
            {#if selectedBooking.isCoverUp}
              <div class="flex justify-between text-sm">
                <span class="text-zinc-400">Cover-up Surcharge</span>
                <span class="text-white">+{formatCurrency(selectedBooking.pricingDetails?.coverUpPrice ?? 0)}</span>
              </div>
            {/if}
            <div class="border-t border-zinc-600 pt-2 mt-2 flex justify-between font-semibold">
              <span class="text-white">Total Quote</span>
              <span class="text-ink-500">{formatCurrency(selectedBooking.pricingDetails?.total)}</span>
            </div>
            <div class="border-t border-zinc-600 pt-2 mt-2 flex justify-between font-semibold">
              <span class="text-white">Deposit (50%)</span>
              <span class="text-tech-500">{formatCurrency(selectedBooking.pricingDetails?.total ? selectedBooking.pricingDetails.total / 2 : undefined)}</span>
            </div>
          </div>
        </div>

        <!-- Duration & Sessions -->
        <div class="p-6 border-b border-zinc-700">
          <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
            <Clock class="w-5 h-5 text-tech-500" />
            Duration & Sessions
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-zinc-500 uppercase font-semibold">Estimated Duration</p>
              <p class="text-white mt-1">{selectedBooking.estimatedDuration || '—'} minutes</p>
            </div>
            <div>
              <p class="text-xs text-zinc-500 uppercase font-semibold">Estimated Sessions</p>
              <p class="text-white mt-1">{selectedBooking.estimatedSessions || '—'}</p>
            </div>
          </div>
        </div>

        <!-- Creative Freedom & Notes -->
        <div class="p-6 border-b border-zinc-700">
          <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
            <Type class="w-5 h-5 text-ink-500" />
            Creative Details & Notes
          </h3>
          <div class="space-y-3">
            <div>
              <p class="text-xs text-zinc-500 uppercase font-semibold">Creative Freedom</p>
              <p class="text-white mt-1">{selectedBooking.creativeFreedom}%</p>
            </div>
            {#if selectedBooking.specificReqs}
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Specific Requirements</p>
                <p class="text-white mt-1 text-sm">{selectedBooking.specificReqs}</p>
              </div>
            {/if}
            {#if selectedBooking.mustHaves}
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Must-Have Elements</p>
                <p class="text-white mt-1 text-sm">{selectedBooking.mustHaves}</p>
              </div>
            {/if}
            {#if selectedBooking.colorPrefs}
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Color Preferences</p>
                <p class="text-white mt-1 text-sm">{selectedBooking.colorPrefs}</p>
              </div>
            {/if}
            {#if selectedBooking.placementNotes}
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Placement Notes</p>
                <p class="text-white mt-1 text-sm">{selectedBooking.placementNotes}</p>
              </div>
            {/if}
            {#if selectedBooking.painReason}
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Pain Reason</p>
                <p class="text-white mt-1 text-sm">{selectedBooking.painReason}</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Reference Images -->
        {#if selectedBooking.referenceImageUrls && selectedBooking.referenceImageUrls.length > 0}
          <div class="p-6 border-b border-zinc-700">
            <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
              <Palette class="w-5 h-5 text-tech-500" />
              Reference Images ({selectedBooking.referenceImageUrls.length})
            </h3>
            <div class="grid grid-cols-3 gap-3">
              {#each selectedBooking.referenceImageUrls as ref}
                <a href={ref.url} target="_blank" rel="noopener noreferrer">
                  <div class="bg-surface-900 rounded-lg overflow-hidden border border-zinc-700 hover:border-tech-500 transition-colors">
                    <img src={ref.url} alt={ref.originalFilename || 'Reference'} class="w-full h-24 object-cover" />
                  </div>
                </a>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Appointment Info -->
        {#if selectedBooking.requestedDate}
          <div class="p-6 border-b border-zinc-700">
            <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar class="w-5 h-5 text-ink-500" />
              Requested Appointment
            </h3>
            <div class="space-y-2">
              <div>
                <p class="text-xs text-zinc-500 uppercase font-semibold">Requested Date</p>
                <p class="text-white mt-1">{selectedBooking.requestedDate}</p>
              </div>
              {#if selectedBooking.requestedTime}
                <div>
                  <p class="text-xs text-zinc-500 uppercase font-semibold">Time</p>
                  <p class="text-white mt-1">{selectedBooking.requestedTime}</p>
                </div>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Status & Timestamps -->
        <div class="p-6 border-b border-zinc-700">
          <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle class="w-5 h-5 text-zinc-400" />
            Status & Timeline
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-zinc-400">Current Status</span>
              <span class="inline-block px-2 py-0.5 rounded-full border text-xs {statusColors[selectedBooking.status] || statusColors.Pending}">
                {selectedBooking.status}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-zinc-400">Created</span>
              <span class="text-white">{formatDate(selectedBooking.createdAt)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-zinc-400">Last Updated</span>
              <span class="text-white">{formatDate(selectedBooking.updatedAt)}</span>
            </div>
            {#if selectedBooking.urgencyLevel}
              <div class="flex justify-between">
                <span class="text-zinc-400">Urgency</span>
                <span class="text-white capitalize">{selectedBooking.urgencyLevel}</span>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="p-6 border-t border-zinc-700 bg-surface-900/50 flex flex-col gap-3">
        {#if selectedBooking.status !== 'Confirmed'}
          <button
            onclick={() => selectedBooking && updateStatus(selectedBooking.id, 'Confirmed')}
            class="w-full px-4 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 text-green-400 rounded-lg transition-all font-medium flex items-center justify-center gap-2"
          >
            <CheckCircle class="w-4 h-4" />
            Confirm Booking
          </button>
        {/if}
        {#if selectedBooking.status !== 'Completed'}
          <button
            onclick={() => selectedBooking && updateStatus(selectedBooking.id, 'Completed')}
            class="w-full px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 rounded-lg transition-all font-medium flex items-center justify-center gap-2"
          >
            <CheckCircle class="w-4 h-4" />
            Mark Completed
          </button>
        {/if}
        {#if selectedBooking.status !== 'Rejected'}
          <button
            onclick={() => selectedBooking && updateStatus(selectedBooking.id, 'Rejected')}
            class="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 rounded-lg transition-all font-medium flex items-center justify-center gap-2"
          >
            <X class="w-4 h-4" />
            Reject Booking
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>
