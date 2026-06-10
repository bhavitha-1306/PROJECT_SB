import React, { useState, useEffect } from 'react';
import { Search, Trophy, Sparkles, Filter } from 'lucide-react';
import type { Event, UserProfile, Registration, EventCategory } from '../types';
import { EventCard } from '../components/EventCard';
import { getUsers } from '../utils/storage';

interface ExploreViewProps {
  events: Event[];
  registrations: Registration[];
  onEventClick: (eventId: string) => void;
  currentUser: UserProfile;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  events,
  registrations,
  onEventClick,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [showOnlyFree, setShowOnlyFree] = useState(false);
  const [showOnlyRecommended, setShowOnlyRecommended] = useState(false);
  const [leaderboardUsers, setLeaderboardUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    // Load users from storage and sort by XP for leaderboard
    const users = getUsers();
    const sorted = [...users].sort((a, b) => b.xp - a.xp);
    setLeaderboardUsers(sorted);
  }, [events, registrations]); // Reload when events/registrations change

  // Filter Events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.hostName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;

    const matchesFree = !showOnlyFree || event.ticketPrice === 0;

    // Recommendation logic based on matching tags / skills
    const matchesRecommended =
      !showOnlyRecommended ||
      currentUser.skills.some((skill) =>
        event.title.toLowerCase().includes(skill.toLowerCase()) ||
        event.description.toLowerCase().includes(skill.toLowerCase())
      );

    return matchesSearch && matchesCategory && matchesFree && matchesRecommended;
  });


  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Hero Section */}
      <section className="explore-hero">
        <div className="hero-badge">
          <span className="pulse-dot" />
          HACK FOR HYDERABAD · July 16
        </div>
        
        <h1 className="hero-title">
          Run your next <br />
          <span className="gradient-text">tech event</span> like clockwork.
        </h1>
        
        <p className="hero-desc">
          Beautiful event pages, instant payment gateway, waitlists, QR check-in, certificates, and leaderboard. Built for tech communities in India.
        </p>
      </section>

      {/* Main Exploration Grid */}
      <div className="explore-layout">
        {/* Left Columns: Discovery Controls & Events */}
        <div className="explore-main">
          {/* Controls Bar */}
          <div className="search-filter-bar">
            {/* Search */}
            <div className="search-input-wrapper">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search events, locations, or hosts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            {/* Category selection */}
            <div className="category-tabs">
              {(['all', 'hackathon', 'workshop', 'meetup', 'social'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="category-tab"
                  style={{
                    background: selectedCategory === cat ? 'rgba(0, 255, 157, 0.05)' : 'var(--bg-secondary)',
                    borderColor: selectedCategory === cat ? 'var(--accent)' : 'var(--border)',
                    color: selectedCategory === cat ? 'var(--accent)' : 'var(--text-muted)',
                  }}
                >
                  {cat === 'all' ? 'All Events' : `${cat}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Chips row */}
          <div className="filter-chips">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={12} /> Filters:
            </span>
            <button
              onClick={() => setShowOnlyFree(!showOnlyFree)}
              className="filter-chip"
              style={{
                borderColor: showOnlyFree ? 'var(--accent)' : 'var(--border)',
                color: showOnlyFree ? 'var(--accent)' : 'var(--text-muted)',
                background: showOnlyFree ? 'rgba(0, 255, 157, 0.05)' : 'transparent',
              }}
            >
              Free Workshops & Events
            </button>
            <button
              onClick={() => setShowOnlyRecommended(!showOnlyRecommended)}
              className="filter-chip"
              style={{
                borderColor: showOnlyRecommended ? 'var(--accent)' : 'var(--border)',
                color: showOnlyRecommended ? 'var(--accent)' : 'var(--text-muted)',
                background: showOnlyRecommended ? 'rgba(0, 255, 157, 0.05)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={11} />
              Recommended for You
            </button>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="event-grid">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  registrations={registrations}
                  onClick={() => onEventClick(event.id)}
                />
              ))}
            </div>
          ) : (
            <div
              className="p-12 text-center rounded-xl border text-neutral-400 text-sm space-y-2"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              <Sparkles className="mx-auto text-neutral-600" size={32} />
              <p className="font-semibold text-white">No events found</p>
              <p className="text-xs">Try searching for a different keyword or resetting your filters.</p>
            </div>
          )}
        </div>

        {/* Right Column: Leaderboard Widget */}
        <div className="sidebar-leaderboard">
          <div className="leaderboard-header">
            <Trophy className="text-[#00ff9d]" size={18} />
            <h3 className="leaderboard-title">
              Global Leaderboard
            </h3>
          </div>
          
          <p className="leaderboard-desc">
            Earn XP by hosting events (+200 XP), attending (+100 XP), checking in (+50 XP), or referring friends (+50 XP).
          </p>

          <div className="leaderboard-list">
            {leaderboardUsers.slice(0, 5).map((user, idx) => {
              const getRankColor = () => {
                switch (idx) {
                  case 0:
                    return '#f59e0b'; // Gold
                  case 1:
                    return '#94a3b8'; // Silver
                  case 2:
                    return '#b45309'; // Bronze
                  default:
                    return 'var(--text-dim)';
                }
              };

              return (
                <div key={user.id} className="leaderboard-item">
                  <div className="leaderboard-user-info">
                    <span className="leaderboard-rank" style={{ color: getRankColor() }}>
                      {idx + 1}
                    </span>
                    <img src={user.avatar} alt={user.name} className="leaderboard-avatar" />
                    <div className="leaderboard-name-wrapper">
                      <p className="leaderboard-name">{user.name}</p>
                      <p className="leaderboard-skill">{user.skills[0] || 'Member'}</p>
                    </div>
                  </div>
                  <span className="leaderboard-xp-badge">
                    {user.xp} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
