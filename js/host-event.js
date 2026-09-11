// Host / Submit Campus Event Form Handler

const HostEventManager = (() => {
  const PRESET_IMAGES = {
    tech: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    cultural: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    music: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    esports: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    workshops: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80'
  };

  const CATEGORY_META = {
    tech: { label: 'Tech & Hackathons', color: '#38bdf8' },
    cultural: { label: 'Cultural & Fests', color: '#ec4899' },
    music: { label: 'Music & Concerts', color: '#f43f5e' },
    esports: { label: 'Esports & Gaming', color: '#a855f7' },
    sports: { label: 'Sports & Athletics', color: '#f59e0b' },
    workshops: { label: 'Workshops & Seminars', color: '#10b981' }
  };

  function openModal() {
    const modal = document.getElementById('hostModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    const modal = document.getElementById('hostModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('hostTitle').value.trim();
    const club = document.getElementById('hostClub').value.trim();
    const category = document.getElementById('hostCategory').value;
    const date = document.getElementById('hostDate').value;
    const time = document.getElementById('hostTime').value.trim();
    const venue = document.getElementById('hostVenue').value.trim();
    const customImg = document.getElementById('hostImageUrl').value.trim();
    const description = document.getElementById('hostDesc').value.trim();
    const prizePool = document.getElementById('hostPrize').value.trim() || 'Exciting Prizes';
    const perksRaw = document.getElementById('hostPerks').value.trim();
    const orgName = document.getElementById('hostOrgName').value.trim() || 'Club Coordinator';
    const orgEmail = document.getElementById('hostOrgEmail').value.trim() || 'events@campus.edu';

    if (!title || !club || !date || !time || !venue || !description) {
      Toast.show('Please fill in all the required event details.', 'info');
      return;
    }

    const catMeta = CATEGORY_META[category] || { label: 'Campus Event', color: '#6366f1' };
    const bannerImage = customImg || PRESET_IMAGES[category] || PRESET_IMAGES.tech;

    // Process perks into list
    const perks = perksRaw
      ? perksRaw.split(',').map(p => p.trim()).filter(Boolean)
      : ['📜 Verified Certificate of Participation', '🍕 Refreshments provided'];

    const newEvent = {
      id: `evt-custom-${Date.now()}`,
      title,
      club,
      category,
      categoryLabel: catMeta.label,
      badgeColor: catMeta.color,
      date,
      time,
      venue,
      image: bannerImage,
      description,
      likes: 1,
      registeredCount: 0,
      maxCapacity: 250,
      price: 'Free',
      featured: false,
      prizePool,
      tags: [catMeta.label.split(' ')[0], 'Campus Event', 'New'],
      perks,
      schedule: [
        { time: `${time.split('-')[0] || '10:00 AM'}`, item: 'Reporting & Badge Collection' },
        { time: 'TBD', item: 'Event Commencement & Keynote' },
        { time: 'TBD', item: 'Valedictory & Certificate Distribution' }
      ],
      organizer: {
        name: orgName,
        role: 'Lead Organizer',
        email: orgEmail,
        phone: '+1 (555) Campus'
      }
    };

    // Add to application state
    AppState.addCustomEvent(newEvent);

    // Reset form and close modal
    document.getElementById('hostEventForm').reset();
    closeModal();

    Toast.show(`"${title}" published successfully! 🚀`, 'success');
  }

  function init() {
    const hostBtn = document.getElementById('btnHostEvent');
    if (hostBtn) {
      hostBtn.addEventListener('click', openModal);
    }

    const heroHostBtn = document.getElementById('btnHeroHostEvent');
    if (heroHostBtn) {
      heroHostBtn.addEventListener('click', openModal);
    }

    const closeBtn = document.getElementById('btnCloseHostModal');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    const form = document.getElementById('hostEventForm');
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }
  }

  return {
    init,
    openModal,
    closeModal
  };
})();
