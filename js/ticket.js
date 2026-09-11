// Ticket Management, RSVP Registration, and Holographic Pass Generator

const TicketManager = (() => {
  const STORAGE_KEY = 'campus_pulse_tickets';

  // Load saved tickets from localStorage
  function getSavedTickets() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading tickets', e);
      return [];
    }
  }

  // Save tickets to localStorage
  function saveTickets(tickets) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
      updateTicketBadge();
    } catch (e) {
      console.error('Error saving tickets', e);
    }
  }

  // Update navbar ticket count badge
  function updateTicketBadge() {
    const badge = document.getElementById('myTicketsBadge');
    if (badge) {
      const count = getSavedTickets().length;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }

  // Generate a random ticket serial ID
  function generateTicketId() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
    return `CP-${new Date().getFullYear()}-${randomChar}${randomNum}`;
  }

  // Generate dynamic barcode decorative bars
  function generateBarcodeHtml() {
    const widths = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2];
    return widths
      .map(w => `<div class="barcode-line" style="width: ${w}px;"></div>`)
      .join('');
  }

  // Build the complete Holographic Ticket HTML
  function renderTicketHtml(ticket) {
    const qrSvg = QRCode.generateQRCodeSVG(
      `CAMPUSPULSE|${ticket.ticketId}|${ticket.attendeeName}|${ticket.eventTitle}`,
      130,
      '#0f172a',
      '#ffffff'
    );

    return `
      <div class="ticket-card" id="holographicTicket">
        <div class="ticket-main">
          <div>
            <div class="ticket-header-row">
              <div class="ticket-institution">
                <svg viewBox="0 0 24 24"><path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/></svg>
                <span class="ticket-inst-name">University Student Pass</span>
              </div>
              <span class="ticket-type-tag">Confirmed Entry</span>
            </div>
            <h2 class="ticket-event-title">${ticket.eventTitle}</h2>
            <div class="ticket-event-club">${ticket.eventClub}</div>
          </div>

          <div class="ticket-details-grid">
            <div class="ticket-detail-item">
              <span class="ticket-label">Attendee Name</span>
              <span class="ticket-value">${ticket.attendeeName}</span>
            </div>
            <div class="ticket-detail-item">
              <span class="ticket-label">Student ID / Roll No</span>
              <span class="ticket-value">${ticket.studentId}</span>
            </div>
            <div class="ticket-detail-item">
              <span class="ticket-label">Date & Time</span>
              <span class="ticket-value">${ticket.eventDate} • ${ticket.eventTime}</span>
            </div>
            <div class="ticket-detail-item">
              <span class="ticket-label">Venue & Gate</span>
              <span class="ticket-value">${ticket.eventVenue}</span>
            </div>
          </div>

          <div class="ticket-id-strip">
            <span>Pass ID: <strong>${ticket.ticketId}</strong></span>
            <span>Dept: ${ticket.department} (${ticket.year})</span>
          </div>
        </div>

        <div class="ticket-divider"></div>

        <div class="ticket-stub">
          <div>
            <div class="ticket-qr-box">
              ${qrSvg}
            </div>
            <div class="ticket-scan-text">Scan at Campus Gate</div>
          </div>

          <div>
            <div class="ticket-barcode">
              ${generateBarcodeHtml()}
            </div>
            <div class="ticket-pass-serial">${ticket.ticketId}</div>
          </div>
        </div>
      </div>
    `;
  }

  // Open RSVP Modal for a specific event
  function openRsvpModal(event) {
    const modal = document.getElementById('rsvpModal');
    const titleEl = document.getElementById('rsvpEventTitle');
    const venueEl = document.getElementById('rsvpEventVenue');
    const eventIdInput = document.getElementById('rsvpEventId');

    if (titleEl) titleEl.textContent = event.title;
    if (venueEl) venueEl.textContent = `${event.date} • ${event.venue}`;
    if (eventIdInput) eventIdInput.value = event.id;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Handle RSVP form submission
  function handleRsvpSubmit(e) {
    e.preventDefault();

    const eventId = document.getElementById('rsvpEventId').value;
    const allEvents = AppState.getAllEvents();
    const event = allEvents.find(ev => ev.id === eventId);

    if (!event) return;

    const name = document.getElementById('rsvpName').value.trim();
    const studentId = document.getElementById('rsvpRoll').value.trim();
    const email = document.getElementById('rsvpEmail').value.trim();
    const department = document.getElementById('rsvpDept').value;
    const year = document.getElementById('rsvpYear').value;

    if (!name || !studentId || !email) {
      Toast.show('Please fill in all required fields.', 'info');
      return;
    }

    const ticket = {
      ticketId: generateTicketId(),
      eventId: event.id,
      eventTitle: event.title,
      eventClub: event.club,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      attendeeName: name,
      studentId: studentId,
      email: email,
      department: department,
      year: year,
      createdAt: new Date().toISOString()
    };

    // Save ticket
    const currentTickets = getSavedTickets();
    currentTickets.unshift(ticket);
    saveTickets(currentTickets);

    // Increase registration count for the event
    event.registeredCount = (event.registeredCount || 0) + 1;
    AppState.saveEventsToStorage();

    // Close RSVP modal and open Ticket Pass modal
    closeRsvpModal();
    openPassModal(ticket);

    Toast.show(`Registration Confirmed! Digital Pass Generated 🎉`, 'success');
  }

  // Open Holographic Pass Modal
  function openPassModal(ticket) {
    const modal = document.getElementById('passModal');
    const container = document.getElementById('passTicketContainer');

    if (container) {
      container.innerHTML = renderTicketHtml(ticket);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeRsvpModal() {
    const modal = document.getElementById('rsvpModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function closePassModal() {
    const modal = document.getElementById('passModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Render Saved Tickets Drawer
  function renderTicketsDrawer() {
    const container = document.getElementById('drawerTicketsList');
    const emptyNotice = document.getElementById('drawerEmptyTickets');
    const tickets = getSavedTickets();

    if (!container) return;

    if (tickets.length === 0) {
      container.innerHTML = '';
      if (emptyNotice) emptyNotice.style.display = 'block';
      return;
    }

    if (emptyNotice) emptyNotice.style.display = 'none';

    container.innerHTML = tickets
      .map(
        t => `
      <div class="drawer-ticket-card" data-ticket-id="${t.ticketId}">
        <div class="drawer-ticket-qr">
          ${QRCode.generateQRCodeSVG(t.ticketId, 62, '#0f172a', '#ffffff')}
        </div>
        <div class="drawer-ticket-info">
          <div class="drawer-ticket-title">${t.eventTitle}</div>
          <div class="drawer-ticket-attendee">${t.attendeeName} • ${t.studentId}</div>
          <div class="drawer-ticket-date">${t.eventDate} • ${t.eventVenue}</div>
          <div style="margin-top: 8px; display: flex; gap: 8px;">
            <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="TicketManager.viewPassById('${t.ticketId}')">
              View Pass
            </button>
          </div>
        </div>
        <button class="drawer-ticket-delete" onclick="TicketManager.deleteTicket('${t.ticketId}')" title="Remove Ticket">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
    `
      )
      .join('');
  }

  function viewPassById(ticketId) {
    const tickets = getSavedTickets();
    const ticket = tickets.find(t => t.ticketId === ticketId);
    if (ticket) {
      closeDrawer();
      openPassModal(ticket);
    }
  }

  function deleteTicket(ticketId) {
    if (confirm('Are you sure you want to remove this pass?')) {
      let tickets = getSavedTickets();
      tickets = tickets.filter(t => t.ticketId !== ticketId);
      saveTickets(tickets);
      renderTicketsDrawer();
      Toast.show('Pass removed from your tickets.', 'info');
    }
  }

  function openDrawer() {
    renderTicketsDrawer();
    const drawer = document.getElementById('ticketsDrawer');
    const overlay = document.getElementById('drawerBackdrop');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    const drawer = document.getElementById('ticketsDrawer');
    const overlay = document.getElementById('drawerBackdrop');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function printPass() {
    window.print();
  }

  // Init bindings
  function init() {
    updateTicketBadge();

    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
      rsvpForm.addEventListener('submit', handleRsvpSubmit);
    }

    const printBtn = document.getElementById('btnPrintPass');
    if (printBtn) {
      printBtn.addEventListener('click', printPass);
    }

    const myTicketsNavBtn = document.getElementById('btnMyTickets');
    if (myTicketsNavBtn) {
      myTicketsNavBtn.addEventListener('click', openDrawer);
    }

    const closeDrawerBtn = document.getElementById('btnCloseDrawer');
    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener('click', closeDrawer);
    }

    const drawerBackdrop = document.getElementById('drawerBackdrop');
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', closeDrawer);
    }
  }

  return {
    init,
    openRsvpModal,
    closeRsvpModal,
    openPassModal,
    closePassModal,
    openDrawer,
    closeDrawer,
    viewPassById,
    deleteTicket,
    printPass,
    getSavedTickets
  };
})();
