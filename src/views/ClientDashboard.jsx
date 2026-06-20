import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  MessageSquare, 
  ExternalLink,
  Users,
  Wallet,
  User,
  ShieldAlert,
  Search,
  Download,
  Tag,
  Star,
  Send,
  Info,
  Check,
  ChevronRight
} from 'lucide-react';
import { getWriters } from '../utils/writers';

export const ClientDashboard = ({ user, onLogout, onGoBack }) => {
  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' | 'post' | 'writers' | 'chat' | 'ledger' | 'profile'
  const [assignments, setAssignments] = useState([]);
  const [writersList, setWritersList] = useState([]);
  
  // Client profile & preferences loaded from localStorage or seeded
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(`inklink_client_profile_${user.email}`);
    if (saved) return JSON.parse(saved);
    return {
      name: user.name,
      email: user.email,
      phone: '9876543210',
      college: 'Hyderabad Central University'
    };
  });

  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem(`inklink_preferences_${user.email}`);
    if (saved) return JSON.parse(saved);
    return {
      inkColor: 'Blue',
      penType: 'Gel',
      paperStyle: 'Ruled',
      marginSize: 'Standard (1 inch)'
    };
  });

  // Post assignment form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Chemistry');
  const [pages, setPages] = useState(10);
  const [deadline, setDeadline] = useState('3 Days');
  const [complexity, setComplexity] = useState('text');
  const [targetWriterId, setTargetWriterId] = useState('pool'); // 'pool' or writer ID
  const [orderInkColor, setOrderInkColor] = useState(preferences.inkColor);
  const [orderPenType, setOrderPenType] = useState(preferences.penType);
  const [orderPaperStyle, setOrderPaperStyle] = useState(preferences.paperStyle);
  const [orderMarginSize, setOrderMarginSize] = useState(preferences.marginSize);

  // Writers Directory search
  const [searchWriterQuery, setSearchWriterQuery] = useState('');

  // Active Chats State
  const [chatChannels, setChatChannels] = useState({});
  const [activeChatChannel, setActiveChatChannel] = useState(null); // writer ID
  const [newChatMessageText, setNewChatMessageText] = useState('');

  // Transactions / Escrow Ledger State
  const [transactions, setTransactions] = useState([]);

  // Scan modal preview state
  const [activeScanOrder, setActiveScanOrder] = useState(null);

  // Filters for assignments list
  const [assignmentFilter, setAssignmentFilter] = useState('all');

  // Load all initial data
  useEffect(() => {
    // 1. Load assignments
    const savedAssignments = localStorage.getItem('inklink_assignments');
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
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
          writerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
          writerId: '1',
          inkColor: 'Blue',
          penType: 'Gel',
          paperStyle: 'Ruled',
          marginSize: 'Standard (1 inch)'
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
          writerId: '3',
          inkColor: 'Blue',
          penType: 'Gel',
          paperStyle: 'Ruled',
          marginSize: 'Standard (1 inch)',
          scanUrl: 'true'
        }
      ];
      setAssignments(initial);
      localStorage.setItem('inklink_assignments', JSON.stringify(initial));
    }

    // 2. Load writers list
    setWritersList(getWriters());

    // 3. Load transactions
    const savedTxns = localStorage.getItem(`inklink_transactions_${user.email}`);
    if (savedTxns) {
      setTransactions(JSON.parse(savedTxns));
    } else {
      const initialTxns = [
        { id: 'TXN_90124', orderId: '1', date: '18 May 2026', amount: 680, type: 'Escrow Lock', status: 'Locked in Escrow' },
        { id: 'TXN_81923', orderId: '2', date: '12 May 2026', amount: 280, type: 'Payment Release', status: 'Released' }
      ];
      setTransactions(initialTxns);
      localStorage.setItem(`inklink_transactions_${user.email}`, JSON.stringify(initialTxns));
    }

    // 4. Initialize Chat Channels from assignments
    const initialChats = {
      '1': [
        { sender: 'Neha Sharma', text: 'Hi, I am working on "Chemistry Lab Report 4". Let me know if you have specific margins or guidelines.', time: '10:30 AM' },
        { sender: 'You', text: 'Thanks! Please keep the handwriting cursive and use blue gel ink.', time: '10:32 AM' }
      ],
      '3': [
        { sender: 'Pooja Singh', text: 'Hi, I have completed the English Lit Essay on Hamlet. Scans are uploaded for your review.', time: '09:15 AM' },
        { sender: 'You', text: 'Looks great, Pooja! Checking the scans now.', time: '09:20 AM' }
      ]
    };
    setChatChannels(initialChats);
  }, [user.email]);

  // Sync preferences defaults to order form when preferences change
  useEffect(() => {
    setOrderInkColor(preferences.inkColor);
    setOrderPenType(preferences.penType);
    setOrderPaperStyle(preferences.paperStyle);
    setOrderMarginSize(preferences.marginSize);
  }, [preferences]);

  const saveAssignments = (updated) => {
    setAssignments(updated);
    localStorage.setItem('inklink_assignments', JSON.stringify(updated));
  };

  const saveTransactions = (updated) => {
    setTransactions(updated);
    localStorage.setItem(`inklink_transactions_${user.email}`, JSON.stringify(updated));
  };

  // Pricing calculations based on chosen writer or base rates
  const getSelectedWriterObj = () => {
    if (targetWriterId === 'pool') return null;
    return writersList.find(w => w.id === targetWriterId);
  };

  const getBaseRate = () => {
    const selectedWriter = getSelectedWriterObj();
    return selectedWriter ? selectedWriter.rate : 35; // standard pool rate is 35
  };

  const getMultiplier = () => {
    if (complexity === 'technical') return 1.3;
    if (complexity === 'diagrams') return 1.5;
    return 1.0;
  };

  const pricePerPage = Math.round(getBaseRate() * getMultiplier());
  const calculatedPrice = pricePerPage * pages;

  // Post Order Handler
  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedWriter = getSelectedWriterObj();
    const orderId = `ord_${Math.floor(Math.random() * 90000 + 10000)}`;

    const newOrder = {
      id: orderId,
      title: title.trim(),
      subject,
      pages,
      deadline,
      complexity,
      price: calculatedPrice,
      status: selectedWriter ? 'accepted' : 'pending',
      writerName: selectedWriter ? selectedWriter.name : null,
      writerAvatar: selectedWriter ? selectedWriter.avatar : null,
      writerId: selectedWriter ? selectedWriter.id : null,
      inkColor: orderInkColor,
      penType: orderPenType,
      paperStyle: orderPaperStyle,
      marginSize: orderMarginSize
    };

    // Save assignments
    const updatedAssignments = [newOrder, ...assignments];
    saveAssignments(updatedAssignments);

    // Save transaction
    const newTxn = {
      id: `TXN_${Math.floor(Math.random() * 90000 + 10000)}`,
      orderId: orderId,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: calculatedPrice,
      type: 'Escrow Lock',
      status: 'Locked in Escrow'
    };
    const updatedTxns = [newTxn, ...transactions];
    saveTransactions(updatedTxns);

    // Sync notification log
    const prevAlerts = JSON.parse(localStorage.getItem('inklink_notifications') || '[]');
    localStorage.setItem('inklink_notifications', JSON.stringify([
      { id: Date.now(), text: `New Assignment "${title}" posted to Writer Pool with ₹${calculatedPrice} locked in escrow.`, time: 'Just now' },
      ...prevAlerts
    ]));

    // Reset Form
    setTitle('');
    setTargetWriterId('pool');
    setActiveTab('assignments');
    alert(`Order posted successfully! ₹${calculatedPrice} locked in escrow.`);
  };

  // Hire Direct Link
  const handleHireDirectly = (writer) => {
    setTargetWriterId(writer.id);
    setActiveTab('post');
  };

  // Open Chat Room with specific writer
  const handleTriggerChat = (writerId, writerName) => {
    // Initialize channel if empty
    if (!chatChannels[writerId]) {
      setChatChannels(prev => ({
        ...prev,
        [writerId]: [
          { sender: writerName, text: `Hello! Thanks for starting this chat. How can I help you with your order?`, time: 'Just now' }
        ]
      }));
    }
    setActiveChatChannel(writerId);
    setActiveTab('chat');
  };

  // Send Message inside Chat tab
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newChatMessageText.trim() || !activeChatChannel) return;

    const timestamp = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    const userMessage = { sender: 'You', text: newChatMessageText, time: timestamp };
    
    // Update local state
    const currentMsgs = chatChannels[activeChatChannel] || [];
    const updatedChannel = [...currentMsgs, userMessage];

    setChatChannels(prev => ({
      ...prev,
      [activeChatChannel]: updatedChannel
    }));
    setNewChatMessageText('');

    // Simulated Writer response after 1.5 seconds
    const activeWriter = writersList.find(w => w.id === activeChatChannel) || { name: 'Writer' };
    setTimeout(() => {
      const writerReplies = [
        "Understood. I will use standard ruled formats and double-check heading styles.",
        "Got it! The sketches/diagrams are being drafted on sheet 4 carefully.",
        "Sure, I will complete this before the 3-day deadline. Standard gel ink is ready.",
        "No problem. I will maintain clean margins on both sides as per your preferences."
      ];
      const randomReply = writerReplies[Math.floor(Math.random() * writerReplies.length)];
      const replyTime = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

      setChatChannels(prev => ({
        ...prev,
        [activeChatChannel]: [...(prev[activeChatChannel] || []), { sender: activeWriter.name, text: randomReply, time: replyTime }]
      }));
    }, 1500);
  };

  // Release payment / Approve Order
  const handleApproveAssignment = (order) => {
    const updated = assignments.map(a => {
      if (a.id === order.id) {
        return { ...a, status: 'approved' };
      }
      return a;
    });
    saveAssignments(updated);

    // Update transactions ledger
    const updatedTxns = transactions.map(t => {
      if (t.orderId === order.id && t.type === 'Escrow Lock') {
        return { ...t, status: 'Released' };
      }
      return t;
    });

    // Add release record
    const releaseTxn = {
      id: `TXN_${Math.floor(Math.random() * 90000 + 10000)}`,
      orderId: order.id,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: order.price,
      type: 'Payment Release',
      status: 'Released'
    };

    saveTransactions([releaseTxn, ...updatedTxns]);
    setActiveScanOrder(null);
    alert(`Assignment approved! Escrow payment of ₹${order.price} successfully released to ${order.writerName}.`);
  };

  // Dispute Order
  const handleDisputeAssignment = (order) => {
    const updated = assignments.map(a => {
      if (a.id === order.id) {
        return { ...a, status: 'disputed' };
      }
      return a;
    });
    saveAssignments(updated);

    // Update transaction
    const updatedTxns = transactions.map(t => {
      if (t.orderId === order.id && t.type === 'Escrow Lock') {
        return { ...t, status: 'Disputed Hold' };
      }
      return t;
    });

    // Add dispute record
    const disputeTxn = {
      id: `TXN_${Math.floor(Math.random() * 90000 + 10000)}`,
      orderId: order.id,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: order.price,
      type: 'Dispute Lock',
      status: 'Investigation Open'
    };

    saveTransactions([disputeTxn, ...updatedTxns]);
    setActiveScanOrder(null);
    alert(`Dispute ticket raised. InkLink Admin has been notified, and escrow funds are locked.`);
  };

  // Save profile edits
  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem(`inklink_client_profile_${user.email}`, JSON.stringify(profile));
    
    // Sync session name if changed
    const session = JSON.parse(localStorage.getItem('inklink_session') || '{}');
    if (session.email === user.email) {
      session.name = profile.name;
      localStorage.setItem('inklink_session', JSON.stringify(session));
    }

    alert('Profile saved successfully!');
  };

  // Save preferences edits
  const handleSavePreferences = (e) => {
    e.preventDefault();
    localStorage.setItem(`inklink_preferences_${user.email}`, JSON.stringify(preferences));
    alert('Default assignment preferences updated successfully!');
  };

  // Filtered assignments
  const getFilteredAssignments = () => {
    return assignments.filter(a => {
      if (assignmentFilter === 'all') return true;
      if (assignmentFilter === 'pending') return a.status === 'pending';
      if (assignmentFilter === 'writing') return a.status === 'accepted' || a.status === 'writing started';
      if (assignmentFilter === 'completed') return a.status === 'completed' || a.status === 'approved';
      if (assignmentFilter === 'disputed') return a.status === 'disputed';
      return true;
    });
  };

  // Download Invoice Simulation
  const handleDownloadInvoice = (txn) => {
    alert(`Downloading Invoice for transaction ${txn.id}...\nOrder: ${txn.orderId}\nAmount: ₹${txn.amount}\n(Sandbox simulation successful)`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-sand)' }}>
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside 
        style={{ 
          width: '290px', 
          flexShrink: 0, 
          borderRight: '2px solid var(--border-editorial)', 
          backgroundColor: '#FFFFFF', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          padding: '24px 18px', 
          position: 'sticky', 
          top: 0, 
          height: '100vh',
          zIndex: 10,
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => window.location.reload()}>
            <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--accent-orange)' }}>*</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '18px', letterSpacing: '-0.03em' }}>INKLINK</span>
            <span style={{ fontSize: '10px', backgroundColor: 'var(--border-editorial)', color: '#FFF', padding: '1px 6px', fontWeight: '800', marginLeft: 'auto' }}>CLIENT</span>
          </div>

          {/* User mini-card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-sand)', border: '1.5px solid var(--border-editorial)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <strong style={{ fontWeight: '900' }}>{profile.name.charAt(0)}</strong>
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '900', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{profile.name}</h4>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {profile.college ? profile.college.substring(0, 24) + '...' : 'Student Member'}
              </span>
            </div>
          </div>

          {/* Tab Navigation links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'assignments', label: '① Active Assignments', icon: FileText },
              { id: 'post', label: '② Post Assignment', icon: PlusCircle },
              { id: 'writers', label: '③ Writers Directory', icon: Users },
              { id: 'chat', label: '④ Chat Room', icon: MessageSquare },
              { id: 'ledger', label: '⑤ Escrow Ledger', icon: Wallet },
              { id: 'profile', label: '⑥ Profile & Preferences', icon: User }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    fontSize: '11px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    border: '1.5px solid var(--border-editorial)',
                    backgroundColor: isActive ? 'var(--border-editorial)' : '#FFFFFF',
                    color: isActive ? 'var(--bg-sand)' : 'var(--text-dark)',
                    boxShadow: isActive ? 'none' : '3px 3px 0 var(--border-editorial)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transform: isActive ? 'translate(1px, 1px)' : 'none',
                    transition: 'transform 0.1s ease'
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
          <button 
            onClick={onGoBack} 
            className="btn-secondary" 
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '11px', 
              fontWeight: '800', 
              textTransform: 'uppercase',
              borderRadius: '4px',
              border: '1.5px solid var(--border-editorial)'
            }}
          >
            Public Landing ↗
          </button>
          <button 
            onClick={onLogout} 
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '11px', 
              fontWeight: '800', 
              textTransform: 'uppercase',
              backgroundColor: 'var(--accent-orange)',
              color: '#FFFFFF',
              border: '1.5px solid var(--border-editorial)',
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main style={{ flexGrow: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Header Banner */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2.5px solid var(--border-editorial)', paddingBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>Client Space</span>
            <h1 style={{ fontSize: '28px', fontWeight: '900', margin: '2px 0 0 0', letterSpacing: '-0.02em' }}>
              {activeTab === 'assignments' && "Active Assignments"}
              {activeTab === 'post' && "Post New Order"}
              {activeTab === 'writers' && "Vetted Writers Registry"}
              {activeTab === 'chat' && "Inbox & Discussions"}
              {activeTab === 'ledger' && "Escrow Balance Ledger"}
              {activeTab === 'profile' && "Preferences & Settings"}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-editorial)', padding: '6px 12px', boxShadow: '2px 2px 0 var(--border-editorial)' }}>
              Wallet Lock: <strong>₹{assignments.reduce((sum, item) => sum + (item.status !== 'approved' ? item.price : 0), 0)}</strong>
            </span>
          </div>
        </header>

        {/* Tab 1: Active Assignments */}
        {activeTab === 'assignments' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
            
            {/* Left side list */}
            <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Filter Row */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                {[
                  { id: 'all', label: 'All Jobs' },
                  { id: 'pending', label: 'Awaiting Claims' },
                  { id: 'writing', label: 'In Progress' },
                  { id: 'completed', label: 'Completed / Approved' },
                  { id: 'disputed', label: 'Disputes' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setAssignmentFilter(f.id)}
                    style={{
                      padding: '6px 14px',
                      fontSize: '11px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      border: '1px solid var(--border-editorial)',
                      backgroundColor: assignmentFilter === f.id ? 'var(--border-editorial)' : '#FFFFFF',
                      color: assignmentFilter === f.id ? 'var(--bg-sand)' : 'var(--text-dark)',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {getFilteredAssignments().length === 0 ? (
                <div style={{ backgroundColor: '#FFFFFF', border: '1.5px dashed var(--border-editorial)', padding: '64px', textAlign: 'center' }}>
                  <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>No Assignments Found</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
                    No orders match the selected filter. Create a new prompt to alert our network of writers.
                  </p>
                  <button onClick={() => setActiveTab('post')} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '12px' }}>
                    Create First Assignment Now
                  </button>
                </div>
              ) : (
                getFilteredAssignments().map(ord => (
                  <div
                    key={ord.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid var(--border-editorial)',
                      padding: '24px',
                      boxShadow: '4px 4px 0 var(--border-editorial)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}
                  >
                    {/* Upper row: title, id, price, status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ID: {ord.id}</span>
                        <h3 style={{ fontSize: '18px', fontWeight: '900', margin: '4px 0 6px 0' }}>{ord.title}</h3>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <span>Subject: <strong>{ord.subject}</strong></span>
                          <span>•</span>
                          <span>Pages: <strong>{ord.pages}</strong></span>
                          <span>•</span>
                          <span>Deadline: <strong>{ord.deadline}</strong></span>
                          <span>•</span>
                          <span>Style: <strong>{ord.inkColor || 'Blue'} Ink, {ord.penType || 'Gel'}, {ord.paperStyle || 'Ruled'}</strong></span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            color: '#FFFFFF',
                            backgroundColor: ord.status === 'pending' ? 'var(--accent-orange)' :
                                             ord.status === 'accepted' ? 'var(--accent-ink)' :
                                             ord.status === 'writing started' ? 'var(--accent-ink)' :
                                             ord.status === 'completed' ? 'var(--accent-green)' :
                                             ord.status === 'approved' ? 'var(--accent-green)' : '#E11D48'
                          }}
                        >
                          {ord.status}
                        </span>
                        <div style={{ fontSize: '20px', fontWeight: '900', marginTop: '8px', color: 'var(--text-dark)' }}>₹{ord.price}</div>
                      </div>
                    </div>

                    {/* Lower row: Assigned writer & actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      
                      {/* Writer Profile */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {ord.writerName ? (
                          <>
                            <img src={ord.writerAvatar} alt={ord.writerName} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-editorial)', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assigned Vetted Writer</div>
                              <div style={{ fontSize: '13px', fontWeight: '700' }}>{ord.writerName}</div>
                            </div>
                          </>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-orange)' }} className="animate-pulse-slow"></span>
                            Awaiting claim in Writer Pool...
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {ord.writerId && (
                          <button
                            onClick={() => handleTriggerChat(ord.writerId, ord.writerName)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 14px',
                              fontSize: '11px',
                              fontWeight: '800',
                              border: '1.5px solid var(--border-editorial)',
                              backgroundColor: '#FFFFFF',
                              cursor: 'pointer'
                            }}
                          >
                            <MessageSquare size={13} />
                            Writer Chat
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
                              fontSize: '11px',
                              fontWeight: '800',
                              backgroundColor: 'var(--accent-green)',
                              color: '#FFFFFF',
                              border: '1.5px solid var(--border-editorial)',
                              cursor: 'pointer',
                              boxShadow: '2px 2px 0 var(--border-editorial)'
                            }}
                          >
                            <ExternalLink size={13} />
                            Review Scans
                          </button>
                        )}

                        {ord.status === 'approved' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-green)', fontWeight: '700' }}>
                            <CheckCircle2 size={14} /> Approved
                          </div>
                        )}

                        {ord.status === 'disputed' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#E11D48', fontWeight: '700' }}>
                            <ShieldAlert size={14} /> Under Review
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right side info column */}
            <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '12px', letterSpacing: '0.02em' }}>Escrow Protection</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                  When posting assignments, your funds are safely locked in the InkLink contract. The writer gets paid only after you approve their handwriting scans.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--accent-green)', fontWeight: '700' }}>
                  <CheckCircle2 size={14} />
                  Razorpay Escrow Verified
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--border-editorial)', color: 'var(--bg-sand)', padding: '24px', border: '1.5px solid var(--border-editorial)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Sandbox simulation hint</h4>
                <p style={{ fontSize: '12px', opacity: 0.8, lineHeight: '1.5' }}>
                  Log out and sign in with a **Writer** account. You will find any pool-assigned tasks under the "Available Jobs" tab, claimable instantly!
                </p>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Post Assignment */}
        {activeTab === 'post' && (
          <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '32px', boxShadow: '6px 6px 0 var(--border-editorial)' }}>
            <h2 className="font-display-condensed" style={{ fontSize: '22px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              Post Assignment Specifications
            </h2>

            <form onSubmit={handleCreateOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
              
              {/* Left Column Fields */}
              <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Assignment Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chemistry Homework - Organic Formulas"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ padding: '12px', border: '1.5px solid var(--border-editorial)', fontSize: '13px', outline: 'none', backgroundColor: 'var(--bg-sand)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Subject Domain</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      style={{ padding: '12px', border: '1.5px solid var(--border-editorial)', fontSize: '13px', fontWeight: '700', outline: 'none', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="Chemistry">Chemistry</option>
                      <option value="English">English</option>
                      <option value="Math">Math</option>
                      <option value="History">History</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Deadline Speed</label>
                    <select
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      style={{ padding: '12px', border: '1.5px solid var(--border-editorial)', fontSize: '13px', fontWeight: '700', outline: 'none', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="24 Hours">24 Hours (Rush +₹50)</option>
                      <option value="48 Hours">48 Hours</option>
                      <option value="3 Days">3 Days</option>
                      <option value="5 Days">5 Days</option>
                      <option value="7 Days">7 Days</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Complexity Grade</label>
                    <select
                      value={complexity}
                      onChange={(e) => setComplexity(e.target.value)}
                      style={{ padding: '12px', border: '1.5px solid var(--border-editorial)', fontSize: '13px', fontWeight: '700', outline: 'none', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="text">Text and Essays</option>
                      <option value="technical">Math / Equations (+30%)</option>
                      <option value="diagrams">Diagrams / Drawings (+50%)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                      <span>Pages Count</span>
                      <span style={{ color: 'var(--accent-orange)' }}>{pages} pages</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={pages}
                      onChange={(e) => setPages(parseInt(e.target.value))}
                      style={{ accentColor: 'var(--accent-orange)', cursor: 'pointer', marginTop: '14px' }}
                    />
                  </div>
                </div>

                {/* Direct writer hiring info */}
                <div style={{ backgroundColor: 'rgba(16, 67, 202, 0.05)', border: '1px solid rgba(16, 67, 202, 0.2)', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Info size={20} color="var(--accent-ink)" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '12px', color: 'var(--accent-ink)', lineHeight: '1.4' }}>
                    {targetWriterId === 'pool' ? (
                      "Your assignment will be posted to the public Writers Pool. Vetted writers can review and claim it."
                    ) : (
                      <span>
                        Direct Hire Selected: <strong>{writersList.find(w => w.id === targetWriterId)?.name}</strong>. The order will be immediately assigned to their active workbench.
                      </span>
                    )}
                  </p>
                </div>

              </div>

              {/* Right Column Fields (Styling Preferences & Pricing) */}
              <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '1px solid var(--border-light)', paddingLeft: '32px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Target Vetted Writer</label>
                  <select
                    value={targetWriterId}
                    onChange={(e) => setTargetWriterId(e.target.value)}
                    style={{ padding: '10px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', fontWeight: '700', outline: 'none' }}
                  >
                    <option value="pool">Public Writer Pool (Lowest Rate)</option>
                    {writersList.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.style} · ₹{w.rate}/page)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Styling preferences (override client defaults) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)' }}>INK COLOR</label>
                    <select
                      value={orderInkColor}
                      onChange={(e) => setOrderInkColor(e.target.value)}
                      style={{ padding: '8px', border: '1px solid var(--border-editorial)', fontSize: '12px' }}
                    >
                      <option value="Blue">Blue Ink</option>
                      <option value="Black">Black Ink</option>
                      <option value="Green">Green Ink</option>
                      <option value="Red">Red Ink</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)' }}>PEN TYPE</label>
                    <select
                      value={orderPenType}
                      onChange={(e) => setOrderPenType(e.target.value)}
                      style={{ padding: '8px', border: '1px solid var(--border-editorial)', fontSize: '12px' }}
                    >
                      <option value="Gel">Gel Pen</option>
                      <option value="Ballpoint">Ballpoint Pen</option>
                      <option value="Fountain">Fountain Pen</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)' }}>PAPER STYLE</label>
                    <select
                      value={orderPaperStyle}
                      onChange={(e) => setOrderPaperStyle(e.target.value)}
                      style={{ padding: '8px', border: '1px solid var(--border-editorial)', fontSize: '12px' }}
                    >
                      <option value="Ruled">Ruled Notebook</option>
                      <option value="Plain">Plain White Sheet</option>
                      <option value="Graph">Graph Paper</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)' }}>MARGIN SIZE</label>
                    <select
                      value={orderMarginSize}
                      onChange={(e) => setOrderMarginSize(e.target.value)}
                      style={{ padding: '8px', border: '1px solid var(--border-editorial)', fontSize: '12px' }}
                    >
                      <option value="Standard (1 inch)">Standard (1 inch)</option>
                      <option value="Narrow (0.5 inch)">Narrow (0.5 inch)</option>
                      <option value="None">No Margins</option>
                    </select>
                  </div>
                </div>

                {/* Estimate Receipt block */}
                <div style={{ backgroundColor: 'var(--bg-sand)', padding: '20px', border: '1.5px solid var(--border-editorial)', marginTop: '12px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', marginBottom: '8px' }}>Escrow Cost Summary</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Base Page Rate ({targetWriterId === 'pool' ? "Pool Vetted" : "Direct Hire"}):</span>
                      <span>₹{getBaseRate()} / page</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Complexity Multiplier:</span>
                      <span>x{getMultiplier()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Pages Count:</span>
                      <span>{pages} sheets</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Locked Escrow Quote</span>
                      <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-dark)' }}>₹{calculatedPrice}</div>
                    </div>
                    
                    <button
                      type="submit"
                      style={{
                        backgroundColor: 'var(--accent-orange)',
                        color: '#FFFFFF',
                        padding: '10px 20px',
                        fontSize: '12px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        border: '1.5px solid var(--border-editorial)',
                        boxShadow: '3px 3px 0 var(--border-editorial)',
                        cursor: 'pointer'
                      }}
                    >
                      Confirm & Lock Escrow ↗
                    </button>
                  </div>
                </div>

              </div>

            </form>
          </div>
        )}

        {/* Tab 3: Writers Directory */}
        {activeTab === 'writers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Search and summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '16px 24px', border: '1.5px solid var(--border-editorial)', boxShadow: '3px 3px 0 var(--border-editorial)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1, maxWidth: '480px' }}>
                <Search size={18} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by Writer Name, Penmanship style, or Background..."
                  value={searchWriterQuery}
                  onChange={(e) => setSearchWriterQuery(e.target.value)}
                  style={{ width: '100%', fontSize: '13px', outline: 'none' }}
                />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
                Vetted Registry: {writersList.length} Penmen Active
              </div>
            </div>

            {/* Writers list grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px' }}>
              {writersList
                .filter(w => 
                  w.name.toLowerCase().includes(searchWriterQuery.toLowerCase()) ||
                  w.style.toLowerCase().includes(searchWriterQuery.toLowerCase()) ||
                  w.background.toLowerCase().includes(searchWriterQuery.toLowerCase())
                )
                .map(writer => (
                  <div
                    key={writer.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid var(--border-editorial)',
                      padding: '24px',
                      boxShadow: '4px 4px 0 var(--border-editorial)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}
                  >
                    {/* Upper row: avatar, name, rating, rate */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <img src={writer.avatar} alt={writer.name} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1.5px solid var(--border-editorial)', objectFit: 'cover' }} />
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>{writer.name}</h4>
                          <span style={{ fontSize: '11px', color: 'var(--accent-ink)', fontWeight: '700' }}>{writer.style}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-sand)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-light)', fontSize: '11px', fontWeight: '800' }}>
                          <Star size={12} color="var(--accent-orange)" fill="var(--accent-orange)" />
                          {writer.rating}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--accent-green)' }}>₹{writer.rate}/page</span>
                      </div>
                    </div>

                    {/* Bio background */}
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      {writer.background} | Completed: <strong>{writer.completed} assignments</strong>
                    </p>

                    {/* Handwriting Preview box */}
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Penmanship Font Simulation</span>
                      <div
                        style={{
                          backgroundColor: '#FAF9F5',
                          border: '1.5px solid var(--border-editorial)',
                          padding: '16px 20px',
                          position: 'relative',
                          backgroundImage: 'linear-gradient(rgba(16, 67, 202, 0.05) 1px, transparent 1px)',
                          backgroundSize: '100% 20px',
                          maxHeight: '100px',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ position: 'absolute', top: 0, left: '20px', width: '1px', height: '100%', backgroundColor: 'rgba(255, 0, 0, 0.15)' }}></div>
                        <p style={{
                          fontFamily: writer.id === '1' ? "'Caveat', cursive" :
                                     writer.id === '2' ? "'Architects Daughter', sans-serif" :
                                     writer.id === '3' ? "'Shadows Into Light', cursive" : "'Patrick Hand', cursive",
                          fontSize: '15px',
                          color: '#1043CA',
                          lineHeight: '20px',
                          paddingLeft: '12px',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden'
                        }}>
                          {writer.sampleText}
                        </p>
                      </div>
                    </div>

                    {/* Quick hire button */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      <button
                        onClick={() => handleHireDirectly(writer)}
                        style={{
                          flexGrow: 1,
                          backgroundColor: 'var(--border-editorial)',
                          color: 'var(--bg-sand)',
                          padding: '10px',
                          fontSize: '11px',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          border: '1.5px solid var(--border-editorial)',
                          boxShadow: '2px 2px 0 var(--accent-orange)',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        Hire Directly ↗
                      </button>
                      <button
                        onClick={() => handleTriggerChat(writer.id, writer.name)}
                        className="btn-secondary"
                        style={{
                          padding: '10px 16px',
                          fontSize: '11px',
                          borderRadius: '0',
                          fontWeight: '800'
                        }}
                      >
                        Inquire Style
                      </button>
                    </div>

                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab 4: Chat Room */}
        {activeTab === 'chat' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px', height: '580px', backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', boxShadow: '6px 6px 0 var(--border-editorial)' }}>
            
            {/* Left side Channels */}
            <div style={{ gridColumn: 'span 4', borderRight: '2px solid var(--border-editorial)', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-sand)' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Active Discussions</span>
              </div>
              
              <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {writersList
                  .filter(w => chatChannels[w.id])
                  .map(writer => {
                    const messages = chatChannels[writer.id] || [];
                    const lastMsg = messages[messages.length - 1] || { text: '', time: '' };
                    const isSelected = activeChatChannel === writer.id;
                    return (
                      <div
                        key={writer.id}
                        onClick={() => setActiveChatChannel(writer.id)}
                        style={{
                          padding: '16px',
                          borderBottom: '1.5px solid var(--border-light)',
                          backgroundColor: isSelected ? 'var(--bg-sand)' : 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <img src={writer.avatar} alt={writer.name} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border-editorial)', objectFit: 'cover' }} />
                        <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <strong style={{ fontSize: '13px', color: 'var(--text-dark)' }}>{writer.name}</strong>
                            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{lastMsg.time}</span>
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                            {lastMsg.sender === 'You' ? 'You: ' : ''}{lastMsg.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(chatChannels).length === 0 && (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                    No chat channels opened. Hire a writer or inquire from the Writers Directory to start!
                  </div>
                )}
              </div>
            </div>

            {/* Right side chat stream */}
            <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', height: '100%' }}>
              {activeChatChannel ? (
                <>
                  {/* Chat Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1.5px solid var(--border-editorial)', backgroundColor: 'var(--bg-sand)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={writersList.find(w => w.id === activeChatChannel)?.avatar} alt="writer avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-editorial)', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ fontSize: '13px', margin: 0 }}>{writersList.find(w => w.id === activeChatChannel)?.name}</h4>
                        <span style={{ fontSize: '9px', color: 'var(--accent-green)', fontWeight: '800' }}>● Vetted Penman Online</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Log */}
                  <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#FAF9F6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {chatChannels[activeChatChannel]?.map((msg, idx) => (
                      <div
                        key={idx}
                        style={{
                          alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                          backgroundColor: msg.sender === 'You' ? 'var(--border-editorial)' : '#FFFFFF',
                          color: msg.sender === 'You' ? 'var(--bg-sand)' : 'var(--text-dark)',
                          padding: '8px 14px',
                          border: '1.5px solid var(--border-editorial)',
                          maxWidth: '75%',
                          fontSize: '13px',
                          borderRadius: '4px',
                          boxShadow: msg.sender === 'You' ? 'none' : '2px 2px 0 var(--border-editorial)'
                        }}
                      >
                        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                        <span style={{ display: 'block', fontSize: '9px', textAlign: 'right', marginTop: '4px', opacity: 0.7 }}>{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Send Input Bar */}
                  <form onSubmit={handleSendMessage} style={{ padding: '12px', borderTop: '1.5px solid var(--border-editorial)', display: 'flex', gap: '8px', backgroundColor: '#FFFFFF' }}>
                    <input
                      type="text"
                      placeholder="Type guidelines, ink preferences or margins specifications..."
                      value={newChatMessageText}
                      onChange={(e) => setNewChatMessageText(e.target.value)}
                      style={{ flexGrow: 1, padding: '10px 14px', border: '1.5px solid var(--border-editorial)', fontSize: '13px', outline: 'none' }}
                    />
                    <button
                      type="submit"
                      style={{
                        backgroundColor: 'var(--border-editorial)',
                        color: 'var(--bg-sand)',
                        padding: '10px 20px',
                        fontSize: '12px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        border: '1.5px solid var(--border-editorial)',
                        cursor: 'pointer'
                      }}
                    >
                      Send
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>
                  <MessageSquare size={48} style={{ strokeWidth: 1.5, marginBottom: '16px' }} />
                  <h3>Discussion Desk Empty</h3>
                  <p style={{ fontSize: '13px', maxWidth: '360px', marginTop: '4px' }}>
                    Select an active writer thread from the sidebar or click "Writer Chat" on any assignment to start.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 5: Escrow Ledger */}
        {activeTab === 'ledger' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Holdings Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Active Escrow Holds</span>
                <div style={{ fontSize: '32px', fontWeight: '900', marginTop: '8px', color: 'var(--accent-orange)' }}>
                  ₹{assignments.reduce((sum, item) => sum + (item.status !== 'approved' && item.status !== 'disputed' ? item.price : 0), 0)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Held until scans are verified</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Released Payments</span>
                <div style={{ fontSize: '32px', fontWeight: '900', marginTop: '8px', color: 'var(--accent-green)' }}>
                  ₹{transactions.filter(t => t.type === 'Payment Release' && t.status === 'Released').reduce((sum, t) => sum + t.amount, 0)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Successfully credited to writers</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Active Disputes</span>
                <div style={{ fontSize: '32px', fontWeight: '900', marginTop: '8px', color: '#E11D48' }}>
                  ₹{assignments.filter(a => a.status === 'disputed').reduce((sum, a) => sum + a.price, 0)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Locked under quality investigation</div>
              </div>
            </div>

            {/* Transactions Table */}
            <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '28px', boxShadow: '6px 6px 0 var(--border-editorial)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                Payment Transaction Log
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-editorial)' }}>
                      <th style={{ padding: '12px 8px', fontWeight: '800' }}>TXN ID</th>
                      <th style={{ padding: '12px 8px', fontWeight: '800' }}>Order ID</th>
                      <th style={{ padding: '12px 8px', fontWeight: '800' }}>Date Locked</th>
                      <th style={{ padding: '12px 8px', fontWeight: '800' }}>Transaction Type</th>
                      <th style={{ padding: '12px 8px', fontWeight: '800' }}>Escrow Status</th>
                      <th style={{ padding: '12px 8px', fontWeight: '800', textAlign: 'right' }}>Amount</th>
                      <th style={{ padding: '12px 8px', fontWeight: '800', textAlign: 'right' }}>Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(txn => (
                      <tr key={txn.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '14px 8px', fontFamily: 'monospace', fontWeight: '700' }}>{txn.id}</td>
                        <td style={{ padding: '14px 8px', fontFamily: 'monospace' }}>{txn.orderId}</td>
                        <td style={{ padding: '14px 8px', color: 'var(--text-muted)' }}>{txn.date}</td>
                        <td style={{ padding: '14px 8px', fontWeight: '700' }}>
                          <span style={{
                            color: txn.type.includes('Release') ? 'var(--accent-green)' :
                                   txn.type.includes('Dispute') ? '#E11D48' : 'var(--accent-ink)'
                          }}>
                            {txn.type}
                          </span>
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '800',
                            padding: '3px 8px',
                            border: '1.5px solid var(--border-editorial)',
                            borderRadius: '4px',
                            backgroundColor: txn.status.includes('Locked') ? 'rgba(255, 85, 0, 0.05)' :
                                             txn.status.includes('Released') ? 'rgba(15, 169, 88, 0.05)' : 'rgba(225, 29, 72, 0.05)',
                            color: txn.status.includes('Locked') ? 'var(--accent-orange)' :
                                   txn.status.includes('Released') ? 'var(--accent-green)' : '#E11D48'
                          }}>
                            {txn.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 8px', fontWeight: '800', textAlign: 'right' }}>₹{txn.amount}</td>
                        <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDownloadInvoice(txn)}
                            style={{ color: 'var(--accent-ink)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '800' }}
                          >
                            <Download size={12} /> Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                          No transactions completed yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 6: Client Profile & Preferences */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
            
            {/* Left side Profile Form */}
            <div style={{ gridColumn: 'span 6', backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '28px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                Personal Client Details
              </h3>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    style={{ padding: '10px', border: '1.5px solid var(--border-editorial)', outline: 'none', backgroundColor: 'var(--bg-sand)', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    style={{ padding: '10px', border: '1.5px solid var(--border-editorial)', opacity: 0.6, fontSize: '13px', cursor: 'not-allowed' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Contact Number</label>
                  <input
                    type="text"
                    required
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ padding: '10px', border: '1.5px solid var(--border-editorial)', outline: 'none', backgroundColor: 'var(--bg-sand)', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>College / University</label>
                  <input
                    type="text"
                    required
                    value={profile.college}
                    onChange={(e) => setProfile(prev => ({ ...prev, college: e.target.value }))}
                    style={{ padding: '10px', border: '1.5px solid var(--border-editorial)', outline: 'none', backgroundColor: 'var(--bg-sand)', fontSize: '13px' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--border-editorial)',
                    color: 'var(--bg-sand)',
                    padding: '12px',
                    fontSize: '11px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    border: '1.5px solid var(--border-editorial)',
                    boxShadow: '3px 3px 0 var(--accent-orange)',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  Save Profile ↗
                </button>
              </form>
            </div>

            {/* Right side Defaults Form */}
            <div style={{ gridColumn: 'span 6', backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '28px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                Default Assignment Preferences
              </h3>

              <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Preferred Ink Color</label>
                  <select
                    value={preferences.inkColor}
                    onChange={(e) => setPreferences(prev => ({ ...prev, inkColor: e.target.value }))}
                    style={{ padding: '10px', border: '1.5px solid var(--border-editorial)', outline: 'none', backgroundColor: 'var(--bg-sand)' }}
                  >
                    <option value="Blue">Blue Ink</option>
                    <option value="Black">Black Ink</option>
                    <option value="Green">Green Ink</option>
                    <option value="Red">Red Ink</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Preferred Pen Type</label>
                  <select
                    value={preferences.penType}
                    onChange={(e) => setPreferences(prev => ({ ...prev, penType: e.target.value }))}
                    style={{ padding: '10px', border: '1.5px solid var(--border-editorial)', outline: 'none', backgroundColor: 'var(--bg-sand)' }}
                  >
                    <option value="Gel">Gel Pen</option>
                    <option value="Ballpoint">Ballpoint Pen</option>
                    <option value="Fountain">Fountain Pen</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Preferred Paper Style</label>
                  <select
                    value={preferences.paperStyle}
                    onChange={(e) => setPreferences(prev => ({ ...prev, paperStyle: e.target.value }))}
                    style={{ padding: '10px', border: '1.5px solid var(--border-editorial)', outline: 'none', backgroundColor: 'var(--bg-sand)' }}
                  >
                    <option value="Ruled">Ruled Notebook Paper</option>
                    <option value="Plain">Plain White A4 Sheets</option>
                    <option value="Graph">Graph Paper</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Preferred Margin Size</label>
                  <select
                    value={preferences.marginSize}
                    onChange={(e) => setPreferences(prev => ({ ...prev, marginSize: e.target.value }))}
                    style={{ padding: '10px', border: '1.5px solid var(--border-editorial)', outline: 'none', backgroundColor: 'var(--bg-sand)' }}
                  >
                    <option value="Standard (1 inch)">Standard (1 inch)</option>
                    <option value="Narrow (0.5 inch)">Narrow (0.5 inch)</option>
                    <option value="None">No Margins</option>
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--border-editorial)',
                    color: 'var(--bg-sand)',
                    padding: '12px',
                    fontSize: '11px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    border: '1.5px solid var(--border-editorial)',
                    boxShadow: '3px 3px 0 var(--accent-orange)',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  Update Rules ↗
                </button>
              </form>
            </div>

          </div>
        )}

      </main>

      {/* 3. MODAL: View Scans Preview */}
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
                  2. Jekyll's experiment aims to separate these elements physically, releasing "Edward Hyde" as a pure manifestation of his dark impulses.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  onClick={() => handleApproveAssignment(activeScanOrder)}
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
                  onClick={() => handleDisputeAssignment(activeScanOrder)}
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
