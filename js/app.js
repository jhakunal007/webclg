// ==========================================================================
// CampusPulse - Main Application Logic, State, and Event Interactions
// ==========================================================================

// Toast Notification Engine
const Toast = (() => {
  let container;

  function init() {
    container = document.getElementById('toastContainer');
  }

  function show(message, type = 'info') {
    if (!container) init();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'heart') icon = '❤️';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }

  return { show, init };
})();

// Application State Management
const AppState = (() => {
  const LIKES_STORAGE_KEY = 'campus_pulse_likes';
  const EVENTS_STORAGE_KEY = 'campus_pulse_custom_events';

  let allEvents = [];
  let likedEventIds = new Set();
  let currentCategory = 'all';
  let currentFilter = 'all';
  let searchQuery = '';
  let currentSort = 'upcoming';

  function loadLikedEvents() {
    try {
      const saved = localStorage.getItem(LIKES_STORAGE_KEY);
      if (saved) {
        likedEventIds = new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading liked events', e);
    }
    updateLikedBadge();
  }

  function saveLikedEvents() {
    try {
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(Array.from(likedEventIds)));
      updateLikedBadge();
    } catch (e) {
      console.error('Error saving liked events', e);
    }
  }

  function updateLikedBadge() {
    const badge = document.getElementById('likedCountBadge');
    if (badge) {
      badge.textContent = likedEventIds.size;
      badge.style.display = likedEventIds.size > 0 ? 'inline-flex' : 'none';
    }
  }

  function loadEvents() {
    let customEvents = [];
    try {
      const savedCustom = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (savedCustom) {
        customEvents = JSON.parse(savedCustom);
      }
    } catch (e) {
      console.error('Error loading custom events', e);
    }

    allEvents = [...customEvents, ...INITIAL_EVENTS];
  }

  function saveEventsToStorage() {
    const customOnly = allEvents.filter(e => e.id.startsWith('evt-custom-'));
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(customOnly));
    } catch (e) {
      console.error('Error saving events', e);
    }
  }

  function addCustomEvent(newEvent) {
    allEvents.unshift(newEvent);
    saveEventsToStorage();
    renderEventsGrid();
    updateStatsCounter();
  }

  function isLiked(eventId) {
    return likedEventIds.has(eventId);
  }

  function toggleLike(eventId, mouseX, mouseY) {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;

    const liked = likedEventIds.has(eventId);

    if (liked) {
      likedEventIds.delete(eventId);
      event.likes = Math.max(0, (event.likes || 1) - 1);
      Toast.show(`Removed "${event.title.substring(0, 24)}..." from saved`, 'info');
    } else {
      likedEventIds.add(eventId);
      event.likes = (event.likes || 0) + 1;
      spawnFloatingHeart(mouseX, mouseY);
      Toast.show(`Liked "${event.title.substring(0, 24)}..."! Saved to your list ❤️`, 'heart');
    }

    saveLikedEvents();
    renderEventsGrid();
  }

  // Floating Heart Particle
  function spawnFloatingHeart(x, y) {
    if (!x || !y) return;
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '❤️';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 900);
  }

  // Filter and Sort Engine
  function getFilteredEvents() {
    return allEvents.filter(event => {
      // 1. Category Filter
      if (currentCategory !== 'all' && event.category !== currentCategory) {
        return false;
      }

      // 2. Chip Filter
      if (currentFilter === 'liked' && !likedEventIds.has(event.id)) {
        return false;
      }
      if (currentFilter === 'free' && !event.price.toLowerCase().includes('free')) {
        return false;
      }
      if (currentFilter === 'flagship' && !event.featured) {
        return false;
      }
      if (currentFilter === 'weekend') {
        const d = new Date(event.date);
        const day = d.getDay(); // 0 is Sunday, 6 is Saturday
        if (day !== 0 && day !== 6 && day !== 5) {
          // Keep weekend & Friday
          return false;
        }
      }

      // 3. Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesClub = event.club.toLowerCase().includes(q);
        const matchesVenue = event.venue.toLowerCase().includes(q);
        const matchesTags = event.tags && event.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesClub && !matchesVenue && !matchesTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (currentSort === 'likes') {
        return (b.likes || 0) - (a.likes || 0);
      }
      if (currentSort === 'registered') {
        return (b.registeredCount || 0) - (a.registeredCount || 0);
      }
      // default: upcoming date
      return new Date(a.date) - new Date(b.date);
    });
  }

  function getAllEvents() {
    return allEvents;
  }

  function setCategory(cat) {
    currentCategory = cat;
    renderEventsGrid();
  }

  function setFilter(filter) {
    currentFilter = filter;
    renderEventsGrid();
  }

  function setSearch(query) {
    searchQuery = query.trim();
    renderEventsGrid();
  }

  function setSort(sort) {
    currentSort = sort;
    renderEventsGrid();
  }

  return {
    loadEvents,
    loadLikedEvents,
    getAllEvents,
    getFilteredEvents,
    isLiked,
    toggleLike,
    setCategory,
    setFilter,
    setSearch,
    setSort,
    addCustomEvent,
    saveEventsToStorage
  };
})();

// Render Events Grid & Cards
function renderEventsGrid() {
  const container = document.getElementById('eventsGrid');
  const countLabel = document.getElementById('eventsResultCount');
  if (!container) return;

  const events = AppState.getFilteredEvents();

  if (countLabel) {
    countLabel.textContent = `Showing ${events.length} event${events.length === 1 ? '' : 's'}`;
  }

  if (events.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">No matching events found</h3>
        <p class="empty-desc">Try loosening your search terms or selecting another category filter.</p>
        <button class="btn btn-secondary" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = events
    .map(event => {
      const liked = AppState.isLiked(event.id);
      const isSpotsLow = (event.maxCapacity - (event.registeredCount || 0)) <= 30;

      return `
      <article class="event-card" data-id="${event.id}">
        <div class="card-header-media">
          <img src="${event.image}" alt="${event.title}" class="card-image" loading="lazy" />
          <span class="card-category-badge" style="background-color: ${event.badgeColor || '#6366f1'}">
            ${event.categoryLabel || event.category}
          </span>
          ${event.featured ? `<span class="card-featured-badge">Flagship Fest</span>` : ''}
          <button 
            class="card-like-btn ${liked ? 'liked' : ''}" 
            onclick="handleCardLike(event, '${event.id}')"
            title="${liked ? 'Unlike event' : 'Like & Save event'}"
            aria-label="${liked ? 'Unlike event' : 'Like event'}">
            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
        </div>

        <div class="card-body">
          <div class="card-club">${event.club}</div>
          <h3 class="card-title" onclick="openEventDetails('${event.id}')">${event.title}</h3>
          
          <div class="card-meta-list">
            <div class="card-meta-item">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
              <span>${formatEventDate(event.date)} • ${event.time}</span>
            </div>
            <div class="card-meta-item">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
              <span>${event.venue}</span>
            </div>
          </div>

          <div class="card-tags">
            ${(event.tags || []).slice(0, 3).map(tag => `<span class="card-tag-pill">#${tag}</span>`).join('')}
          </div>

          <div class="card-footer">
            <div class="card-likes-count" title="${event.likes || 0} students liked this">
              <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <span><strong>${event.likes || 0}</strong> likes</span>
            </div>
            
            <div class="card-actions">
              <button class="btn btn-ghost" style="padding: 6px 10px; font-size: 0.82rem;" onclick="openEventDetails('${event.id}')">
                Details
              </button>
              <button class="btn btn-primary btn-card-rsvp" onclick="triggerEventRsvp('${event.id}')">
                Get Pass
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
    })
    .join('');
}

// Like Button Handler with coordinates
function handleCardLike(e, eventId) {
  e.stopPropagation();
  const rect = e.currentTarget.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top;
  AppState.toggleLike(eventId, x, y);
}

// Format Event Date Helper
function formatEventDate(dateStr) {
  try {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
  } catch (e) {
    return dateStr;
  }
}

// Reset Filters
function resetFilters() {
  const searchInput = document.getElementById('eventSearchInput');
  if (searchInput) searchInput.value = '';

  document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
  const allCatPill = document.querySelector('.category-pill[data-category="all"]');
  if (allCatPill) allCatPill.classList.add('active');

  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  const allChip = document.querySelector('.filter-chip[data-filter="all"]');
  if (allChip) allChip.classList.add('active');

  AppState.setCategory('all');
  AppState.setFilter('all');
  AppState.setSearch('');
}

// Event Details Modal
function openEventDetails(eventId) {
  const allEvents = AppState.getAllEvents();
  const event = allEvents.find(e => e.id === eventId);
  if (!event) return;

  const modal = document.getElementById('detailsModal');
  const content = document.getElementById('detailsContent');
  if (!modal || !content) return;

  const liked = AppState.isLiked(event.id);

  content.innerHTML = `
    <div class="modal-hero-cover">
      <img src="${event.image}" alt="${event.title}" class="modal-hero-img" />
      <div class="modal-hero-gradient"></div>
    </div>
    
    <div class="modal-inner">
      <div class="modal-badge-row">
        <span class="card-category-badge" style="position: static; background-color: ${event.badgeColor || '#6366f1'}">
          ${event.categoryLabel || event.category}
        </span>
        <span class="spotlight-tag" style="background: rgba(56, 189, 248, 0.15); border-color: rgba(56, 189, 248, 0.4); color: #38bdf8;">
          ${event.club}
        </span>
        ${event.prizePool ? `<span class="spotlight-tag" style="background: rgba(245, 158, 11, 0.15); border-color: rgba(245, 158, 11, 0.4); color: #f59e0b;">Pool: ${event.prizePool}</span>` : ''}
      </div>

      <h2 class="modal-title">${event.title}</h2>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.7;">
        ${event.description}
      </p>

      <div class="modal-meta-grid">
        <div>
          <div class="meta-block-label">Date & Time</div>
          <div class="meta-block-val">${formatEventDate(event.date)} • ${event.time}</div>
        </div>
        <div>
          <div class="meta-block-label">Campus Location</div>
          <div class="meta-block-val">${event.venue}</div>
        </div>
        <div>
          <div class="meta-block-label">Entry / Fee</div>
          <div class="meta-block-val" style="color: #10b981;">${event.price || 'Free'}</div>
        </div>
        <div>
          <div class="meta-block-label">Registrations</div>
          <div class="meta-block-val">${event.registeredCount || 0} / ${event.maxCapacity || 300} Confirmed</div>
        </div>
      </div>

      <h4 class="modal-section-title">🎁 Event Perks & Highlights</h4>
      <ul class="perks-list">
        ${(event.perks || ['Free Certificate', 'Refreshments provided']).map(p => `<li>${p}</li>`).join('')}
      </ul>

      ${
        event.schedule && event.schedule.length > 0
          ? `
          <h4 class="modal-section-title">⏱️ Schedule & Roadmap</h4>
          <div class="timeline">
            ${event.schedule
              .map(
                s => `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-time">${s.time}</div>
                <div class="timeline-desc">${s.item}</div>
              </div>
            `
              )
              .join('')}
          </div>
        `
          : ''
      }

      ${
        event.organizer
          ? `
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-subtle); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.75rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: gap;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Lead Coordinator</div>
            <div style="font-weight: 700;">${event.organizer.name} (${event.organizer.role})</div>
            <div style="font-size: 0.82rem; color: var(--accent-cyan);">${event.organizer.email}</div>
          </div>
          <button class="btn btn-ghost" style="padding: 6px 12px; font-size: 0.8rem;" onclick="copyShareLink('${event.id}')">
            🔗 Share Event
          </button>
        </div>
      `
          : ''
      }

      <div style="display: flex; gap: 1rem; justify-content: flex-end; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
        <button class="btn btn-secondary" onclick="closeDetailsModal()">
          Close
        </button>
        <button class="btn btn-secondary ${liked ? 'liked' : ''}" onclick="handleCardLike(event, '${event.id}')">
          ${liked ? '❤️ Liked' : '🤍 Like Event'} (${event.likes || 0})
        </button>
        <button class="btn btn-primary" onclick="closeDetailsModal(); triggerEventRsvp('${event.id}')">
          Get Instant Digital Pass 🎫
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDetailsModal() {
  const modal = document.getElementById('detailsModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function triggerEventRsvp(eventId) {
  const allEvents = AppState.getAllEvents();
  const event = allEvents.find(e => e.id === eventId);
  if (event) {
    TicketManager.openRsvpModal(event);
  }
}

// Copy Share Link
function copyShareLink(eventId) {
  const url = `${window.location.origin}${window.location.pathname}#event-${eventId}`;
  navigator.clipboard.writeText(url).then(() => {
    Toast.show('Event link copied to clipboard! 📋', 'success');
  }).catch(() => {
    Toast.show('Link copied!', 'info');
  });
}

// Countdown Timer for Flagship Fest (HackVerse 2026)
function startCountdownTimer() {
  const targetDate = new Date('2026-09-25T09:00:00').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minsEl = document.getElementById('countMins');
    const secsEl = document.getElementById('countSecs');

    if (!daysEl) return;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// Stats Counter
function updateStatsCounter() {
  const allEvents = AppState.getAllEvents();
  const totalEventsEl = document.getElementById('statTotalEvents');
  const totalRegEl = document.getElementById('statTotalReg');

  if (totalEventsEl) {
    totalEventsEl.textContent = `${allEvents.length}+`;
  }
  if (totalRegEl) {
    const totalReg = allEvents.reduce((acc, e) => acc + (e.registeredCount || 0), 0);
    totalRegEl.textContent = `${totalReg.toLocaleString()}+`;
  }
}

// Global Event Listeners & Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Toast
  Toast.init();

  // Load Saved State & Events
  AppState.loadLikedEvents();
  AppState.loadEvents();

  // Initialize Modules
  TicketManager.init();
  HostEventManager.init();

  // Render Grid & Counters
  renderEventsGrid();
  updateStatsCounter();
  startCountdownTimer();

  // Category Pills Listeners
  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      AppState.setCategory(pill.dataset.category);
    });
  });

  // Filter Chips Listeners
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.setFilter(chip.dataset.filter);
    });
  });

  // Search Input Listener
  const searchInput = document.getElementById('eventSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      AppState.setSearch(e.target.value);
    });
  }

  // Sort Select Listener
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', e => {
      AppState.setSort(e.target.value);
    });
  }

  // Modal Closers
  const closeDetailsBtn = document.getElementById('btnCloseDetailsModal');
  if (closeDetailsBtn) {
    closeDetailsBtn.addEventListener('click', closeDetailsModal);
  }

  const closeRsvpBtn = document.getElementById('btnCloseRsvpModal');
  if (closeRsvpBtn) {
    closeRsvpBtn.addEventListener('click', TicketManager.closeRsvpModal);
  }

  const closePassBtn = document.getElementById('btnClosePassModal');
  if (closePassBtn) {
    closePassBtn.addEventListener('click', TicketManager.closePassModal);
  }

  // Close modals on overlay backdrop click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Keyboard Escape key closes any open modal or drawer
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeDetailsModal();
      TicketManager.closeRsvpModal();
      TicketManager.closePassModal();
      HostEventManager.closeModal();
      TicketManager.closeDrawer();
    }
  });

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
