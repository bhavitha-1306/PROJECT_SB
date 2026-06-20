import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Shield, PenTool, UserCheck } from 'lucide-react';
import { registerOrGetWriter } from '../utils/writers';

export const SignupPage = ({ onSignupSuccess, onGoBack, onOpenLogin }) => {
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Client specific
  const [address, setAddress] = useState('');
  
  // Worker specific
  const [penmanship, setPenmanship] = useState('Elegant Cursive');
  const [background, setBackground] = useState('');
  
  // Admin specific
  const [adminCode, setAdminCode] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (role === 'admin' && adminCode !== 'INKADMIN2026') {
      setErrorMsg('Invalid Admin Access Passcode.');
      return;
    }

    // Simulate Auth success
    const mockUser = {
      role,
      name: name.toUpperCase(),
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

    onSignupSuccess(mockUser);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-sand)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation / Action Bar */}
      <header className="border-bottom" style={{ borderColor: 'var(--border-editorial)', backgroundColor: '#FFFFFF' }}>
        <div className="section-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px' }}>
          <button 
            onClick={onGoBack}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '13px', 
              fontWeight: '700', 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-dark)', 
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={onGoBack}>
            <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--accent-orange)' }}>*</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '18px', letterSpacing: '-0.03em' }}>INKLINK</span>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <button 
              onClick={onOpenLogin}
              style={{ background: 'none', border: 'none', color: 'var(--accent-orange)', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Double Column Workspace */}
      <main style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)' }}>
        
        {/* Left Column: Editorial Showcase Info (Veson Style) */}
        <section 
          style={{ 
            gridColumn: 'span 5', 
            backgroundColor: 'var(--border-editorial)', 
            color: 'var(--bg-sand)',
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            borderRight: '2px solid var(--border-editorial)'
          }}
        >
          {/* Overlay grid lines for premium editorial aesthetic */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.7 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <span className="pill-badge badge-orange" style={{ alignSelf: 'flex-start', border: '1px solid var(--bg-sand)' }}>
              Join the Network
            </span>
            
            <div>
              <h1 className="font-display-condensed" style={{ fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: '0.95', color: '#FFFFFF', marginBottom: '20px' }}>
                WHICH ROLE <br />
                MAKES SENSE <br />
                <span style={{ color: 'var(--accent-orange)' }}>FOR YOU?</span>
              </h1>
              <p style={{ color: 'rgba(247,245,240,0.7)', fontSize: '14px', lineHeight: '1.5', maxWidth: '380px' }}>
                InkLink acts as a trusted bridge connecting academic requirements with real human penmanship. Choose the profile that fits your objectives.
              </p>
            </div>

            {/* Dynamic Value Prop List depending on active role */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
              {role === 'client' && (
                <>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <UserCheck size={20} color="var(--accent-orange)" />
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase' }}>Escrow Protected Orders</h4>
                      <p style={{ fontSize: '12px', color: 'rgba(247,245,240,0.6)', marginTop: '4px' }}>Funds are locked safely and only paid once you approve the high-res handwriting scan.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <CheckCircle2 size={20} color="var(--accent-orange)" />
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase' }}>Verified Human Penmen</h4>
                      <p style={{ fontSize: '12px', color: 'rgba(247,245,240,0.6)', marginTop: '4px' }}>Every writer is audited and verified for legibility, neatness, and page formatting.</p>
                    </div>
                  </div>
                </>
              )}

              {role === 'writer' && (
                <>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <PenTool size={20} color="var(--accent-orange)" />
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase' }}>Earn for your Handwriting</h4>
                      <p style={{ fontSize: '12px', color: 'rgba(247,245,240,0.6)', marginTop: '4px' }}>Get paid ₹25 - ₹50 per page. Claim matches instantly based on your own schedule.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <CheckCircle2 size={20} color="var(--accent-orange)" />
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase' }}>Fast UPI Payouts</h4>
                      <p style={{ fontSize: '12px', color: 'rgba(247,245,240,0.6)', marginTop: '4px' }}>Withdraw your earnings directly to your bank account or UPI handle with ease.</p>
                    </div>
                  </div>
                </>
              )}

              {role === 'admin' && (
                <>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Shield size={20} color="var(--accent-orange)" />
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase' }}>Audit applications</h4>
                      <p style={{ fontSize: '12px', color: 'rgba(247,245,240,0.6)', marginTop: '4px' }}>Whitelist qualified penmen, review complaint dispute tickets, and release escrows.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <CheckCircle2 size={20} color="var(--accent-orange)" />
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase' }}>Global Operations</h4>
                      <p style={{ fontSize: '12px', color: 'rgba(247,245,240,0.6)', marginTop: '4px' }}>Keep track of daily transactions, gross volumes, and active commissions.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1, fontSize: '11px', color: 'rgba(247,245,240,0.4)' }}>
            © 2026 INKLINK. Double-column editorial authentication space.
          </div>
        </section>

        {/* Right Column: Premium Sign Up Interactive Form */}
        <section style={{ gridColumn: 'span 7', padding: '60px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
            
            {/* Title */}
            <div style={{ marginBottom: '32px' }}>
              <span className="pill-badge badge-orange" style={{ marginBottom: '12px' }}>Sign Up Page</span>
              <h2 className="font-display-condensed" style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: '1.0' }}>
                Register Your Account
              </h2>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div style={{ fontSize: '12px', color: '#E11D48', backgroundColor: '#FFE4E6', border: '1.5px solid #FDA4AF', padding: '12px', fontWeight: '600', marginBottom: '24px' }}>
                ⚠ {errorMsg}
              </div>
            )}

            {/* Premium Role Tabs Selector */}
            <div style={{ display: 'flex', border: '2px solid var(--border-editorial)', padding: '4px', backgroundColor: '#FFFFFF', marginBottom: '32px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
              {['client', 'writer', 'admin'].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => { setRole(r); setErrorMsg(''); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontSize: '11px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: role === r ? 'var(--border-editorial)' : 'transparent',
                    color: role === r ? '#FFFFFF' : 'var(--text-dark)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {r === 'writer' ? 'Writer (Penman)' : r}
                </button>
              ))}
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Common Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ padding: '12px 16px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none', boxShadow: '2px 2px 0 rgba(0,0,0,0.05)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: '12px 16px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '12px 16px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              {role !== 'admin' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ padding: '12px 16px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              )}

              {/* Client-specific: Mailing Address */}
              {role === 'client' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Doorstep Mailing Address</label>
                  <textarea
                    placeholder="Required for physical notebook/lab sheet postage delivery"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    style={{ padding: '12px 16px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none', resize: 'none' }}
                  />
                </div>
              )}

              {/* Writer-specific: Penmanship Style & Bio Background */}
              {role === 'writer' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Penmanship Style</label>
                    <select
                      value={penmanship}
                      onChange={(e) => setPenmanship(e.target.value)}
                      style={{ padding: '12px 16px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', fontSize: '13px', fontWeight: '600', outline: 'none' }}
                    >
                      <option value="Elegant Cursive">Elegant Cursive</option>
                      <option value="Neat Block Print">Neat Block Print</option>
                      <option value="Stylized Script">Stylized Script</option>
                      <option value="Student Handwriting">Student Handwriting</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject Specialization Background</label>
                    <input
                      type="text"
                      placeholder="e.g. BSc Math Scholar, Literature graduate"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      style={{ padding: '12px 16px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </>
              )}

              {/* Admin-specific: Access Code */}
              {role === 'admin' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-orange)' }}>Admin Verification Passcode *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter invite passcode to whitelist admin"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    style={{ padding: '12px 16px', border: '1.5px dashed var(--accent-orange)', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Use <code>INKADMIN2026</code> to verify on sandbox.
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--accent-orange)',
                  color: '#FFFFFF',
                  padding: '14px',
                  fontWeight: '800',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  border: '2px solid var(--border-editorial)',
                  boxShadow: '4px 4px 0 var(--border-editorial)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  letterSpacing: '0.05em',
                  transition: 'var(--transition-smooth)',
                  marginTop: '10px'
                }}
              >
                Create Account & Log In ↗
              </button>

            </form>

          </div>
          
        </section>

      </main>

    </div>
  );
};
