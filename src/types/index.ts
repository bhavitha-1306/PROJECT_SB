export type UserRole = 'attendee' | 'organiser' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  skills: string[];
  xp: number;
  badges: string[];
  referralCode: string;
  referralsCount: number;
  referralsEarnedXp: number;
}

export type EventCategory = 'hackathon' | 'workshop' | 'meetup' | 'social';

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  avatar: string;
  linkedin?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  coverType: 'gradient' | 'image';
  coverUrl: string; // CSS background gradient or image URL
  coverEmoji?: string; // Emoji to overlay on gradient cover
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: string; // e.g., "2 hours", "48 hours"
  locationType: 'physical' | 'virtual';
  location: string; // Map address or Video call link
  hostId: string;
  hostName: string;
  hostAvatar: string;
  ticketPrice: number; // 0 for free
  capacity: number;
  customQuestion?: string; // e.g. "What is your T-shirt size?"
  timeline: TimelineItem[];
  speakers: Speaker[];
  isFeatured?: boolean;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  status: 'going' | 'waitlist' | 'checked_in';
  waitlistNumber?: number;
  customAnswer?: string;
  teamName?: string;
  teamMembers?: string[];
  referralCodeUsed?: string;
  paymentId?: string;
}

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export interface GlobalStats {
  totalEvents: number;
  totalRegistrations: number;
  totalSalesVolume: number; // Gross payments
  totalAdminCommission: number; // 5% of gross payments
}
