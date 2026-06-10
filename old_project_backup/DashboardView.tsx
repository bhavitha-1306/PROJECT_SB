import React, { useState } from 'react';
import { Calendar, MapPin, Users, Ticket, BarChart3, QrCode, Download, UserCheck, AlertTriangle, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import type { Event, Registration, UserProfile } from '../types';

interface DashboardViewProps {
  events: Event[];
  registrations: Registration[];
  currentUser: UserProfile;
  onCheckInAttendee: (registrationId: string) => void;
  onReleaseWaitlistSeat: (eventId: string, registrationId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  events,
  registrations,
  currentUser,
  onCheckInAttendee,
  onReleaseWaitlistSeat,
}) => {
  const [activeTab, setActiveTab] = useState<'attending' | 'hosting'>('attending');
  const [selectedHostedEventId, setSelectedHostedEventId] = useState<string>('');
  const [showScanner, setShowScanner] = useState(false);
  const [selectedScanGuestId, setSelectedScanGuestId] = useState('');

  // 1. Attending Events data
  const myRegistrations = registrations.filter((r) => r.userId === currentUser.id);
  
  // 2. Hosting Events data
  const myHostedEvents = events.filter((e) => e.hostId === currentUser.id);

  // Set default selected hosted event
  if (myHostedEvents.length > 0 && !selectedHostedEventId) {
    setSelectedHostedEventId(myHostedEvents[0].id);
  }

  const selectedHostedEvent = events.find((e) => e.id === selectedHostedEventId);

  // Registrations for the selected hosted event
  const hostedEventRegistrations = registrations.filter(
    (r) => r.eventId === selectedHostedEventId
  );

  const goingGuests = hostedEventRegistrations.filter(r => r.status === 'going' || r.status === 'checked_in');
  const checkedInCount = hostedEventRegistrations.filter(r => r.status === 'checked_in').length;

  // Earnings calculations
  const totalGrossRevenue = goingGuests.reduce((acc, r) => {
    const ev = events.find((e) => e.id === r.eventId);
    return acc + (ev?.ticketPrice || 0);
  }, 0);

  const adminPlatformFeeCut = Math.round(totalGrossRevenue * 0.05); // 5% Admin Fee
  const hostNetPayout = totalGrossRevenue - adminPlatformFeeCut;

  // CSV Exporter
  const handleExportCSV = () => {
    if (!selectedHostedEvent) return;
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Name,Email,Registration Status,Custom Answer,Team Name,Team Members\n';
    
    hostedEventRegistrations.forEach((r) => {
      const row = `"${r.userName}","${r.userEmail}","${r.status}","${r.customAnswer || ''}","${r.teamName || ''}","${r.teamMembers?.join('; ') || ''}"`;
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedHostedEvent.title.replace(/\s+/g, '_')}_attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulated Calendar .ics downloader
  const handleDownloadICS = (event: Event) => {
    const formattedDate = event.date.replace(/-/g, '');
    const icsContent = `data:text/calendar;charset=utf-8,
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${formattedDate}T090000
DURATION:PT3H
DESCRIPTION:${event.description.substring(0, 100)}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const encodedUri = encodeURI(icsContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // QR check-in simulation submission
  const handleSimulateScan = () => {
    if (!selectedScanGuestId) return;
    onCheckInAttendee(selectedScanGuestId);
    setShowScanner(false);
    setSelectedScanGuestId('');
    alert('QR Ticket Verified! Guest successfully checked in.');
  };

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page Title & View Toggles */}
      <div className="dashboard-header">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">User Dashboard</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage your tickets and monitor hosted communities.
          </p>
        </div>

        {/* Dashboard Tabs Toggle */}
        <ul className="dashboard-tabs">
          <li>
            <button
              onClick={() => setActiveTab('attending')}
              className={`dashboard-tab ${activeTab === 'attending' ? 'dashboard-tab-active' : ''}`}
            >
              <Ticket size={13} />
              Attending Tickets
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('hosting')}
              className={`dashboard-tab ${activeTab === 'hosting' ? 'dashboard-tab-active' : ''}`}
            >
              <BarChart3 size={13} />
              Hosting Hub
            </button>
          </li>
        </ul>
      </div>

      {/* Attending Tab Content */}
      {activeTab === 'attending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {myRegistrations.length > 0 ? (
            <div className="ticket-grid">
              {myRegistrations.map((reg) => {
                const event = events.find((e) => e.id === reg.eventId);
                if (!event) return null;

                const isChecked = reg.status === 'checked_in';
                const isWait = reg.status === 'waitlist';

                return (
                  <div
                    key={reg.id}
                    className="ticket-card"
                  >
                    {/* Visual QR Code Section */}
                    <div className="qr-section">
                      {isWait ? (
                        <div className="w-28 h-28 border border-dashed border-neutral-800 rounded-lg flex items-center justify-center bg-neutral-900/40 text-neutral-600" style={{ width: '112px', height: '112px', border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.02)' }}>
                          <AlertTriangle size={32} className="text-amber-500" />
                        </div>
                      ) : (
                        <div className="qr-code-box">
                          {/* Elegant vector SVG QR Code */}
                          <svg className="w-24 h-24 text-black" viewBox="0 0 100 100" fill="currentColor" style={{ width: '96px', height: '96px', display: 'block' }}>
                            {/* Outer boundary blocks */}
                            <path d="M0,0 h30 v10 h-20 v20 h-10 z M70,0 h30 v30 h-10 v-20 h-20 z M0,70 h10 v20 h20 v10 h-30 z M80,80 h10 v10 h-10 z" />
                            {/* Inner pixelated layout */}
                            <rect x="10" y="10" width="10" height="10" />
                            <rect x="10" y="20" width="10" height="10" />
                            <rect x="20" y="10" width="10" height="10" />
                            <rect x="70" y="10" width="20" height="10" />
                            <rect x="80" y="20" width="10" height="10" />
                            <rect x="10" y="70" width="20" height="10" />
                            <rect x="20" y="80" width="10" height="10" />
                            {/* Scattered details */}
                            <rect x="40" y="40" width="10" height="10" />
                            <rect x="50" y="50" width="10" height="10" />
                            <rect x="40" y="60" width="20" height="10" />
                            <rect x="60" y="40" width="10" height="20" />
                            <rect x="50" y="20" width="10" height="10" />
                            <rect x="50" y="80" width="20" height="10" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="qr-code-label">
                        {isWait ? 'WAITLISTED' : isChecked ? 'CHECKED IN' : `RSVP PASS - ${reg.id.toUpperCase()}`}
                      </div>
                    </div>

                    {/* Ticket details body */}
                    <div className="ticket-details-body">
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-neutral-300" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '2px 8px', fontSize: '10px', color: 'var(--text-muted)' }}>
                          {event.category}
                        </span>
                        
                        <h3 className="ticket-title" style={{ marginTop: '8px' }}>{event.title}</h3>
                        
                        <div className="ticket-meta-info" style={{ marginTop: '8px' }}>
                          <p className="ticket-meta-item">
                            <Calendar size={12} className="text-[#00ff9d]" />
                            {event.date} · {event.time}
                          </p>
                          <p className="ticket-meta-item">
                            <MapPin size={12} className="text-[#00ff9d]" />
                            {event.locationType === 'virtual' ? 'Virtual Call' : event.location.split(',')[0]}
                          </p>
                        </div>
                      </div>

                      {/* Ticket footer action */}
                      <div className="ticket-footer">
                        {isChecked ? (
                          <span className="ticket-active-badge" style={{ color: 'var(--success)' }}>
                            <ShieldCheck size={12} /> Attendance Confirmed
                          </span>
                        ) : isWait ? (
                          <div style={{ width: '100%' }}>
                            <span className="status-badge status-badge-waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <AlertTriangle size={12} /> Waitlist Position #{reg.waitlistNumber}
                            </span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="ticket-active-badge">
                              <QrCode size={13} /> Active Ticket
                            </span>
                            <button
                              onClick={() => handleDownloadICS(event)}
                              className="ticket-calendar-btn"
                              title="Add to Calendar File"
                            >
                              <Download size={13} /> Add to Calendar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="p-12 text-center rounded-xl border text-neutral-400 text-sm space-y-2"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              <Ticket className="mx-auto text-neutral-600" size={32} />
              <p className="font-semibold text-white">No active tickets</p>
              <p className="text-xs">You haven't RSVPed for any events yet. Head to Discover to explore!</p>
            </div>
          )}
        </div>
      )}

      {/* Hosting Tab Content */}
      {activeTab === 'hosting' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {myHostedEvents.length > 0 ? (
            <div className="hosting-grid">
              
              {/* Left Column Sidebar: Hosted Events list selectors */}
              <div className="hosting-sidebar">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Your Hosted Events</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {myHostedEvents.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => {
                        setSelectedHostedEventId(e.id);
                        setShowScanner(false);
                      }}
                      className={`hosting-event-btn ${selectedHostedEventId === e.id ? 'hosting-event-btn-active' : ''}`}
                    >
                      <span className="truncate pr-2">{e.title}</span>
                      <Users size={12} className="flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Columns: Main Event Analytics & Management */}
              <div className="hosting-main">
                {selectedHostedEvent && (
                  <>
                    {/* Header info */}
                    <div className="hosting-header">
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-neutral-300" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '2px 8px', fontSize: '10px', color: 'var(--text-muted)' }}>
                          {selectedHostedEvent.category}
                        </span>
                        <h2 className="text-xl font-bold text-white font-display mt-2" style={{ marginTop: '8px' }}>{selectedHostedEvent.title}</h2>
                      </div>
                      
                      <div className="hosting-header-actions">
                        <button
                          onClick={() => setShowScanner(!showScanner)}
                          className="btn-outline"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', padding: '8px 16px', borderRadius: 'var(--radius-sm)', color: 'var(--accent)', borderColor: 'rgba(0, 255, 157, 0.2)', cursor: 'pointer' }}
                        >
                          <QrCode size={13} /> QR Scanner Simulator
                        </button>
                        <button
                          onClick={handleExportCSV}
                          className="btn-outline"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                        >
                          <Download size={13} /> Export CSV
                        </button>
                      </div>
                    </div>

                    {/* QR scanner view simulation */}
                    {showScanner && (
                      <div className="qr-scanner-simulator">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#00ff9d] font-display flex items-center gap-1.5" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Sparkles size={14} className="animate-pulse" /> Simulated Camera Viewfinder
                          </h3>
                          <button
                            onClick={() => setShowScanner(false)}
                            className="text-neutral-400 hover:text-white text-xs"
                            style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
                          >
                            Close
                          </button>
                        </div>

                        {/* Scanner Viewfinder Box */}
                        <div className="scanner-viewfinder">
                          {/* Laser Scan line */}
                          <div className="scanner-laser-line" />
                          <QrCode size={40} className="text-neutral-600 mb-2" style={{ color: 'var(--text-dim)' }} />
                          <p className="text-xs text-neutral-400" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Position attendee's QR ticket in front of the lens</p>
                        </div>

                        {/* Dropdown simulator */}
                        <div className="scanner-controls">
                          <select
                            value={selectedScanGuestId}
                            onChange={(e) => setSelectedScanGuestId(e.target.value)}
                            className="scanner-select"
                          >
                            <option value="">Select RSVP guest ticket to scan...</option>
                            {goingGuests
                              .filter((g) => g.status === 'going')
                              .map((g) => (
                                <option key={g.id} value={g.id}>
                                  {g.userName} (Pass: {g.id.toUpperCase()})
                                </option>
                              ))}
                          </select>
                          <button
                            type="button"
                            onClick={handleSimulateScan}
                            disabled={!selectedScanGuestId}
                            className="btn-primary"
                            style={{ padding: '8px 16px', fontSize: '12.5px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', opacity: !selectedScanGuestId ? 0.5 : 1 }}
                          >
                            Simulate Scan
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Analytics Row cards */}
                    <div className="analytics-grid">
                      {/* Card 1: Total registrations */}
                      <div className="analytics-card">
                        <p className="analytics-label">Registrations</p>
                        <p className="analytics-value">
                          {goingGuests.length} / {selectedHostedEvent.capacity}
                        </p>
                        <div className="analytics-progress-bar">
                          <div
                            className="analytics-progress-fill"
                            style={{
                              width: `${Math.min(100, (goingGuests.length / selectedHostedEvent.capacity) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Card 2: Attendance rate */}
                      <div className="analytics-card">
                        <p className="analytics-label">Check-in Attendance</p>
                        <p className="analytics-value" style={{ color: 'var(--accent)' }}>
                          {checkedInCount}
                        </p>
                        <p className="analytics-subtext">
                          {goingGuests.length > 0
                            ? `${Math.round((checkedInCount / goingGuests.length) * 100)}% check-in rate`
                            : '0% check-in rate'}
                        </p>
                      </div>

                      {/* Card 3: Payout Summary */}
                      <div className="analytics-card">
                        <p className="analytics-label" style={{ fontWeight: 'semibold' }}>Net Payout (95%)</p>
                        <p className="analytics-value">
                          ₹{hostNetPayout}
                        </p>
                        <div className="analytics-receipt-split">
                          <span>Gross: ₹{totalGrossRevenue}</span>
                          <span>Admin cut (5%): ₹{adminPlatformFeeCut}</span>
                        </div>
                      </div>
                    </div>

                    {/* Registrations List and Waitlist */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 className="section-title" style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                        Attendees Guest List
                      </h3>

                      {hostedEventRegistrations.length > 0 ? (
                        <div className="guest-table-wrapper">
                          <table className="guest-table">
                            <thead>
                              <tr>
                                <th>Attendee</th>
                                <th>Email</th>
                                <th>RSVP Question Answer</th>
                                <th>Team</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {hostedEventRegistrations.map((guest) => (
                                <tr key={guest.id}>
                                  <td style={{ fontWeight: 'bold', color: '#fff' }}>{guest.userName}</td>
                                  <td>{guest.userEmail}</td>
                                  <td style={{ fontStyle: 'italic' }}>
                                    {guest.customAnswer || <span style={{ color: 'var(--text-dim)' }}>N/A</span>}
                                  </td>
                                  <td>
                                    {guest.teamName ? (
                                      <div title={`Members: ${guest.teamMembers?.join(', ')}`}>
                                        👥 {guest.teamName}
                                      </div>
                                    ) : (
                                      <span style={{ color: 'var(--text-dim)' }}>Solo</span>
                                    )}
                                  </td>
                                  <td>
                                    <span
                                      className={`status-badge ${
                                        guest.status === 'checked_in'
                                          ? 'status-badge-verified'
                                          : guest.status === 'waitlist'
                                          ? 'status-badge-waitlist'
                                          : 'status-badge-going'
                                      }`}
                                    >
                                      {guest.status === 'checked_in' ? 'checked in' : guest.status}
                                    </span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    {guest.status === 'going' && (
                                      <button
                                        onClick={() => onCheckInAttendee(guest.id)}
                                        className="guest-action-btn"
                                        style={{ marginLeft: 'auto', justifyContent: 'flex-end' }}
                                      >
                                        <UserCheck size={12} /> Check-In
                                      </button>
                                    )}
                                    {guest.status === 'waitlist' && (
                                      <button
                                        onClick={() => onReleaseWaitlistSeat(selectedHostedEvent.id, guest.id)}
                                        className="guest-action-btn"
                                        style={{ color: 'var(--warning)', marginLeft: 'auto', justifyContent: 'flex-end' }}
                                        title="Promote attendee from waitlist"
                                      >
                                        <Mail size={12} /> Release Seat
                                      </button>
                                    )}
                                    {guest.status === 'checked_in' && (
                                      <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Verified</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-center text-xs text-neutral-500 py-6" style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '24px 0' }}>
                          No registrations for this event yet.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div
              className="p-12 text-center rounded-xl border text-neutral-400 text-sm space-y-2"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              <BarChart3 className="mx-auto text-neutral-600" size={32} />
              <p className="font-semibold text-white">No hosted events</p>
              <p className="text-xs">You haven't created any events yet. Head to "Host Event" to create one!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
