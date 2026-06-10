import React, { useState } from 'react';

interface FontOption {
  id: string;
  name: string;
  className: string;
  style: string;
}

const FONTS: FontOption[] = [
  { id: 'caveat', name: 'Elegant Cursive', className: 'font-caveat', style: "'Caveat', cursive" },
  { id: 'reenie', name: 'Quick Scribble', className: 'font-reenie', style: "'Reenie Beanie', cursive" },
  { id: 'architect', name: 'Neat Block Print', className: 'font-architect', style: "'Architects Daughter', sans-serif" },
  { id: 'shadows', name: 'Stylized Script', className: 'font-shadows', style: "'Shadows Into Light', cursive" },
  { id: 'patrick', name: 'Student Handwriting', className: 'font-patrick', style: "'Patrick Hand', cursive" },
];

const INK_COLORS = [
  { id: 'blue', name: 'Ink Blue', value: '#1043CA' },
  { id: 'black', name: 'Charcoal Black', value: '#1A1A1A' },
  { id: 'pencil', name: 'Pencil Grey', value: '#5A5E66' },
];

const PAPER_STYLES = [
  { id: 'lined', name: 'Lined Notebook', bg: 'linear-gradient(rgba(16, 67, 202, 0.08) 1.5px, transparent 1.5px)', size: '100% 28px' },
  { id: 'grid', name: 'Graph Grid', bg: 'linear-gradient(rgba(16, 67, 202, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 67, 202, 0.05) 1px, transparent 1px)', size: '20px 20px, 20px 20px' },
  { id: 'plain', name: 'Plain Paper', bg: 'none', size: 'auto' },
];

export const HandwritingSimulator: React.FC = () => {
  const [text, setText] = useState<string>(
    "Dear Professor,\n\nHere is my completed assignment for the InkLink demo. I'm showcasing how realistic handwriting looks on this interactive platform. The service matches students with expert writers who write out work by hand with precision.\n\nBest regards,\nAlex"
  );
  const [selectedFont, setSelectedFont] = useState<FontOption>(FONTS[0]);
  const [selectedInk, setSelectedInk] = useState(INK_COLORS[0]);
  const [selectedPaper, setSelectedPaper] = useState(PAPER_STYLES[0]);
  const [fontSize, setFontSize] = useState<number>(20);

  return (
    <div className="border-bottom" style={{ borderColor: 'var(--border-editorial)' }}>
      <div className="section-container" style={{ padding: '80px 40px' }}>
        
        {/* Section Heading in Veson Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '48px' }}>
          <div style={{ gridColumn: 'span 8' }}>
            <span className="pill-badge badge-orange" style={{ marginBottom: '16px' }}>Interactive Sandbox</span>
            <h2 className="font-display-condensed" style={{ fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: '1.0' }}>
              Handwriting <br />
              <span style={{ color: 'var(--accent-orange)' }}>Simulator</span>
            </h2>
          </div>
          <div style={{ gridColumn: 'span 4', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '300px', textAlign: 'right' }}>
              Test how your digital text looks when rewritten by our team of professional hand-writers.
            </p>
          </div>
        </div>

        {/* Simulator Workspace Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>
          
          {/* Settings panel - Left */}
          <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Input Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1. Type Your Assignment Content
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{
                  width: '100%',
                  height: '180px',
                  padding: '16px',
                  border: '1.5px solid var(--border-editorial)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-dark)',
                  resize: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  boxShadow: '4px 4px 0 var(--border-editorial)'
                }}
                placeholder="Enter assignment text here..."
              />
            </div>

            {/* Font Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                2. Choose Writing Style / Font
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setSelectedFont(font)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: '600',
                      border: '1.5px solid var(--border-editorial)',
                      backgroundColor: selectedFont.id === font.id ? 'var(--border-editorial)' : 'transparent',
                      color: selectedFont.id === font.id ? 'var(--bg-sand)' : 'var(--text-dark)',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Ink and Paper selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Ink Color Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  3. Select Ink Color
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                  {INK_COLORS.map((ink) => (
                    <button
                      key={ink.id}
                      onClick={() => setSelectedInk(ink)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: ink.value,
                        border: selectedInk.id === ink.id ? '2.5px solid var(--accent-orange)' : '1px solid var(--border-editorial)',
                        cursor: 'pointer',
                        transform: selectedInk.id === ink.id ? 'scale(1.15)' : 'none',
                        transition: 'var(--transition-smooth)'
                      }}
                      title={ink.name}
                    />
                  ))}
                </div>
              </div>

              {/* Paper Background Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  4. Paper Background
                </label>
                <select
                  value={selectedPaper.id}
                  onChange={(e) => {
                    const found = PAPER_STYLES.find(p => p.id === e.target.value);
                    if (found) setSelectedPaper(found);
                  }}
                  style={{
                    padding: '8px 12px',
                    border: '1.5px solid var(--border-editorial)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--text-dark)',
                    outline: 'none',
                    fontWeight: '600',
                    fontSize: '13px'
                  }}
                >
                  {PAPER_STYLES.map(paper => (
                    <option key={paper.id} value={paper.id}>{paper.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Font Size slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  5. Writing Size
                </label>
                <span style={{ fontSize: '12px', fontWeight: '600', fontFamily: 'monospace' }}>{fontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="32"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--accent-orange)',
                  cursor: 'pointer'
                }}
              />
            </div>

          </div>

          {/* Paper Mockup - Right */}
          <div style={{ gridColumn: 'span 7' }}>
            <div className="notebook-container">
              {/* Binder rings and header bar */}
              <div className="notebook-header" style={{ justifyContent: 'space-between' }}>
                <span>PAGE NO: 01</span>
                <span>DATE: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              
              {/* Paper Area */}
              <div
                style={{
                  minHeight: '340px',
                  padding: '24px 30px 24px 50px',
                  position: 'relative',
                  backgroundColor: '#FAF9F6',
                  backgroundImage: selectedPaper.bg,
                  backgroundSize: selectedPaper.size,
                  color: selectedInk.value,
                  fontFamily: selectedFont.style,
                  fontSize: `${fontSize}px`,
                  lineHeight: '28px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  transition: 'color 0.3s ease, font-family 0.3s ease'
                }}
              >
                {/* Simulated Red vertical margin line on left */}
                {selectedPaper.id === 'lined' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '38px',
                      width: '1.5px',
                      height: '100%',
                      backgroundColor: 'rgba(235, 52, 52, 0.25)'
                    }}
                  />
                )}
                {text || <span style={{ opacity: 0.3 }}>Your handwritten preview will show up here...</span>}
              </div>
            </div>
            
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }} className="animate-pulse-slow"></span>
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                This is a live rendering. Real work is 100% written by actual humans.
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
