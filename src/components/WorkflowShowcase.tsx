import React, { useState } from 'react';

type FlowRole = 'client' | 'writer' | 'admin';

export const WorkflowShowcase: React.FC = () => {
  const [activeRole, setActiveRole] = useState<FlowRole>('client');

  const getWorkflowSteps = () => {
    switch (activeRole) {
      case 'client':
        return [
          { num: '01', title: 'Upload Assignment', desc: 'Drag-and-drop assignment prompts, PDFs, subject parameters, page counts, and formatting rules.' },
          { num: '02', title: 'Select Your Writer', desc: 'Browse matched subject-expert writers, view their handwriting samples, ratings, and page rates.' },
          { num: '03', title: 'Fund Escrow', desc: 'Make a secure payment which is held safely in escrow until you approve the completed handwriting scan.' },
          { num: '04', title: 'Track in Real-Time', desc: 'Chat directly with your writer, monitor draft updates, and get automated progress check-ins.' },
          { num: '05', title: 'Download & Ship', desc: 'Download crystal-clear high-res scanned PDFs instantly, or opt for premium doorstep physical delivery.' },
        ];
      case 'writer':
        return [
          { num: '01', title: 'Apply & Verify', desc: 'Submit a sample of your handwriting. Once verified for neatness and speed, you gain access to the writer panel.' },
          { num: '02', title: 'Browse Job Board', desc: 'Filter through client-submitted assignments by subject (Math, History, Code, etc.), pages, and deadlines.' },
          { num: '03', title: 'Secure Assignments', desc: 'Submit proposals to clients, or accept instant-assign jobs matching your specified hourly availability.' },
          { num: '04', title: 'Write & Scan', desc: 'Write assignments cleanly using required paper, scan with our mobile scanner tool, and upload drafts.' },
          { num: '05', title: 'Fast Payouts', desc: 'Once client approves, funds release instantly. Withdraw earnings (₹25 - ₹50 per page) straight to UPI/Bank.' },
        ];
      case 'admin':
        return [
          { num: '01', title: 'Verify Profiles', desc: 'Audit applicant penmanship tests, grade their writing clarity, and whitelist qualified writers.' },
          { num: '02', title: 'Oversee Escrow', desc: 'Monitor active payment locks, distribute payouts to writers, and manage refunds for disputed orders.' },
          { num: '03', title: 'Resolve Complaints', desc: 'Manage writer-client dispute tickets, verify guidelines adherence, and ensure 100% satisfaction guarantee.' },
          { num: '04', title: 'Platform Analytics', desc: 'Track daily page volume, active assignments count, commission logs, and payout schedules.' },
        ];
    }
  };

  const getMockupScreenTitle = () => {
    switch (activeRole) {
      case 'client': return 'Client Panel: "Upload Assignment"';
      case 'writer': return 'Writer Dashboard: "Job Board"';
      case 'admin': return 'Admin Panel: "Writer Verification"';
    }
  };

  return (
    <div className="border-bottom" style={{ borderColor: 'var(--border-editorial)' }}>
      <div className="section-container" style={{ padding: '80px 40px' }}>
        
        {/* Title Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '56px' }}>
          <div style={{ gridColumn: 'span 8' }}>
            <span className="pill-badge badge-orange" style={{ marginBottom: '16px' }}>Interactive Flowchart</span>
            <h2 className="font-display-condensed" style={{ fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: '1.0' }}>
              How the platform <br />
              <span style={{ color: 'var(--accent-orange)' }}>Operates</span>
            </h2>
          </div>
          <div style={{ gridColumn: 'span 4', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '8px', border: '1.5px solid var(--border-editorial)', padding: '4px', backgroundColor: '#FFFFFF' }}>
              {(['client', 'writer', 'admin'] as FlowRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: activeRole === role ? 'var(--border-editorial)' : 'transparent',
                    color: activeRole === role ? 'var(--bg-sand)' : 'var(--text-dark)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>
          
          {/* Timeline list of steps - Left */}
          <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {getWorkflowSteps().map((step) => (
              <div
                key={step.num}
                style={{
                  display: 'flex',
                  gap: '24px',
                  padding: '24px',
                  border: '1.5px solid var(--border-editorial)',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '4px 4px 0 var(--border-editorial)',
                  transition: 'var(--transition-smooth)',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '900',
                    fontFamily: 'var(--font-display)',
                    color: 'var(--accent-orange)',
                    lineHeight: '1',
                  }}
                >
                  {step.num}
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '6px' }}>{step.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.45' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Screen Preview - Right */}
          <div style={{ gridColumn: 'span 6' }}>
            <div
              style={{
                border: '2px solid var(--border-editorial)',
                backgroundColor: '#FFFFFF',
                boxShadow: '8px 8px 0 var(--border-editorial)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Window Header */}
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: '1.5px solid var(--border-editorial)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-sand)'
                }}
              >
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FF5F56', border: '1px solid rgba(0,0,0,0.1)' }}></span>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFBD2E', border: '1px solid rgba(0,0,0,0.1)' }}></span>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27C93F', border: '1px solid rgba(0,0,0,0.1)' }}></span>
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--text-muted)' }}>
                  {getMockupScreenTitle()}
                </span>
              </div>

              {/* Mockup Content Panels */}
              <div style={{ padding: '32px', flexGrow: 1, backgroundColor: '#FAF9F6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px' }}>
                
                {/* Client Mockup Frame */}
                {activeRole === 'client' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                      <span style={{ fontWeight: '800', fontSize: '14px' }}>INKLINK CLIENT PANEL</span>
                      <span style={{ fontSize: '10px', padding: '3px 8px', backgroundColor: 'var(--accent-ink)', color: '#FFFFFF', borderRadius: '4px', fontWeight: '700' }}>Active Order</span>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', padding: '16px', border: '1px solid var(--border-editorial)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Assignment Name:</span>
                        <span style={{ fontWeight: '700' }}>Chemistry Lab Report 4</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Assigned Writer:</span>
                        <span style={{ fontWeight: '700', color: 'var(--accent-orange)' }}>Neha Sharma (Gold Class)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                        <span style={{ fontWeight: '700', color: 'var(--accent-green)' }}>In Progress (Writing page 12/15)</span>
                      </div>
                    </div>

                    {/* Progress slider bar */}
                    <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '80%', backgroundColor: 'var(--accent-green)' }}></div>
                    </div>

                    {/* Chat Simulator bubble */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', marginTop: '10px' }}>
                      <div style={{ alignSelf: 'flex-start', backgroundColor: '#FFFFFF', padding: '8px 12px', border: '1.5px solid var(--border-editorial)', maxWidth: '80%' }}>
                        <strong>Neha S:</strong> I am using blue gel ink on single-lined notebook paper. Will upload the first 5 pages for review shortly.
                      </div>
                      <div style={{ alignSelf: 'flex-end', backgroundColor: 'var(--border-editorial)', color: 'var(--bg-sand)', padding: '8px 12px', border: '1.5px solid var(--border-editorial)', maxWidth: '80%' }}>
                        <strong>Client (You):</strong> Perfect, thank you Neha! Appreciate the quick update.
                      </div>
                    </div>
                  </div>
                )}

                {/* Writer Mockup Frame */}
                {activeRole === 'writer' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                      <span style={{ fontWeight: '800', fontSize: '14px' }}>AVAILABLE ASSIGNMENTS</span>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-green)' }}>● 12 jobs online</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* Job 1 */}
                      <div style={{ backgroundColor: '#FFFFFF', padding: '12px', border: '1px solid var(--border-editorial)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '12px' }}>World History Lecture Notes</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>History | 14 Pages | Deadline: 2 Days</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '900', color: 'var(--accent-green)', fontSize: '14px' }}>₹490</div>
                          <button style={{ fontSize: '9px', fontWeight: '800', padding: '4px 8px', backgroundColor: 'var(--border-editorial)', color: 'var(--bg-sand)', marginTop: '4px' }}>ACCEPT</button>
                        </div>
                      </div>

                      {/* Job 2 */}
                      <div style={{ backgroundColor: '#FFFFFF', padding: '12px', border: '1px solid var(--border-editorial)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '12px' }}>Calculus III Practice Problems</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Math | 8 Pages | Deadline: 24 Hours</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '900', color: 'var(--accent-green)', fontSize: '14px' }}>₹380</div>
                          <button style={{ fontSize: '9px', fontWeight: '800', padding: '4px 8px', backgroundColor: 'var(--border-editorial)', color: 'var(--bg-sand)', marginTop: '4px' }}>ACCEPT</button>
                        </div>
                      </div>
                    </div>

                    {/* Earnings Summary */}
                    <div style={{ backgroundColor: 'var(--border-editorial)', color: 'var(--bg-sand)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase' }}>This Month Earnings</div>
                        <div style={{ fontSize: '20px', fontWeight: '900' }}>₹12,450</div>
                      </div>
                      <button style={{ fontSize: '11px', fontWeight: '800', padding: '6px 12px', backgroundColor: 'var(--accent-orange)', color: '#FFFFFF', border: '1px solid #FFFFFF' }}>WITHDRAW</button>
                    </div>
                  </div>
                )}

                {/* Admin Mockup Frame */}
                {activeRole === 'admin' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                      <span style={{ fontWeight: '800', fontSize: '14px' }}>ADMIN VERIFICATION PORTAL</span>
                      <span style={{ fontSize: '10px', padding: '3px 8px', backgroundColor: 'var(--accent-orange)', color: '#FFFFFF', borderRadius: '4px', fontWeight: '700' }}>Pending Reviews</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ backgroundColor: '#FFFFFF', padding: '16px', border: '1px solid var(--border-editorial)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '800', fontSize: '12px' }}>Applicant: Ravi Patel</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Applied 2h ago</span>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                          Submited penmanship test page: "Neat printing, excellent line alignment, readable curves."
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{ flex: 1, fontSize: '10px', fontWeight: '800', padding: '6px', backgroundColor: 'var(--accent-green)', color: '#FFFFFF', border: '1px solid var(--border-editorial)' }}>APPROVE</button>
                          <button style={{ flex: 1, fontSize: '10px', fontWeight: '800', padding: '6px', backgroundColor: '#FF4D4D', color: '#FFFFFF', border: '1px solid var(--border-editorial)' }}>REJECT</button>
                        </div>
                      </div>
                    </div>

                    {/* Stats metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ backgroundColor: '#FFFFFF', padding: '10px', border: '1px solid var(--border-editorial)', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>ACTIVE ORDERS</div>
                        <div style={{ fontSize: '16px', fontWeight: '900' }}>32 orders</div>
                      </div>
                      <div style={{ backgroundColor: '#FFFFFF', padding: '10px', border: '1px solid var(--border-editorial)', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>DAILY REVENUE</div>
                        <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--accent-green)' }}>₹45,000</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer disclaimer */}
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '12px', textAlign: 'center' }}>
                  Mockups simulate actual user interactions built in Phase 2 framework.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
