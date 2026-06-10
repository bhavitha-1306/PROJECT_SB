import React, { useState } from 'react';
import { Compass, PlusCircle, LayoutDashboard, User, ShieldAlert, Sun, Moon, ChevronDown } from 'lucide-react';
import type { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  userName: string;
  userAvatar: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setTab,
  userRole,
  setUserRole,
  userName,
  userAvatar,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const tabs = [
    { id: 'discover', label: 'Discover', icon: <Compass size={16} /> },
    { id: 'create', label: 'Host Event', icon: <PlusCircle size={16} /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'profile', label: 'Profile & Wallet', icon: <User size={16} /> },
  ];

  // If Admin role, add Admin panel tab
  if (userRole === 'admin') {
    tabs.push({ id: 'admin', label: 'Admin Panel', icon: <ShieldAlert size={16} /> });
  }

  return (
    <nav className="header-nav no-print">
      {/* Brand Logo */}
      <div
        onClick={() => setTab('discover')}
        className="nav-brand"
      >
        <div className="logo-box">
          TE
        </div>
        <span className="brand-name">
          TechEvent
        </span>
      </div>

      {/* Navigation tabs */}
      <ul className="nav-menu">
        {tabs.map((t) => {
          const isActive = currentTab === t.id;
          return (
            <li key={t.id}>
              <button
                onClick={() => setTab(t.id)}
                className="nav-item-btn"
                style={{
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(0, 255, 157, 0.06)' : 'transparent',
                  border: '1px solid transparent',
                  borderColor: isActive ? 'rgba(0, 255, 157, 0.15)' : 'transparent',
                }}
              >
                {t.icon}
                {t.label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Action panel (Theme, Role swapper & Profile) */}
      <div className="nav-actions">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-btn"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Profile Dropdown with Role Selector */}
        <div className="profile-dropdown-wrapper">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="profile-trigger-btn"
          >
            <img
              src={userAvatar}
              alt={userName}
              className="profile-avatar-img"
            />
            <span className="profile-trigger-name">
              {userName}
            </span>
            <ChevronDown size={13} className="text-neutral-400" />
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay blocker to close dropdown */}
              <div
                className="dropdown-overlay"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <p className="dropdown-title">
                    Role Swapper
                  </p>
                  <p className="dropdown-subtitle">
                    Toggle roles to test different flows.
                  </p>
                </div>
                
                <div className="py-1" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {(['attendee', 'organiser', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setUserRole(r);
                        setDropdownOpen(false);
                        // Redirect to discover if switching off admin and on admin tab
                        if (currentTab === 'admin' && r !== 'admin') {
                          setTab('discover');
                        }
                      }}
                      className="dropdown-item-btn"
                      style={{
                        color: userRole === r ? 'var(--accent)' : 'var(--text-muted)',
                        background: userRole === r ? 'rgba(0, 255, 157, 0.05)' : 'transparent',
                      }}
                    >
                      <span style={{ textTransform: 'capitalize' }}>{r}</span>
                      {userRole === r && (
                        <span className="dropdown-item-dot" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
