const EVENTS_KEY = 'te_events';
const REGISTRATIONS_KEY = 'te_registrations';
const CURRENT_USER_KEY = 'te_current_user';
const COMMENTS_KEY = 'te_comments';
const USERS_LIST_KEY = 'te_users_list';

const SEED_USERS = [
  {
    id: 'user-bhavitha',
    name: 'Bhavitha R',
    email: 'bhavitha@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'UI/UX Designer & Frontend enthusiast. Designing seamless experiences.',
    skills: ['Figma', 'UI/UX', 'React', 'JavaScript', 'Tailwind'],
    xp: 1250,
    badges: ['Early Adopter', 'UI Evangelist', 'Hackathon Hero'],
    referralCode: 'BHAVI25',
    referralsCount: 5,
    referralsEarnedXp: 250,
  },
  {
    id: 'user-rahul',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Fullstack Dev & Open source contributor. Building web products.',
    skills: ['Node.js', 'React', 'TypeScript', 'PostgreSQL'],
    xp: 950,
    badges: ['Code Ninja', 'Top Contributor'],
    referralCode: 'RAHUL99',
    referralsCount: 3,
    referralsEarnedXp: 150,
  },
  {
    id: 'user-sneha',
    name: 'Sneha Reddy',
    email: 'sneha@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    bio: 'AI researcher and Python geek. Loving data and neural networks.',
    skills: ['Python', 'PyTorch', 'FastAPI', 'MLOps'],
    xp: 800,
    badges: ['Data Explorer'],
    referralCode: 'SNEHA50',
    referralsCount: 2,
    referralsEarnedXp: 100,
  },
  {
    id: 'user-arjun',
    name: 'Arjun Dev',
    email: 'arjun@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    bio: 'Product manager and organizer of tech meetups in Hyderabad.',
    skills: ['Product Strategy', 'Agile', 'Public Speaking'],
    xp: 1100,
    badges: ['Super Host', 'Community Builder'],
    referralCode: 'ARJUN22',
    referralsCount: 4,
    referralsEarnedXp: 200,
  },
  {
    id: 'user-vikram',
    name: 'Vikram Jain',
    email: 'vikram@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    bio: 'College senior, looking for hacker groups and web dev internships.',
    skills: ['HTML', 'CSS', 'JavaScript'],
    xp: 350,
    badges: ['Curious Learner'],
    referralCode: 'VIKRAM0',
    referralsCount: 0,
    referralsEarnedXp: 0,
  }
];

const SEED_EVENTS = [
  {
    id: 'event-hack-for-hyd',
    title: 'Hack For Hyderabad 2026',
    description: 'A 36-hour physical hackathon bringing together builders, designers, and creators to build tech solutions for local civic challenges. Mentors from Microsoft and SDC India will be on-site to guide teams. Food, drinks, and awesome swag are on us!',
    category: 'hackathon',
    coverType: 'gradient',
    coverUrl: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    coverEmoji: '🏆',
    date: '2026-07-16',
    time: '09:00',
    duration: '36 hours',
    locationType: 'physical',
    location: 'Microsoft Campus, Gachibowli, Hyderabad',
    hostId: 'user-arjun',
    hostName: 'Arjun Dev',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    ticketPrice: 0,
    capacity: 200,
    customQuestion: 'What is your T-shirt size? (S, M, L, XL)',
    isFeatured: true,
    speakers: [
      {
        id: 'spk-1',
        name: 'John Doe',
        role: 'Google Staff Engineer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
        linkedin: 'https://linkedin.com/in/johndoe'
      },
      {
        id: 'spk-2',
        name: 'Sarah Smith',
        role: 'Microsoft Principal Architect',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop',
        linkedin: 'https://linkedin.com/in/sarahsmith'
      }
    ],
    timeline: [
      { id: 't-1', time: '09:00 AM', title: 'Check-in & Registration', description: 'Get your badges, custom t-shirts, and check into the hacking bay.' },
      { id: 't-2', time: '10:00 AM', title: 'Opening Ceremony', description: 'Intro to tracks, rules, and keynote by Sarah Smith.' },
      { id: 't-3', time: '11:00 AM', title: 'Hacking Begins', description: 'Pitch ideas, form teams, and start code deployment.' },
      { id: 't-4', time: '01:00 PM', title: 'Networking Lunch', description: 'Buffet lunch in the cafeteria and mentor speed-dating.' },
      { id: 't-5', time: '09:00 PM', title: 'Midnight Coffee & Snacks', description: 'Keep the caffeine flowing for the overnight coding sprint.' }
    ]
  },
  {
    id: 'event-uiux-masterclass',
    title: 'UI/UX Design Masterclass & Portfolio Review',
    description: 'Learn the secrets of high-converting landing pages, grid systems, glassmorphism UI, and dark mode color palettes. In the second half, we will review submitted portfolios live and give concrete improvements. Registration includes access to Figma design system kits.',
    category: 'workshop',
    coverType: 'image',
    coverUrl: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=800&fit=crop',
    date: '2026-06-25',
    time: '14:00',
    duration: '4 hours',
    locationType: 'physical',
    location: 'SNIST Seminar Hall, Ghatkesar, Hyderabad',
    hostId: 'user-bhavitha',
    hostName: 'Bhavitha R',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    ticketPrice: 499,
    capacity: 5,
    customQuestion: 'Link to your current portfolio or Figma file:',
    isFeatured: true,
    speakers: [
      {
        id: 'spk-3',
        name: 'Bhavitha R',
        role: 'Senior UI/UX Designer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
        linkedin: 'https://linkedin.com/in/bhavitha'
      }
    ],
    timeline: [
      { id: 't-6', time: '02:00 PM', title: 'Visual Design Fundamentals', description: 'Hierarchy, modern layouts, spacing, and typography choices.' },
      { id: 't-7', time: '03:30 PM', title: 'Interactive Prototyping', description: 'Building advanced micro-interactions and transitions in Figma.' },
      { id: 't-8', time: '04:30 PM', title: 'Tea Break & Networking', description: 'Fresh tea, cookies, and chat with fellow designers.' },
      { id: 't-9', time: '05:00 PM', title: 'Live Portfolio Critiques', description: 'Reviewing 5 attendee portfolios on-screen with UX suggestions.' }
    ]
  },
  {
    id: 'event-rust-systems',
    title: 'Rust Systems Programming: Zero to Production',
    description: 'A deep-dive technical workshop on memory safety, concurrency primitives, and async tokio runtimes in Rust. Built for backend engineers looking to migrate microservices from Node.js/Go to Rust. Attendees will build an high-performance HTTP web server.',
    category: 'workshop',
    coverType: 'gradient',
    coverUrl: 'linear-gradient(135deg, #1e130c, #9a8478)',
    coverEmoji: '🦀',
    date: '2026-08-02',
    time: '10:00',
    duration: '6 hours',
    locationType: 'virtual',
    location: 'https://zoom.us/j/tech-rust-systems-101',
    hostId: 'user-rahul',
    hostName: 'Rahul Sharma',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    ticketPrice: 999,
    capacity: 100,
    customQuestion: 'What is your experience level in systems programming?',
    speakers: [
      {
        id: 'spk-4',
        name: 'Rahul Sharma',
        role: 'Systems Engineer at Cloudflare',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
        linkedin: 'https://linkedin.com/in/rahulrust'
      }
    ],
    timeline: [
      { id: 't-10', time: '10:00 AM', title: 'Understanding Borrow Checker', description: 'Ownership models, lifetimes, and safety rules.' },
      { id: 't-11', time: '12:00 PM', title: 'Multi-threaded Concurrency', description: 'Safe sharing of data, channels, Arc, and Mutex.' },
      { id: 't-12', time: '02:00 PM', title: 'Building the Server', description: 'Hands-on coding session using tokio and axum.' }
    ]
  },
  {
    id: 'event-rooftop-mixer',
    title: 'Sunset Rooftop Tech Mixer',
    description: 'No presentations, no agendas, just pure networking. Grab a drink, meet fellow founders, designers, and engineers in Hyderabad, and enjoy the sunset. Open to tech creators, students, and hobbyists.',
    category: 'social',
    coverType: 'image',
    coverUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&fit=crop',
    date: '2026-06-30',
    time: '17:30',
    duration: '3 hours',
    locationType: 'physical',
    location: 'Over the Moon Rooftop Cafe, Jubilee Hills, Hyderabad',
    hostId: 'user-sneha',
    hostName: 'Sneha Reddy',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    ticketPrice: 0,
    capacity: 50,
    speakers: [],
    timeline: [
      { id: 't-13', time: '05:30 PM', title: 'Welcome Drinks & Icebreaker', description: 'Grab your customized name card and networking category tag.' },
      { id: 't-14', time: '06:30 PM', title: 'Sunset Meetup & Pitch', description: 'Optional 60-second open-mic elevator pitch for projects/hiring.' },
      { id: 't-15', time: '07:30 PM', title: 'Social Mixer', description: 'Connect freely under the stars.' }
    ]
  }
];

const SEED_REGISTRATIONS = [
  {
    id: 'reg-1',
    eventId: 'event-hack-for-hyd',
    userId: 'user-bhavitha',
    userName: 'Bhavitha R',
    userEmail: 'bhavitha@example.com',
    timestamp: '2026-06-08T12:00:00Z',
    status: 'checked_in',
    customAnswer: 'M',
    teamName: 'Code Innovators',
    teamMembers: ['Bhavitha R', 'Rahul Sharma', 'Sneha Reddy']
  },
  {
    id: 'reg-2',
    eventId: 'event-hack-for-hyd',
    userId: 'user-rahul',
    userName: 'Rahul Sharma',
    userEmail: 'rahul@example.com',
    timestamp: '2026-06-08T12:05:00Z',
    status: 'going',
    customAnswer: 'L',
    teamName: 'Code Innovators',
    teamMembers: ['Bhavitha R', 'Rahul Sharma', 'Sneha Reddy']
  },
  {
    id: 'reg-3',
    eventId: 'event-hack-for-hyd',
    userId: 'user-sneha',
    userName: 'Sneha Reddy',
    userEmail: 'sneha@example.com',
    timestamp: '2026-06-08T12:10:00Z',
    status: 'going',
    customAnswer: 'S',
    teamName: 'Code Innovators',
    teamMembers: ['Bhavitha R', 'Rahul Sharma', 'Sneha Reddy']
  },
  {
    id: 'reg-4',
    eventId: 'event-uiux-masterclass',
    userId: 'user-rahul',
    userName: 'Rahul Sharma',
    userEmail: 'rahul@example.com',
    timestamp: '2026-06-09T10:00:00Z',
    status: 'checked_in',
    customAnswer: 'https://github.com/rahul',
    paymentId: 'pay_mock_rahul123'
  },
  {
    id: 'reg-5',
    eventId: 'event-uiux-masterclass',
    userId: 'user-sneha',
    userName: 'Sneha Reddy',
    userEmail: 'sneha@example.com',
    timestamp: '2026-06-09T10:05:00Z',
    status: 'going',
    customAnswer: 'https://behance.net/sneha',
    paymentId: 'pay_mock_sneha456'
  },
  {
    id: 'reg-6',
    eventId: 'event-uiux-masterclass',
    userId: 'user-arjun',
    userName: 'Arjun Dev',
    userEmail: 'arjun@example.com',
    timestamp: '2026-06-09T10:10:00Z',
    status: 'going',
    customAnswer: 'https://figma.com/@arjun',
    paymentId: 'pay_mock_arjun789'
  },
  {
    id: 'reg-7',
    eventId: 'event-uiux-masterclass',
    userId: 'user-vikram',
    userName: 'Vikram Jain',
    userEmail: 'vikram@example.com',
    timestamp: '2026-06-09T10:15:00Z',
    status: 'going',
    customAnswer: 'No portfolio yet, learning UI design!',
    paymentId: 'pay_mock_vikram101'
  },
  {
    id: 'reg-8',
    eventId: 'event-uiux-masterclass',
    userId: 'user-custom-host',
    userName: 'Pavan Kumar',
    userEmail: 'pavan@example.com',
    timestamp: '2026-06-09T10:20:00Z',
    status: 'going',
    customAnswer: 'figma.com/design-pavan',
    paymentId: 'pay_mock_pavan202'
  },
  {
    id: 'reg-9',
    eventId: 'event-uiux-masterclass',
    userId: 'user-bhavitha',
    userName: 'Bhavitha R',
    userEmail: 'bhavitha@example.com',
    timestamp: '2026-06-09T11:00:00Z',
    status: 'waitlist',
    waitlistNumber: 1,
    customAnswer: 'https://dribbble.com/bhavitha'
  }
];

const SEED_COMMENTS = [
  {
    id: 'com-1',
    eventId: 'event-hack-for-hyd',
    userId: 'user-rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    content: 'Super excited for this! Anyone wants to team up? I specialize in React + Node.js backend. Let me know!',
    timestamp: '2026-06-09T14:30:00Z'
  },
  {
    id: 'com-2',
    eventId: 'event-hack-for-hyd',
    userId: 'user-sneha',
    userName: 'Sneha Reddy',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    content: '@Rahul count me in! I work on ML/Python integrations. We should build a smart civic assistant!',
    timestamp: '2026-06-09T14:35:00Z'
  },
  {
    id: 'com-3',
    eventId: 'event-uiux-masterclass',
    userId: 'user-vikram',
    userName: 'Vikram Jain',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    content: 'Are we going to build full design systems in this class or just basic layouts?',
    timestamp: '2026-06-09T18:12:00Z'
  },
  {
    id: 'com-4',
    eventId: 'event-uiux-masterclass',
    userId: 'user-bhavitha',
    userName: 'Bhavitha R',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    content: '@Vikram we will cover visual framework tokens and building responsive component grids. You can submit your files beforehand!',
    timestamp: '2026-06-09T18:20:00Z'
  }
];

export const initializeStorage = () => {
  if (!localStorage.getItem(EVENTS_KEY)) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(SEED_EVENTS));
  }
  if (!localStorage.getItem(REGISTRATIONS_KEY)) {
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(SEED_REGISTRATIONS));
  }
  if (!localStorage.getItem(CURRENT_USER_KEY)) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(SEED_USERS[0]));
  }
  if (!localStorage.getItem(COMMENTS_KEY)) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(SEED_COMMENTS));
  }
  if (!localStorage.getItem(USERS_LIST_KEY)) {
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(SEED_USERS));
  }
};

// Events Api
export const getEvents = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
};

export const saveEvents = (events) => {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
};

// Registrations Api
export const getRegistrations = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '[]');
};

export const saveRegistrations = (registrations) => {
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
};

// Comments Api
export const getComments = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
};

export const saveComments = (comments) => {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
};

// Current User Api
export const getCurrentUser = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
};

export const saveCurrentUser = (user) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  
  // Also update in users list
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    saveUsers(users);
  }
};

// All Users Api
export const getUsers = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(USERS_LIST_KEY) || '[]');
};

export const saveUsers = (users) => {
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
};
