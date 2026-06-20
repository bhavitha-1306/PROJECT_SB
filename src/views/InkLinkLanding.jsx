import React, { useState, useEffect } from 'react';
import { HandwritingSimulator } from '../components/HandwritingSimulator';
import { WorkflowShowcase } from '../components/WorkflowShowcase';
import { PriceEstimator } from '../components/PriceEstimator';
import { ArrowUpRight, Star, CheckCircle2 } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { getWriters } from '../utils/writers';

export const InkLinkLanding = ({ currentUser, onLoginSuccess, onLogout, onGoToDashboard, onGoToSignup }) => {
  const [writers, setWriters] = useState(() => getWriters());
  const [activeSampleWriter, setActiveSampleWriter] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');

  useEffect(() => {
    setWriters(getWriters());
  }, [currentUser]);

  const handleScrollTo = (elementId) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setEmailInput('');
      }, 3000);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-sand)', minHeight: '100vh' }}>
      
      {/* 1. Header Navigation Bar (Veson Editorial Border System) */}
      <header className="border-bottom" style={{ borderColor: 'var(--border-editorial)', backgroundColor: 'transparent' }}>
        <div className="section-container nav-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => window.location.reload()}>
            <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--accent-orange)' }}>*</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '22px', letterSpacing: '-0.03em' }}>INKLINK</span>
          </div>

          <nav className="nav-links">
            <a href="#simulator" onClick={(e) => { e.preventDefault(); handleScrollTo('simulator'); }}>Simulator</a>
            <a href="#workflow" onClick={(e) => { e.preventDefault(); handleScrollTo('workflow'); }}>How It Works</a>
            <a href="#estimator" onClick={(e) => { e.preventDefault(); handleScrollTo('estimator'); }}>Pricing</a>
            <a href="#directory" onClick={(e) => { e.preventDefault(); handleScrollTo('directory'); }}>Our Writers</a>
          </nav>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {currentUser ? (
              <>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-orange)' }}>
                  ● {currentUser.name} ({currentUser.role.toUpperCase()})
                </span>
                <button
                  onClick={onGoToDashboard}
                  style={{ 
                    padding: '8px 18px', 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    borderRadius: '9999px', 
                    backgroundColor: 'var(--border-editorial)', 
                    color: 'var(--bg-sand)',
                    border: '1.5px solid var(--border-editorial)',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-dark)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--border-editorial)';
                    e.currentTarget.style.color = 'var(--bg-sand)';
                  }}
                >
                  Dashboard ↗
                </button>
                <button
                  onClick={onLogout}
                  style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => { setAuthInitialTab('login'); setIsAuthModalOpen(true); }}
                  style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-dark)', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-orange)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dark)'}
                >
                  Login
                </button>
                <button 
                  onClick={onGoToSignup}
                  style={{ 
                    padding: '8px 18px', 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    borderRadius: '9999px', 
                    backgroundColor: 'var(--border-editorial)', 
                    color: 'var(--bg-sand)',
                    border: '1.5px solid var(--border-editorial)',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-dark)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--border-editorial)';
                    e.currentTarget.style.color = 'var(--bg-sand)';
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section - Double Column Grid with borders */}
      <section className="border-bottom" style={{ borderColor: 'var(--border-editorial)' }}>
        <div className="section-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)' }}>
          
          {/* Hero Left Column */}
          <div 
            style={{ 
              gridColumn: 'span 7', 
              padding: '80px 40px',
              borderRight: '1px solid var(--border-editorial)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '32px'
            }}
          >
            <span className="pill-badge badge-orange" style={{ alignSelf: 'flex-start' }}>Phase 1 Launching</span>
            
            <h1 className="font-display-condensed" style={{ fontSize: 'clamp(44px, 6vw, 88px)', lineHeight: '0.85' }}>
              GET YOUR <br />
              ASSIGNMENTS <br />
              <span style={{ color: 'var(--accent-orange)' }}>HANDWRITTEN.</span>
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.5', maxWidth: '540px' }}>
              Ditch the digital printouts. We connect you with verified, human penmen to write out your academic assignments, lab sheets, accounts ledgers, and notebooks. 100% written by hand, delivered in scanned PDF or physical mail.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleScrollTo('estimator')} 
                className="btn-primary"
              >
                Hire A Writer ↗
              </button>
              <button 
                onClick={() => handleScrollTo('simulator')} 
                className="btn-secondary"
              >
                Test Handwriting Simulator
              </button>
            </div>

            {/* Quick value props list */}
            <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '24px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--accent-green)" />
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>100% Human Penmanship</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--accent-green)" />
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>On-Time Escrow Protect</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--accent-green)" />
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Doorstep Delivery Available</span>
              </div>
            </div>
          </div>

          {/* Hero Right Column - Image Showcase */}
          <div 
            style={{ 
              gridColumn: 'span 5',
              backgroundColor: '#FAF9F6',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Overlay grid lines for premium editorial aesthetic */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--border-light) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }}></div>
            
            <div style={{ padding: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid var(--border-editorial)', padding: '4px 10px', backgroundColor: '#FFFFFF' }}>Writer Spotlight</span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>01 / 04</span>
              </div>
              
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '24px', boxShadow: '6px 6px 0 var(--border-editorial)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <img src={writers[0]?.avatar} alt={writers[0]?.name} style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1.5px solid var(--border-editorial)', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800' }}>{writers[0]?.name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{writers[0]?.background}</span>
                  </div>
                </div>
                
                {/* Lined paper snippet inside hero */}
                <div style={{ backgroundColor: '#FCFAF5', border: '1.5px solid var(--border-editorial)', padding: '16px', height: '120px', backgroundImage: 'linear-gradient(rgba(16, 67, 202, 0.05) 1px, transparent 1px)', backgroundSize: '100% 20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: '20px', width: '1px', height: '100%', backgroundColor: 'rgba(255,0,0,0.15)' }}></div>
                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: '16px', color: '#1043CA', lineHeight: '20px', paddingLeft: '12px' }}>
                    Dear Client, I take extra care of heading styles, margins, and equation clarity for all science reports.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom info section */}
            <div style={{ padding: '40px', borderTop: '1px solid var(--border-editorial)', backgroundColor: 'var(--border-editorial)', color: 'var(--bg-sand)', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'var(--font-display)' }}>₹25 <span style={{ fontSize: '13px', fontWeight: '500' }}>/ page starting</span></div>
                  <div style={{ fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>Standard rates based on writer ranks</div>
                </div>
                <button 
                  onClick={() => handleScrollTo('estimator')}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--bg-sand)', color: '#FFFFFF', transition: 'var(--transition-smooth)' }}
                  className="hero-arrow-btn"
                >
                  <ArrowUpRight size={20} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Text Tagline Banner */}
      <section className="border-bottom" style={{ borderColor: 'var(--border-editorial)', overflow: 'hidden', whiteSpace: 'nowrap', padding: '24px 0', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', gap: '48px', animation: 'marquee 25s linear infinite', width: 'max-content' }}>
          <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-orange)' }}>★</span> 100% HUMAN PENMANSHIP ONLY
          </span>
          <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-orange)' }}>★</span> ZERO GENERATIVE AI
          </span>
          <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-orange)' }}>★</span> FAST EXTREME DELIVERY IN 24H
          </span>
          <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-orange)' }}>★</span> VERIFIED ACADEMIC WRITERS
          </span>
          <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-orange)' }}>★</span> SCAN PDF & DIRECT POST MAIL
          </span>
        </div>
      </section>

      {/* 4. Stats Counters Section */}
      <section className="border-bottom" style={{ borderColor: 'var(--border-editorial)', backgroundColor: '#FAF9F6' }}>
        <div className="section-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div style={{ padding: '32px 40px', borderLeft: '1px solid var(--border-editorial)', borderRight: '1px solid var(--border-editorial)', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', fontWeight: '900', color: 'var(--text-dark)', fontFamily: 'var(--font-display)' }}>15K+</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginTop: '4px' }}>Assignments Completed</div>
          </div>
          <div style={{ padding: '32px 40px', borderRight: '1px solid var(--border-editorial)', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', fontWeight: '900', color: 'var(--text-dark)', fontFamily: 'var(--font-display)' }}>320+</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginTop: '4px' }}>Verified Penmen Writers</div>
          </div>
          <div style={{ padding: '32px 40px', borderRight: '1px solid var(--border-editorial)', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', fontWeight: '900', color: 'var(--text-dark)', fontFamily: 'var(--font-display)' }}>4.9★</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginTop: '4px' }}>Penmanship Satisfaction Rating</div>
          </div>
          <div style={{ padding: '32px 40px', borderRight: '1px solid var(--border-editorial)', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', fontWeight: '900', color: 'var(--text-dark)', fontFamily: 'var(--font-display)' }}>24h</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginTop: '4px' }}>Fastest Rush Turnaround</div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Handwriting Simulator Section */}
      <div id="simulator">
        <HandwritingSimulator />
      </div>

      {/* 6. How it Works / Workflow Showcase Section */}
      <div id="workflow">
        <WorkflowShowcase />
      </div>

      {/* 7. Price Estimator Section */}
      <div id="estimator">
        <PriceEstimator />
      </div>

      {/* 8. Top Writers Registry Directory Section */}
      <section id="directory" className="border-bottom" style={{ borderColor: 'var(--border-editorial)' }}>
        <div className="section-container" style={{ padding: '80px 40px' }}>
          
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '48px' }}>
            <div style={{ gridColumn: 'span 8' }}>
              <span className="pill-badge badge-orange" style={{ marginBottom: '16px' }}>Penman Registry</span>
              <h2 className="font-display-condensed" style={{ fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: '1.0' }}>
                Meet Our Top <br />
                <span style={{ color: 'var(--accent-orange)' }}>Hand-Writers</span>
              </h2>
            </div>
            <div style={{ gridColumn: 'span 4', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '300px', textAlign: 'right' }}>
                All writers are vetted through strict handwriting checks. Click on any profile to see a writing sample snippet.
              </p>
            </div>
          </div>

          {/* Writers Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {writers.map((writer) => (
              <div
                key={writer.id}
                onClick={() => setActiveSampleWriter(writer)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid var(--border-editorial)',
                  padding: '24px',
                  boxShadow: '4px 4px 0 var(--border-editorial)',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                className="writer-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <img src={writer.avatar} alt={writer.name} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--border-editorial)', objectFit: 'cover' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-sand)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-light)', fontSize: '11px', fontWeight: '700' }}>
                    <Star size={12} color="var(--accent-orange)" fill="var(--accent-orange)" />
                    {writer.rating}
                  </div>
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '4px' }}>{writer.name}</h4>
                <div style={{ fontSize: '11px', color: 'var(--accent-ink)', fontWeight: '700', marginBottom: '12px' }}>{writer.style}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', height: '36px', overflow: 'hidden' }}>{writer.background}</div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orders Completed</span>
                    <div style={{ fontSize: '14px', fontWeight: '800' }}>{writer.completed} jobs</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rate / Page</span>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-green)' }}>₹{writer.rate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Modal writer penmanship popup sample */}
        {activeSampleWriter && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
              padding: '20px'
            }}
            onClick={() => setActiveSampleWriter(null)}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid var(--border-editorial)',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '8px 8px 0 var(--border-editorial)',
                animation: 'scaleUp 0.15s ease'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1.5px solid var(--border-editorial)', backgroundColor: 'var(--bg-sand)' }}>
                <h4 style={{ fontSize: '16px', margin: 0 }}>Penmanship Sample</h4>
                <button onClick={() => setActiveSampleWriter(null)} style={{ fontSize: '18px', fontWeight: '900' }}>×</button>
              </div>
              
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                  <img src={activeSampleWriter.avatar} alt={activeSampleWriter.name} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--border-editorial)', objectFit: 'cover' }} />
                  <div>
                    <h5 style={{ fontSize: '14px', fontWeight: '800' }}>{activeSampleWriter.name}</h5>
                    <span style={{ fontSize: '12px', color: 'var(--accent-ink)', fontWeight: '700' }}>{activeSampleWriter.style}</span>
                  </div>
                </div>

                {/* Real handwriting image samples (if uploaded) */}
                {activeSampleWriter.images && activeSampleWriter.images.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                      Real Handwriting Samples
                    </span>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                      {activeSampleWriter.images.map((img, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            flexShrink: 0, 
                            width: '130px', 
                            height: '130px', 
                            border: '1.5px solid var(--border-editorial)', 
                            boxShadow: '2px 2px 0 var(--border-editorial)', 
                            backgroundColor: '#FFFFFF',
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <img 
                            src={img} 
                            alt={`Sample ${idx + 1}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => {
                              const w = window.open();
                              w.document.write(`<img src="${img}" style="max-width:100%; max-height:100%; display:block; margin:auto;"/>`);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>* Click any sample to view in full size</span>
                  </div>
                )}

                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Font Simulation Preview
                </span>
                <div style={{ backgroundColor: '#FAF9F5', border: '1.5px solid var(--border-editorial)', padding: '24px', position: 'relative', backgroundImage: 'linear-gradient(rgba(16, 67, 202, 0.05) 1px, transparent 1px)', backgroundSize: '100% 24px' }}>
                  <div style={{ position: 'absolute', top: 0, left: '24px', width: '1px', height: '100%', backgroundColor: 'rgba(255,0,0,0.15)' }}></div>
                  <p style={{
                    fontFamily: activeSampleWriter.id === '1' ? "'Caveat', cursive" :
                               activeSampleWriter.id === '2' ? "'Architects Daughter', sans-serif" :
                               activeSampleWriter.id === '3' ? "'Shadows Into Light', cursive" : "'Patrick Hand', cursive",
                    fontSize: '18px',
                    color: '#1043CA',
                    lineHeight: '24px',
                    paddingLeft: '16px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {activeSampleWriter.sampleText}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveSampleWriter(null);
                    handleScrollTo('estimator');
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--accent-orange)',
                    color: '#FFFFFF',
                    padding: '12px',
                    fontWeight: '800',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    marginTop: '20px',
                    border: '1.5px solid var(--border-editorial)',
                    boxShadow: '3px 3px 0 var(--border-editorial)',
                    cursor: 'pointer'
                  }}
                >
                  Hire {activeSampleWriter.name} Now ↗
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 9. Premium Newsletter and CTA Footer Banner */}
      <footer style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--bg-sand)', borderTop: '2px solid var(--border-editorial)' }}>
        <div className="section-container" style={{ padding: '80px 40px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>
            
            {/* Left Big Text */}
            <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 className="font-display-condensed" style={{ fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: '0.9', color: '#FFFFFF' }}>
                Join the Pen <br />
                <span style={{ color: 'var(--accent-orange)' }}>Revolution</span>
              </h2>
              <p style={{ color: 'rgba(247,245,240,0.7)', fontSize: '15px', maxWidth: '540px' }}>
                Stay up to date with new hand-writers Whitelisting announcements, custom paper stock options, and student promotional campaigns. No spam, only premium script updates.
              </p>

              {/* Newsletter Form */}
              <form onSubmit={handleSubscribe} style={{ display: 'flex', maxWidth: '480px', border: '1.5px solid var(--bg-sand)', padding: '4px', backgroundColor: 'rgba(255,255,255,0.05)', marginTop: '8px' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  style={{
                    flexGrow: 1,
                    padding: '12px 16px',
                    fontSize: '13px',
                    color: '#FFFFFF',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--accent-orange)',
                    color: '#FFFFFF',
                    padding: '10px 24px',
                    fontWeight: '800',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Subscribe ↗
                </button>
              </form>

              {newsletterSubscribed && (
                <div style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: '700', marginTop: '-12px' }}>
                  ✓ Subscription confirmed! Welcome to the loop.
                </div>
              )}
            </div>

            {/* Right Quick Links */}
            <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', textAlign: 'right' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', marginBottom: '16px' }}>
                  <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--accent-orange)' }}>*</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '18px', letterSpacing: '-0.03em', color: '#FFFFFF' }}>INKLINK</span>
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(247,245,240,0.5)', lineHeight: '1.6' }}>
                  Handwritten assignment platform.<br />
                  Connecting students with vetted penmen.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(247,245,240,0.6)', marginTop: '40px' }}>
                <a href="#simulator" onClick={(e) => { e.preventDefault(); handleScrollTo('simulator'); }}>Simulator</a>
                <a href="#workflow" onClick={(e) => { e.preventDefault(); handleScrollTo('workflow'); }}>Workflow</a>
                <a href="#estimator" onClick={(e) => { e.preventDefault(); handleScrollTo('estimator'); }}>Pricing</a>
                <a href="#directory" onClick={(e) => { e.preventDefault(); handleScrollTo('directory'); }}>Writers</a>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-white)', paddingTop: '32px', marginTop: '64px', fontSize: '11px', color: 'rgba(247,245,240,0.4)' }}>
            <span>© 2026 INKLINK. All rights reserved. Vetted by human hand.</span>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>

        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={onLoginSuccess}
        initialTab={authInitialTab}
      />
    </div>
  );
};
