import {
  AdItem,
  NewsArticle,
  ForumThread,
  SocialPost,
  VideoItem,
  ProductItem,
  MapLocation,
  EmailMessage,
  WebsiteData
} from '../types/browser';

// ==================== ADVERTISEMENTS ====================
export const FICTIONAL_ADS: AdItem[] = [
  {
    id: 'ad_northstar_1',
    sponsor: 'Northstar Electronics',
    title: 'New HorizonBook Pro 16 - Built for Performance',
    description: 'Experience ultra-fast 14-core processing and all-day battery life. Starting at $899 at NovaMart.',
    url: 'http://novamart.local/product/laptop-apex-15',
    keywords: ['laptop', 'computer', 'tech', 'electronics', 'hardware', 'pc', 'specs', 'student'],
    badgeColor: 'bg-blue-600',
    callToAction: 'Shop Now'
  },
  {
    id: 'ad_orbit_1',
    sponsor: 'Orbit Travel',
    title: 'Weekend Getaway? Coastal Express Trains from $39',
    description: 'Direct high-speed rail to Port Haven and Sunset Beach. Book your round-trip journey today.',
    url: 'http://orbittravel.local',
    keywords: ['travel', 'trip', 'hotel', 'flight', 'train', 'weekend', 'vacation', 'beach', 'tickets'],
    badgeColor: 'bg-emerald-600',
    callToAction: 'Explore Routes'
  },
  {
    id: 'ad_evergreen_1',
    sponsor: 'Evergreen Mutual Insurance',
    title: 'Comprehensive Auto & Home Protection',
    description: 'Get local claims service you can count on in Metro City. Save up to 20% by bundling policies.',
    url: 'http://evergreeninsure.local',
    keywords: ['insurance', 'car', 'auto', 'home', 'claims', 'quote', 'money', 'finance'],
    badgeColor: 'bg-teal-600',
    callToAction: 'Get Free Quote'
  },
  {
    id: 'ad_brightline_1',
    sponsor: 'Brightline Mobile',
    title: 'Unlimited 5G Data Across Metro City',
    description: 'Zero dead zones in the subway or Waterfront district. Switch today and receive a free Wi-Fi hotspot.',
    url: 'http://brightlinemobile.local',
    keywords: ['mobile', 'phone', 'network', '5g', 'data', 'sim', 'wifi', 'internet'],
    badgeColor: 'bg-indigo-600',
    callToAction: 'View Plans'
  },
  {
    id: 'ad_cloudbox_1',
    sponsor: 'CloudBox Storage',
    title: 'Secure Encrypted Backup - 500GB Free',
    description: 'Automatic backup for your documents, photos, and project archives. End-to-end client encryption.',
    url: 'http://novamart.local',
    keywords: ['backup', 'cloud', 'storage', 'files', 'drive', 'security', 'save'],
    badgeColor: 'bg-sky-600',
    callToAction: 'Sign Up Free'
  }
];

// ==================== NEWS ARTICLES ====================
export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    slug: 'waterfront-transit-expansion',
    headline: 'City Council Approves $140M Waterfront Light Rail Expansion',
    subtitle: 'New coastal line to connect Central Station directly to Pier 9 and the Maritime District by 2028.',
    author: 'Elena Rostova',
    authorRole: 'Urban Affairs Correspondent',
    date: 'September 7, 2026',
    category: 'Local',
    readTime: '4 min read',
    leadParagraph: 'METRO CITY — In a decisive 9-2 vote Monday evening, the City Council cleared the final budget authorization for the long-awaited Waterfront Transit Corridor, promising relief for downtown commuters and revitalization along the historic harbor.',
    bodyParagraphs: [
      'The project will introduce 6.2 miles of electrified light rail track, four new passenger hubs, and an integrated bike-share depot adjacent to Pier 9. Construction is scheduled to break ground early next spring near the Civic Center.',
      '“This infrastructure investment bridges our commercial core with the working harbor,” said Council President Linda Chen during the post-vote press briefing. “Residents will have direct, zero-emission transit to the maritime terminal in under twelve minutes.”',
      'Local business associations along Grand Avenue voiced strong support, citing expected increases in weekend foot traffic for nearby restaurants and cultural venues. However, harbor freight operators have requested continued dialogue regarding nighttime commercial truck access during the primary excavation phase.',
      'Environmental assessments completed by the Metro Department of Transportation indicate that the line will offset approximately 14,000 automobile trips daily along the congested Lower Shore Parkway.'
    ],
    tags: ['Transit', 'City Council', 'Waterfront', 'Infrastructure', 'Metro City'],
    commentsCount: 14,
    comments: [
      {
        id: 'c1',
        author: 'HarborResident',
        date: 'Sept 7, 18:45',
        text: 'Long overdue! Trying to drive down to the ferry terminal on Friday evenings has been an absolute nightmare for years.',
        upvotes: 28
      },
      {
        id: 'c2',
        author: 'TransitNerd_99',
        date: 'Sept 7, 19:10',
        text: 'Will the rolling stock use low-floor LRVs like the airport line? The platforms need level boarding for wheelchairs and bikes.',
        upvotes: 15
      },
      {
        id: 'c3',
        author: 'DowntownBizOwner',
        date: 'Sept 7, 20:30',
        text: 'Excited for the customers it brings, just hoping Grand Avenue doesn’t stay dug up for three straight summers.',
        upvotes: 9
      }
    ]
  },
  {
    id: 'news-2',
    slug: 'northstar-horizon-launch',
    headline: 'Northstar Electronics Unveils HorizonBook 15 Pro with Custom Silicon',
    subtitle: 'Flagship workstation targets developers and creatives with impressive efficiency benchmarks.',
    author: 'David K. Vance',
    authorRole: 'Technology Editor',
    date: 'September 6, 2026',
    category: 'Tech',
    readTime: '3 min read',
    leadParagraph: 'SILICON HARBOR — Domestic tech firm Northstar Electronics announced the global availability of its next-generation laptop line today, touting a 35% boost in multicore rendering performance alongside whisper-quiet thermal design.',
    bodyParagraphs: [
      'Priced starting at $899 at national retailers including NovaMart, the HorizonBook 15 Pro features a matte 2.8K anti-glare display, aerospace aluminum chassis, and full compatibility with modern Linux distributions.',
      'Initial synthetic benchmarks showed battery runtime exceeding 16 hours on continuous web browsing and code compilation workloads. Early reviewers praised the return of full-size function keys and the dual NVMe expansion slots.',
      '“We designed this machine for people who build things,” stated Northstar Chief Product Officer Maya Lin during the keynote broadcast. “Hardware should be accessible, repairable, and durable.”',
      'The notebook is already available for in-store demonstration at the NovaMart Flagship store on 4th Avenue.'
    ],
    tags: ['Technology', 'Hardware', 'Northstar', 'Laptops', 'NovaMart'],
    commentsCount: 8,
    comments: [
      {
        id: 'c4',
        author: 'SysAdmin_Carl',
        date: 'Sept 6, 14:22',
        text: 'Glad to see hardware vendors finally supporting native Linux firmware updates through LVFS out of the box!',
        upvotes: 42
      },
      {
        id: 'c5',
        author: 'PixelPusher',
        date: 'Sept 6, 16:04',
        text: 'How is the color accuracy on the matte panel? Looking for 100% DCI-P3 for photo retouching.',
        upvotes: 11
      }
    ]
  },
  {
    id: 'news-3',
    slug: 'annual-harbor-food-festival',
    headline: 'Annual Harbor Harvest Food & Jazz Festival Returns This Weekend',
    subtitle: 'Over 60 regional culinary vendors and three live music stages to take over Pier 4.',
    author: 'Chloe Simmons',
    authorRole: 'Culture & Lifestyle',
    date: 'September 5, 2026',
    category: 'Culture',
    readTime: '2 min read',
    leadParagraph: 'PORT HAVEN — The fragrant aromas of wood-fired sourdough, artisan clam chowder, and roasted autumn squash will once again greet waterfront visitors this Saturday and Sunday at Pier 4.',
    bodyParagraphs: [
      'Now in its twelfth year, the festival celebrates regional producers from across the valley. Admission is free to the public, with sample tasting passes available at the central gate.',
      'Headlining Saturday evening is the Marcus Webb Quintet, performing their acclaimed modern acoustic set against the backdrop of the illuminated suspension bridge.',
      'Organizers encourage visitors to use public transit or water taxis from the Downtown ferry terminal due to limited surface parking along Dock Street.'
    ],
    tags: ['Events', 'Food', 'Culture', 'Weekend', 'Harbor'],
    commentsCount: 5,
    comments: [
      {
        id: 'c6',
        author: 'FoodieJen',
        date: 'Sept 5, 11:05',
        text: 'The wood-fired sourdough from Old Mill Bakery alone is worth the trip. Definitely arriving early before the lines peak!',
        upvotes: 19
      }
    ]
  },
  {
    id: 'news-4',
    slug: 'metro-fc-championship-run',
    headline: 'Metro FC Secures Playoff Berth with Thrilling Stoppage-Time Header',
    subtitle: 'Captain Santiago strikes in the 94th minute to seal 2-1 victory over Valley United.',
    author: 'Ray Kowalski',
    authorRole: 'Senior Sports Analyst',
    date: 'September 4, 2026',
    category: 'Sports',
    readTime: '3 min read',
    leadParagraph: 'METRO STADIUM — Before a roaring capacity crowd of 32,000, Metro FC clinched their postseason ticket Sunday in dramatic fashion, overturning a one-goal deficit in the final ten minutes of play.',
    bodyParagraphs: [
      'Trailing until the 83rd minute following an early Valley United penalty, Metro’s relentless high press finally broke through when midfielder Liam Doyle curled a low cross across the six-yard box.',
      'In the dying seconds of stoppage time, veteran center-back Mateo Santiago rose above two defenders to nod home a corner kick, sending the stadium into pandemonium.',
      'Metro will host the conference quarterfinal at home on October 3.'
    ],
    tags: ['Sports', 'Football', 'Metro FC', 'Champions League'],
    commentsCount: 22
  },
  {
    id: 'news-bell-bankruptcy',
    slug: 'bell-electronics-bankruptcy',
    headline: 'Bell Electronics Shuts Down Amid Disputed Financial Audits',
    subtitle: '120 factory workers laid off as court appoints receiver to investigate missing inventory manifests.',
    author: 'Howard Thorne',
    authorRole: 'Investigative Bureau',
    date: 'November 14, 2003',
    category: 'Archive',
    readTime: '5 min read',
    leadParagraph: 'NORTHBRIDGE — Following months of legal wrangling with state revenue agents, Bell Electronics Components has formally entered Chapter 7 liquidation, shuttering its sprawling 104 Waterfront Way assembly plant.',
    bodyParagraphs: [
      'Court filings submitted Wednesday reveal that independent auditors uncovered over $2.4 million in unverified telecommunications component shipments billed to freight partner Crownline Logistics between 1996 and 2001.',
      'Former employees gathered outside the plant gates described years of tension following the mysterious September 1998 disappearance of lead auditor Anna Claire Bell, who had reportedly raised internal red flags regarding duplicate shipping bills.',
      '“Anna warned management that phantom shipments were leaving the docks under police escort,” claimed one former warehouse worker who spoke on condition of anonymity. “A week later she was gone, and management seized her files.”',
      'Plant supervisor Daniel Mercer declined to comment when reached by phone at his home yesterday. Police records indicate Mercer was briefly questioned in 1998 but never named as an official suspect.',
      'Creditors have petitioned the superior court to subpoena all remaining corporate bank records and shipping manifests before the property is auctioned off next spring.'
    ],
    tags: ['Northbridge', 'Bell Electronics', 'Crownline Logistics', 'Investigation', 'Archive'],
    commentsCount: 19,
    comments: [
      {
        id: 'cb1',
        author: 'ExAuditor',
        date: 'Nov 14, 2003 16:40',
        text: 'They took Anna’s blue folders from the second-floor file cabinets before detectives ever arrived on scene. Management knew what was on those duplicate ledgers.',
        upvotes: 45
      },
      {
        id: 'cb2',
        author: 'WaterfrontWatch',
        date: 'Nov 14, 2003 18:10',
        text: 'Everyone along the docks knew Crownline trucks were running freight at 2 AM with patrol escorts. It was an open secret in the 3rd Precinct.',
        upvotes: 38
      }
    ]
  },
  {
    id: 'news-hayes-resignation',
    slug: 'hayes-resignation-2008',
    headline: 'Detective Daniel Hayes Resigns Amid Evidence Vault Inquiries',
    subtitle: 'Veteran 16-year investigator departs Major Crimes abruptly after state audit of archived cold case lockers.',
    author: 'Elena Rostova',
    authorRole: 'Police & Courts Reporter',
    date: 'November 4, 2008',
    category: 'Archive',
    readTime: '4 min read',
    leadParagraph: 'NORTHBRIDGE — Detective Daniel Hayes, lead investigator on several prominent municipal cases throughout the late 1990s, has resigned from the Northbridge Police Department effective immediately, according to a brief memorandum issued by the Chief of Police.',
    bodyParagraphs: [
      'Hayes’ resignation follows an unannounced review conducted by the State Attorney General Special Prosecutions Bureau into missing physical exhibits from Central Station Vault B.',
      'Department sources confirmed that state auditors flagged irregular sign-out logs associated with historical dockets, including Case 27, the unsolved 1998 disappearance of auditor Anna Bell.',
      'Hayes was previously commended in 1997 for investigative diligence, but rumors of close ties to harbor freight operators have shadowed his tenure since the closure of Bell Electronics.',
      'Neither Hayes nor the police union could be reached for formal comment. Bureau Commander Arthur Vance stated that Hayes departed in good standing and wished him well in his retirement.'
    ],
    tags: ['Northbridge Police', 'Daniel Hayes', 'Major Crimes', 'Resignation', 'Archive'],
    commentsCount: 14
  }
];

// ==================== SOCIAL POSTS (PULSE) ====================
export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'pulse_1',
    author: 'Metro Transit Authority',
    handle: '@MetroTransit',
    avatarColor: 'bg-blue-600',
    timeAgo: '2h ago',
    content: '🚆 Council just approved the Waterfront Light Rail Corridor! Construction starts early next year connecting Pier 9 to Central Station in 12 minutes. Check the full route map on omnimaps.local! #MetroCity #Transit',
    likes: 342,
    reposts: 89,
    commentsCount: 27,
    tags: ['MetroCity', 'Transit', 'Waterfront']
  },
  {
    id: 'pulse_2',
    author: 'Marcus Vance',
    handle: '@marcus_photo',
    avatarColor: 'bg-emerald-600',
    timeAgo: '4h ago',
    content: 'Golden hour down at the Old Lighthouse Pier was incredible today. Fog rolled in right as the cargo freighter passed beneath the suspension bridge. Shot on 35mm film. 📸✨',
    likes: 512,
    reposts: 64,
    commentsCount: 19,
    tags: ['Photography', 'Cityscape', 'FilmPhotography']
  },
  {
    id: 'pulse_3',
    author: 'Sarah Lin',
    handle: '@sarah_dev',
    avatarColor: 'bg-indigo-600',
    timeAgo: '6h ago',
    content: 'Just set up my new HorizonBook laptop from @NorthstarDigital. Installing Securix Linux took under 8 minutes and all hardware works out of the box. Battery is showing 15 hours remaining! 💻🐧',
    likes: 189,
    reposts: 31,
    commentsCount: 14,
    tags: ['Linux', 'Hardware', 'Tech']
  },
  {
    id: 'pulse_4',
    author: 'Metro City Weather Watch',
    handle: '@SkyWatch_Metro',
    avatarColor: 'bg-sky-600',
    timeAgo: '7h ago',
    content: '🌤️ Afternoon high: 71°F (22°C) with low humidity and gentle sea breezes. Perfect weather for the Pier 4 food festival this weekend! See full radar on skywatch.local',
    likes: 95,
    reposts: 12,
    commentsCount: 4,
    tags: ['Weather', 'MetroCity']
  },
  {
    id: 'pulse_5',
    author: 'Pier 4 Harbor Market',
    handle: '@HarborEats',
    avatarColor: 'bg-amber-600',
    timeAgo: '1d ago',
    content: 'Over 60 local food trucks and artisan bakers will be set up Saturday morning! Free entry, live jazz starting at 1 PM. Come hungry! 🥖🎷',
    likes: 420,
    reposts: 110,
    commentsCount: 38,
    tags: ['FoodFestival', 'Weekend', 'Harbor']
  },
  {
    id: 'pulse_6',
    author: 'NovaMart Official',
    handle: '@NovaMart_Online',
    avatarColor: 'bg-rose-600',
    timeAgo: '1d ago',
    content: 'Back-to-School Tech Sale is live! Mechanical keyboards, noise-canceling headphones, and backpacks now up to 30% off. Fast shipping across the metro area. 🛒📦',
    likes: 154,
    reposts: 20,
    commentsCount: 8,
    tags: ['TechSale', 'Deals', 'NovaMart']
  }
];

// ==================== VIDEOS (VIEWTUBE) ====================
export const VIDEOS: VideoItem[] = [
  {
    id: 'vid_1',
    title: 'HorizonBook Pro 15 In-Depth Teardown & Repairability Score',
    channel: 'HardwareLab Reviews',
    views: '84K views',
    timeAgo: '3 days ago',
    duration: '14:28',
    category: 'Tech',
    description: 'We disassemble Northstar’s new 2026 laptop to see what components can be upgraded by the user. Dual M.2 slots, modular I/O boards, and standard Torx screws make this one of the most repair-friendly laptops on the market.',
    color: 'from-blue-900 to-indigo-950',
    commentsCount: 128,
    upvotes: '4.9K'
  },
  {
    id: 'vid_2',
    title: 'Walking the Historic 4th District & Waterfront Pier at Sunset',
    channel: 'Metro Wanders 4K',
    views: '32K views',
    timeAgo: '1 week ago',
    duration: '22:15',
    category: 'City',
    description: 'Relaxing ambient binaural walk starting from the Municipal Courthouse, through Old Town alleys, past the 4th Precinct, and finishing at Pier 9 just as harbor lights illuminate.',
    color: 'from-amber-950 to-slate-900',
    commentsCount: 45,
    upvotes: '1.8K'
  },
  {
    id: 'vid_3',
    title: 'Building a Silent Home Server on Linux for Under $300',
    channel: 'SelfHosted Workshop',
    views: '112K views',
    timeAgo: '2 weeks ago',
    duration: '18:40',
    category: 'Tech',
    description: 'Full walkthrough using used enterprise components, setting up ZFS storage pools, automatic Samba network shares, and local Docker containers with minimal power draw.',
    color: 'from-emerald-950 to-slate-900',
    commentsCount: 310,
    upvotes: '7.2K'
  },
  {
    id: 'vid_4',
    title: 'The Best Wood-Fired Pizza in Metro City? Taste Test Tour',
    channel: 'Local Bites & Brews',
    views: '48K views',
    timeAgo: '5 days ago',
    duration: '11:05',
    category: 'City',
    description: 'We visited three legendary neighborhood pizzerias: Bella Napoli in Little Italy, Grand Slice in the 4th District, and Harbor Coal-Fired by the marina.',
    color: 'from-rose-950 to-slate-900',
    commentsCount: 92,
    upvotes: '2.4K'
  },
  {
    id: 'vid_5',
    title: 'Why Mechanical Keyboards Feel So Good - Switch Mechanics Explained',
    channel: 'KeebCraft',
    views: '67K views',
    timeAgo: '3 weeks ago',
    duration: '09:50',
    category: 'Tech',
    description: 'A deep look into linear vs tactile vs clicky switches, spring weights, switch lubing, and acoustic resonance inside aluminum cases.',
    color: 'from-purple-950 to-slate-900',
    commentsCount: 76,
    upvotes: '3.1K'
  }
];

// ==================== FORUM THREADS (DISCOURSE / NETBOARD) ====================
export const FORUM_THREADS: ForumThread[] = [
  {
    id: 'thread-1',
    subforumId: 'hardware',
    title: 'Best lightweight laptop for daily commuting and typing?',
    author: 'TransitCommuter',
    createdAt: 'September 5, 2026',
    views: 420,
    tags: ['Laptops', 'Recommendations', 'BatteryLife'],
    posts: [
      {
        id: 'p1',
        author: 'TransitCommuter',
        avatarText: 'TC',
        role: 'Member',
        postDate: 'Sep 5, 2026 at 11:20 AM',
        content: `Hey everyone! I spend about 45 minutes on the commuter train each morning and need a laptop that won’t break my back or die before 5 PM. Mostly writing documents, running lightweight scripts, and browsing. Budget is around $700–$900.
        
Looking at the new HorizonBook 15 or maybe an older ThinkPad model. Thoughts?`,
        likes: 4
      },
      {
        id: 'p2',
        author: 'KeyCapGuru',
        avatarText: 'KG',
        role: 'Senior Member',
        postDate: 'Sep 5, 2026 at 11:45 AM',
        content: `I picked up the HorizonBook 15 last week from NovaMart. The keyboard has 1.5mm travel and zero deck flex, which is rare for sub-kilogram laptops these days. Battery easily gets me through a full workday without bringing the charger brick. Highly recommend!`,
        likes: 12,
        signature: 'Dual-booting Securix OS & Arch Linux | 65% Custom Keyboard'
      },
      {
        id: 'p3',
        author: 'MetroLinuxFan',
        avatarText: 'ML',
        role: 'Moderator',
        postDate: 'Sep 5, 2026 at 12:15 PM',
        content: `Seconding KeyCapGuru. Plus Northstar has official Linux drivers in kernel 6.8+ so sleep/wake state works instantly with zero battery drain when lid is closed.`,
        likes: 8
      }
    ]
  },
  {
    id: 'thread-2',
    subforumId: 'community',
    title: 'What’s the best coffee & study spot in the 4th District?',
    author: 'Student_Clara',
    createdAt: 'September 6, 2026',
    views: 280,
    tags: ['4thDistrict', 'Coffee', 'StudySpots'],
    posts: [
      {
        id: 'p4',
        author: 'Student_Clara',
        avatarText: 'SC',
        role: 'New Member',
        postDate: 'Sep 6, 2026 at 02:14 PM',
        content: `Finals prep is coming up and my apartment is too noisy with street renovations. Looking for a cafe with decent Wi-Fi, comfortable seating, and good espresso near Elm or Oak Street.`,
        likes: 3
      },
      {
        id: 'p5',
        author: 'BaristaDan',
        avatarText: 'BD',
        role: 'Local Resident',
        postDate: 'Sep 6, 2026 at 02:30 PM',
        content: `Try "The Roast & Folio" across from the Central Library branch on 4th & Market. They have quiet booths upstairs, plenty of outlets, and roast their own beans in-house.`,
        likes: 11
      }
    ]
  },
  {
    id: 'thread-3',
    subforumId: 'gaming',
    title: 'Classic PC Simulation and Mystery Games Retrospective (1998-2004)',
    author: 'RetroNostalgia',
    createdAt: 'September 2, 2026',
    views: 890,
    isPinned: true,
    tags: ['RetroGaming', 'PCClassics', 'History'],
    posts: [
      {
        id: 'p6',
        author: 'RetroNostalgia',
        avatarText: 'RN',
        role: 'Archivist',
        postDate: 'Sep 2, 2026 at 09:15 AM',
        content: `There was something magical about late 90s PC gaming: chunky big-box packaging, thick spiral-bound manuals, and games that trusted the player to take real notes on paper. What are your all-time favorites from that golden era?`,
        likes: 34
      },
      {
        id: 'p7',
        author: 'DetectiveGamer',
        avatarText: 'DG',
        role: 'Member',
        postDate: 'Sep 2, 2026 at 10:02 AM',
        content: `The investigative puzzle games where you actually had to cross-reference fictional phone directories and log into fictional computer terminals. That atmosphere has never been matched.`,
        likes: 27
      }
    ]
  },
  {
    id: 'thread-4',
    subforumId: 'photography',
    title: 'Tips for long-exposure harbor photography at night?',
    author: 'LensCrafter',
    createdAt: 'September 4, 2026',
    views: 310,
    tags: ['Photography', 'NightPhotography', 'Harbor'],
    posts: [
      {
        id: 'p8',
        author: 'LensCrafter',
        avatarText: 'LC',
        role: 'Member',
        postDate: 'Sep 4, 2026 at 08:30 PM',
        content: `Heading down to Pier 9 this Friday to capture the bridge lights reflected in the water. Any advice on aperture and ND filter selection when dealing with strong sodium harbor lights?`,
        likes: 6
      }
    ]
  },
  {
    id: 'thread-unsolved-cases',
    subforumId: 'community',
    title: 'Northbridge Cold Cases: The 1998 Disappearance of Anna Bell (CASE-1998-027)',
    author: 'HarborHistorian',
    createdAt: 'August 18, 2026',
    views: 1420,
    tags: ['ColdCase', 'AnnaBell', 'NorthbridgeHistory', 'TrueCrime'],
    posts: [
      {
        id: 'p-case27-1',
        author: 'HarborHistorian',
        avatarText: 'HH',
        role: 'Local Archivist',
        postDate: 'Aug 18, 2026 at 10:14 PM',
        content: `Next month marks 28 years since Anna Claire Bell vanished from Willow Street in September 1998. Her Ford Taurus was found abandoned on Canal Road weeks later, but no body was ever recovered. The police ruled it voluntary disappearance or carjacking, but old warehouse workers remember the duplicate audits at Bell Electronics. Anyone here remember the case?`,
        likes: 24
      },
      {
        id: 'p-case27-2',
        author: 'ExAuditor_98',
        avatarText: 'EA',
        role: 'Verified Former Employee',
        postDate: 'Aug 19, 2026 at 01:22 AM',
        content: `I worked accounting at Bell Electronics back then. Anna found out that freight manifests to Crownline Logistics were being billed twice and paid to an offshore shell company. She kept a set of duplicate audit ledgers in a private rental locker (CS-14 at Canal Storage). The day she planned to submit her findings to the state, she never made it home. And Detective Hayes shut down the company office within 48 hours.`,
        likes: 56,
        signature: 'Truth doesn’t expire with the statute of limitations.'
      },
      {
        id: 'p-case27-3',
        author: 'NorthbridgeLocal',
        avatarText: 'NL',
        role: 'Member',
        postDate: 'Aug 19, 2026 at 08:45 AM',
        content: `My aunt lived at 40 Willow Street back then. She told officers she saw a patrol car with amber flashers stopped behind a dark sedan around 10:40 PM, but the detective (Hayes) wrote down that she was mistaken and told her not to talk to reporters.`,
        likes: 39
      }
    ]
  }
];

// ==================== SHOPPING PRODUCTS (NOVAMART) ====================
export const PRODUCTS: ProductItem[] = [
  {
    id: 'laptop-apex-15',
    name: 'Northstar HorizonBook 15 Pro Laptop',
    category: 'Laptops',
    price: 899,
    originalPrice: 999,
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    specs: {
      Processor: '14-Core Intel Core i7-13700H',
      RAM: '16GB DDR5 4800MHz (Upgradeable)',
      Storage: '512GB PCIe 4.0 NVMe SSD',
      Display: '15.6" 2.8K IPS Matte (120Hz)',
      Battery: 'Up to 16 Hours Runtime',
      OS: 'Securix Linux / Multi-OS Ready'
    },
    description: 'Designed for professional performance and uncompromised portability. Featuring a durable aluminum alloy body, backlit ergonomic keyboard, and comprehensive I/O ports including Thunderbolt 4, HDMI 2.1, and full-size SD card reader.',
    badge: 'Editor’s Choice',
    color: 'bg-slate-800'
  },
  {
    id: 'audio-acoustiq-9',
    name: 'AcoustiQ Pro Active Noise-Cancelling Headphones',
    category: 'Audio',
    price: 149,
    originalPrice: 189,
    rating: 4.7,
    reviewCount: 428,
    inStock: true,
    specs: {
      Driver: '40mm Titanium Composite',
      BatteryLife: '38 Hours with ANC Active',
      Connectivity: 'Bluetooth 5.3 + 3.5mm Analog Cable',
      NoiseCancellation: 'Dual-Feed Hybrid Active ANC',
      Weight: '235 grams'
    },
    description: 'Escape commuter noise and office chatter. Plush memory foam earcups provide all-day comfort while multi-microphone noise canceling ensures crystal-clear voice calls.',
    badge: 'Sale',
    color: 'bg-indigo-950'
  },
  {
    id: 'keyboard-vortex-87',
    name: 'Vortex K-87 Tenkeyless Mechanical Keyboard',
    category: 'Keyboards',
    price: 79,
    originalPrice: 89,
    rating: 4.9,
    reviewCount: 189,
    inStock: true,
    specs: {
      Layout: '87-Key TKL US ANSI',
      Switches: 'Gateron Pro Yellow (Pre-Lubed)',
      Keycaps: 'Double-Shot PBT Cherry Profile',
      Backlight: 'Subtle White LED with 8 Modes',
      Connection: 'Detachable Braided USB-C Cable'
    },
    description: 'The definitive typing keyboard. Hot-swappable PCB allows you to change switches without soldering. Built with sound-dampening silicone sheets for a deep, satisfying acoustic profile.',
    color: 'bg-cyan-950'
  },
  {
    id: 'backpack-commute-waterproof',
    name: 'MetroGuard 24L Weatherproof Daily Backpack',
    category: 'Accessories',
    price: 49,
    rating: 4.6,
    reviewCount: 94,
    inStock: true,
    specs: {
      Capacity: '24 Liters',
      Material: 'Cordura 800D Water-Repellent Ballistic Nylon',
      LaptopSleeve: 'Suspended Padded Sleeve fits up to 16"',
      Security: 'Hidden Passport / Wallet Rear Pocket',
      Zippers: 'YKK Aquaguard Sealed Zippers'
    },
    description: 'Keep your expensive electronics safe in heavy rain. Features ergonomic padded shoulder straps, luggage pass-through handle, and dedicated organizer pockets for cables and chargers.',
    color: 'bg-emerald-950'
  }
];

// ==================== MAP LOCATIONS (OMNIMAPS) ====================
export const MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'loc_precinct_4',
    name: 'Metropolitan Police - 4th District Station',
    category: 'Emergency',
    address: '104 Market Street',
    district: 'Civic Center / 4th District',
    x: 48,
    y: 44,
    description: 'Headquarters of the 4th District Criminal Investigation Squad and central precinct holding facility.',
    icon: 'Shield',
    phone: '(555) 019-4000'
  },
  {
    id: 'loc_central_library',
    name: 'Metro Central Public Library & Municipal Archives',
    category: 'Government',
    address: '220 Elm Avenue',
    district: 'Civic Center',
    x: 52,
    y: 38,
    description: 'Houses regional historical newspapers on microfilm, city deed records, and public research terminals.',
    icon: 'BookOpen',
    phone: '(555) 019-2240'
  },
  {
    id: 'loc_pier_9',
    name: 'Pier 9 Maritime Wharf & Cargo Terminal',
    category: 'Commercial',
    address: '900 Lower Shore Parkway',
    district: 'Waterfront / Harbor',
    x: 82,
    y: 65,
    description: 'Commercial deep-water dock accommodating coastal freighters, container warehouses, and harbor pilot station.',
    icon: 'Anchor',
    phone: '(555) 019-8900'
  },
  {
    id: 'loc_central_station',
    name: 'Grand Central Passenger Rail Station',
    category: 'Transit',
    address: '1 Rail Plaza, Grand Ave',
    district: 'Downtown Core',
    x: 40,
    y: 52,
    description: 'Major regional rail junction connecting suburban lines, intercity express, and underground metro network.',
    icon: 'Train',
    phone: '(555) 019-7245'
  },
  {
    id: 'loc_pier_4_market',
    name: 'Pier 4 Artisan Hall & Waterfront Promenade',
    category: 'Food',
    address: '400 Harbor Boulevard',
    district: 'Waterfront',
    x: 74,
    y: 58,
    description: 'Popular weekend destination featuring local seafood eateries, open-air farmers stalls, and outdoor jazz stage.',
    icon: 'Coffee',
    phone: '(555) 019-4412'
  },
  {
    id: 'loc_municipal_courthouse',
    name: 'Metropolitan Hall of Justice & Clerk’s Office',
    category: 'Government',
    address: '50 Civic Plaza',
    district: 'Civic Center',
    x: 46,
    y: 40,
    description: 'Municipal courtrooms, district attorney division, and public records filing counter.',
    icon: 'Landmark',
    phone: '(555) 019-5000'
  },
  {
    id: 'loc_novamart_flagship',
    name: 'NovaMart Flagship Department Store',
    category: 'Commercial',
    address: '350 4th Avenue',
    district: 'Downtown Core',
    x: 36,
    y: 45,
    description: 'Three floors of consumer electronics, home goods, hardware demonstrations, and customer service center.',
    icon: 'ShoppingBag',
    phone: '(555) 019-3300'
  },
  {
    id: 'loc_grand_slice_pizza',
    name: 'Grand Slice Pizzeria',
    category: 'Food',
    address: '144 Oak Street',
    district: '4th District',
    x: 44,
    y: 47,
    description: 'Neighborhood staple serving brick-oven pizza and espresso since 1984.',
    icon: 'Utensils',
    phone: '(555) 019-1440'
  }
];

// ==================== WEBMAIL MESSAGES (INBOX.LOCAL) ====================
export const INITIAL_EMAILS: EmailMessage[] = [
  {
    id: 'email_1',
    fromName: 'IT Services Helpdesk',
    fromEmail: 'sysadmin@police.internal',
    toEmail: 'investigator@police.internal',
    subject: 'Workstation Setup Complete - Securix OS 24.04',
    date: 'Sep 7, 2026, 08:30 AM',
    folder: 'inbox',
    isRead: true,
    isStarred: true,
    body: `Hello Investigator,

Your desktop workstation (WS-07) in the 4th District Squad Room has been successfully migrated to Securix OS 24.04 LTS.

Important Notice:
- Your local home directory is mounted with LUKS2 encryption.
- All downloads through the browser will be automatically placed in your user directory: /home/investigator/Downloads/
- Use http://search.local to search internal manuals and local records.
- For IT assistance, dial extension 4000 or submit a ticket through intranet.local.

Best regards,
Metro Police IT Division`
  },
  {
    id: 'email_2',
    fromName: 'NovaMart Order Support',
    fromEmail: 'orders@novamart.local',
    toEmail: 'investigator@metro.gov',
    subject: 'Your NovaMart Order Confirmation #NM-94821',
    date: 'Sep 6, 2026, 04:15 PM',
    folder: 'inbox',
    isRead: true,
    isStarred: false,
    body: `Thank you for shopping at NovaMart Online!

Order #NM-94821
---------------------------------------------
1x MetroGuard 24L Weatherproof Backpack - $49.00
1x Vortex K-87 Mechanical Keyboard (TKL) - $79.00
Standard Ground Courier Shipping - FREE
---------------------------------------------
Total Paid: $128.00

Tracking Number: NM-TRK-774021
Expected Delivery: Wednesday, Sep 9, 2026

You can manage your order or download your receipt anytime at http://novamart.local/account.`,
    attachments: [
      {
        name: 'Order_Receipt_NM94821.txt',
        size: '1.2 KB',
        mimeType: 'text/plain',
        fileContent: `NOVAMART ONLINE INVOICE #NM-94821
Date: 2026-09-06
Items:
1. MetroGuard 24L Weatherproof Backpack ($49.00)
2. Vortex K-87 Mechanical Keyboard ($79.00)
Payment Method: Government Card Ending in 8842
Status: Processed & Shipped`
      }
    ]
  },
  {
    id: 'email_3',
    fromName: 'NetBoard Community Forum',
    fromEmail: 'notifications@discourse.local',
    toEmail: 'investigator@metro.gov',
    subject: 'Reply to thread: Classic PC Simulation and Mystery Games',
    date: 'Sep 5, 2026, 10:14 AM',
    folder: 'inbox',
    isRead: false,
    isStarred: false,
    body: `Hello!

User "DetectiveGamer" just posted a reply to your subscribed discussion thread:
"Classic PC Simulation and Mystery Games Retrospective (1998-2004)" in the Gaming subforum.

Excerpt:
"The investigative puzzle games where you actually had to cross-reference fictional phone directories and log into fictional computer terminals. That atmosphere has never been matched..."

To view the response or reply, visit:
http://discourse.local/thread/thread-3`
  },
  {
    id: 'email_4',
    fromName: 'Captain J. Vance',
    fromEmail: 'j.vance@police.internal',
    toEmail: 'squad-all@police.internal',
    subject: 'Squad Room Maintenance & Shift Briefing Reminder',
    date: 'Sep 4, 2026, 05:00 PM',
    folder: 'inbox',
    isRead: true,
    isStarred: true,
    body: `Detectives,

Reminder that Friday afternoon briefing starts promptly at 16:30 in Conference Room B.
Be prepared to present case updates on pending property theft reports in the Harbor corridor.

Also, please ensure all physical evidence binders are locked in Room 3 before leaving for the weekend.

- Captain Vance`
  },
  {
    id: 'email_5',
    fromName: 'Metro Transit Newsletter',
    fromEmail: 'newsletter@transit.local',
    toEmail: 'investigator@metro.gov',
    subject: 'Monthly Transit Update: Waterfront Light Rail Project Approved',
    date: 'Sep 7, 2026, 09:00 AM',
    folder: 'inbox',
    isRead: false,
    isStarred: false,
    body: `Read all about the new Waterfront light rail expansion connecting Central Station to Pier 9.
Full details on our route map at http://omnimaps.local and news coverage on http://metrodaily.local.`
  }
];

// ==================== ENCYCLOPEDIA (LEXICON) ====================
export const LEXICON_ARTICLES: Record<string, { title: string; content: string; related: string[] }> = {
  'metro-city': {
    title: 'Metro City (Metropolitan Municipality)',
    content: `Metro City is a major coastal metropolis and commercial port situated along the Grand Estuary. Founded in 1842 as a timber shipping hub, the city rapidly industrialized during the railroad boom of the late 19th century.
    
Districts:
1. Civic Center: The administrative heart of municipal government, housing the City Hall, Hall of Justice, and Central Police Headquarters.
2. Downtown Core: A dense high-rise district of banking, retail, and commercial tech headquarters.
3. Waterfront & Pier District: Historic maritime wharves, ferry terminals, and shipping container yards.
4. North Hills: Residential district characterized by steep scenic vistas and historic stone architecture.
5. Industrial Canal: Logistics hubs, rail yards, and manufacturing facilities.`,
    related: ['History of Harbor Terminal', 'Digital Forensics', 'Light Rail System']
  },
  'digital-forensics': {
    title: 'Digital Forensics & Incident Investigation',
    content: `Digital forensics encompasses the recovery, preservation, and analysis of electronic data in criminal and civil inquiries.
    
Key Protocols:
- Chain of Custody: Meticulous logging of who accessed evidence, timestamped records, and verification hashes (SHA-256 / MD5).
- Non-Destructive Inspection: Creating bit-level raw disk images before analysis to prevent altering access timestamps.
- Virtual File Systems: Secure sandboxed environments allowing investigators to query filesystem metadata without risking host contamination.`,
    related: ['Metro City', 'Securix OS', 'Cryptographic Hashing']
  }
};

// ==================== WEB ARCHIVE (WAYBACK SNAPSHOTS) ====================
export const ARCHIVE_SNAPSHOTS = [
  {
    url: 'http://example.local',
    date: 'March 14, 2004',
    title: 'Example Local Domain (Archived 2004)',
    content: `<!DOCTYPE html>
<html>
<head><title>Welcome to Example Local - 2004</title></head>
<body bgcolor="#c0c0c0" text="#000080" link="#800000" vlink="#008080">
<center>
<h1><marquee scrollamount="4">*** WELCOME TO EXAMPLE.LOCAL (EST. 2004) ***</marquee></h1>
<hr size="3" color="#000080">
<table border="2" cellpadding="8" bgcolor="#ffffff" width="80%">
<tr>
<td align="center">
<p><b>This website is optimized for Netscape Navigator 4.0 and Internet Explorer 5.5!</b></p>
<p>Best viewed at 800x600 resolution with 16-bit High Color.</p>
<p>Under Construction! [🚧👷‍♂️🚧]</p>
<p>Visitor Counter: <b>000482</b></p>
</td>
</tr>
</table>
<br>
<a href="mailto:webmaster@example.local">Email the Webmaster</a> | <a href="#guestbook">Sign My Guestbook!</a>
</center>
</body>
</html>`
  },
  {
    url: 'http://retro-fan.local',
    date: 'October 21, 2001',
    title: 'The Retro Tech & Computer Fanpage (Archived 2001)',
    content: `<!DOCTYPE html>
<html>
<head><title>Retro Tech Fanpage</title></head>
<body bgcolor="#000000" text="#00ff00" link="#ffff00" vlink="#ff00ff">
<h2>> Dave's Old Computing Corner</h2>
<p>Specs of my battle station:</p>
<ul>
<li>CPU: Intel Pentium III 800MHz Coppermine</li>
<li>RAM: 256MB PC-133 SDRAM</li>
<li>GPU: 3dfx Voodoo5 5500 AGP 64MB</li>
<li>HDD: Western Digital 30GB IDE 7200RPM</li>
<li>OS: Windows 2000 Professional Service Pack 2</li>
</ul>
<p>Dial-up connection: USRobotics 56k V.90 External Faxmodem.</p>
</body>
</html>`
  }
];

// ==================== ALL CORE WEBSITES ====================
export const CORE_WEBSITES: Record<string, WebsiteData> = {
  'search.local': {
    domain: 'search.local',
    name: 'Beacon Search Engine',
    category: 'Portal',
    icon: 'Search',
    isHttps: true,
    themeColor: '#2563eb',
    pages: {
      '/': {
        url: 'https://search.local/',
        title: 'Beacon Search',
        category: 'Portal'
      }
    }
  },
  'metrodaily.local': {
    domain: 'metrodaily.local',
    name: 'The Metropolitan Daily Chronicle',
    category: 'News',
    icon: 'Newspaper',
    isHttps: true,
    themeColor: '#0f172a',
    pages: {
      '/': {
        url: 'https://metrodaily.local/',
        title: 'The Metropolitan Daily Chronicle - Leading Regional News',
        category: 'News',
        isCustomRenderer: true
      }
    }
  },
  'pulse.local': {
    domain: 'pulse.local',
    name: 'Pulse Social',
    category: 'Social',
    icon: 'MessageSquare',
    isHttps: true,
    themeColor: '#4f46e5',
    pages: {
      '/': {
        url: 'https://pulse.local/',
        title: 'Pulse / Discover What’s Happening',
        category: 'Social',
        isCustomRenderer: true
      }
    }
  },
  'viewtube.local': {
    domain: 'viewtube.local',
    name: 'ViewTube Video Platform',
    category: 'Media',
    icon: 'Video',
    isHttps: true,
    themeColor: '#dc2626',
    pages: {
      '/': {
        url: 'https://viewtube.local/',
        title: 'ViewTube - Watch and Share Videos',
        category: 'Media',
        isCustomRenderer: true
      }
    }
  },
  'discourse.local': {
    domain: 'discourse.local',
    name: 'NetBoard Community Discussion Forums',
    category: 'Community',
    icon: 'Users',
    isHttps: true,
    themeColor: '#0284c7',
    pages: {
      '/': {
        url: 'https://discourse.local/',
        title: 'NetBoard - General Discussion & Tech Forums',
        category: 'Community',
        isCustomRenderer: true
      }
    }
  },
  'novamart.local': {
    domain: 'novamart.local',
    name: 'NovaMart Marketplace',
    category: 'Shopping',
    icon: 'ShoppingBag',
    isHttps: true,
    themeColor: '#059669',
    pages: {
      '/': {
        url: 'https://novamart.local/',
        title: 'NovaMart Online - Electronics, Audio & Daily Gear',
        category: 'Shopping',
        isCustomRenderer: true
      }
    }
  },
  'omnimaps.local': {
    domain: 'omnimaps.local',
    name: 'OmniMaps Metro City',
    category: 'Travel',
    icon: 'MapPin',
    isHttps: true,
    themeColor: '#0284c7',
    pages: {
      '/': {
        url: 'https://omnimaps.local/',
        title: 'OmniMaps - Metro City Interactive Navigation',
        category: 'Travel',
        isCustomRenderer: true
      }
    }
  },
  'inbox.local': {
    domain: 'inbox.local',
    name: 'MetroMail Webmail Client',
    category: 'Services',
    icon: 'Mail',
    isHttps: true,
    themeColor: '#0284c7',
    pages: {
      '/': {
        url: 'https://inbox.local/',
        title: 'MetroMail - Secure Webmail',
        category: 'Services',
        isCustomRenderer: true
      }
    }
  },
  'skywatch.local': {
    domain: 'skywatch.local',
    name: 'SkyWatch Metro Weather',
    category: 'General',
    icon: 'CloudSun',
    isHttps: true,
    themeColor: '#0284c7',
    pages: {
      '/': {
        url: 'https://skywatch.local/',
        title: 'SkyWatch Weather - Metro Forecast & Radar',
        category: 'General',
        isCustomRenderer: true
      }
    }
  },
  'lexicon.local': {
    domain: 'lexicon.local',
    name: 'Lexicon Encyclopedia',
    category: 'Reference',
    icon: 'BookOpen',
    isHttps: true,
    themeColor: '#475569',
    pages: {
      '/': {
        url: 'https://lexicon.local/',
        title: 'Lexicon Free Encyclopedia',
        category: 'Reference',
        isCustomRenderer: true
      }
    }
  },
  'archive.local': {
    domain: 'archive.local',
    name: 'Wayback Web Archive Engine',
    category: 'Reference',
    icon: 'History',
    isHttps: true,
    themeColor: '#78716c',
    pages: {
      '/': {
        url: 'https://archive.local/',
        title: 'Wayback Web Archive - Preserving Internet History',
        category: 'Reference',
        isCustomRenderer: true
      }
    }
  },
  'intranet.local': {
    domain: 'intranet.local',
    name: 'Metropolitan Police Dept - Intranet Portal',
    category: 'Department',
    icon: 'Shield',
    isHttps: false,
    themeColor: '#1e3a8a',
    pages: {
      '/': {
        url: 'http://intranet.local/',
        title: 'Metropolitan Police Intranet',
        category: 'Department',
        content: `METROPOLITAN INVESTIGATION UNIT - SECURE INTRANET
Station: 4th District Headquarters | Node: WS-07

[DEPARTMENT BULLETINS]
• NOTICE: All precinct terminals have been updated to Securix OS 24.04 LTS.
• REMINDER: Verify hash sums on seized external flash media before mounting.
• SYSTEM MAINTENANCE: The Central Arrest Records Database will undergo routine indexing this weekend.

[QUICK ACCESS PORTALS]
• Department Documentation: http://manuals.local/
• Local Search Index: https://search.local/
• Terminal Guide & Commands: http://manuals.local/terminal

[IT SUPPORT CONTACT]
Internal Extension: 4000 | Sysadmin: admin@police.internal`
      }
    }
  },
  'manuals.local': {
    domain: 'manuals.local',
    name: 'Securix OS Documentation',
    category: 'Reference',
    icon: 'BookOpen',
    isHttps: false,
    themeColor: '#334155',
    pages: {
      '/': {
        url: 'http://manuals.local/',
        title: 'Securix OS System Manuals',
        category: 'Reference',
        content: `Securix OS 24.04 Reference Manual & Investigator Handbook
--------------------------------------------------------------
Welcome to the documentation repository.

Sections Available:
1. Terminal Commands Reference: http://manuals.local/terminal
2. Forensic Integrity Guidelines: http://manuals.local/forensics
3. Network Configuration: http://manuals.local/network`
      },
      '/terminal': {
        url: 'http://manuals.local/terminal',
        title: 'Terminal Commands Guide - Securix OS',
        category: 'Reference',
        content: `TERMINAL COMMANDS GUIDE
=======================
pwd           Print Working Directory
ls [-la]      List directory contents with permissions
cd <path>     Change current working directory
cat <file>    Concatenate and display files
touch <file>  Create an empty file or update timestamp
mkdir <dir>   Create a directory
cp <s> <d>    Copy files or directories
mv <s> <d>    Move or rename files
rm <file>     Remove files or directories
grep <pat> <f>Search for patterns in files
find <dir>    Search files by criteria
whoami        Print current user id
python        Launch interactive Python shell
nano <file>   Launch console text editor
help          Display interactive command help`
      },
      '/forensics': {
        url: 'http://manuals.local/forensics',
        title: 'Digital Forensics Protocol',
        category: 'Policy',
        content: `DIGITAL EVIDENCE SEIZURE & CHAIN OF CUSTODY
1. Document serial numbers and physical state before connecting to workstation.
2. All imported evidence must be filed under /home/investigator/Documents/ or dedicated media folders.
3. Cryptographic integrity must be preserved.`
      }
    }
  },
  'northstardigital.local': {
    domain: 'northstardigital.local',
    name: 'Northstar Electronics Official',
    category: 'Corporate',
    icon: 'Cpu',
    isHttps: true,
    themeColor: '#2563eb',
    pages: {
      '/': {
        url: 'https://northstardigital.local/',
        title: 'Northstar Electronics - Engineering for Tomorrow',
        category: 'Corporate',
        content: `NORTHSTAR ELECTRONICS
Precision Computing Hardware & Silicon Design

[FLAGSHIP PRODUCTS]
• HorizonBook 15 Pro: Next-generation 14-core portable workstation. Read full specs or purchase on http://novamart.local/product/laptop-apex-15
• HorizonStation 400: Enterprise rackmount nodes.

[SUPPORT & DRIVERS]
All Northstar hardware drivers are upstreamed to Linux 6.8+ kernels.`
      }
    }
  },
  'orbittravel.local': {
    domain: 'orbittravel.local',
    name: 'Orbit Travel & High Speed Rail',
    category: 'Travel',
    icon: 'Compass',
    isHttps: true,
    themeColor: '#059669',
    pages: {
      '/': {
        url: 'https://orbittravel.local/',
        title: 'Orbit Travel - Regional Transit & Rail Bookings',
        category: 'Travel',
        content: `ORBIT TRAVEL - REGIONAL BOOKING ENGINE
Connecting Metro City to Port Haven, Valley Junction, and Silver Springs.

Popular Routes:
• Metro Central Station -> Port Haven Pier: 42 mins (Departures every 30 mins)
• Metro Central Station -> Valley Mountain Ski Resort: 1 hr 15 mins

Check route timetables and station connections on http://omnimaps.local.`
      }
    }
  },
  'evergreeninsure.local': {
    domain: 'evergreeninsure.local',
    name: 'Evergreen Mutual Insurance',
    category: 'Business',
    icon: 'ShieldCheck',
    isHttps: true,
    themeColor: '#0d9488',
    pages: {
      '/': {
        url: 'https://evergreeninsure.local/',
        title: 'Evergreen Mutual - Local Protection for Home & Auto',
        category: 'Business',
        content: `EVERGREEN MUTUAL INSURANCE CO.
Serving Metro City households and commercial fleets since 1974.

Branch Office: 300 Grand Avenue, Suite 400
Claims Line: 1-800-555-EVERGREEN
Licensed in all municipal zones.`
      }
    }
  },
  'brightlinemobile.local': {
    domain: 'brightlinemobile.local',
    name: 'Brightline Mobile 5G',
    category: 'Corporate',
    icon: 'Wifi',
    isHttps: true,
    themeColor: '#6366f1',
    pages: {
      '/': {
        url: 'https://brightlinemobile.local/',
        title: 'Brightline Mobile - High Speed 5G Coverage',
        category: 'Corporate',
        content: `BRIGHTLINE MOBILE NETWORK
Metro City’s Fastest 5G Network.

Coverage includes:
• 100% of Metro Subway Lines & Underpasses
• Harbor District & Offshore Ferry Channels
• High-Speed Rail Corridors`
      }
    }
  },
  'example.local': {
    domain: 'example.local',
    name: 'Local Test Domain',
    category: 'Testing',
    icon: 'Globe',
    isHttps: false,
    pages: {
      '/': {
        url: 'http://example.local/',
        title: 'Example Local Domain',
        category: 'Testing',
        content: `Example Domain (Internal Simulation)
This domain is established to verify internal simulated HTTP protocol resolution.
Status: HTTP 200 OK.
Server: Securix-HTTPd/2.4
For historical archived versions of this page from 2004, visit http://archive.local.`
      }
    }
  }
};
