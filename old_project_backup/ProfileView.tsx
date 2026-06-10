import React, { useState } from 'react';
import { Award, FileText, Gift, Plus, Trophy, X, Printer } from 'lucide-react';
import type { UserProfile, Event, Registration } from '../types';

interface ProfileViewProps {
  currentUser: UserProfile;
  events: Event[];
  registrations: Registration[];
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  events,
  registrations,
  onUpdateUser,
}) => {
  const [newSkill, setNewSkill] = useState('');
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  
  // Certificate view modal overlay
  const [viewingCertificateEvent, setViewingCertificateEvent] = useState<Event | null>(null);

  // Resume view modal overlay
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Checked in registrations (which gives certificates)
  const checkedInRegs = registrations.filter(
    (r) => r.userId === currentUser.id && r.status === 'checked_in'
  );

  const checkedInEvents = checkedInRegs
    .map((r) => events.find((e) => e.id === r.eventId))
    .filter((e): e is Event => !!e);

  // Update profile basic info
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name,
      bio,
    });
    alert('Profile updated successfully!');
  };

  // Add Skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || currentUser.skills.includes(newSkill.trim())) return;
    
    const updatedSkills = [...currentUser.skills, newSkill.trim()];
    onUpdateUser({
      ...currentUser,
      skills: updatedSkills,
      xp: currentUser.xp + 10, // Award 10 XP for skill addition!
    });
    setNewSkill('');
  };

  // Delete Skill
  const handleDeleteSkill = (skillToDelete: string) => {
    const updatedSkills = currentUser.skills.filter((s) => s !== skillToDelete);
    onUpdateUser({
      ...currentUser,
      skills: updatedSkills,
    });
  };

  return (
    <div className="container py-8 space-y-8 no-print">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">Profile & Achievements</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Review your credentials, print certificates, and download your tech event resume.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Basic Edit & Skills */}
        <div className="space-y-6">
          {/* Profile Card Info */}
          <div className="p-5 rounded-xl border bg-neutral-950 border-neutral-900 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border border-neutral-800"
              />
              <div>
                <h3 className="text-base font-bold text-white font-display">{currentUser.name}</h3>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#00ff9d]/10 text-[#00ff9d]">
                  Developer Level {Math.floor(currentUser.xp / 400) + 1}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#00ff9d]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400">Short Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#00ff9d]"
                />
              </div>
              <button type="submit" className="btn-primary py-2 px-4 rounded-lg text-xs w-full">
                Save Profile Details
              </button>
            </form>
          </div>

          {/* Skills Board */}
          <div className="p-5 rounded-xl border bg-neutral-950 border-neutral-900 space-y-3.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-display">
              Technical Skills List
            </h3>
            
            {/* Input tag */}
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Rust, Figma)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-grow px-3 py-2 text-xs rounded-lg bg-neutral-900 border border-neutral-800 focus:outline-none text-white"
              />
              <button type="submit" className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-[#00ff9d] text-neutral-300 hover:text-white">
                <Plus size={14} />
              </button>
            </form>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {currentUser.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-900 border border-neutral-800 text-neutral-300"
                >
                  {skill}
                  <button
                    onClick={() => handleDeleteSkill(skill)}
                    className="text-neutral-500 hover:text-red-400 ml-0.5"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns: Achievements Wallet & Certificates */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* XP & Rewards Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* XP details */}
            <div className="p-5 rounded-xl border bg-neutral-950 border-neutral-900 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#00ff9d]/10 flex items-center justify-center text-[#00ff9d] border border-[#00ff9d]/20">
                <Trophy size={22} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase text-neutral-400">Total Points Earned</p>
                <p className="text-2xl font-black text-white">{currentUser.xp} XP</p>
                <p className="text-[10px] text-neutral-500">Earn 150 more XP to unlock Level {Math.floor(currentUser.xp / 400) + 2}</p>
              </div>
            </div>

            {/* Referrals details */}
            <div className="p-5 rounded-xl border bg-neutral-950 border-neutral-900 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#00e5ff]/10 flex items-center justify-center text-[#00e5ff] border border-[#00e5ff]/20">
                <Gift size={22} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase text-neutral-400">Referrals Invited</p>
                <p className="text-2xl font-black text-white">{currentUser.referralsCount}</p>
                <p className="text-[10px] text-neutral-400 font-medium">
                  Referral Code: <strong className="text-[#00ff9d] font-mono">{currentUser.referralCode}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Badges */}
          <div className="p-5 rounded-xl border bg-neutral-950 border-neutral-900 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-display">
              Achievement Badge Wallet
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {currentUser.badges.map((badge) => (
                <div
                  key={badge}
                  className="p-3 rounded-lg border bg-neutral-900/40 border-neutral-900 flex flex-col items-center justify-center text-center space-y-1"
                >
                  <Award className="text-[#00ff9d]" size={20} />
                  <span className="text-[10.5px] font-bold text-white leading-tight">{badge}</span>
                </div>
              ))}
              <div className="p-3 rounded-lg border border-dashed border-neutral-800 flex flex-col items-center justify-center text-center text-neutral-600">
                <Trophy size={16} />
                <span className="text-[9px] mt-1 font-semibold">Join Hackathons to unlock more!</span>
              </div>
            </div>
          </div>

          {/* Certificate Wallet Section */}
          <div className="p-5 rounded-xl border bg-neutral-950 border-neutral-900 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-display">
                Digital Certificates of Participation
              </h3>
              <button
                onClick={() => setShowResumeModal(true)}
                className="text-xs font-bold text-[#00ff9d] flex items-center gap-1 hover:underline"
              >
                <FileText size={13} /> Open Resume Builder
              </button>
            </div>

            {checkedInEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {checkedInEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-xl border bg-neutral-900/40 border-neutral-900 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-bold text-white truncate max-w-[170px]">
                        {event.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400">Verified: {event.date}</p>
                    </div>
                    <button
                      onClick={() => setViewingCertificateEvent(event)}
                      className="px-2.5 py-1.5 rounded bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-[#00ff9d] transition-colors"
                    >
                      View Pass
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-xs text-neutral-500 py-6">
                No certificates unlocked yet. Attend hosts' events and get checked-in by QR to claim certificates of participation!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Viewer Modal Overlay */}
      {viewingCertificateEvent && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fade-in no-print">
          <div className="w-full max-w-2xl bg-white text-black p-8 rounded-xl border border-neutral-200 relative text-center space-y-8 animate-scale-up shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setViewingCertificateEvent(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            {/* Print button */}
            <button
              onClick={() => window.print()}
              className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 bg-neutral-100 border border-neutral-350 hover:bg-neutral-200 rounded text-xs font-semibold text-neutral-800"
            >
              <Printer size={13} /> Print Certificate
            </button>

            {/* Certificate Border layout */}
            <div className="border-[6px] border-double border-neutral-800 p-8 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
                  TechEvent Digital Credentials
                </h2>
                <h1 className="font-serif text-3xl font-extrabold text-neutral-900 italic">
                  Certificate of Participation
                </h1>
                <div className="h-[2px] w-40 bg-neutral-900 mx-auto mt-4" />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-neutral-500">This is proudly certified that</p>
                <h3 className="text-2xl font-black font-display text-neutral-950 uppercase">
                  {currentUser.name}
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                  has successfully participated and contributed in <strong className="text-black">{viewingCertificateEvent.title}</strong> hosted on the TechEvent event platform on {viewingCertificateEvent.date}.
                </p>
              </div>

              {/* Signature and Verification QR */}
              <div className="flex justify-between items-end pt-6 max-w-md mx-auto text-xs">
                {/* Host Signature */}
                <div className="text-left space-y-1">
                  <div className="font-serif italic text-base text-neutral-800">
                    {viewingCertificateEvent.hostName}
                  </div>
                  <div className="h-[1px] w-28 bg-neutral-400" />
                  <p className="text-[10px] text-neutral-400">Event Coordinator Host</p>
                </div>

                {/* QR Code Verification */}
                <div className="text-right flex flex-col items-end gap-1.5">
                  <svg className="w-12 h-12 text-black border border-neutral-300 p-0.5 rounded" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0,0 h30 v10 h-20 v20 h-10 z M70,0 h30 v30 h-10 v-20 h-20 z M0,70 h10 v20 h20 v10 h-30 z M80,80 h10 v10 h-10 z" />
                    <rect x="10" y="10" width="10" height="10" />
                    <rect x="70" y="10" width="20" height="10" />
                    <rect x="10" y="70" width="20" height="10" />
                    <rect x="40" y="40" width="20" height="20" />
                  </svg>
                  <p className="text-[8px] text-neutral-400 font-mono">Verify Code: TKE-{viewingCertificateEvent.id.toUpperCase().substring(6, 12)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Builder Viewer Modal Overlay */}
      {showResumeModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fade-in no-print">
          <div className="w-full max-w-2xl bg-white text-black p-8 rounded-xl border border-neutral-200 relative space-y-6 animate-scale-up shadow-2xl overflow-y-auto max-h-[90vh]">
            
            {/* Controls */}
            <div className="flex justify-between items-center border-b pb-3 no-print">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 font-display">
                Simulated Event Resume PDF
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1 px-3 py-1.5 bg-neutral-900 border border-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-white rounded"
                >
                  <Printer size={13} /> Export PDF
                </button>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="p-1 text-neutral-400 hover:text-black"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Resume print layout document */}
            <div className="p-6 border border-neutral-300 rounded space-y-6">
              
              {/* Header profile */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-black tracking-tight">{currentUser.name}</h1>
                  <p className="text-xs text-neutral-600 font-medium">{currentUser.email} · Hyderabad, India</p>
                  <p className="text-xs text-neutral-500 mt-2 max-w-md">{currentUser.bio}</p>
                </div>
                
                <div className="text-right space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 border border-neutral-200">
                    XP Points: {currentUser.xp}
                  </span>
                  <p className="text-[9px] text-neutral-400 uppercase font-bold">Verified Credentials</p>
                </div>
              </div>

              {/* Skills section */}
              <div className="space-y-2">
                <h2 className="text-xs uppercase font-extrabold text-neutral-800 tracking-wider border-b border-neutral-300 pb-1">
                  Technical Expertise
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-neutral-100 rounded text-[10.5px] font-medium border border-neutral-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attended events history */}
              <div className="space-y-3">
                <h2 className="text-xs uppercase font-extrabold text-neutral-800 tracking-wider border-b border-neutral-300 pb-1">
                  Participated Tech Events
                </h2>
                {registrations.filter(r => r.userId === currentUser.id).length > 0 ? (
                  <div className="space-y-3.5">
                    {registrations.filter(r => r.userId === currentUser.id).map(reg => {
                      const ev = events.find(e => e.id === reg.eventId);
                      if (!ev) return null;
                      return (
                        <div key={reg.id} className="text-xs space-y-1">
                          <div className="flex justify-between font-bold">
                            <span>{ev.title} ({ev.category})</span>
                            <span className="text-neutral-500 font-normal">{ev.date}</span>
                          </div>
                          <p className="text-neutral-500 text-[11px] leading-relaxed">
                            Successfully attended. Checked-in and verified badge. Custom answer: {reg.customAnswer || 'None'}.
                            {reg.teamName && ` Contributed as member of team "${reg.teamName}".`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic">No events registered yet.</p>
                )}
              </div>

              {/* Achievements section */}
              <div className="space-y-2">
                <h2 className="text-xs uppercase font-extrabold text-neutral-800 tracking-wider border-b border-neutral-300 pb-1">
                  Achievements & Certifications
                </h2>
                <ul className="list-disc pl-4 text-xs space-y-1 text-neutral-600">
                  <li>Verified badges earned on TechEvent platform: {currentUser.badges.join(', ')}</li>
                  <li>Accomplished Level {Math.floor(currentUser.xp / 400) + 1} with absolute index matching {currentUser.xp} XP points</li>
                  <li>Simulated digital verification secure references</li>
                </ul>
              </div>

              <div className="h-[1px] bg-neutral-200" />
              
              {/* Footer reference check */}
              <div className="flex justify-between items-center text-[9px] text-neutral-400">
                <span>Verified by TechEvent Platform Sandbox API</span>
                <span>Code Reference: BHAVI-RESUME-2026</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
