const WRITERS_KEY = 'inklink_writers';

const DEFAULT_WRITERS = [
  {
    id: '1',
    name: 'Neha Sharma',
    email: 'neha@inklink.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
    style: 'Elegant Cursive',
    background: 'BSc Chemistry Graduate',
    rating: 4.9,
    rate: 35,
    completed: 184,
    sampleText: 'Hydrogen bonds form when a hydrogen atom covalently bonded to a highly electronegative atom...',
    images: []
  },
  {
    id: '2',
    name: 'Arjun Verma',
    email: 'arjun@inklink.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80',
    style: 'Neat Block Print',
    background: 'Engineering Student',
    rating: 4.8,
    rate: 30,
    completed: 215,
    sampleText: 'Integrate the function f(x) = 3x^2 + 2x from x=0 to x=5. Using the fundamental theorem of calculus...',
    images: []
  },
  {
    id: '3',
    name: 'Pooja Singh',
    email: 'pooja@inklink.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    style: 'Stylized Script',
    background: 'BA English Literature',
    rating: 5.0,
    rate: 50,
    completed: 96,
    sampleText: 'The theme of duality in Stevenson\'s novel is primarily represented through the physical transformation...',
    images: []
  },
  {
    id: '4',
    name: 'Ravi Patel',
    email: 'ravi@inklink.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    style: 'Student Handwriting',
    background: 'BCom Accounts Major',
    rating: 4.7,
    rate: 25,
    completed: 312,
    sampleText: 'Ledger Entry: Debit Cash Account, Credit Accounts Receivable. All balances are verified with worksheets.',
    images: []
  }
];

export const getWriters = () => {
  const data = localStorage.getItem(WRITERS_KEY);
  if (!data) {
    localStorage.setItem(WRITERS_KEY, JSON.stringify(DEFAULT_WRITERS));
    return DEFAULT_WRITERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Error parsing writers data from localStorage", e);
    return DEFAULT_WRITERS;
  }
};

export const saveWriters = (writers) => {
  localStorage.setItem(WRITERS_KEY, JSON.stringify(writers));
};

export const registerOrGetWriter = (user) => {
  if (!user || user.role !== 'writer') return null;
  const writers = getWriters();
  const email = user.email || `${user.name.toLowerCase().replace(/\s+/g, '')}@inklink.com`;
  
  let writer = writers.find(w => w.email.toLowerCase() === email.toLowerCase());
  
  if (!writer) {
    // Generate random avatar
    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    
    writer = {
      id: `writer_${Date.now()}`,
      name: user.name,
      email: email,
      avatar: user.avatar || randomAvatar,
      style: user.details?.penmanship || 'Elegant Cursive',
      background: user.details?.background || 'Vetted Penman',
      rating: 5.0,
      rate: 30, // default page rate
      completed: 0,
      sampleText: 'The quick brown fox jumps over the lazy dog. Writing out custom academic assignments professionally.',
      images: []
    };
    writers.push(writer);
    saveWriters(writers);
  }
  
  return writer;
};

export const updateWriterProfile = (email, updatedFields) => {
  if (!email) return null;
  const writers = getWriters();
  const index = writers.findIndex(w => w.email.toLowerCase() === email.toLowerCase());
  
  if (index !== -1) {
    writers[index] = {
      ...writers[index],
      ...updatedFields
    };
    saveWriters(writers);
    return writers[index];
  }
  return null;
};
