import React from 'react';
import { ShieldAlert, BarChart3, Database, Trash2, Star, RefreshCw, DollarSign } from 'lucide-react';
import type { Event, Registration, UserProfile } from '../types';

interface AdminPanelProps {
  events: Event[];
  registrations: Registration[];
  users: UserProfile[];
  onDeleteEvent: (eventId: string) => void;
  onToggleFeatureEvent: (eventId: string) => void;
  onResetDatabase: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  events,
  registrations,
  users,
  onDeleteEvent,
  onToggleFeatureEvent,
  onResetDatabase,
}) => {
  
  // Calculate Platform statistics
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;

  // Find registrations that are paid
  const paidRegistrations = registrations.filter(r => {
    const ev = events.find(e => e.id === r.eventId);
    return ev && ev.ticketPrice > 0 && (r.status === 'going' || r.status === 'checked_in');
  });

  const totalGrossSales = paidRegistrations.reduce((acc, r) => {
    const ev = events.find(e => e.id === r.eventId);
    return acc + (ev?.ticketPrice || 0);
  }, 0);

  // Platform 5% Commission Cut
  const totalAdminCommission = Math.round(totalGrossSales * 0.05);

  const handleResetClick = () => {
    if (window.confirm('Are you sure you want to reset the database to default seed events, registrations, and comments? All customized additions will be lost.')) {
      onResetDatabase();
    }
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-display flex items-center gap-2">
            <ShieldAlert className="text-[#00ff9d]" size={28} />
            Platform Admin Panel
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Review cross-platform statistics, track 5% commissions, and manage event directories.
          </p>
        </div>

        <button
          onClick={handleResetClick}
          className="btn-outline py-2 px-4 rounded-lg text-xs font-bold flex items-center gap-1.5 text-red-400 border-red-500/20 hover:border-red-500/40"
        >
          <RefreshCw size={13} />
          Reset Database Seed
        </button>
      </div>

      {/* Aggregate Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {/* Stat 1: Commission Cut */}
        <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-xl space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-1">
            <DollarSign size={12} className="text-[#00ff9d]" /> Platform Revenue (5% Fee)
          </p>
          <p className="text-2xl font-black text-[#00ff9d]">₹{totalAdminCommission}</p>
          <p className="text-[10px] text-neutral-500">Collected from paid workshops</p>
        </div>

        {/* Stat 2: Gross sales */}
        <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-xl space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400">Total Ticket Sales Volume</p>
          <p className="text-2xl font-black text-white">₹{totalGrossSales}</p>
          <p className="text-[10px] text-neutral-500">Gross transaction flow in INR</p>
        </div>

        {/* Stat 3: Total events */}
        <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-xl space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400">Total Listed Events</p>
          <p className="text-2xl font-black text-white">{totalEvents}</p>
          <p className="text-[10px] text-neutral-500">Hackathons, socials & workshops</p>
        </div>

        {/* Stat 4: Registrations */}
        <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-xl space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400">Total RSVPs / Admissions</p>
          <p className="text-2xl font-black text-white">{totalRegistrations}</p>
          <p className="text-[10px] text-neutral-500">Total registered seats</p>
        </div>

        {/* Stat 5: Total registered users */}
        <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-xl space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400">Total Registered Users</p>
          <p className="text-2xl font-black text-white">{users.length}</p>
          <p className="text-[10px] text-neutral-500">Attendee & Organiser profiles</p>
        </div>
      </div>

      {/* Visual Chart of Event Payout Splits */}
      <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-display flex items-center gap-1.5">
          <BarChart3 size={15} /> Event Commission Split Summaries
        </h3>
        
        <div className="space-y-3 pt-2">
          {events.filter(e => e.ticketPrice > 0).map(e => {
            const evRegs = registrations.filter(r => r.eventId === e.id && (r.status === 'going' || r.status === 'checked_in')).length;
            const gross = evRegs * e.ticketPrice;
            const comm = Math.round(gross * 0.05);
            const payout = gross - comm;

            return (
              <div key={e.id} className="text-xs space-y-1 bg-neutral-900/40 p-3.5 rounded border border-neutral-900">
                <div className="flex justify-between font-bold text-white mb-1.5">
                  <span>{e.title}</span>
                  <span className="text-[#00ff9d]">Total Gross: ₹{gross}</span>
                </div>
                
                {/* Horizontal Bar Visual */}
                <div className="h-6 w-full bg-neutral-950 rounded flex overflow-hidden font-mono font-bold text-[9px]">
                  {payout > 0 ? (
                    <div
                      className="bg-blue-600/90 text-white flex items-center justify-center truncate px-2"
                      style={{ width: `${(payout / gross) * 100}%` }}
                      title={`Net Organiser Payout: ₹${payout}`}
                    >
                      Host Net: 95% (₹{payout})
                    </div>
                  ) : null}
                  {comm > 0 ? (
                    <div
                      className="bg-[#00ff9d] text-black flex items-center justify-center truncate px-2"
                      style={{ width: `${(comm / gross) * 100}%` }}
                      title={`Admin Platform Commission: ₹${comm}`}
                    >
                      Admin Cut: 5% (₹{comm})
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
          {events.filter(e => e.ticketPrice > 0).length === 0 && (
            <p className="text-center text-xs text-neutral-500 py-4">
              Create paid workshops to see financial split graphs.
            </p>
          )}
        </div>
      </div>

      {/* Database Master Directory Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-display flex items-center gap-1.5">
          <Database size={15} /> Event Administration Directory
        </h3>

        <div className="overflow-x-auto border border-neutral-900 rounded-lg">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-900 text-neutral-400 font-semibold uppercase text-[10px]">
                <th className="p-3">Event Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Host Name</th>
                <th className="p-3 text-center">Registrations</th>
                <th className="p-3 text-right">Commission Cut (5%)</th>
                <th className="p-3 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {events.map((e) => {
                const evRegs = registrations.filter(r => r.eventId === e.id && (r.status === 'going' || r.status === 'checked_in')).length;
                const gross = evRegs * e.ticketPrice;
                const commission = Math.round(gross * 0.05);

                return (
                  <tr key={e.id} className="hover:bg-neutral-950/40">
                    <td className="p-3 font-semibold text-white truncate max-w-[200px]">{e.title}</td>
                    <td className="p-3 capitalize text-neutral-400">{e.category}</td>
                    <td className="p-3 text-neutral-400 font-mono">
                      {e.ticketPrice === 0 ? 'FREE' : `₹${e.ticketPrice}`}
                    </td>
                    <td className="p-3 text-neutral-400">{e.hostName}</td>
                    <td className="p-3 text-center font-bold text-neutral-300">{evRegs} / {e.capacity}</td>
                    <td className="p-3 text-right text-[#00ff9d] font-bold font-mono">
                      {e.ticketPrice === 0 ? '₹0' : `₹${commission}`}
                    </td>
                    <td className="p-3 text-right flex items-center justify-end gap-2">
                      {/* Featured button toggle */}
                      <button
                        onClick={() => onToggleFeatureEvent(e.id)}
                        className={`p-1.5 rounded transition-colors ${
                          e.isFeatured ? 'text-amber-400 hover:text-amber-500 bg-amber-500/5' : 'text-neutral-500 hover:text-white'
                        }`}
                        title={e.isFeatured ? 'Unfeature event' : 'Mark as Featured Event Banner'}
                      >
                        <Star size={14} fill={e.isFeatured ? 'currentColor' : 'none'} />
                      </button>

                      {/* Delete button action */}
                      <button
                        onClick={() => onDeleteEvent(e.id)}
                        className="p-1.5 rounded text-neutral-500 hover:text-red-400 transition-colors"
                        title="Delete event from platform"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
