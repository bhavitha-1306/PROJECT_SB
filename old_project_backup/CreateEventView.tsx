import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, BadgeDollarSign, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Event, EventCategory, TimelineItem, Speaker } from '../types';

interface CreateEventViewProps {
  onCreateEvent: (newEvent: Event) => void;
  hostId: string;
  hostName: string;
  hostAvatar: string;
}

export const CreateEventView: React.FC<CreateEventViewProps> = ({
  onCreateEvent,
  hostId,
  hostName,
  hostAvatar,
}) => {
  const [step, setStep] = useState(1);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('meetup');
  const [description, setDescription] = useState('');
  const [coverType, setCoverType] = useState<'gradient' | 'image'>('gradient');
  const [coverUrl, setCoverUrl] = useState('linear-gradient(135deg, #0f2027, #203a43, #2c5364)');
  const [coverEmoji, setCoverEmoji] = useState('🔥');
  
  const [date, setDate] = useState('2026-07-20');
  const [time, setTime] = useState('14:00');
  const [duration, setDuration] = useState('3 hours');
  const [locationType, setLocationType] = useState<'physical' | 'virtual'>('physical');
  const [location, setLocation] = useState('');

  const [ticketPrice, setTicketPrice] = useState<number>(0);
  const [isPaid, setIsPaid] = useState(false);
  const [capacity, setCapacity] = useState<number>(100);
  const [customQuestion, setCustomQuestion] = useState('');

  const [timeline, setTimeline] = useState<TimelineItem[]>([
    { id: '1', time: '02:00 PM', title: 'Introductory Session', description: 'Kickoff and basic introduction' }
  ]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  // Predefined Gradients for cover selector
  const gradients = [
    { label: 'Cyberpunk Purple', value: 'linear-gradient(135deg, #6441a5, #2a0845)', emoji: '👾' },
    { label: 'Sunset Orange', value: 'linear-gradient(135deg, #f12711, #f5af19)', emoji: '🌅' },
    { label: 'Ocean Blue', value: 'linear-gradient(135deg, #2b5876, #4e4376)', emoji: '🌊' },
    { label: 'Emerald Glow', value: 'linear-gradient(135deg, #11998e, #38ef7d)', emoji: '🌿' },
    { label: 'Dark Carbon', value: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', emoji: '⚙️' }
  ];

  // Predefined unsplash covers for cover selector
  const imageCovers = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&fit=crop', // Conf
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&fit=crop', // Event Hall
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&fit=crop', // Work
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&fit=crop', // Meetup
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&fit=crop'  // Social
  ];

  // AI Prompt Parsing Algorithm
  const handleAiGeneration = () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);

    setTimeout(() => {
      const prompt = aiPrompt.toLowerCase();
      
      // Determine category
      let genCategory: EventCategory = 'meetup';
      let genEmoji = '🔥';
      let genCover = gradients[0].value;

      if (prompt.includes('hackathon') || prompt.includes('hack')) {
        genCategory = 'hackathon';
        genEmoji = '🏆';
        genCover = gradients[0].value; // Cyberpunk
      } else if (prompt.includes('workshop') || prompt.includes('class') || prompt.includes('learn') || prompt.includes('masterclass')) {
        genCategory = 'workshop';
        genEmoji = '🎓';
        genCover = gradients[3].value; // Emerald Glow
      } else if (prompt.includes('party') || prompt.includes('mixer') || prompt.includes('social') || prompt.includes('meetup')) {
        genCategory = prompt.includes('social') || prompt.includes('party') ? 'social' : 'meetup';
        genEmoji = prompt.includes('party') ? '🎉' : '💬';
        genCover = gradients[1].value; // Sunset
      }

      // Extract title/topic
      let genTitle = 'AI & Future Technology Meetup';
      if (prompt.includes('rust')) {
        genTitle = 'Rust Systems Coding Workshop';
        genEmoji = '🦀';
      } else if (prompt.includes('figma') || prompt.includes('ui') || prompt.includes('ux') || prompt.includes('design')) {
        genTitle = 'UI/UX Design Masterclass';
        genEmoji = '🎨';
      } else if (prompt.includes('web') || prompt.includes('react') || prompt.includes('frontend')) {
        genTitle = 'React Web Developers Hackday';
        genEmoji = '⚡';
      } else {
        // Try to generate title from prompt capitalization
        const cleanPrompt = aiPrompt.replace(/for \d+/g, '').replace(/at \w+/g, '').replace(/on \w+/g, '');
        genTitle = cleanPrompt.charAt(0).toUpperCase() + cleanPrompt.slice(1);
      }

      // Extract capacity
      let genCapacity = 100;
      const capacityMatch = prompt.match(/(\d+)\s*(people|students|attendees|participants|devs)/);
      if (capacityMatch && capacityMatch[1]) {
        genCapacity = parseInt(capacityMatch[1]);
      }

      // Extract location
      let genLocation = 'SNIST Campus, Ghatkesar, Hyderabad';
      if (prompt.includes('zoom') || prompt.includes('virtual') || prompt.includes('online') || prompt.includes('meet')) {
        setLocationType('virtual');
        genLocation = 'https://zoom.us/j/tech-ai-event-generator';
      } else {
        setLocationType('physical');
        const locations = ['snist', 'sdc', 'microsoft', 'gachibowli', 'jubilee hills'];
        const foundLoc = locations.find(loc => prompt.includes(loc));
        if (foundLoc) {
          if (foundLoc === 'snist') genLocation = 'SNIST Seminar Hall, Ghatkesar, Hyderabad';
          if (foundLoc === 'sdc') genLocation = 'SDC India Hub, Jubilee Hills, Hyderabad';
          if (foundLoc === 'microsoft') genLocation = 'Microsoft Campus, Gachibowli, Hyderabad';
        }
      }

      // Populate Agenda
      const genTimeline: TimelineItem[] = [
        { id: 't-1', time: '10:00 AM', title: 'Check-in & Registration', description: 'Scan QR tickets and collect badges.' },
        { id: 't-2', time: '11:00 AM', title: 'Hands-on Technical Sprint', description: 'Core learning tracks and live coding.' },
        { id: 't-3', time: '01:00 PM', title: 'Lunch & Open Networking', description: 'Fresh lunch buffet and tech matchmaking.' },
        { id: 't-4', time: '03:00 PM', title: 'Demo, Q&A and Feedback', description: 'Showcasing projects and distributing certificates.' }
      ];

      // Populate Speaker
      const genSpeakers: Speaker[] = [
        {
          id: 'sp-1',
          name: 'TechEvent Expert',
          role: 'Tech Lead / Host Coordinator',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
          linkedin: 'https://linkedin.com'
        }
      ];

      // Set states
      setTitle(genTitle);
      setCategory(genCategory);
      setCoverType('gradient');
      setCoverUrl(genCover);
      setCoverEmoji(genEmoji);
      setCapacity(genCapacity);
      setLocation(genLocation);
      setTimeline(genTimeline);
      setSpeakers(genSpeakers);
      setDescription(`Welcome to ${genTitle}! This event was generated by TechEvent AI. We will cover advanced techniques, live coding practices, networking breakouts, and career growth tips in the space. Join us for a fun and engaging tech experience.`);

      setIsAiGenerating(false);
      setStep(1); // Set to step 1 so they can preview and finalize!
      alert('AI successfully generated your event! Please review the details below.');
    }, 2000);
  };

  // Add Agenda Item
  const handleAddTimeline = () => {
    const nextId = (timeline.length + 1).toString();
    setTimeline([...timeline, { id: nextId, time: '03:00 PM', title: 'Session Topic', description: 'Add description here' }]);
  };

  // Remove Agenda Item
  const handleRemoveTimeline = (id: string) => {
    setTimeline(timeline.filter((item) => item.id !== id));
  };

  // Edit Timeline Fields
  const handleTimelineChange = (id: string, field: 'time' | 'title' | 'description', value: string) => {
    setTimeline(timeline.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  // Add Speaker
  const handleAddSpeaker = () => {
    const nextId = (speakers.length + 1).toString();
    setSpeakers([...speakers, { id: nextId, name: 'Speaker Name', role: 'Role Details', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120' }]);
  };

  // Remove Speaker
  const handleRemoveSpeaker = (id: string) => {
    setSpeakers(speakers.filter((s) => s.id !== id));
  };

  const handleSpeakerChange = (id: string, field: 'name' | 'role' | 'avatar' | 'linkedin', value: string) => {
    setSpeakers(speakers.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  // Handle Form Submit
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      alert('Please fill out the Event Title and Location!');
      return;
    }

    const newEvent: Event = {
      id: `event_${Math.random().toString(36).substring(2, 9)}`,
      title,
      description,
      category,
      coverType,
      coverUrl,
      coverEmoji: coverType === 'gradient' ? coverEmoji : undefined,
      date,
      time,
      duration,
      locationType,
      location,
      hostId,
      hostName,
      hostAvatar,
      ticketPrice: isPaid ? ticketPrice : 0,
      capacity,
      customQuestion: customQuestion.trim() || undefined,
      timeline,
      speakers
    };

    onCreateEvent(newEvent);
  };

  // 5% calculations
  const adminCommission = Math.round(ticketPrice * 0.05);
  const netEarnings = Math.max(0, ticketPrice - adminCommission);

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px', maxWidth: '768px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">Create Your Event</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Build a beautiful, Luma-style page to gather your tech community.
        </p>
      </div>

      {/* AI Assistant Creator Box */}
      <section className="sidebar-promo-widget" style={{ padding: '24px', background: 'rgba(5, 5, 5, 0.8)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} className="text-[#00ff9d]" style={{ animation: 'pulse 2s infinite' }} />
          <h3 className="promo-title">
            Create Event with AI
          </h3>
        </div>
        
        <p className="promo-desc">
          Describe your event details in plain language (e.g., *"AI workshop for 40 dev students at SNIST Seminar Hall on July 10"*). The AI will auto-populate the layout, agenda schedule, category covers, and descriptions!
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="E.g., Hackathon for 100 hackers at SDC India Hub with 3 speakers on August 5th"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            disabled={isAiGenerating}
            className="form-input"
            style={{ flexGrow: 1 }}
          />
          <button
            type="button"
            onClick={handleAiGeneration}
            disabled={isAiGenerating || !aiPrompt.trim()}
            className="btn-primary"
            style={{ padding: '8px 24px', fontSize: '13px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', opacity: isAiGenerating || !aiPrompt.trim() ? 0.5 : 1 }}
          >
            {isAiGenerating ? 'Generating...' : 'Generate ✨'}
          </button>
        </div>
      </section>

      {/* Steps Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12.5px', fontWeight: 'bold' }}>
        <span style={{ color: step === 1 ? 'var(--accent)' : 'var(--text-dim)' }}>1. Basic Details</span>
        <ArrowRight size={12} style={{ color: 'var(--text-dim)' }} />
        <span style={{ color: step === 2 ? 'var(--accent)' : 'var(--text-dim)' }}>2. Date & Venue</span>
        <ArrowRight size={12} style={{ color: 'var(--text-dim)' }} />
        <span style={{ color: step === 3 ? 'var(--accent)' : 'var(--text-dim)' }}>3. Admission & Speakers</span>
      </div>

      {/* Manual Form Wizard */}
      <form onSubmit={handleFinalSubmit} className="sidebar-card" style={{ padding: '32px' }}>
        
        {/* Step 1: Basic details */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 className="section-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} className="text-[#00ff9d]" /> Step 1: Basic Information
            </h3>

            {/* Event Title */}
            <div className="form-field">
              <label className="form-label">Event Title</label>
              <input
                type="text"
                required
                placeholder="E.g., Snist Dev Meetup v2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Grid for category & duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-field">
                <label className="form-label">Event Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="form-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="hackathon">Hackathon</option>
                  <option value="workshop">Workshop</option>
                  <option value="meetup">Meetup</option>
                  <option value="social">Social</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., 3 hours, 2 days"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-field">
              <label className="form-label">Event Description</label>
              <textarea
                required
                rows={4}
                placeholder="Give a detailed overview of what participants can expect..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Cover selector */}
            <div className="form-field" style={{ gap: '10px' }}>
              <label className="form-label">Page Banner Cover</label>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12.5px', fontWeight: 'bold' }}>
                <button
                  type="button"
                  onClick={() => setCoverType('gradient')}
                  className="btn-outline"
                  style={{
                    padding: '6px 16px',
                    borderRadius: 'var(--radius-sm)',
                    borderColor: coverType === 'gradient' ? 'var(--accent)' : 'var(--border)',
                    color: coverType === 'gradient' ? 'var(--accent)' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  Theme Gradient
                </button>
                <button
                  type="button"
                  onClick={() => setCoverType('image')}
                  className="btn-outline"
                  style={{
                    padding: '6px 16px',
                    borderRadius: 'var(--radius-sm)',
                    borderColor: coverType === 'image' ? 'var(--accent)' : 'var(--border)',
                    color: coverType === 'image' ? 'var(--accent)' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  Unsplash Cover
                </button>
              </div>

              {coverType === 'gradient' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {gradients.map((grad, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setCoverUrl(grad.value);
                        setCoverEmoji(grad.emoji);
                      }}
                      className="cover-grad-item"
                      style={{
                        background: grad.value,
                        height: '56px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justify-content: 'center',
                        fontSize: '20px',
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: coverUrl === grad.value ? 'var(--accent)' : 'transparent',
                        transform: coverUrl === grad.value ? 'scale(1.05)' : 'none',
                        transition: 'var(--transition)'
                      }}
                      title={grad.label}
                    >
                      {grad.emoji}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {imageCovers.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCoverUrl(imgUrl)}
                      style={{
                        height: '56px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: coverUrl === imgUrl ? 'var(--accent)' : 'transparent',
                        transform: coverUrl === imgUrl ? 'scale(1.05)' : 'none',
                        overflow: 'hidden',
                        transition: 'var(--transition)'
                      }}
                    >
                      <img src={imgUrl} alt="cover selection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

        {/* Step 2: Time & Venue */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 className="section-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} className="text-[#00ff9d]" /> Step 2: Time & Location Details
            </h3>

            {/* Grid for date & time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-field">
                <label className="form-label">Event Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Location Type Tabs */}
            <div className="form-field">
              <label className="form-label">Location Type</label>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12.5px', fontWeight: 'bold' }}>
                <button
                  type="button"
                  onClick={() => setLocationType('physical')}
                  className="btn-outline"
                  style={{
                    padding: '6px 16px',
                    borderRadius: 'var(--radius-sm)',
                    borderColor: locationType === 'physical' ? 'var(--accent)' : 'var(--border)',
                    color: locationType === 'physical' ? 'var(--accent)' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  Physical Venue
                </button>
                <button
                  type="button"
                  onClick={() => setLocationType('virtual')}
                  className="btn-outline"
                  style={{
                    padding: '6px 16px',
                    borderRadius: 'var(--radius-sm)',
                    borderColor: locationType === 'virtual' ? 'var(--accent)' : 'var(--border)',
                    color: locationType === 'virtual' ? 'var(--accent)' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  Virtual Link
                </button>
              </div>
            </div>

            {/* Location Value */}
            <div className="form-field">
              <label className="form-label">
                {locationType === 'physical' ? 'Physical Address / Venue Name' : 'Video Conference Link (Zoom / Meet)'}
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={locationType === 'physical' ? 'E.g., SNIST Seminar Hall, Ghatkesar' : 'E.g., https://zoom.us/j/1234'}
                className="form-input"
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-outline"
                style={{ padding: '10px 24px', fontSize: '13px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ArrowLeft size={13} /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '13px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Next Step <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Admission, Timeline, Speakers */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 className="section-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BadgeDollarSign size={16} className="text-[#00ff9d]" /> Step 3: Admission & Speakers
            </h3>

            {/* Pricing Section & Admin Split */}
            <div className="sidebar-promo-widget" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 className="promo-title">Paid Admission</h4>
                  <p className="promo-desc">Charge attendees for workshops & webinars</p>
                </div>
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                  style={{ cursor: 'pointer', accentColor: 'var(--accent)', width: '18px', height: '18px' }}
                />
              </div>

              {isPaid && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                    <span className="form-label">Ticket Fee (₹):</span>
                    <input
                      type="number"
                      min={0}
                      value={ticketPrice}
                      onChange={(e) => setTicketPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="form-input"
                      style={{ width: '120px', fontFamily: 'monospace' }}
                    />
                  </div>
                  
                  {/* Payout Breakdown */}
                  <div className="analytics-card" style={{ padding: '16px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg-primary)' }}>
                    <p className="analytics-label" style={{ fontSize: '10.5px' }}>Admin Commission Fee Split (5%)</p>
                    <div className="analytics-receipt-split" style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      <span>Gross ticket charge:</span>
                      <span>₹{ticketPrice}</span>
                    </div>
                    <div className="analytics-receipt-split" style={{ fontSize: '12.5px', color: 'var(--warning)' }}>
                      <span>Admin commission cut (5%):</span>
                      <span>-₹{adminCommission}</span>
                    </div>
                    <div className="analytics-receipt-split" style={{ fontSize: '13.5px', color: 'var(--accent)', fontWeight: 'bold', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                      <span>Your Net Organiser payout:</span>
                      <span>₹{netEarnings}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Capacity & Custom Question */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-field">
                <label className="form-label">Seat Capacity</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Custom RSVP Question (Optional)</label>
                <input
                  type="text"
                  placeholder="E.g., Your Figma Profile link"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Timeline Agenda Builder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <label className="form-label" style={{ margin: 0 }}>Timeline Schedule (Agenda)</label>
                <button
                  type="button"
                  onClick={handleAddTimeline}
                  className="guest-action-btn"
                >
                  <Plus size={12} /> Add Session
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                {timeline.map((item, index) => (
                  <div key={item.id} className="analytics-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '12px' }}>Session #{index + 1}</span>
                      {timeline.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTimeline(item.id)}
                          style={{ color: 'var(--error)', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Time (e.g. 02:00 PM)"
                        value={item.time}
                        onChange={(e) => handleTimelineChange(item.id, 'time', e.target.value)}
                        className="form-input"
                        style={{ padding: '8px 10px', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        placeholder="Session Title"
                        value={item.title}
                        onChange={(e) => handleTimelineChange(item.id, 'title', e.target.value)}
                        className="form-input"
                        style={{ padding: '8px 10px', fontSize: '12px' }}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Session Description"
                      value={item.description}
                      onChange={(e) => handleTimelineChange(item.id, 'description', e.target.value)}
                      className="form-input"
                      style={{ padding: '8px 10px', fontSize: '12px' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Speakers Profiles Builder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <label className="form-label" style={{ margin: 0 }}>Speakers Profiles</label>
                <button
                  type="button"
                  onClick={handleAddSpeaker}
                  className="guest-action-btn"
                >
                  <Plus size={12} /> Add Speaker
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                {speakers.map((s, index) => (
                  <div key={s.id} className="analytics-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '12px' }}>Speaker #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpeaker(s.id)}
                        style={{ color: 'var(--error)', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Speaker Name"
                        value={s.name}
                        onChange={(e) => handleSpeakerChange(s.id, 'name', e.target.value)}
                        className="form-input"
                        style={{ padding: '8px 10px', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        placeholder="Speaker Role/Company"
                        value={s.role}
                        onChange={(e) => handleSpeakerChange(s.id, 'role', e.target.value)}
                        className="form-input"
                        style={{ padding: '8px 10px', fontSize: '12px' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Avatar URL"
                        value={s.avatar}
                        onChange={(e) => handleSpeakerChange(s.id, 'avatar', e.target.value)}
                        className="form-input"
                        style={{ padding: '8px 10px', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        placeholder="LinkedIn Link (Optional)"
                        value={s.linkedin || ''}
                        onChange={(e) => handleSpeakerChange(s.id, 'linkedin', e.target.value)}
                        className="form-input"
                        style={{ padding: '8px 10px', fontSize: '12px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-outline"
                style={{ padding: '10px 24px', fontSize: '13px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ArrowLeft size={13} /> Back
              </button>
              
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '10px 28px', fontSize: '13px', fontWeight: 'bold', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Publish Event 🚀
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
