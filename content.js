// ============================================================================
// PUMPROOM.DEMOCRAT — Site Content & Showcase Data
// ============================================================================
// Edit this file to update text, add new projects, swap in real screenshots,
// or post fresh updates for family and friends. No HTML edits required!

window.SITE_CONTENT = {
  brand: {
    name: "The Pump Room",
    domain: "pumproom.democrat",
    statusLabel: "STUDIO ONLINE • BUILDING NEW THINGS",
    tagline: "Things I’m building, testing, and sharing.",
    description:
      "Welcome to pumproom.democrat — a home base for family, friends, and curious visitors to check out the apps, media projects, and weekend experiments coming off the workbench.",
    aboutHeading: "What happens in the Pump Room?",
    aboutCopy:
      "This site is my digital workshop and broadcast desk. Whenever I'm tinkering with a new app, putting together media projects, or building tools for home and family, this is where I drop demos, progress notes, and finished builds so everyone can see what's cooking.",
    locationTag: "Static Edge Site",
  },

  // Highlighted build shown in the initial hero "NOW ON THE BENCH" studio monitor
  featured: {
    badge: "NOW ON THE BENCH",
    title: "Home Media & App Lab",
    subtitle: "Active Build • v1.0",
    summary:
      "Building custom living-room media experiences, retro channel apps, and small tools that make everyday tech more fun for the whole family.",
    metrics: [
      { label: "Status", value: "In Active Dev" },
      { label: "Focus", value: "Apps & Media" },
      { label: "Access", value: "Web & Living Room" },
    ],
    projectId: "living-room-tv",
  },

  // Scroll-scrubbed chapters inside the sticky NOW ON THE BENCH stage (p: 0 -> 1)
  benchStages: [
    {
      index: "01",
      shortLabel: "Active Build",
      badge: "NOW ON THE BENCH",
      subtitle: "Active Build • v1.0",
      title: "Home Media & App Lab",
      summary:
        "Building custom living-room media experiences, retro channel apps, and small tools that make everyday tech more fun for the whole family.",
      caption: "Phase 01 — Designing calm, clutter-free living-room apps.",
      visualMode: "eq",
      metrics: [
        { label: "Status", value: "In Active Dev" },
        { label: "Focus", value: "Apps & Media" },
        { label: "Access", value: "Web & Living Room" },
      ],
      projectId: "living-room-tv",
    },
    {
      index: "02",
      shortLabel: "Media & Studio",
      badge: "BENCH STAGE 02 • SIGNAL",
      subtitle: "Studio Desk • Media Reel",
      title: "Curated Clips, Audio & Broadcast Feeds",
      summary:
        "Packaging video edits, retro streams, and family highlight reels into one fast, dark-mode broadcast desk without noisy feeds.",
      caption: "Phase 02 — Turning raw recordings into shareable studio sessions.",
      visualMode: "signal",
      metrics: [
        { label: "Format", value: "Video & Audio" },
        { label: "Playback", value: "Zero Clutter" },
        { label: "Sharing", value: "Family & Friends" },
      ],
      projectId: "audio-visual-sessions",
    },
    {
      index: "03",
      shortLabel: "Edge Shipping",
      badge: "BENCH STAGE 03 • LIVE",
      subtitle: "Shipped • pumproom.democrat",
      title: "Fast Prototypes Off the Workbench",
      summary:
        "Every experiment, utility, and finished build lands right here on pumproom.democrat — scroll down to browse every build and dispatch.",
      caption: "Phase 03 — Continuously shipping updates straight from the bench.",
      visualMode: "grid",
      metrics: [
        { label: "Delivery", value: "Global Edge" },
        { label: "Builds", value: "4 Active Tracks" },
        { label: "Next", value: "Explore Below" },
      ],
      projectId: "pumproom-site",
    },
  ],

  // Categories shown in the filter bar
  categories: [
    { id: "all", label: "All Builds" },
    { id: "apps", label: "Apps & Code" },
    { id: "media", label: "Media & Studio" },
    { id: "family", label: "Family & Home" },
    { id: "experiments", label: "Experiments" },
  ],

  // Showcase projects — add, edit, or remove objects here.
  // Tip: Add `image: "./images/my-shot.jpg"` to display a real screenshot/photo!
  projects: [
    {
      id: "living-room-tv",
      title: "Custom TV & Media Experience",
      category: "apps",
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
      links: [
        { label: "Read Notes", action: "modal" },
      ],
    },
    {
      id: "pumproom-site",
      title: "pumproom.democrat Home Base",
      category: "family",
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
      links: [
        { label: "Read Notes", action: "modal" },
      ],
    },
    {
      id: "audio-visual-sessions",
      title: "Studio Clips & Media Reel",
      category: "media",
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
      links: [
        { label: "Preview Concept", action: "modal" },
      ],
    },
    {
      id: "weekend-prototypes",
      title: "Weekend Workshop Prototypes",
      category: "experiments",
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
      links: [
        { label: "Read Notes", action: "modal" },
      ],
    },
  ],

  // Short broadcast-style updates ("From the Bench")
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

  // Quick links shown in the About section (edit or add external links anytime)
  links: [
    { label: "Browse Builds", href: "#work", note: "Jump to the project grid" },
    { label: "Latest Updates", href: "#updates", note: "See recent workshop notes" },
    { label: "Back to Top", href: "#top", note: "Return to the studio spotlight" },
  ],
};
