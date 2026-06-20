import React, { useState } from 'react';
import { registerOrGetWriter } from '../utils/writers';

export const AuthModal = ({ isOpen, onClose, onSuccess, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [role, setRole] = useState('client');
  
  // Common states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Client specific
  const [address, setAddress] = useState('');
  
  // Writer specific
  const [penmanship, setPenmanship] = useState('Elegant Cursive');
  const [background, setBackground] = useState('BSc Chemistry Student');
  
  // Admin specific
  const [adminCode, setAdminCode] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (activeTab === 'signup') {
      if (!name) {
        setErrorMsg('Please enter your name.');
        return;
      }
      if (role === 'admin' && adminCode !== 'INKADMIN2026') {
        setErrorMsg('Invalid Admin Access Passcode.');
        return;
      }
    }

    // Simulate Auth success
    const mockUser = {
      role,
      name: activeTab === 'signup' ? name : email.split('@')[0].toUpperCase(),
      email,
      details: {
        phone,
        address: role === 'client' ? address : undefined,
        penmanship: role === 'writer' ? penmanship : undefined,
        background: role === 'writer' ? background : undefined,
      }
    };

    if (role === 'writer') {
      registerOrGetWriter(mockUser);
    }

    onSuccess(mockUser);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '2.5px solid var(--border-editorial)',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '10px 10px 0 var(--border-editorial)',
          position: 'relative',
          animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '2px solid var(--border-editorial)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-sand)'
          }}
        >
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--accent-orange)' }}>*</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '16px', letterSpacing: '-0.02em' }}>
              INKLINK MEMBER PORTAL
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              fontSize: '24px',
              fontWeight: '900',
              lineHeight: '1',
              color: 'var(--text-dark)',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {/* Tab selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1.5px solid var(--border-editorial)' }}>
          <button
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            style={{
              padding: '14px',
              fontSize: '13px',
              fontWeight: '800',
              textTransform: 'uppercase',
              backgroundColor: activeTab === 'login' ? '#FFFFFF' : 'var(--bg-sand)',
              borderRight: '1.5px solid var(--border-editorial)',
              color: activeTab === 'login' ? 'var(--accent-orange)' : 'var(--text-dark)',
              transition: 'var(--transition-smooth)'
            }}
          >
            Login
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setErrorMsg(''); }}
            style={{
              padding: '14px',
              fontSize: '13px',
              fontWeight: '800',
              textTransform: 'uppercase',
              backgroundColor: activeTab === 'signup' ? '#FFFFFF' : 'var(--bg-sand)',
              color: activeTab === 'signup' ? 'var(--accent-orange)' : 'var(--text-dark)',
              transition: 'var(--transition-smooth)'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Role selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Platform Role
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', border: '1.5px solid var(--border-editorial)', padding: '3px', backgroundColor: 'var(--bg-sand)' }}>
              {['client', 'writer', 'admin'].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => { setRole(r); setErrorMsg(''); }}
                  style={{
                    padding: '8px',
                    fontSize: '11px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    backgroundColor: role === r ? 'var(--border-editorial)' : 'transparent',
                    color: role === r ? 'var(--bg-sand)' : 'var(--text-dark)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div style={{ fontSize: '12px', color: '#E11D48', backgroundColor: '#FFE4E6', border: '1px solid #FDA4AF', padding: '10px', fontWeight: '600' }}>
              ⚠ {errorMsg}
            </div>
          )}

          {/* Form fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
            
            {activeTab === 'signup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ padding: '10px 12px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Email Address *</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '10px 12px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '10px 12px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            {activeTab === 'signup' && role !== 'admin' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ padding: '10px 12px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                />
              </div>
            )}

            {/* Role-Specific Sign Up Form Items */}
            {activeTab === 'signup' && role === 'client' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Doorstep Mailing Address</label>
                <input
                  type="text"
                  placeholder="Required for physical notebook postage"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ padding: '10px 12px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                />
              </div>
            )}

            {activeTab === 'signup' && role === 'writer' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Penmanship Style</label>
                  <select
                    value={penmanship}
                    onChange={(e) => setPenmanship(e.target.value)}
                    style={{ padding: '10px 12px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', fontSize: '13px', fontWeight: '600', outline: 'none' }}
                  >
                    <option value="Elegant Cursive">Elegant Cursive</option>
                    <option value="Neat Block Print">Neat Block Print</option>
                    <option value="Stylized Script">Stylized Script</option>
                    <option value="Student Handwriting">Student Handwriting</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Subject Background / Bio</label>
                  <input
                    type="text"
                    placeholder="e.g. BSc Math Scholar, Literature graduate"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    style={{ padding: '10px 12px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </>
            )}

            {/* Admin Verification Code */}
            {activeTab === 'signup' && role === 'admin' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>Admin invite passcode *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter passcode to whitelist admin"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  style={{ padding: '10px 12px', border: '1.5px dashed var(--accent-orange)', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Use: <code>INKADMIN2026</code> in this sandbox.</span>
              </div>
            )}

          </div>

          {/* Submit Action */}
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--border-editorial)',
              color: 'var(--bg-sand)',
              padding: '14px',
              fontWeight: '800',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: '1.5px solid var(--border-editorial)',
              boxShadow: '4px 4px 0 var(--accent-orange)',
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-orange)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--border-editorial)'}
          >
            {activeTab === 'login' ? `Sign In As ${role} ↗` : `Create ${role} Account ↗`}
          </button>

        </form>
      </div>
    </div>
  );
};
