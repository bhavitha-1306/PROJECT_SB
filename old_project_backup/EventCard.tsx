import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import type { Event, Registration } from '../types';

interface EventCardProps {
  event: Event;
  registrations: Registration[];
  onClick: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  registrations,
  onClick,
}) => {
  const eventRegistrations = registrations.filter(
    (r) => r.eventId === event.id && (r.status === 'going' || r.status === 'checked_in')
  );
  
  const attendeeCount = eventRegistrations.length;

  // Format Date
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).toUpperCase();

  // Parse time to 12 hour format
  const [hoursStr, minutesStr] = event.time.split(':');
  const hours = parseInt(hoursStr);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const formattedTime = `${displayHours}:${minutesStr} ${ampm}`;

  return (
    <div
      onClick={onClick}
      className="glass-card"
    >
      {/* Cover Image/Gradient */}
      <div
        className="card-cover"
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
        {event.coverType === 'gradient' && event.coverEmoji && (
          <span className="card-emoji">
            {event.coverEmoji}
          </span>
        )}
        
        {/* Category Badge */}
        <span className="card-badge">
          {event.category}
        </span>

        {/* Pricing Badge */}
        <span
          className="card-price"
          style={
            event.ticketPrice === 0
              ? { background: 'rgba(16, 185, 129, 0.9)', color: '#ffffff' }
              : { background: 'var(--accent)', color: '#000000' }
          }
        >
          {event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}
        </span>
      </div>

      {/* Info Body */}
      <div className="card-body">
        <div>
          {/* DateTime header */}
          <div className="card-date">
            <Calendar size={12} />
            <span>
              {formattedDate} · {formattedTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="card-title">
            {event.title}
          </h3>

          {/* Description Snippet */}
          <p className="card-desc">
            {event.description}
          </p>
        </div>

        {/* Footer Info Row */}
        <div className="card-footer">
          {/* Location details */}
          <div className="card-location">
            <MapPin size={13} className="flex-shrink-0" />
            <span className="truncate">
              {event.locationType === 'virtual' ? 'Virtual Call' : event.location.split(',')[0]}
            </span>
          </div>

          {/* Registrations count and host */}
          <div className="card-stats">
            {attendeeCount > 0 && (
              <div className="card-stat-count">
                <Users size={12} />
                <span>{attendeeCount}</span>
              </div>
            )}
            <img
              src={event.hostAvatar}
              alt={event.hostName}
              title={`Hosted by ${event.hostName}`}
              className="card-host-avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
