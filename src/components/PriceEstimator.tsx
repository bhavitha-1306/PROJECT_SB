import React, { useState } from 'react';

export const PriceEstimator: React.FC = () => {
  const [pages, setPages] = useState<number>(10);
  const [deadline, setDeadline] = useState<number>(3); // days
  const [writerRank, setWriterRank] = useState<'standard' | 'gold' | 'elite'>('gold');
  const [complexity, setComplexity] = useState<'text' | 'technical' | 'diagrams'>('text');
  const [showInvoiceMsg, setShowInvoiceMsg] = useState<boolean>(false);

  // Pricing formula
  const getBaseRatePerPage = () => {
    switch (writerRank) {
      case 'standard': return 25; // Rs. 25 per page
      case 'gold': return 35;     // Rs. 35 per page
      case 'elite': return 50;    // Rs. 50 per page
    }
  };

  const getComplexityMultiplier = () => {
    switch (complexity) {
      case 'text': return 1.0;
      case 'technical': return 1.3; // Math formulas take longer
      case 'diagrams': return 1.5;  // Drawing charts takes longer
    }
  };

  const getDeadlineMultiplier = () => {
    if (deadline === 1) return 1.5; // 24h rush fee
    if (deadline === 2) return 1.25;
    return 1.0;
  };

  const pricePerPage = Math.round(getBaseRatePerPage() * getComplexityMultiplier() * getDeadlineMultiplier());
  const totalPrice = pricePerPage * pages;
  const platformFee = Math.round(totalPrice * 0.15);
  const writerPayout = totalPrice - platformFee;

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowInvoiceMsg(true);
    setTimeout(() => {
      setShowInvoiceMsg(false);
    }, 4000);
  };

  return (
    <div className="border-bottom" style={{ borderColor: 'var(--border-editorial)' }}>
      <div className="section-container" style={{ padding: '80px 40px' }}>
        
        {/* Header Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '48px' }}>
          <div style={{ gridColumn: 'span 4' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '300px' }}>
              Clear, upfront pricing. Calculate details instantly and pick the writer that matches your academic requirements.
            </p>
          </div>
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
            <span className="pill-badge badge-orange" style={{ marginBottom: '16px' }}>Cost Calculator</span>
            <h2 className="font-display-condensed" style={{ fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: '1.0' }}>
              Instant Price <br />
              <span style={{ color: 'var(--accent-orange)' }}>Estimator</span>
            </h2>
          </div>
        </div>

        {/* Calculator workspace */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>
          
          {/* Controls - Left */}
          <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Pages Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  1. Number of Pages
                </span>
                <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--accent-orange)' }}>{pages} pages</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={pages}
                onChange={(e) => setPages(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-orange)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>1 Page</span>
                <span>50 Pages</span>
                <span>100 Pages</span>
              </div>
            </div>

            {/* Writer Quality Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                2. Writer Experience Rank
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                
                {/* Standard */}
                <button
                  type="button"
                  onClick={() => setWriterRank('standard')}
                  style={{
                    padding: '16px',
                    border: '1.5px solid var(--border-editorial)',
                    backgroundColor: writerRank === 'standard' ? 'var(--border-editorial)' : '#FFFFFF',
                    color: writerRank === 'standard' ? 'var(--bg-sand)' : 'var(--text-dark)',
                    textAlign: 'left',
                    boxShadow: writerRank === 'standard' ? 'none' : '4px 4px 0 var(--border-editorial)',
                    transition: 'var(--transition-smooth)',
                    transform: writerRank === 'standard' ? 'translate(2px, 2px)' : 'none'
                  }}
                >
                  <div style={{ fontWeight: '800', fontSize: '13px', textTransform: 'uppercase' }}>Standard</div>
                  <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>₹25/page base rate. Verified neat penmanship.</div>
                </button>

                {/* Gold */}
                <button
                  type="button"
                  onClick={() => setWriterRank('gold')}
                  style={{
                    padding: '16px',
                    border: '2px solid var(--border-editorial)',
                    backgroundColor: writerRank === 'gold' ? 'var(--border-editorial)' : '#FFFFFF',
                    color: writerRank === 'gold' ? 'var(--bg-sand)' : 'var(--text-dark)',
                    textAlign: 'left',
                    boxShadow: writerRank === 'gold' ? 'none' : '4px 4px 0 var(--border-editorial)',
                    transition: 'var(--transition-smooth)',
                    transform: writerRank === 'gold' ? 'translate(2px, 2px)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '800', fontSize: '13px', textTransform: 'uppercase' }}>Gold Class</span>
                    <span style={{ fontSize: '8px', padding: '2px 6px', backgroundColor: 'var(--accent-orange)', color: '#FFFFFF', borderRadius: '4px', fontWeight: '800' }}>BEST</span>
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>₹35/page base rate. Subject experts. Highly rated.</div>
                </button>

                {/* Elite */}
                <button
                  type="button"
                  onClick={() => setWriterRank('elite')}
                  style={{
                    padding: '16px',
                    border: '1.5px solid var(--border-editorial)',
                    backgroundColor: writerRank === 'elite' ? 'var(--border-editorial)' : '#FFFFFF',
                    color: writerRank === 'elite' ? 'var(--bg-sand)' : 'var(--text-dark)',
                    textAlign: 'left',
                    boxShadow: writerRank === 'elite' ? 'none' : '4px 4px 0 var(--border-editorial)',
                    transition: 'var(--transition-smooth)',
                    transform: writerRank === 'elite' ? 'translate(2px, 2px)' : 'none'
                  }}
                >
                  <div style={{ fontWeight: '800', fontSize: '13px', textTransform: 'uppercase' }}>Elite Level</div>
                  <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>₹50/page base rate. Flawless script. Custom formatting.</div>
                </button>

              </div>
            </div>

            {/* Deadline & Complexity row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Deadline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  3. Delivery Timeframe
                </span>
                <select
                  value={deadline}
                  onChange={(e) => setDeadline(parseInt(e.target.value))}
                  style={{
                    padding: '12px',
                    border: '1.5px solid var(--border-editorial)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--text-dark)',
                    fontWeight: '600',
                    outline: 'none',
                    boxShadow: '4px 4px 0 var(--border-editorial)'
                  }}
                >
                  <option value={1}>24 Hours (Express Rush +50%)</option>
                  <option value={2}>48 Hours (Fast +25%)</option>
                  <option value={3}>3 Days (Standard rate)</option>
                  <option value={5}>5 Days (Standard rate)</option>
                  <option value={7}>7 Days (Standard rate)</option>
                </select>
              </div>

              {/* Complexity */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  4. Assignment Type
                </span>
                <select
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value as any)}
                  style={{
                    padding: '12px',
                    border: '1.5px solid var(--border-editorial)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--text-dark)',
                    fontWeight: '600',
                    outline: 'none',
                    boxShadow: '4px 4px 0 var(--border-editorial)'
                  }}
                >
                  <option value="text">Text and Essays (Normal)</option>
                  <option value="technical">Math / Equations (+30%)</option>
                  <option value="diagrams">Diagrams and Drawings (+50%)</option>
                </select>
              </div>

            </div>

          </div>

          {/* Pricing Invoice mockup - Right */}
          <div style={{ gridColumn: 'span 5' }}>
            <form
              onSubmit={handleOrderSubmit}
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid var(--border-editorial)',
                padding: '32px',
                boxShadow: '8px 8px 0 var(--border-editorial)',
                position: 'relative'
              }}
            >
              {/* Receipt Heading */}
              <div style={{ borderBottom: '1px dashed var(--border-editorial)', paddingBottom: '20px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', margin: 0, letterSpacing: '0.05em' }}>InkLink Invoice</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0', fontFamily: 'monospace' }}>ESTIMATE ID: #IL-{Math.floor(Math.random() * 900000 + 100000)}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Base Page Rate ({writerRank})</span>
                  <span style={{ fontWeight: '600' }}>₹{getBaseRatePerPage()} / page</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Complexity Multiplier</span>
                  <span style={{ fontWeight: '600' }}>x {getComplexityMultiplier()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Rush Delivery Charge</span>
                  <span style={{ fontWeight: '600' }}>x {getDeadlineMultiplier()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Rate per page (Final)</span>
                  <span style={{ fontWeight: '600' }}>₹{pricePerPage}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Pages</span>
                  <span style={{ fontWeight: '600' }}>{pages}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Writer Compensation</span>
                  <span style={{ fontWeight: '500', color: 'var(--accent-green)' }}>₹{writerPayout}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Platform Service Fee (15%)</span>
                  <span style={{ fontWeight: '500' }}>₹{platformFee}</span>
                </div>
              </div>

              {/* Total Box */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-sand)',
                  padding: '16px',
                  border: '1.5px solid var(--border-editorial)',
                  marginBottom: '24px'
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Estimated Total:</span>
                <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-dark)' }}>₹{totalPrice}</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--accent-orange)',
                  color: '#FFFFFF',
                  padding: '16px',
                  fontWeight: '800',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  border: '2px solid var(--border-editorial)',
                  boxShadow: '4px 4px 0 var(--border-editorial)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  letterSpacing: '0.05em',
                  transition: 'var(--transition-smooth)'
                }}
                className="btn-submit-invoice"
              >
                Proceed to Writer Pool ↗
              </button>

              {/* Banner Success */}
              {showInvoiceMsg && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '24px',
                    zIndex: 2,
                    animation: 'scaleUp 0.2s ease'
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>✓</div>
                  <h4 style={{ fontSize: '16px', color: 'var(--text-dark)', marginBottom: '8px' }}>Quote Generated!</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Redirecting sandbox to writer selection screen...</p>
                </div>
              )}
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
