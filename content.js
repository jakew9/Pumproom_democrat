// ============================================================================
// PUMPROOM.DEMOCRAT — Front Page Content Data
// ============================================================================

window.SITE_CONTENT = {
  brand: {
    name: "The Pump Room",
    domain: "pumproom.democrat",
    statusLabel: "STUDIO ONLINE · BUILDING NEW THINGS",
    tagline: "Things I’m building, testing, and sharing.",
    description:
      "Welcome to pumproom.democrat — a home base for family, friends, and curious visitors to check out the apps, media projects, and weekend experiments coming off the workbench.",
  },

  // Initial spotlight build shown at scroll progress 0
  featured: {
    badge: "NOW ON THE BENCH",
    subtitle: "Active Build · v1.0",
    title: "Home Media & App Lab",
    summary:
      "Building custom living-room media experiences, retro channel apps, and small tools that make everyday tech more fun for the whole family.",
    metrics: [
      { label: "Status", value: "In Active Dev" },
      { label: "Focus", value: "Apps & Media" },
      { label: "Access", value: "Web & Living Room" },
    ],
    projectId: "living-room-tv",
  },

  // Scroll-scrubbed states inside the sticky NOW ON THE BENCH stage (p: 0 -> 1)
  benchStages: [
    {
      index: "01",
      badge: "NOW ON THE BENCH",
      subtitle: "Active Build · v1.0",
      title: "Home Media & App Lab",
      summary:
        "Building custom living-room media experiences, retro channel apps, and small tools that make everyday tech more fun for the whole family.",
      metrics: [
        { label: "Status", value: "In Active Dev" },
        { label: "Focus", value: "Apps & Media" },
        { label: "Access", value: "Web & Living Room" },
      ],
      projectId: "living-room-tv",
    },
    {
      index: "02",
      badge: "NOW ON THE BENCH · 02",
      subtitle: "Studio Desk · Media Reel",
      title: "Studio Clips & Media Reel",
      summary:
        "A curated corner for video edits, audio recordings, slideshows, and behind-the-scenes clips without hunting through group chats.",
      metrics: [
        { label: "Status", value: "Coming Soon" },
        { label: "Focus", value: "Video & Audio" },
        { label: "Access", value: "Family & Friends" },
      ],
      projectId: "audio-visual-sessions",
    },
    {
      index: "03",
      badge: "NOW ON THE BENCH · 03",
      subtitle: "Shipped · pumproom.democrat",
      title: "Weekend Workshop Prototypes",
      summary:
        "Quick scripts, small utilities, and creative experiments spun up to test new ideas and share finished builds straight from the bench.",
      metrics: [
        { label: "Status", value: "Ongoing" },
        { label: "Focus", value: "Tools & Web" },
        { label: "Access", value: "Live Below" },
      ],
      projectId: "weekend-prototypes",
    },
  ],

  // Workbench cards shown below the sticky stage
  projects: [
    {
      id: "living-room-tv",
      title: "Custom TV & Media Experience",
      categoryLabel: "Apps & Code",
      status: "In Progress",
      statusTone: "amber",
      date: "Nov 2026",
      visualStyle: "broadcast",
      image: "",
      summary:
        "A dedicated media player app designed for effortless couch browsing, curated playlists, and classic TV vibes.",
      details:
        "Built to turn a regular screen into a cozy, zero-clutter broadcast channel. Supports custom playlists, clean remote navigation, and smooth playback without noisy algorithms getting in the way.",
      tags: ["TV App", "Media", "UI Design"],
      links: [{ label: "Read Notes" }],
    },
    {
      id: "pumproom-site",
      title: "pumproom.democrat Home Base",
      categoryLabel: "Family & Home",
      status: "Live",
      statusTone: "green",
      date: "Nov 2026",
      visualStyle: "grid",
      image: "",
      summary:
        "This website — a fast, dark-mode studio hub where family and friends can browse everything I'm making.",
      details:
        "Designed for zero friction: pure static files served fast worldwide, with a single content file so new projects, photos, and updates can be published in seconds.",
      tags: ["Web", "Studio UI", "Showcase"],
      links: [{ label: "Read Notes" }],
    },
    {
      id: "audio-visual-sessions",
      title: "Studio Clips & Media Reel",
      categoryLabel: "Media & Studio",
      status: "Coming Soon",
      statusTone: "cyan",
      date: "Upcoming",
      visualStyle: "waveform",
      image: "",
      summary:
        "A curated corner for video edits, audio recordings, slideshows, and behind-the-scenes clips from recent projects.",
      details:
        "A dedicated place to share videos, recordings, or family highlight reels without having to hunt through group chats or expiring links.",
      tags: ["Video", "Audio", "Showcase"],
      links: [{ label: "Preview Concept" }],
    },
    {
      id: "weekend-prototypes",
      title: "Weekend Workshop Prototypes",
      categoryLabel: "Experiments",
      status: "Ongoing",
      statusTone: "amber",
      date: "2026",
      visualStyle: "terminal",
      image: "",
      summary:
        "Quick scripts, small utilities, and creative experiments spun up to test new ideas and learn new tools.",
      details:
        "Not every project needs to be huge. This shelf collects bite-sized web toys, automation helpers, and visual tests worth sharing with anyone curious about what's next.",
      tags: ["Prototypes", "Tools", "Creative Coding"],
      links: [{ label: "Read Notes" }],
    },
  ],

  // Workbench updates ("From the Bench")
  updates: [
    {
      date: "Nov 25, 2026",
      tag: "LAUNCH",
      title: "pumproom.democrat goes live",
      body: "Set up the new dark-mode studio home page as a central place to share builds, media, and updates with family and friends.",
    },
    {
      date: "Nov 24, 2026",
      tag: "BUILD LOG",
      title: "Iterating on custom media & TV app builds",
      body: "Refining playback reliability, controls, and interface polish on current living-room software experiments.",
    },
    {
      date: "Coming Next",
      tag: "UP NEXT",
      title: "Adding real screenshots, demos, and family gallery links",
      body: "Next up: dropping screenshots into the showcase cards and adding direct links to live demos and shared media.",
    },
  ],
};
