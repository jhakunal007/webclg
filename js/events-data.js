// Initial curated dataset of authentic, rich college events
const INITIAL_EVENTS = [
  {
    id: "evt-1",
    title: "HackVerse 2026: 36-Hour National Hackathon",
    club: "DevSociety & IEEE Student Branch",
    category: "tech",
    categoryLabel: "Tech & Hackathons",
    badgeColor: "#38bdf8",
    date: "2026-09-25",
    time: "09:00 AM - 36 Hours",
    venue: "Turing Innovation Hub & Auditorium A",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    description: "The flagship annual hackathon bringing together 800+ student innovators from across 60+ universities. Build cutting-edge solutions across GenAI, Web3, FinTech, and Smart Healthcare with direct mentorship from industry leaders and venture capitalists.",
    likes: 384,
    registeredCount: 520,
    maxCapacity: 600,
    price: "Free",
    featured: true,
    prizePool: "$6,500",
    tags: ["Hackathon", "AI/ML", "Cash Prizes", "Swag Kits", "Free Meals"],
    perks: [
      "🏆 $6,500+ Prize Pool + Sponsor Track Bounties",
      "🍕 Midnight Pizza & Unlimited Energy Drinks",
      "👕 Exclusive HackVerse Varsity Hoodie & Goodie Bags",
      "📜 Official IEEE Recognized Participation Certificate",
      "💼 Fast-track Internship & Job Interviews with Top Sponsors"
    ],
    schedule: [
      { time: "Day 1 - 09:00 AM", item: "Check-in, ID Badge & Swag Distribution" },
      { time: "Day 1 - 11:00 AM", item: "Keynote & Problem Statements Unveiled" },
      { time: "Day 1 - 12:00 PM", item: "Hacking Begins (Timer Starts)" },
      { time: "Day 2 - 08:00 PM", item: "Initial Code Review & Mid-way Checkpoint" },
      { time: "Day 3 - 01:00 PM", item: "Top 10 Final Pitches & Grand Award Ceremony" }
    ],
    organizer: {
      name: "Aryan Sharma",
      role: "Lead Coordinator, DevSociety",
      email: "hackverse@campus.edu",
      phone: "+1 (555) 019-2834"
    }
  },
  {
    id: "evt-2",
    title: "AuraFest '26: Neon Symphony Musical Night",
    club: "Campus Cultural Council & Music Guild",
    category: "cultural",
    categoryLabel: "Cultural & Fests",
    badgeColor: "#ec4899",
    date: "2026-10-02",
    time: "06:30 PM - 11:30 PM",
    venue: "Main Amphitheatre & Central Lawn",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    description: "Prepare for the most electrifying cultural evening of the year! Featuring chart-topping indie artists, dazzling laser beam shows, food truck lanes, and an unforgettable live DJ set under the autumn stars.",
    likes: 612,
    registeredCount: 1450,
    maxCapacity: 1800,
    price: "Free Entry (College ID)",
    featured: true,
    prizePool: "Celebration",
    tags: ["Live Concert", "EDM", "Food Trucks", "Laser Show", "Celebrity Night"],
    perks: [
      "🎸 Headline performance by Indie Sensation The Velvet Skyline",
      "✨ Glow-in-the-dark neon wristbands & face paint stalls",
      "🍔 15+ Gourmet Food Trucks with student discounts",
      "📸 Photobooth stations with instant polaroid prints"
    ],
    schedule: [
      { time: "06:30 PM", item: "Gates Open & Neon Wristband Collection" },
      { time: "07:15 PM", item: "College Band Opening Showcase" },
      { time: "08:30 PM", item: "Headline Artist Performance" },
      { time: "10:15 PM", item: "High-Energy EDM & Laser Finale" }
    ],
    organizer: {
      name: "Meera Sen",
      role: "President, Cultural Affairs",
      email: "aurafest@campus.edu",
      phone: "+1 (555) 019-8821"
    }
  },
  {
    id: "evt-3",
    title: "Apex Arena: Inter-College Valorant & FIFA Championship",
    club: "Campus Esports & Gaming Syndicate",
    category: "esports",
    categoryLabel: "Esports & Gaming",
    badgeColor: "#a855f7",
    date: "2026-09-18",
    time: "10:00 AM - 08:00 PM",
    venue: "Student Activity Center (SAC) Arena",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    description: "Lock in your squad for the fiercest gaming tournament on campus! 32 teams compete in Valorant 5v5 custom lobbies on 240Hz monitors with live commentary on Twitch, plus a 64-player FIFA 26 knockout tournament.",
    likes: 279,
    registeredCount: 184,
    maxCapacity: 200,
    price: "Free",
    featured: false,
    prizePool: "$2,200",
    tags: ["Valorant", "FIFA", "LAN Tournament", "Trophies", "Twitch Stream"],
    perks: [
      "🎮 240Hz Gaming Rigs provided on-site",
      "🏆 Custom Acrylic Champion Trophies + Gaming Headsets",
      "🎙️ Live Casted Matches on Giant SAC Video Wall",
      "🍕 Free Red Bull & Snack Boxes for all competitors"
    ],
    schedule: [
      { time: "10:00 AM", item: "Bracket Draw & Hardware Check" },
      { time: "11:00 AM", item: "Round of 32 & Sweet 16 LAN Matches" },
      { time: "03:00 PM", item: "Quarter-Finals & FIFA 26 Semis" },
      { time: "06:00 PM", item: "Grand Finals Bo3 with Live Shoutcasting" }
    ],
    organizer: {
      name: "Rohan Patel",
      role: "Esports Coordinator",
      email: "esports@campus.edu",
      phone: "+1 (555) 019-4412"
    }
  },
  {
    id: "evt-4",
    title: "Battle of the Bands: SoundWave 2026",
    club: "Campus Music Guild",
    category: "music",
    categoryLabel: "Music & Concerts",
    badgeColor: "#f43f5e",
    date: "2026-10-09",
    time: "05:00 PM - 10:00 PM",
    venue: "Open Air Theatre (OAT)",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    description: "12 student bands battle across Rock, Metal, Acoustic, and Fusion genres for the ultimate campus title. High-powered sound system, guest celebrity judges, and an audience vote factor!",
    likes: 415,
    registeredCount: 310,
    maxCapacity: 800,
    price: "Free",
    featured: false,
    prizePool: "$1,800",
    tags: ["Live Music", "Rock & Metal", "Audience Voting", "Guitar Riffs"],
    perks: [
      "🎸 Studio Recording Time for Winning Band at SoundForge Studios",
      "🥇 $1,800 Cash Prize + Trophy",
      "🎤 Best Vocalist & Best Drummer Solo Awards"
    ],
    schedule: [
      { time: "05:00 PM", item: "Opening Acoustic Sets" },
      { time: "06:30 PM", item: "Round 1: Original Compositions" },
      { time: "08:15 PM", item: "Round 2: Classic Rock Covers Jam" },
      { time: "09:30 PM", item: "Audience Vote Counting & Awarding" }
    ],
    organizer: {
      name: "Tanya Kapoor",
      role: "Music Guild Head",
      email: "musicguild@campus.edu",
      phone: "+1 (555) 019-9011"
    }
  },
  {
    id: "evt-5",
    title: "GenAI & LLM Agent Building Workshop",
    club: "AI Research Collective & Google Developer Group",
    category: "workshops",
    categoryLabel: "Workshops & Seminars",
    badgeColor: "#10b981",
    date: "2026-09-19",
    time: "02:00 PM - 06:00 PM",
    venue: "Lab 304, Computer Science Block",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    description: "A deep-dive, hands-on workshop building production-ready autonomous AI agents. Learn function calling, vector embeddings with RAG, and multimodal reasoning using modern SDKs. Laptops required.",
    likes: 512,
    registeredCount: 110,
    maxCapacity: 120,
    price: "Free",
    featured: false,
    prizePool: "Certification",
    tags: ["AI/ML", "Hands-on", "Python", "Certificate", "API Credits"],
    perks: [
      "💻 $50 Cloud API Credits for every attendee",
      "📜 Verified Skill Badge & Digital Certificate",
      "☕ Coffee, Cookies & Networking with Senior ML Engineers",
      "📂 Reusable GitHub Template Repositories"
    ],
    schedule: [
      { time: "02:00 PM", item: "Architecture of Modern AI Agents" },
      { time: "03:15 PM", item: "Hands-on Lab: Vector Databases & RAG" },
      { time: "04:30 PM", item: "Live Deployment: Building a Multi-Agent Assistant" },
      { time: "05:30 PM", item: "Q&A, Project Showcase & Certificate Issue" }
    ],
    organizer: {
      name: "Vikram Malhotra",
      role: "GDG Campus Lead",
      email: "gdg@campus.edu",
      phone: "+1 (555) 019-7733"
    }
  },
  {
    id: "evt-6",
    title: "Night Slam: 3v3 Inter-Hostel Basketball Clash",
    club: "University Sports Board",
    category: "sports",
    categoryLabel: "Sports & Athletics",
    badgeColor: "#f59e0b",
    date: "2026-09-22",
    time: "07:00 PM - 11:00 PM",
    venue: "Floodlit Central Basketball Courts",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    description: "Under the high-beam floodlights, 16 hostel squads battle in fast-paced 10-minute half-court games with live beats by DJ Ray. Expect buzzer-beaters, 3-point shootouts, and intense campus rivalry.",
    likes: 198,
    registeredCount: 64,
    maxCapacity: 80,
    price: "Free",
    featured: false,
    prizePool: "$800",
    tags: ["Basketball", "3v3", "Night Games", "Hostel Rivalry", "Dunk Contest"],
    perks: [
      "🏀 Official Spalding Game Balls & Medals for Top 3",
      "🥤 Unlimited Electrolyte Drinks & Energy Bars",
      "🔥 Halftime 3-Point Shootout Contest with $100 Cash Prize"
    ],
    schedule: [
      { time: "07:00 PM", item: "Group Stage Knockouts (Court A & B)" },
      { time: "08:30 PM", item: "Halftime 3-Point Contest" },
      { time: "09:30 PM", item: "Semi-Finals & 3rd Place Playoff" },
      { time: "10:15 PM", item: "Championship Finals & Trophy Presentation" }
    ],
    organizer: {
      name: "Kabir Roy",
      role: "Sports Secretary",
      email: "sportsboard@campus.edu",
      phone: "+1 (555) 019-3351"
    }
  },
  {
    id: "evt-7",
    title: "RoboCombat 2026: 15kg & 30kg Bot Wars",
    club: "Robotics & Automation Society",
    category: "tech",
    categoryLabel: "Tech & Hackathons",
    badgeColor: "#38bdf8",
    date: "2026-10-05",
    time: "10:00 AM - 05:00 PM",
    venue: "Reinforced Combat Arena, Mechanical Quadrangle",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    description: "Sparks will fly! Custom-built fighting robots equipped with pneumatic flippers, vertical spinning blades, and titanium wedges clash in our bulletproof polycarbonate arena until only one bot remains standing.",
    likes: 334,
    registeredCount: 42,
    maxCapacity: 50,
    price: "Free",
    featured: false,
    prizePool: "$3,000",
    tags: ["RoboWars", "Hardware", "Sparks", "Cash Prizes", "Engineering"],
    perks: [
      "⚡ High-torque DC Motors & LiPo Battery Safety Station",
      "🏆 $3,000 Grand Prize Pool + Sponsored Hardware Kits",
      "🛡️ Official RAS Safety & Innovation Awards"
    ],
    schedule: [
      { time: "10:00 AM", item: "Weigh-in & Radio Failsafe Safety Checks" },
      { time: "11:30 AM", item: "15kg Featherweight Elimination Bracket" },
      { time: "02:00 PM", item: "30kg Heavyweight Destruction Heats" },
      { time: "04:15 PM", item: "The Grand Arena Finale" }
    ],
    organizer: {
      name: "Sneha Nair",
      role: "Head of Robotics",
      email: "robotics@campus.edu",
      phone: "+1 (555) 019-1290"
    }
  },
  {
    id: "evt-8",
    title: "CineSpotlight: Annual 48-Hour Short Film Festival",
    club: "Campus Film Society & Dramatics Club",
    category: "cultural",
    categoryLabel: "Cultural & Fests",
    badgeColor: "#ec4899",
    date: "2026-10-14",
    time: "06:00 PM - 09:30 PM",
    venue: "Main Auditorium Screening Hall",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    description: "Teams received a mystery prop and dialogue prompt 48 hours ago. Now experience their cinematic masterpieces on the giant silver screen followed by jury evaluations from national film directors.",
    likes: 247,
    registeredCount: 290,
    maxCapacity: 450,
    price: "Free",
    featured: false,
    prizePool: "$1,500",
    tags: ["Film Festival", "Cinema", "Popcorn", "Red Carpet", "Director Q&A"],
    perks: [
      "🍿 Complimentary Butter Popcorn & Soda for audience",
      "🏆 Golden Reel Trophy for Best Picture, Cinematography & Acting",
      "🎬 Winner's film submitted to National Student Film Festival"
    ],
    schedule: [
      { time: "06:00 PM", item: "Red Carpet Arrival & Photo Wall" },
      { time: "06:30 PM", item: "Screening of Top 8 Finalist Short Films" },
      { time: "08:30 PM", item: "Jury Discussion & Audience Choice Voting" },
      { time: "09:00 PM", item: "Golden Reel Awards Ceremony" }
    ],
    organizer: {
      name: "Arjun Verma",
      role: "Film Society Secretary",
      email: "films@campus.edu",
      phone: "+1 (555) 019-6644"
    }
  }
];
