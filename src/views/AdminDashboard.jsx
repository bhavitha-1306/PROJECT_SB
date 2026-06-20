import React, { useState, useEffect } from 'react';
import { Users, RefreshCw } from 'lucide-react';

export const AdminDashboard = ({ user, onLogout, onGoBack }) => {
  const [assignments, setAssignments] = useState([]);
  const [pendingWriters, setPendingWriters] = useState([]);

  useEffect(() => {
    // Load orders
    const savedOrders = localStorage.getItem('inklink_assignments');
    if (savedOrders) {
      setAssignments(JSON.parse(savedOrders));
    }

    // Load pending writers or seed them
    const savedWriters = localStorage.getItem('inklink_pending_writers');
    if (savedWriters) {
      setPendingWriters(JSON.parse(savedWriters));
    } else {
      const initialWriters = [
        {
          id: 'w_1',
          name: 'Ravi Patel',
          email: 'ravi.patel@gmail.com',
          penmanship: 'Neat Block Print',
          background: 'BCom Student, Accounts Specialist',
          date: '1h ago'
        },
        {
          id: 'w_2',
          name: 'Sonia Mehta',
          email: 'sonia.mehta@outlook.com',
          penmanship: 'Stylized Script',
          background: 'BA English Honours Graduate',
          date: '3h ago'
        }
      ];
      setPendingWriters(initialWriters);
      localStorage.setItem('inklink_pending_writers', JSON.stringify(initialWriters));
    }
  }, []);

  const handleApproveWriter = (id, name) => {
    const updated = pendingWriters.filter(w => w.id !== id);
    setPendingWriters(updated);
    localStorage.setItem('inklink_pending_writers', JSON.stringify(updated));

    alert(`Writer ${name} whitelisted! They can now log in and claim assignments.`);
  };

  const handleRejectWriter = (id, name) => {
    const updated = pendingWriters.filter(w => w.id !== id);
    setPendingWriters(updated);
    localStorage.setItem('inklink_pending_writers', JSON.stringify(updated));

    alert(`Application for ${name} rejected.`);
  };

  const handleResetSandbox = () => {
    if (window.confirm('Reset local sandbox database? This will clear all orders and restore seed data.')) {
      localStorage.removeItem('inklink_assignments');
      localStorage.removeItem('inklink_pending_writers');
      window.location.reload();
    }
  };

  // Metrics calculations
  const totalVolume = assignments.reduce((sum, item) => sum + item.price, 0);
  const platformRevenue = Math.round(totalVolume * 0.15);
  const activeCount = assignments.filter(a => a.status === 'accepted').length;

  return (
    <div style={{ backgroundColor: 'var(--bg-sand)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Dashboard Sub-Header / Nav */}
      <header className="border-bottom" style={{ borderColor: 'var(--border-editorial)', backgroundColor: '#FFFFFF' }}>
        <div className="section-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>Admin Portal ({user.email})</span>
            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '2px 0 0 0', letterSpacing: '-0.02em' }}>InkLink Admin Panel</h1>
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
        
        {/* Central Platform Metrics Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
          
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-editorial)', padding: '20px', boxShadow: '3px 3px 0 var(--border-editorial)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Active Assignments</span>
            <div style={{ fontSize: '28px', fontWeight: '900', marginTop: '4px' }}>{activeCount} orders</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-editorial)', padding: '20px', boxShadow: '3px 3px 0 var(--border-editorial)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Total Page Volume</span>
            <div style={{ fontSize: '28px', fontWeight: '900', marginTop: '4px' }}>{assignments.reduce((sum, a) => sum + a.pages, 0)} pages</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-editorial)', padding: '20px', boxShadow: '3px 3px 0 var(--border-editorial)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Gross Volume</span>
            <div style={{ fontSize: '28px', fontWeight: '900', marginTop: '4px', color: 'var(--accent-green)' }}>₹{totalVolume}</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-editorial)', padding: '20px', boxShadow: '3px 3px 0 var(--border-editorial)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Platform Fees (15%)</span>
            <div style={{ fontSize: '28px', fontWeight: '900', marginTop: '4px', color: 'var(--accent-ink)' }}>₹{platformRevenue}</div>
          </div>

        </div>

        {/* Main Columns Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
          
          {/* Main workspace - Left */}
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Whitelisting queue */}
            <div>
              <h2 className="font-display-condensed" style={{ fontSize: '22px', marginBottom: '20px' }}>
                Pending Writer Applications ({pendingWriters.length})
              </h2>

              {pendingWriters.length === 0 ? (
                <div style={{ backgroundColor: '#FFFFFF', border: '1.5px dashed var(--border-editorial)', padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Users size={28} style={{ marginBottom: '8px' }} />
                  <p style={{ fontSize: '13px' }}>No pending applications. Whitelist queue is clear!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pendingWriters.map(writer => (
                    <div
                      key={writer.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid var(--border-editorial)',
                        padding: '20px',
                        boxShadow: '3px 3px 0 var(--border-editorial)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: '800' }}>{writer.name}</h4>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{writer.email}</span>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--accent-ink)', fontWeight: '700', marginTop: '4px' }}>
                          Style: {writer.penmanship}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {writer.background}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleApproveWriter(writer.id, writer.name)}
                          style={{
                            padding: '8px 16px',
                            fontSize: '11px',
                            fontWeight: '800',
                            backgroundColor: 'var(--accent-green)',
                            color: '#FFFFFF',
                            border: '1px solid var(--border-editorial)',
                            cursor: 'pointer'
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectWriter(writer.id, writer.name)}
                          style={{
                            padding: '8px 16px',
                            fontSize: '11px',
                            fontWeight: '800',
                            backgroundColor: '#E11D48',
                            color: '#FFFFFF',
                            border: '1px solid var(--border-editorial)',
                            cursor: 'pointer'
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Central Assignments Monitor */}
            <div>
              <h2 className="font-display-condensed" style={{ fontSize: '22px', marginBottom: '20px' }}>
                All Platform Assignments ({assignments.length})
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {assignments.map(a => (
                  <div
                    key={a.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid var(--border-editorial)',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '13px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <strong style={{ fontFamily: 'monospace' }}>{a.id}</strong>
                        <span>{a.title}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Pages: {a.pages} | Subject: {a.subject} | Assigned Writer: <strong>{a.writerName || 'None'}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <strong style={{ color: 'var(--accent-green)' }}>₹{a.price}</strong>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          color: '#FFFFFF',
                          backgroundColor: a.status === 'pending' ? 'var(--accent-orange)' :
                                           a.status === 'accepted' ? 'var(--accent-ink)' : 'var(--accent-green)'
                        }}
                      >
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Admin Sidebar Operations - Right */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px' }}>
                Complaint Desk
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ borderLeft: '2px solid #E11D48', paddingLeft: '12px', fontSize: '12px' }}>
                  <div style={{ fontWeight: '700', color: '#E11D48' }}>Dispute: #ORD-9071</div>
                  <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>Client claims handwriting resolution was blurry. Pending file check.</p>
                </div>
                <div style={{ borderLeft: '2px solid var(--accent-green)', paddingLeft: '12px', fontSize: '12px' }}>
                  <div style={{ fontWeight: '700', color: 'var(--accent-green)' }}>Resolved: #ORD-8451</div>
                  <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>Payment released successfully after scan approval.</p>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--border-editorial)', color: 'var(--bg-sand)', padding: '24px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={14} />
                Sandbox Operations
              </h4>
              <p style={{ fontSize: '12px', opacity: 0.8, lineHeight: '1.5', marginBottom: '16px' }}>
                Trigger system resets to return all tables (assignments, whitelisted status) back to seeds.
              </p>
              <button
                onClick={handleResetSandbox}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--accent-orange)',
                  color: '#FFFFFF',
                  padding: '12px',
                  fontWeight: '800',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  border: '1px solid #FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Reset Database Seed
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
