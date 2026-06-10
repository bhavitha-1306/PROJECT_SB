import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowLeft, Sparkles, AlertTriangle, ShieldCheck, Download } from 'lucide-react';
import type { Event, UserProfile, Registration, Comment } from '../types';
import { CheckoutModal } from '../components/CheckoutModal';
import { getComments, saveComments } from '../utils/storage';

interface EventDetailsViewProps {
  event: Event;
  registrations: Registration[];
  onBack: () => void;
  currentUser: UserProfile;
  onRegister: (eventId: string, customAnswer: string, teamName?: string, teamMembers?: string[], referralCode?: string, paymentId?: string) => void;
}

export const EventDetailsView: React.FC<EventDetailsViewProps> = ({
  event,
  registrations,
  onBack,
  currentUser,
  onRegister,
}) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [customAnswer, setCustomAnswer] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamMembersInput, setTeamMembersInput] = useState('');
  const [referralCodeInput, setReferralCodeInput] = useState('');
  
  // Tabs for Details vs Chat
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');

  // Chat/Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  // AI Assistant Chat state
  const [aiMessages, setAiMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: `Hi! I am the TechEvent AI Assistant for ${event.title}. Ask me anything about the agenda, venue, parking, or speakers!` }
  ]);
  const [aiInput, setAiInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Load comments
  useEffect(() => {
    const allComments = getComments();
    const eventComments = allComments.filter((c) => c.eventId === event.id);
    setComments(eventComments);
  }, [event.id]);

  // Scroll to bottom of chat/ai logs
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, comments]);

  // Countdown timer calculation
  useEffect(() => {
    const target = new Date(`${event.date}T${event.time}:00`);
    const interval = setInterval(() => {
      const difference = target.getTime() - new Date().getTime();
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [event.date, event.time]);

  // Check Registration Status
  const userRegistration = registrations.find(
    (r) => r.eventId === event.id && r.userId === currentUser.id
  );

  const isGoing = userRegistration?.status === 'going' || userRegistration?.status === 'checked_in';
  const isWaitlisted = userRegistration?.status === 'waitlist';
  const isCheckedIn = userRegistration?.status === 'checked_in';

  // Capacity checks
  const approvedRegistrationsCount = registrations.filter(
    (r) => r.eventId === event.id && (r.status === 'going' || r.status === 'checked_in')
  ).length;

  const isFull = approvedRegistrationsCount >= event.capacity;

  // Handles Registration Form Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (event.ticketPrice > 0) {
      setShowCheckout(true);
    } else {
      processRegistration();
    }
  };

  const processRegistration = (paymentId?: string) => {
    const parsedMembers = teamMembersInput
      ? teamMembersInput.split(',').map((m) => m.trim())
      : undefined;

    onRegister(
      event.id,
      customAnswer,
      teamName || undefined,
      parsedMembers,
      referralCodeInput || undefined,
      paymentId
    );
    setShowCheckout(false);
  };

  // Chat Comment Submit
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: `com_${Math.random().toString(36).substring(2, 9)}`,
      eventId: event.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
    };

    const allComments = getComments();
    const updated = [newCommentObj, ...allComments];
    saveComments(updated);
    setComments((prev) => [newCommentObj, ...prev]);
    setNewComment('');
  };

  // AI assistant answering model
  const askAIAssistant = (question: string) => {
    const qLower = question.toLowerCase();
    let answer = `I'm sorry, I don't have details about that specific question for ${event.title}. Feel free to contact the host ${event.hostName}!`;

    // Rules matching
    if (qLower.includes('start') || qLower.includes('when') || qLower.includes('date') || qLower.includes('time')) {
      const dateStr = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
      answer = `The event starts on ${dateStr} at ${event.time}. The duration is ${event.duration}.`;
    } else if (qLower.includes('where') || qLower.includes('venue') || qLower.includes('location') || qLower.includes('address')) {
      if (event.locationType === 'virtual') {
        answer = `This is a virtual event. Registered attendees can access the link here: ${event.location}.`;
      } else {
        answer = `The physical venue is: ${event.location}. It is hosted at ${event.location.split(',')[0]}.`;
      }
    } else if (qLower.includes('parking')) {
      if (event.locationType === 'virtual') {
        answer = `This is a virtual event, so no physical parking is needed! Just join via the Zoom link.`;
      } else {
        answer = `Basement Parking is available for free for all registered guests near the main block at the venue. Please show your TechEvent QR ticket at the gate.`;
      }
    } else if (qLower.includes('price') || qLower.includes('fee') || qLower.includes('cost') || qLower.includes('pay')) {
      answer = event.ticketPrice === 0 
        ? `This event is completely free! Direct registration is open.`
        : `The ticket fee is ₹${event.ticketPrice}. Note that a simulated 5% admin platform fee is calculated during checkout.`;
    } else if (qLower.includes('speaker') || qLower.includes('host') || qLower.includes('who is')) {
      if (event.speakers.length > 0) {
        const names = event.speakers.map((s) => `${s.name} (${s.role})`).join(', ');
        answer = `The event is hosted by ${event.hostName}. Featured speakers include: ${names}.`;
      } else {
        answer = `This event is hosted by ${event.hostName}. There are no other listed external speakers.`;
      }
    } else if (qLower.includes('lunch') || qLower.includes('food') || qLower.includes('drink') || qLower.includes('snack') || qLower.includes('schedule') || qLower.includes('agenda') || qLower.includes('timeline')) {
      // Find matching items in agenda
      const matchingAgendas = event.timeline.filter(t => 
        t.title.toLowerCase().includes(qLower) || 
        t.description.toLowerCase().includes(qLower) ||
        qLower.includes('schedule') || qLower.includes('agenda')
      );
      
      if (matchingAgendas.length > 0 && !qLower.includes('schedule') && !qLower.includes('agenda')) {
        const items = matchingAgendas.map(t => `${t.time} - ${t.title}: ${t.description}`).join('\n\n');
        answer = `Here is what I found in the schedule:\n\n${items}`;
      } else if (event.timeline.length > 0) {
        const schedule = event.timeline.map(t => `${t.time} · ${t.title}`).join('\n');
        answer = `Here is the official agenda:\n${schedule}`;
      } else {
        answer = `The agenda details haven't been fully populated yet. Check the main event page details for information!`;
      }
    }

    setAiMessages((prev) => [...prev, { sender: 'ai', text: answer }]);
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput.trim();
    setAiMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setAiInput('');

    // Simulate AI typing delay
    setTimeout(() => {
      askAIAssistant(userMsg);
    }, 600);
  };

  // Quick prompt selection for AI Assistant
  const quickAiPrompts = [
    'What is the schedule?',
    event.locationType === 'physical' ? 'Where is the parking?' : 'How do I join?',
    'Who are the speakers?',
    'Is there a fee?'
  ];

  return (
    <div className="container" style={{ paddingTop: '24px', paddingBottom: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="btn-outline"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', cursor: 'pointer' }}
      >
        <ArrowLeft size={14} /> Back to Discover
      </button>

      {/* Main Content Layout */}
      <div className="details-grid">
        {/* Left Columns (Event details / Chat Tabs) */}
        <div className="details-main">
          {/* Header Card */}
          <div
            className="details-hero"
            style={
              event.coverType === 'gradient'
                ? { background: event.coverUrl }
                : {
                    backgroundImage: `url(${event.coverUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
            }
          >
            <div className="hero-overlay-shadow" />
            <div className="details-hero-content">
              <span className="details-hero-badge">
                {event.category}
              </span>
              <h1 className="details-hero-title">
                {event.title}
              </h1>
              <div className="details-meta-row">
                <span className="details-meta-item">
                  <Calendar size={14} className="text-[#00ff9d]" />
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="details-meta-item">
                  <Clock size={14} className="text-[#00ff9d]" />
                  {event.time} ({event.duration})
                </span>
                <span className="details-meta-item">
                  <MapPin size={14} className="text-[#00ff9d]" />
                  {event.locationType === 'virtual' ? 'Virtual' : event.location.split(',')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation tabs for Details vs Chat */}
          <div className="details-tabs">
            <button
              onClick={() => setActiveTab('details')}
              className="details-tab"
              style={{
                color: activeTab === 'details' ? 'var(--accent)' : 'var(--text-muted)',
                borderColor: activeTab === 'details' ? 'var(--accent)' : 'transparent',
              }}
            >
              Event Details
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className="details-tab"
              style={{
                color: activeTab === 'chat' ? 'var(--accent)' : 'var(--text-muted)',
                borderColor: activeTab === 'chat' ? 'var(--accent)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Guest Wall
              {comments.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] text-neutral-300" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)' }}>
                  {comments.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Event Description */}
              <div className="section-block">
                <h3 className="section-title">About Event</h3>
                <p className="details-desc">
                  {event.description}
                </p>
              </div>

              {/* Event Timeline (Agenda) */}
              {event.timeline && event.timeline.length > 0 && (
                <div className="section-block">
                  <h3 className="section-title">Event Agenda</h3>
                  <div className="timeline-list">
                    {event.timeline.map((item) => (
                      <div key={item.id} className="timeline-item">
                        <div className="timeline-dot" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div>
                            <span className="timeline-time">
                              {item.time}
                            </span>
                          </div>
                          <h4 className="timeline-title">{item.title}</h4>
                          <p className="timeline-desc">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Speaker Profiles */}
              {event.speakers && event.speakers.length > 0 && (
                <div className="section-block">
                  <h3 className="section-title">Event Speakers</h3>
                  <div className="speaker-grid">
                    {event.speakers.map((speaker) => (
                      <div
                        key={speaker.id}
                        className="speaker-card"
                      >
                        <img
                          src={speaker.avatar}
                          alt={speaker.name}
                          className="speaker-avatar"
                        />
                        <div className="speaker-details">
                          <h4 className="speaker-name">{speaker.name}</h4>
                          <p className="speaker-role">{speaker.role}</p>
                          {speaker.linkedin && (
                            <a
                              href={speaker.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="speaker-linkedin"
                            >
                              LinkedIn Profile ↗
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Chat / Guestbook Content */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="guestbook-card">
                <h3 className="section-title" style={{ fontSize: '14.5px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Guest Board & Chat
                </h3>
                {isGoing ? (
                  <form onSubmit={handleCommentSubmit} className="guest-post-form">
                    <input
                      type="text"
                      placeholder="Write a message to the wall..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="guest-post-input"
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '12.5px' }}>
                      Post
                    </button>
                  </form>
                ) : (
                  <div className="p-3 text-center bg-neutral-900/60 rounded-lg text-xs text-neutral-400 border border-neutral-800 flex items-center justify-center gap-1.5" style={{ background: 'rgba(255, 255, 255, 0.02)', borderColor: 'var(--border)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={14} className="text-amber-500" /> RSVP for this event to write on the guest board.
                  </div>
                )}

                <div className="guest-posts-list">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="guest-comment-card"
                      >
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="comment-avatar"
                        />
                        <div className="comment-content-wrapper">
                          <div className="comment-meta">
                            <span className="comment-author-name">{comment.userName}</span>
                            <span className="comment-time">
                              {new Date(comment.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="comment-text">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-xs text-neutral-500 py-6" style={{ color: 'var(--text-dim)', fontSize: '12px', padding: '24px 0' }}>
                      No posts on the board yet. Be the first to start the conversation!
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: RSVP Actions / Stats Sidebar / AI Chatbot */}
        <div className="details-sidebar">
          {/* Ticket Registration Box */}
          <div className="sidebar-card">
            {/* Price Header */}
            <div className="sidebar-ticket-header">
              <div>
                <p className="ticket-header-title">Admission Ticket</p>
                <p className="ticket-header-price">
                  {event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="ticket-header-title">Capacity Left</p>
                <p className="ticket-capacity-left">
                  {Math.max(0, event.capacity - approvedRegistrationsCount)} / {event.capacity}
                </p>
              </div>
            </div>

            {/* Countdown widget */}
            <div className="countdown-box">
              <div>
                <div className="countdown-val">{timeLeft.days}</div>
                <div className="countdown-lbl">Days</div>
              </div>
              <div>
                <div className="countdown-val">{timeLeft.hours}</div>
                <div className="countdown-lbl">Hrs</div>
              </div>
              <div>
                <div className="countdown-val">{timeLeft.minutes}</div>
                <div className="countdown-lbl">Mins</div>
              </div>
              <div>
                <div className="countdown-val">{timeLeft.seconds}</div>
                <div className="countdown-lbl">Secs</div>
              </div>
            </div>

            {/* Registration State Controller */}
            {isCheckedIn ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="sidebar-status-pill sidebar-status-success">
                  <ShieldCheck size={16} /> Verified Attendee · Checked In
                </div>
                <button
                  onClick={() => alert("Digital Certificate will print. Use the Certificate view under profile!")}
                  className="btn-outline"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', padding: '10px', borderRadius: 'var(--radius-sm)', color: 'var(--accent)', cursor: 'pointer' }}
                >
                  <Download size={14} /> Certificate Unlocked
                </button>
              </div>
            ) : isGoing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="sidebar-status-pill sidebar-status-info">
                  <ShieldCheck size={16} /> Registered Successfully!
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Your ticket details and QR check-in pass are available in your **Dashboard**.
                </p>
              </div>
            ) : isWaitlisted ? (
              <div className="sidebar-status-pill sidebar-status-warning" style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', alignItems: 'flex-start', padding: '12px' }}>
                <p style={{ alignSelf: 'flex-start', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> You are on the Waitlist
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Your current waitlist index: <strong style={{ color: '#fff' }}>#{userRegistration?.waitlistNumber}</strong>. We will notify you if a host releases a seat!
                </p>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleRegisterSubmit} className="details-form">
                {event.customQuestion && (
                  <div className="form-field">
                    <label className="form-label">
                      {event.customQuestion}
                    </label>
                    <input
                      type="text"
                      required
                      value={customAnswer}
                      onChange={(e) => setCustomAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="form-input"
                    />
                  </div>
                )}

                {/* Team registration if Hackathon */}
                {event.category === 'hackathon' && (
                  <div className="team-section">
                    <p className="team-section-title">Team Registration</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Team Name (e.g. Code Innovators)"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="form-input"
                        style={{ padding: '8px 10px', fontSize: '11.5px' }}
                      />
                      <input
                        type="text"
                        placeholder="Invite Member Emails (comma-separated)"
                        value={teamMembersInput}
                        onChange={(e) => setTeamMembersInput(e.target.value)}
                        className="form-input"
                        style={{ padding: '8px 10px', fontSize: '11.5px' }}
                      />
                    </div>
                  </div>
                )}

                {/* Referral Code input */}
                <div className="form-field">
                  <label className="form-label">
                    Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={referralCodeInput}
                    onChange={(e) => setReferralCodeInput(e.target.value)}
                    placeholder="Enter friend's referral code"
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '13px', fontWeight: '700', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                >
                  {isFull ? 'Join Waitlist (No fee)' : event.ticketPrice > 0 ? `Register & Pay ₹${event.ticketPrice}` : 'Register (FREE)'}
                </button>
              </form>
            )}
          </div>

          {/* Referral system promo widget */}
          <div className="sidebar-promo-widget">
            <p className="promo-title">
              <Users size={14} className="text-[#00ff9d]" /> Invite & Earn XP
            </p>
            <p className="promo-desc">
              Share your custom code <strong className="text-[#00ff9d]">{currentUser.referralCode}</strong> with friends. When they register using your code, both earn 50 XP!
            </p>
          </div>

          {/* AI assistant Chat Widget */}
          <div className="ai-assistant-widget">
            <div className="ai-widget-header">
              <Sparkles className="text-[#00ff9d]" size={15} style={{ animation: 'pulse 2s infinite' }} />
              <h4 className="ai-widget-title">
                AI Event Assistant
              </h4>
            </div>

            {/* Chat Box */}
            <div className="ai-chat-box">
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`ai-msg ${msg.sender === 'user' ? 'ai-msg-user' : 'ai-msg-assistant'}`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick prompts chips */}
            <div className="ai-prompt-chips">
              {quickAiPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAiMessages((prev) => [...prev, { sender: 'user', text: p }]);
                    setTimeout(() => askAIAssistant(p), 600);
                  }}
                  className="ai-prompt-chip"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Prompt form */}
            <form onSubmit={handleAiSubmit} className="ai-chat-input-form">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask assistant..."
                className="ai-chat-input"
              />
              <button
                type="submit"
                className="ai-send-btn"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Checkout Portal Simulation */}
      {showCheckout && (
        <CheckoutModal
          event={event}
          onClose={() => setShowCheckout(false)}
          onSuccess={(payId) => processRegistration(payId)}
        />
      )}
    </div>
  );
};
