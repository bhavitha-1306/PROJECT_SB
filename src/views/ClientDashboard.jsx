import React, { useState, useEffect } from 'react';
import { PlusCircle, FileText, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';

export const ClientDashboard = ({ user, onLogout, onGoBack }) => {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Chemistry');
  const [pages, setPages] = useState(10);
  const [deadline, setDeadline] = useState('3 Days');
  const [complexity, setComplexity] = useState('text');
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  
  // Chat Modal states
  const [activeChatOrder, setActiveChatOrder] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Scan modal states
  const [activeScanOrder, setActiveScanOrder] = useState(null);

  // Seed initial data or load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('inklink_assignments');
    if (saved) {
      setAssignments(JSON.parse(saved));
    } else {
      const initial = [
        {
          id: '1',
          title: 'Chemistry Lab Report 4',
          subject: 'Chemistry',
          pages: 15,
          deadline: '3 Days',
          complexity: 'technical',
          price: 680,
          status: 'accepted',
          writerName: 'Neha Sharma',
          writerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
        },
        {
          id: '2',
          title: 'English Lit Essay on Hamlet',
          subject: 'English',
          pages: 8,
          deadline: '5 Days',
          complexity: 'text',
          price: 280,
          status: 'completed',
          writerName: 'Pooja Singh',
          writerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
          scanUrl: 'true'
        }
      ];
      setAssignments(initial);
      localStorage.setItem('inklink_assignments', JSON.stringify(initial));
    }
  }, []);

  const saveToStorage = (updated) => {
    setAssignments(updated);
    localStorage.setItem('inklink_assignments', JSON.stringify(updated));
  };

  // Pricing calculations
  const getBaseRate = () => 35; // standard gold rate
  const getMultiplier = () => {
    if (complexity === 'technical') return 1.3;
    if (complexity === 'diagrams') return 1.5;
    return 1.0;
  };
  const pricePerPage = Math.round(getBaseRate() * getMultiplier());
  const calculatedPrice = pricePerPage * pages;

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!title) return;

    const newOrder = {
      id: `ord_${Math.floor(Math.random() * 90000 + 10000)}`,
      title,
      subject,
      pages,
      deadline,
      complexity,
      price: calculatedPrice,
      status: 'pending'
    };

    const updated = [newOrder, ...assignments];
    saveToStorage(updated);
    setTitle('');
    setShowNewOrderForm(false);

    // Sync notification log
    const prevAlerts = JSON.parse(localStorage.getItem('inklink_notifications') || '[]');
    localStorage.setItem('inklink_notifications', JSON.stringify([
      { id: Date.now(), text: `New Assignment "${title}" posted to Writer Pool.`, time: 'Just now' },
      ...prevAlerts
    ]));
  };

  const handleOpenChat = (order) => {
    setActiveChatOrder(order);
    setChatMessages([
      { sender: order.writerName || 'Writer', text: `Hi, I am working on "${order.title}". Let me know if you have specific margins or guidelines.`, time: '10:30 AM' },
      { sender: 'You', text: `Thanks! Please keep the handwriting cursive and use blue gel ink.`, time: '10:32 AM' }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatOrder) return;

    const updatedMessages = [
      ...chatMessages,
      { sender: 'You', text: newMessage, time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) }
    ];
    setChatMessages(updatedMessages);
    setNewMessage('');

    // Mock response after 1 second
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: activeChatOrder.writerName || 'Writer', text: 'Got it. I will follow those specifications perfectly!', time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1200);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-sand)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Dashboard Sub-Header / Nav */}
      <header className="border-bottom" style={{ borderColor: 'var(--border-editorial)', backgroundColor: '#FFFFFF' }}>
        <div className="section-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>Client Space</span>
            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '2px 0 0 0', letterSpacing: '-0.02em' }}>Welcome, {user.name}</h1>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={onGoBack} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '12px' }}>
              Public Landing ↗
            </button>
            <button onClick={onLogout} className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px', boxShadow: 'none' }}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="section-container" style={{ padding: '40px' }}>
        
        {/* Actions bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 className="font-display-condensed" style={{ fontSize: '28px' }}>My Active Assignments</h2>
          <button
            onClick={() => setShowNewOrderForm(true)}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '13px' }}
          >
            <PlusCircle size={16} />
            Post New Assignment ↗
          </button>
        </div>

        {/* Assignments Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
          
          {/* Main List - Left */}
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {assignments.length === 0 ? (
              <div style={{ backgroundColor: '#FFFFFF', border: '1.5px dashed var(--border-editorial)', padding: '64px', textAlign: 'center' }}>
                <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>No Assignments Posted Yet</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Submit a prompt to calculate rates and notify our writers network.</p>
                <button onClick={() => setShowNewOrderForm(true)} className="btn-secondary">Get Started Now</button>
              </div>
            ) : (
              assignments.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid var(--border-editorial)',
                    padding: '28px',
                    boxShadow: '4px 4px 0 var(--border-editorial)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ID: {ord.id}</span>
                      <h3 style={{ fontSize: '18px', fontWeight: '900', margin: '4px 0' }}>{ord.title}</h3>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                        <span>Subject: <strong>{ord.subject}</strong></span>
                        <span>•</span>
                        <span>Pages: <strong>{ord.pages}</strong></span>
                        <span>•</span>
                        <span>Deadline: <strong>{ord.deadline}</strong></span>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          color: '#FFFFFF',
                          backgroundColor: ord.status === 'pending' ? 'var(--accent-orange)' :
                                           ord.status === 'accepted' ? 'var(--accent-ink)' : 'var(--accent-green)'
                        }}
                      >
                        {ord.status}
                      </span>
                      <div style={{ fontSize: '20px', fontWeight: '900', marginTop: '8px', color: 'var(--text-dark)' }}>₹{ord.price}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    
                    {/* Writer Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {ord.writerName ? (
                        <>
                          <img src={ord.writerAvatar} alt={ord.writerName} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-editorial)' }} />
                          <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Assigned Writer</div>
                            <div style={{ fontSize: '13px', fontWeight: '700' }}>{ord.writerName}</div>
                          </div>
                        </>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-orange)' }} className="animate-pulse-slow"></span>
                          Pending writer whitelisting...
                        </div>
                      )}
                    </div>

                    {/* CTAs */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {ord.status !== 'pending' && (
                        <button
                          onClick={() => handleOpenChat(ord)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            fontSize: '12px',
                            fontWeight: '700',
                            border: '1px solid var(--border-editorial)',
                            backgroundColor: '#FFFFFF',
                            cursor: 'pointer'
                          }}
                        >
                          <MessageSquare size={14} />
                          Chat
                        </button>
                      )}

                      {ord.status === 'completed' && (
                        <button
                          onClick={() => setActiveScanOrder(ord)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            fontSize: '12px',
                            fontWeight: '700',
                            backgroundColor: 'var(--accent-green)',
                            color: '#FFFFFF',
                            border: '1px solid var(--border-editorial)',
                            cursor: 'pointer'
                          }}
                        >
                          <ExternalLink size={14} />
                          View Scans
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sandbox Info - Right */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px', letterSpacing: '0.02em' }}>Escrow Guarantee</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                Your payment of <strong>₹{assignments.reduce((sum, item) => sum + (item.status !== 'completed' ? item.price : 0), 0)}</strong> for active assignments is locked safely in the InkLink smart contract. Funds are only paid out once you approve writer scans.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--accent-green)', fontWeight: '700' }}>
                <CheckCircle2 size={14} />
                Secured by Razorpay locks
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--border-editorial)', color: 'var(--bg-sand)', padding: '24px', border: '1.5px solid var(--border-editorial)' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Sandbox Simulations</h4>
              <p style={{ fontSize: '12px', opacity: 0.8, lineHeight: '1.5' }}>
                Log out and register a **Writer** account with style details. You will find your posted jobs on the public job board, ready to accept!
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL: Post New Assignment Form */}
      {showNewOrderForm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifycontent: 'center', zIndex: 999, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', width: '100%', maxWidth: '500px', boxShadow: '8px 8px 0 var(--border-editorial)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1.5px solid var(--border-editorial)', backgroundColor: 'var(--bg-sand)' }}>
              <h4 style={{ fontSize: '15px', margin: 0, fontWeight: '900' }}>Post Assignment Prompt</h4>
              <button onClick={() => setShowNewOrderForm(false)} style={{ fontSize: '18px', fontWeight: '900', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleCreateOrder} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800' }}>Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. History Essays - Cold War"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ padding: '10px', border: '1.5px solid var(--border-editorial)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800' }}>Subject Type</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{ padding: '10px', border: '1.5px solid var(--border-editorial)', fontSize: '13px', fontWeight: '600', outline: 'none' }}
                  >
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                    <option value="Math">Math</option>
                    <option value="History">History</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800' }}>Deadline</label>
                  <select
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    style={{ padding: '10px', border: '1.5px solid var(--border-editorial)', fontSize: '13px', fontWeight: '600', outline: 'none' }}
                  >
                    <option value="24 Hours">24 Hours (Rush)</option>
                    <option value="48 Hours">48 Hours</option>
                    <option value="3 Days">3 Days</option>
                    <option value="5 Days">5 Days</option>
                    <option value="7 Days">7 Days</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800' }}>Complexity Grade</label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    style={{ padding: '10px', border: '1.5px solid var(--border-editorial)', fontSize: '13px', fontWeight: '600', outline: 'none' }}
                  >
                    <option value="text">Text and Essays</option>
                    <option value="technical">Math / Equations (+30%)</option>
                    <option value="diagrams">Diagrams / Drawing (+50%)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800' }}>Pages ({pages})</label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={pages}
                    onChange={(e) => setPages(parseInt(e.target.value))}
                    style={{ accentColor: 'var(--accent-orange)', cursor: 'pointer', marginTop: '10px' }}
                  />
                </div>
              </div>

              {/* Estimate Receipt block */}
              <div style={{ backgroundColor: 'var(--bg-sand)', padding: '14px', border: '1px solid var(--border-editorial)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Estimated Escrow Quote</div>
                  <div style={{ fontSize: '18px', fontWeight: '900' }}>₹{calculatedPrice}</div>
                </div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--accent-orange)',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '800',
                    border: '1px solid var(--border-editorial)',
                    boxShadow: '2px 2px 0 var(--border-editorial)',
                    cursor: 'pointer'
                  }}
                >
                  Confirm & Post ↗
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: Chat Simulator */}
      {activeChatOrder && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', width: '100%', maxWidth: '480px', height: '480px', display: 'flex', flexDirection: 'column', boxShadow: '8px 8px 0 var(--border-editorial)' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1.5px solid var(--border-editorial)', backgroundColor: 'var(--bg-sand)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={activeChatOrder.writerAvatar} alt={activeChatOrder.writerName} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border-editorial)' }} />
                <div>
                  <h4 style={{ fontSize: '13px', margin: 0, fontWeight: '800' }}>{activeChatOrder.writerName}</h4>
                  <span style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: '700' }}>● Online</span>
                </div>
              </div>
              <button onClick={() => setActiveChatOrder(null)} style={{ fontSize: '18px', fontWeight: '900', cursor: 'pointer' }}>×</button>
            </div>

            {/* Message Pane */}
            <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#FAF9F6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.sender === 'You' ? 'var(--border-editorial)' : '#FFFFFF',
                    color: msg.sender === 'You' ? 'var(--bg-sand)' : 'var(--text-dark)',
                    padding: '8px 14px',
                    border: '1px solid var(--border-editorial)',
                    maxWidth: '80%',
                    fontSize: '13px',
                    borderRadius: '4px',
                    boxShadow: msg.sender === 'You' ? 'none' : '2px 2px 0 var(--border-editorial)'
                  }}
                >
                  <p>{msg.text}</p>
                  <span style={{ display: 'block', fontSize: '9px', textAlign: 'right', marginTop: '4px', opacity: 0.7 }}>{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendMessage} style={{ padding: '12px', borderTop: '1.5px solid var(--border-editorial)', display: 'flex', gap: '8px', backgroundColor: '#FFFFFF' }}>
              <input
                type="text"
                placeholder="Type message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flexGrow: 1, padding: '8px 12px', border: '1px solid var(--border-editorial)', fontSize: '13px', outline: 'none' }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--border-editorial)',
                  color: 'var(--bg-sand)',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '800',
                  border: '1.5px solid var(--border-editorial)',
                  cursor: 'pointer'
                }}
              >
                Send
              </button>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: View Scans Preview */}
      {activeScanOrder && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', width: '100%', maxWidth: '540px', boxShadow: '8px 8px 0 var(--border-editorial)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1.5px solid var(--border-editorial)', backgroundColor: 'var(--bg-sand)' }}>
              <h4 style={{ fontSize: '14px', margin: 0, fontWeight: '900' }}>Review Scanned Assignment PDF</h4>
              <button onClick={() => setActiveScanOrder(null)} style={{ fontSize: '18px', fontWeight: '900', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Lined Notebook Paper scan */}
              <div
                style={{
                  backgroundColor: '#FAF9F5',
                  border: '1.5px solid var(--border-editorial)',
                  padding: '32px 32px 32px 48px',
                  position: 'relative',
                  backgroundImage: 'linear-gradient(rgba(16, 67, 202, 0.05) 1px, transparent 1px)',
                  backgroundSize: '100% 24px',
                  minHeight: '240px',
                  color: '#1043CA',
                  fontFamily: "'Caveat', cursive",
                  fontSize: '20px',
                  lineHeight: '24px'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: '32px', width: '1.5px', height: '100%', backgroundColor: 'rgba(235, 52, 52, 0.25)' }}></div>
                <h5 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: '16px', color: 'var(--text-dark)', marginBottom: '12px' }}>
                  {activeScanOrder.title}
                </h5>
                <p>
                  1. Duality refers to the co-existence of two opposing principles, such as good and evil, within a single human entity.<br /><br />
                  2. Jekyll\'s experiment aims to separate these elements physically, releasing "Edward Hyde" as a pure manifestation of his dark impulses.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  onClick={() => {
                    alert('Assignment approved! Escrow payment released to Pooja.');
                    setActiveScanOrder(null);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--accent-green)',
                    color: '#FFFFFF',
                    padding: '12px',
                    fontWeight: '800',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    border: '1.5px solid var(--border-editorial)',
                    boxShadow: '3px 3px 0 var(--border-editorial)',
                    cursor: 'pointer'
                  }}
                >
                  Approve & Release Payment ✓
                </button>
                <button
                  onClick={() => alert('Dispute ticket raised. Admin notified.')}
                  style={{
                    flex: 1,
                    backgroundColor: '#E11D48',
                    color: '#FFFFFF',
                    padding: '12px',
                    fontWeight: '800',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    border: '1.5px solid var(--border-editorial)',
                    boxShadow: '3px 3px 0 var(--border-editorial)',
                    cursor: 'pointer'
                  }}
                >
                  Raise Quality Dispute ⚠
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
