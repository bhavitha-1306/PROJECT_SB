import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MessageSquare, 
  Upload, 
  Search, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Trash2, 
  Wallet, 
  Sparkles, 
  X, 
  Camera, 
  ArrowRight,
  TrendingUp,
  DollarSign,
  UserPlus,
  Image as ImageIcon,
  Tag,
  Activity,
  Truck,
  User,
  Bell,
  MapPin,
  Map,
  ShieldAlert,
  Send,
  Navigation,
  FileCheck
} from 'lucide-react';
import { updateWriterProfile } from '../utils/writers';

export const WriterDashboard = ({ user, onLogout, onGoBack }) => {
  const [activeTab, setActiveTab] = useState('jobs'); // 'registration' | 'samples' | 'pricing' | 'jobs' | 'orders' | 'delivery' | 'profile' | 'wallet' | 'messages'
  const [assignments, setAssignments] = useState([]);
  
  // Dynamic Writer profile loaded from localStorage
  const [myProfile, setMyProfile] = useState(() => {
    const writers = JSON.parse(localStorage.getItem('inklink_writers') || '[]');
    const found = writers.find(w => w.email.toLowerCase() === user.email.toLowerCase());
    if (found) {
      return {
        ...found,
        isRegistered: found.isRegistered === undefined ? true : found.isRegistered,
        aadharUploaded: found.aadharUploaded === undefined ? true : found.aadharUploaded,
        collegeIdUploaded: found.collegeIdUploaded === undefined ? true : found.collegeIdUploaded
      };
    }
    return {
      name: user.name,
      email: user.email,
      phone: '',
      password: '••••••••',
      style: user.details?.penmanship || 'Elegant Cursive',
      background: user.details?.background || 'Vetted Penman',
      rate: 35,
      urgentRate: 15,
      deliveryCharges: 25,
      subjectPricing: [
        { subject: 'Math', price: 10 },
        { subject: 'Physics', price: 12 },
        { subject: 'Notes', price: 7 }
      ],
      sampleText: 'Hydrogen bonds form when a hydrogen atom covalently bonded to a highly electronegative atom...',
      images: [],
      rating: 4.8,
      completed: 32,
      isRegistered: true,
      aadharUploaded: true,
      collegeIdUploaded: true,
      subjectSpecialization: 'Science & Chemistry',
      speed: 3,
      languages: 'English, Hindi',
      timings: 'Weekdays 4 PM - 9 PM',
      city: 'Hyderabad',
      address: 'Flat 204, Gachibowli, Hyderabad'
    };
  });

  // Form states for Registration
  const [regName, setRegName] = useState(myProfile.name);
  const [regPhone, setRegPhone] = useState(myProfile.phone || '9876543210');
  const [regEmail, setRegEmail] = useState(myProfile.email);
  const [regPassword, setRegPassword] = useState(myProfile.password || 'password123');
  const [regAadharUploaded, setRegAadharUploaded] = useState(myProfile.aadharUploaded || false);
  const [regCollegeIdUploaded, setRegCollegeIdUploaded] = useState(myProfile.collegeIdUploaded || false);
  const [regSubject, setRegSubject] = useState(myProfile.subjectSpecialization || 'Science & Chemistry');
  const [regSpeed, setRegSpeed] = useState(myProfile.speed || 3);
  const [regLanguages, setRegLanguages] = useState(myProfile.languages || 'English, Hindi');
  const [regTimings, setRegTimings] = useState(myProfile.timings || 'Weekdays 4 PM - 9 PM');
  const [regCity, setRegCity] = useState(myProfile.city || 'Hyderabad');
  const [regAddress, setRegAddress] = useState(myProfile.address || 'Gachibowli');
  const [regLiveLoc, setRegLiveLoc] = useState(false);

  // Sample Upload states
  const [sampleCategory, setSampleCategory] = useState('ruled'); // 'ruled' | 'plain' | 'diagram' | 'style'
  const [sampleStyleText, setSampleStyleText] = useState(myProfile.sampleText);

  // Pricing Setup States
  const [pricePerPage, setPricePerPage] = useState(myProfile.rate || 35);
  const [urgentRate, setUrgentRate] = useState(myProfile.urgentRate || 15);
  const [deliveryCharges, setDeliveryCharges] = useState(myProfile.deliveryCharges || 25);
  const [subjectPricingList, setSubjectPricingList] = useState(myProfile.subjectPricing || [
    { subject: 'Math', price: 10 },
    { subject: 'Physics', price: 12 },
    { subject: 'Notes', price: 7 }
  ]);
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjPrice, setNewSubjPrice] = useState(10);

  // Available Jobs State
  const [filterNearby, setFilterNearby] = useState(false);
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [filterHighPaying, setFilterHighPaying] = useState(false);
  const [filterSubject, setFilterSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoolJob, setSelectedPoolJob] = useState(null);

  // Active Orders View State
  const [selectedActiveOrder, setSelectedActiveOrder] = useState(null);

  // Delivery Management States
  const [deliveryOption, setDeliveryOption] = useState('partner'); // 'self' | 'partner' | 'pickup'
  const [deliveryOTP, setDeliveryOTP] = useState('');
  const [otpVerifySuccess, setOtpVerifySuccess] = useState(false);
  const [liveMapActive, setLiveMapActive] = useState(false);
  const [mapPosition, setMapPosition] = useState(0); // 0 to 100 percentage along mock route
  const [deliveryLogs, setDeliveryLogs] = useState([
    { time: '02:00 PM', log: 'Order dispatched for delivery.' },
    { time: '02:15 PM', log: 'Delivery partner assigned nearby.' }
  ]);

  // Worker Profile Editing States
  const [profileName, setProfileName] = useState(myProfile.name);
  const [profileAvatar, setProfileAvatar] = useState(myProfile.avatar || '');
  const [profileSpeed, setProfileSpeed] = useState(myProfile.speed || 3);
  const [profileLanguages, setProfileLanguages] = useState(myProfile.languages || 'English, Hindi');
  const [profileSubject, setProfileSubject] = useState(myProfile.subjectSpecialization || 'Science & Chemistry');

  // Wallet and Earnings States
  const [walletBalance, setWalletBalance] = useState(12450);
  const [withdrawableBalance, setWithdrawableBalance] = useState(8290);
  const [upiId, setUpiId] = useState('');
  const [bankAcc, setBankAcc] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [showWithdrawMsg, setShowWithdrawMsg] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: 'TXN101', orderId: '#ORD12345', date: '10 May 2026', amount: 250, type: 'credit', status: 'Completed' },
    { id: 'TXN102', orderId: '#ORD12340', date: '08 May 2026', amount: 200, type: 'credit', status: 'Completed' },
    { id: 'TXN103', orderId: '#ORD12338', date: '05 May 2026', amount: 350, type: 'credit', status: 'Completed' }
  ]);

  // Notification and Messages Channel List State
  const [activeChannelId, setActiveChannelId] = useState('rohan'); // 'rohan' | 'priya' | 'vikram'
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState({
    rohan: [
      { sender: 'Client', text: 'Hi, I am Rohan. Please use blue ink and keep standard margins.', time: '10:30 AM' },
      { sender: 'You', text: 'Sure Rohan, I am starting the writing on ruled notebook paper.', time: '10:32 AM' }
    ],
    priya: [
      { sender: 'Client', text: 'Hi Neha! Can you add neat diagrams for the chemistry experiment?', time: '11:15 AM' },
      { sender: 'You', text: 'Yes Priya! I have seeded neat diagram layouts for pages 4 and 5.', time: '11:18 AM' }
    ],
    vikram: [
      { sender: 'Client', text: 'Hello, is the history assignment ready? Need it today.', time: '01:05 PM' },
      { sender: 'You', text: 'Yes Vikram, completing the final review. It will be marked out for delivery shortly.', time: '01:10 PM' }
    ]
  });

  const [alerts, setAlerts] = useState([
    { id: 1, text: 'New Chemistry Lab assignment posted in Hyderabad.', type: 'info', time: 'Just now' },
    { id: 2, text: 'Delivery Reminder: English Lit assignment due in 4 hours.', type: 'warning', time: '10m ago' },
    { id: 3, text: 'Escrow Payment Released: ₹680 added to processing ledger.', type: 'success', time: '2h ago' }
  ]);

  // Load assignments from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('inklink_assignments');
    if (saved) {
      setAssignments(JSON.parse(saved));
    } else {
      // Default fallback
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
          writerName: myProfile.name,
          distance: 2.5,
          clientRating: 4.9,
          progress: 40
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
          writerName: myProfile.name,
          distance: 4.8,
          clientRating: 4.7,
          progress: 100,
          scanUrl: 'true'
        },
        {
          id: 'ord_90412',
          title: 'Mechanical Design Notes',
          subject: 'Math',
          pages: 12,
          deadline: '24 Hours',
          complexity: 'diagrams',
          price: 450,
          status: 'pending',
          distance: 1.2,
          clientRating: 5.0,
          progress: 0
        },
        {
          id: 'ord_31295',
          title: 'History Review Assignment',
          subject: 'History',
          pages: 20,
          deadline: '48 Hours',
          complexity: 'text',
          price: 520,
          status: 'pending',
          distance: 6.5,
          clientRating: 4.6,
          progress: 0
        }
      ];
      setAssignments(initial);
      localStorage.setItem('inklink_assignments', JSON.stringify(initial));
    }
  }, [myProfile.name]);

  const saveAssignmentsToStorage = (updated) => {
    setAssignments(updated);
    localStorage.setItem('inklink_assignments', JSON.stringify(updated));
  };

  // Sync profile edits with localStorage
  const handleUpdateProfileStorage = (updatedFields) => {
    const updated = { ...myProfile, ...updatedFields };
    setMyProfile(updated);
    updateWriterProfile(user.email, updated);

    // Sync current session
    const session = JSON.parse(localStorage.getItem('inklink_session') || '{}');
    session.name = updated.name;
    session.details = {
      ...session.details,
      penmanship: updated.style,
      background: updated.background,
      rate: updated.rate,
      phone: updated.phone,
      isRegistered: updated.isRegistered
    };
    localStorage.setItem('inklink_session', JSON.stringify(session));
  };

  // Handle Registration Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regAadharUploaded || !regCollegeIdUploaded) {
      alert('Please upload simulated identity documents (Aadhaar & College/Govt ID) to proceed.');
      return;
    }
    const updated = {
      name: regName,
      phone: regPhone,
      email: regEmail,
      password: regPassword,
      aadharUploaded: regAadharUploaded,
      collegeIdUploaded: regCollegeIdUploaded,
      subjectSpecialization: regSubject,
      speed: Number(regSpeed),
      languages: regLanguages,
      timings: regTimings,
      city: regCity,
      address: regAddress,
      isRegistered: true
    };
    handleUpdateProfileStorage(updated);
    alert('Registration submitted successfully! You are now a whitelisted writer.');
    setActiveTab('jobs'); // Switch to available jobs
  };

  // File upload simulation helpers
  const simulateFileUpload = (type) => {
    if (type === 'aadhar') {
      setRegAadharUploaded(true);
      alert('Aadhaar scanned and uploaded successfully (sandbox simulated)!');
    } else if (type === 'college') {
      setRegCollegeIdUploaded(true);
      alert('College ID / Govt ID uploaded successfully (sandbox simulated)!');
    }
  };

  // Handwriting Sample Handlers
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        // Append along with category label
        const newImgObj = { url: base64Image, category: sampleCategory };
        const updatedImages = [...(myProfile.images || []), newImgObj];
        handleUpdateProfileStorage({ images: updatedImages });
      };
      reader.readAsDataURL(file);
    });
  };

  const addCuratedSample = (unsplashUrl) => {
    const newImgObj = { url: unsplashUrl, category: sampleCategory };
    const updatedImages = [...(myProfile.images || []), newImgObj];
    handleUpdateProfileStorage({ images: updatedImages });
  };

  const handleDeleteSample = (imgIdx) => {
    const updatedImages = (myProfile.images || []).filter((_, idx) => idx !== imgIdx);
    handleUpdateProfileStorage({ images: updatedImages });
  };

  // Pricing setup list handlers
  const handleAddSubjectPrice = (e) => {
    e.preventDefault();
    if (!newSubjName) return;
    const newList = [...subjectPricingList, { subject: newSubjName, price: Number(newSubjPrice) }];
    setSubjectPricingList(newList);
    handleUpdateProfileStorage({ subjectPricing: newList });
    setNewSubjName('');
    setNewSubjPrice(10);
  };

  const handleRemoveSubjectPrice = (subjIndex) => {
    const newList = subjectPricingList.filter((_, idx) => idx !== subjIndex);
    setSubjectPricingList(newList);
    handleUpdateProfileStorage({ subjectPricing: newList });
  };

  const handleSaveGlobalRates = (e) => {
    e.preventDefault();
    handleUpdateProfileStorage({
      rate: Number(pricePerPage),
      urgentRate: Number(urgentRate),
      deliveryCharges: Number(deliveryCharges)
    });
    alert('Global pricing and turn-around margins saved successfully!');
  };

  // Job claims / Accepts
  const handleAcceptJob = (jobId) => {
    const updated = assignments.map(a => {
      if (a.id === jobId) {
        return {
          ...a,
          status: 'accepted',
          writerName: myProfile.name,
          progress: 10
        };
      }
      return a;
    });
    saveAssignmentsToStorage(updated);
    setSelectedPoolJob(null);

    // Add alert
    const newAlert = {
      id: Date.now(),
      text: `You accepted the assignment: "${assignments.find(a => a.id === jobId)?.title}"`,
      type: 'success',
      time: 'Just now'
    };
    setAlerts(prev => [newAlert, ...prev]);
    alert('Job assigned to you! Check your Active Orders Dashboard.');
  };

  const handleRejectJob = (jobId) => {
    // Simply dismiss it from available board dynamically
    const updated = assignments.filter(a => a.id !== jobId);
    saveAssignmentsToStorage(updated);
    setSelectedPoolJob(null);
    alert('Job request declined.');
  };

  // Active orders flow
  const handleUpdateStatus = (jobId, currentStatus) => {
    let nextStatus = currentStatus;
    let progress = 10;
    if (currentStatus === 'accepted') {
      nextStatus = 'writing started';
      progress = 40;
    } else if (currentStatus === 'writing started') {
      nextStatus = 'completed';
      progress = 100;
    } else if (currentStatus === 'completed') {
      nextStatus = 'out of delivery';
      progress = 100;
    }

    const updated = assignments.map(a => {
      if (a.id === jobId) {
        return { ...a, status: nextStatus, progress };
      }
      return a;
    });
    saveAssignmentsToStorage(updated);

    // Sync notification logs
    const newAlert = {
      id: Date.now(),
      text: `Order #${jobId.replace('ord_', '')} status changed to "${nextStatus.toUpperCase()}"`,
      type: 'info',
      time: 'Just now'
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  // Delivery maps and OTP simulation
  useEffect(() => {
    let timer;
    if (liveMapActive && mapPosition < 100) {
      timer = setInterval(() => {
        setMapPosition(prev => {
          const next = prev + 10;
          if (next >= 100) {
            setLiveMapActive(false);
            setDeliveryLogs(prevLogs => [
              ...prevLogs,
              { time: 'Just now', log: 'Reached customer location. Awaiting OTP verification.' }
            ]);
            return 100;
          }
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [liveMapActive, mapPosition]);

  const handleStartDeliveryRoute = () => {
    setLiveMapActive(true);
    setMapPosition(0);
    setDeliveryLogs(prev => [
      ...prev,
      { time: 'Just now', log: 'Writer started moving. GPS tracking activated.' }
    ]);
  };

  const handleVerifyDeliveryOTP = (e, orderId) => {
    e.preventDefault();
    if (deliveryOTP === '1234') {
      setOtpVerifySuccess(true);
      const updated = assignments.map(a => {
        if (a.id === orderId) {
          return { ...a, status: 'delivered' };
        }
        return a;
      });
      saveAssignmentsToStorage(updated);

      // Release Escrow money to Wallet
      const orderAmount = assignments.find(a => a.id === orderId)?.price || 350;
      const compensation = Math.round(orderAmount * 0.85);
      setWalletBalance(prev => prev + compensation);
      setWithdrawableBalance(prev => prev + compensation);
      setTransactions(prev => [
        {
          id: `TXN${Date.now().toString().slice(-4)}`,
          orderId: `#ORD${orderId.replace('ord_', '')}`,
          date: 'Today',
          amount: compensation,
          type: 'credit',
          status: 'Completed'
        },
        ...prev
      ]);

      alert(`OTP Verified! Order successfully delivered. ₹${compensation} has been credited to your withdrawable balance.`);
    } else {
      alert('Invalid OTP. Please try using standard customer test OTP: "1234"');
    }
  };

  // Wallet settlement
  const handleWithdrawFunds = (e) => {
    e.preventDefault();
    if (withdrawableBalance <= 0) {
      alert('No withdrawable balance available.');
      return;
    }
    if (!upiId && (!bankAcc || !bankIfsc)) {
      alert('Please fill out either UPI or Bank Account details.');
      return;
    }
    setShowWithdrawMsg(true);
    setTimeout(() => {
      const amt = withdrawableBalance;
      setWithdrawableBalance(0);
      setShowWithdrawMsg(false);
      setUpiId('');
      setBankAcc('');
      setBankIfsc('');
      setTransactions(prev => [
        {
          id: `TXN${Date.now().toString().slice(-4)}`,
          orderId: 'WITHDRAWAL',
          date: 'Today',
          amount: amt,
          type: 'debit',
          status: 'Completed'
        },
        ...prev
      ]);
      alert(`Bank Settlement Completed! ₹${amt} deposited successfully.`);
    }, 2000);
  };

  // Chat simulator send
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = { sender: 'You', text: newMessage, time: 'Just now' };
    setChats(prev => ({
      ...prev,
      [activeChannelId]: [...prev[activeChannelId], userMessage]
    }));
    setNewMessage('');

    // Mock Client Auto-respond
    setTimeout(() => {
      let clientMsgText = "Excellent. Please keep standard ruled formats.";
      if (activeChannelId === 'priya') {
        clientMsgText = "Thanks for the layout update! Yes, the sketches look perfect.";
      } else if (activeChannelId === 'vikram') {
        clientMsgText = "Understood. Please let me know once delivery is initiated.";
      }
      setChats(prev => ({
        ...prev,
        [activeChannelId]: [...prev[activeChannelId], { sender: 'Client', text: clientMsgText, time: 'Just now' }]
      }));
      // Add notification alert too
      setAlerts(prev => [
        { id: Date.now(), text: `New message from client in channel "${activeChannelId.toUpperCase()}"`, type: 'info', time: 'Just now' },
        ...prev
      ]);
    }, 1200);
  };

  // Filter available jobs pool
  const getFilteredJobs = () => {
    return assignments.filter(job => {
      if (job.status !== 'pending') return false;
      
      // search query
      const matchSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.subject.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      // Filter badges
      if (filterNearby && job.distance > 3) return false;
      if (filterUrgent && job.deadline !== '24 Hours') return false;
      if (filterHighPaying && job.price < 400) return false;
      if (filterSubject !== 'All' && job.subject !== filterSubject) return false;

      return true;
    });
  };

  const activeJobs = assignments.filter(a => a.status !== 'pending' && a.status !== 'completed' && a.status !== 'delivered');
  const completedJobs = assignments.filter(a => a.status === 'completed' || a.status === 'delivered');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-sand)' }}>
      
      {/* 9-Part Left Sidebar Navigation */}
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
        {/* Brand & Small Profile Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => window.location.reload()}>
            <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--accent-orange)' }}>*</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '18px', letterSpacing: '-0.03em' }}>INKLINK</span>
            <span style={{ fontSize: '10px', backgroundColor: 'var(--accent-orange)', color: '#FFF', padding: '1px 6px', fontWeight: '800', marginLeft: 'auto' }}>WRITER</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-sand)', border: '1.5px solid var(--border-editorial)', display: 'flex', alignItems: 'center', justifycontent: 'center', overflow: 'hidden' }}>
              {myProfile.avatar ? (
                <img src={myProfile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <strong style={{ fontWeight: '900', margin: 'auto' }}>{myProfile.name.charAt(0)}</strong>
              )}
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '900', margin: 0 }}>{myProfile.name}</h4>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {myProfile.isRegistered ? '★ 4.8 Verified Penman' : 'Unregistered Writer'}
              </span>
            </div>
          </div>

          {/* 9 Sidebar navigation tabs */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            
            <button 
              onClick={() => setActiveTab('registration')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                border: '1.5px solid var(--border-editorial)',
                backgroundColor: activeTab === 'registration' ? 'var(--border-editorial)' : '#FFFFFF',
                color: activeTab === 'registration' ? 'var(--bg-sand)' : 'var(--text-dark)',
                boxShadow: activeTab === 'registration' ? 'none' : '2px 2px 0 var(--border-editorial)',
                cursor: 'pointer',
                textAlign: 'left',
                transform: activeTab === 'registration' ? 'translate(1px, 1px)' : 'none'
              }}
            >
              <UserPlus size={13} />
              ① Registration
            </button>

            <button 
              onClick={() => setActiveTab('samples')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                border: '1.5px solid var(--border-editorial)',
                backgroundColor: activeTab === 'samples' ? 'var(--border-editorial)' : '#FFFFFF',
                color: activeTab === 'samples' ? 'var(--bg-sand)' : 'var(--text-dark)',
                boxShadow: activeTab === 'samples' ? 'none' : '2px 2px 0 var(--border-editorial)',
                cursor: 'pointer',
                textAlign: 'left',
                transform: activeTab === 'samples' ? 'translate(1px, 1px)' : 'none'
              }}
            >
              <Camera size={13} />
              ② Sample Upload
            </button>

            <button 
              onClick={() => setActiveTab('pricing')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                border: '1.5px solid var(--border-editorial)',
                backgroundColor: activeTab === 'pricing' ? 'var(--border-editorial)' : '#FFFFFF',
                color: activeTab === 'pricing' ? 'var(--bg-sand)' : 'var(--text-dark)',
                boxShadow: activeTab === 'pricing' ? 'none' : '2px 2px 0 var(--border-editorial)',
                cursor: 'pointer',
                textAlign: 'left',
                transform: activeTab === 'pricing' ? 'translate(1px, 1px)' : 'none'
              }}
            >
              <Tag size={13} />
              ③ Pricing Setup
            </button>

            <button 
              onClick={() => setActiveTab('jobs')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                border: '1.5px solid var(--border-editorial)',
                backgroundColor: activeTab === 'jobs' ? 'var(--border-editorial)' : '#FFFFFF',
                color: activeTab === 'jobs' ? 'var(--bg-sand)' : 'var(--text-dark)',
                boxShadow: activeTab === 'jobs' ? 'none' : '2px 2px 0 var(--border-editorial)',
                cursor: 'pointer',
                textAlign: 'left',
                transform: activeTab === 'jobs' ? 'translate(1px, 1px)' : 'none'
              }}
            >
              <Briefcase size={13} />
              ④ Available Jobs
            </button>

            <button 
              onClick={() => setActiveTab('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                border: '1.5px solid var(--border-editorial)',
                backgroundColor: activeTab === 'orders' ? 'var(--border-editorial)' : '#FFFFFF',
                color: activeTab === 'orders' ? 'var(--bg-sand)' : 'var(--text-dark)',
                boxShadow: activeTab === 'orders' ? 'none' : '2px 2px 0 var(--border-editorial)',
                cursor: 'pointer',
                textAlign: 'left',
                transform: activeTab === 'orders' ? 'translate(1px, 1px)' : 'none'
              }}
            >
              <Activity size={13} />
              ⑤ Active Orders
            </button>

            <button 
              onClick={() => setActiveTab('delivery')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                border: '1.5px solid var(--border-editorial)',
                backgroundColor: activeTab === 'delivery' ? 'var(--border-editorial)' : '#FFFFFF',
                color: activeTab === 'delivery' ? 'var(--bg-sand)' : 'var(--text-dark)',
                boxShadow: activeTab === 'delivery' ? 'none' : '2px 2px 0 var(--border-editorial)',
                cursor: 'pointer',
                textAlign: 'left',
                transform: activeTab === 'delivery' ? 'translate(1px, 1px)' : 'none'
              }}
            >
              <Truck size={13} />
              ⑥ Delivery Mgmt
            </button>

            <button 
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                border: '1.5px solid var(--border-editorial)',
                backgroundColor: activeTab === 'profile' ? 'var(--border-editorial)' : '#FFFFFF',
                color: activeTab === 'profile' ? 'var(--bg-sand)' : 'var(--text-dark)',
                boxShadow: activeTab === 'profile' ? 'none' : '2px 2px 0 var(--border-editorial)',
                cursor: 'pointer',
                textAlign: 'left',
                transform: activeTab === 'profile' ? 'translate(1px, 1px)' : 'none'
              }}
            >
              <User size={13} />
              ⑦ Worker Profile
            </button>

            <button 
              onClick={() => setActiveTab('wallet')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                border: '1.5px solid var(--border-editorial)',
                backgroundColor: activeTab === 'wallet' ? 'var(--border-editorial)' : '#FFFFFF',
                color: activeTab === 'wallet' ? 'var(--bg-sand)' : 'var(--text-dark)',
                boxShadow: activeTab === 'wallet' ? 'none' : '2px 2px 0 var(--border-editorial)',
                cursor: 'pointer',
                textAlign: 'left',
                transform: activeTab === 'wallet' ? 'translate(1px, 1px)' : 'none'
              }}
            >
              <Wallet size={13} />
              ⑧ Earning & Wallet
            </button>

            <button 
              onClick={() => setActiveTab('messages')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                border: '1.5px solid var(--border-editorial)',
                backgroundColor: activeTab === 'messages' ? 'var(--border-editorial)' : '#FFFFFF',
                color: activeTab === 'messages' ? 'var(--bg-sand)' : 'var(--text-dark)',
                boxShadow: activeTab === 'messages' ? 'none' : '2px 2px 0 var(--border-editorial)',
                cursor: 'pointer',
                textAlign: 'left',
                transform: activeTab === 'messages' ? 'translate(1px, 1px)' : 'none'
              }}
            >
              <Bell size={13} />
              ⑨ Chat & Alerts
            </button>

          </nav>
        </div>

        {/* Bottom utility Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
          <button 
            onClick={onGoBack} 
            className="btn-secondary" 
            style={{ 
              width: '100%', 
              padding: '8px', 
              fontSize: '10px', 
              fontWeight: '800', 
              textTransform: 'uppercase', 
              justifyContent: 'center',
              borderRadius: '0' 
            }}
          >
            Public Landing ↗
          </button>
          <button 
            onClick={onLogout} 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              padding: '8px', 
              fontSize: '10px', 
              fontWeight: '800', 
              textTransform: 'uppercase', 
              justifyContent: 'center', 
              boxShadow: 'none',
              borderRadius: '0'
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main scrollable Content Panel */}
      <main style={{ flexGrow: 1, padding: '32px 48px', overflowY: 'auto', maxHeight: '100vh', width: '100%' }}>
        
        {/* Dynamic header message banner based on active tab */}
        <div style={{ borderBottom: '1.5px solid var(--border-editorial)', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
              Step {activeTab === 'registration' ? '1' : activeTab === 'samples' ? '2' : activeTab === 'pricing' ? '3' : activeTab === 'jobs' ? '4' : activeTab === 'orders' ? '5' : activeTab === 'delivery' ? '6' : activeTab === 'profile' ? '7' : activeTab === 'wallet' ? '8' : '9'} of 9 Workspace Flow
            </span>
            <h2 className="font-display-condensed" style={{ fontSize: '24px', margin: '4px 0 0 0' }}>
              {activeTab === 'registration' && '① Writer Registration Profile'}
              {activeTab === 'samples' && '② Handwriting Upload Vault'}
              {activeTab === 'pricing' && '③ Pricing Rates & Subject Setup'}
              {activeTab === 'jobs' && '④ Available Writing Job Boards'}
              {activeTab === 'orders' && '⑤ Active Orders Tracking System'}
              {activeTab === 'delivery' && '⑥ Delivery Options & GPS Map Tracker'}
              {activeTab === 'profile' && '⑦ Writer Public Showcase Card'}
              {activeTab === 'wallet' && '⑧ Earnings Statement & Ledger Transfer'}
              {activeTab === 'messages' && '⑨ Alerts Feed & Client In-App Chat'}
            </h2>
          </div>
          
          <div style={{ fontSize: '11px', fontWeight: '800', backgroundColor: '#FFFFFF', border: '1px solid var(--border-editorial)', padding: '4px 12px', borderRadius: '4px' }}>
            Status: <span style={{ color: myProfile.isRegistered ? 'var(--accent-green)' : 'var(--accent-orange)' }}>
              ● {myProfile.isRegistered ? 'Whitelisted Writer' : 'Registration Pending'}
            </span>
          </div>
        </div>

        {/* Global Warning for unregistered writers */}
        {!myProfile.isRegistered && activeTab !== 'registration' && (
          <div style={{ backgroundColor: 'rgba(255, 85, 0, 0.05)', border: '2px solid var(--accent-orange)', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', boxShadow: '3px 3px 0 var(--border-editorial)' }}>
            <ShieldAlert size={24} color="var(--accent-orange)" />
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-dark)' }}>PENMAN REGISTRATION IS INCOMPLETE</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>To accept customer orders, configure subject rates, and receive wallet payouts, please complete step ① (Registration) first.</p>
            </div>
            <button onClick={() => setActiveTab('registration')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '10px', marginLeft: 'auto' }}>Go to Step 1</button>
          </div>
        )}

        {/* VIEW 1: Writer Registration Page */}
        {activeTab === 'registration' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
            <div style={{ gridColumn: 'span 8' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '28px', boxShadow: '5px 5px 0 var(--border-editorial)' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>Submit Registration & Verification Info</h3>
                
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Subsection: Personal details */}
                  <div>
                    <h4 style={{ fontSize: '11px', color: 'var(--accent-orange)', marginBottom: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '4px' }}>Personal Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '10px', fontWeight: '800' }}>Full Name *</label>
                        <input 
                          type="text" required value={regName} onChange={(e) => setRegName(e.target.value)}
                          style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '10px', fontWeight: '800' }}>Phone Number *</label>
                        <input 
                          type="text" required value={regPhone} onChange={(e) => setRegPhone(e.target.value)}
                          style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                        <label style={{ fontSize: '10px', fontWeight: '800' }}>Email Address *</label>
                        <input 
                          type="email" required disabled value={regEmail}
                          style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', backgroundColor: 'var(--bg-sand)', fontSize: '12px', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                        <label style={{ fontSize: '10px', fontWeight: '800' }}>Password *</label>
                        <input 
                          type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                          style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subsection: Identity Verification */}
                  <div style={{ marginTop: '8px' }}>
                    <h4 style={{ fontSize: '11px', color: 'var(--accent-orange)', marginBottom: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '4px' }}>Identity Verification Documents</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ border: '1.5px dashed var(--border-editorial)', padding: '16px', textAlign: 'center', backgroundColor: regAadharUploaded ? 'rgba(15,169,88,0.05)' : 'var(--bg-sand)' }}>
                        <h5 style={{ fontSize: '11px', margin: '0 0 6px 0' }}>Aadhaar Card Upload</h5>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '12px' }}>Upload a PDF/Image scan of front & back Aadhaar card.</p>
                        {regAadharUploaded ? (
                          <span style={{ color: 'var(--accent-green)', fontWeight: '800', fontSize: '11px' }}>✓ Aadhaar Scanned</span>
                        ) : (
                          <button type="button" onClick={() => simulateFileUpload('aadhar')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '10px', borderRadius: '0' }}>Upload Aadhaar</button>
                        )}
                      </div>
                      <div style={{ border: '1.5px dashed var(--border-editorial)', padding: '16px', textAlign: 'center', backgroundColor: regCollegeIdUploaded ? 'rgba(15,169,88,0.05)' : 'var(--bg-sand)' }}>
                        <h5 style={{ fontSize: '11px', margin: '0 0 6px 0' }}>College ID / Government ID</h5>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '12px' }}>Upload current student ID card or Govt-issued address proof.</p>
                        {regCollegeIdUploaded ? (
                          <span style={{ color: 'var(--accent-green)', fontWeight: '800', fontSize: '11px' }}>✓ ID Verified</span>
                        ) : (
                          <button type="button" onClick={() => simulateFileUpload('college')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '10px', borderRadius: '0' }}>Upload ID Proof</button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Subsection: Skills & Details */}
                  <div style={{ marginTop: '8px' }}>
                    <h4 style={{ fontSize: '11px', color: 'var(--accent-orange)', marginBottom: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '4px' }}>Skills & Experience</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '10px', fontWeight: '800' }}>Subject Specialization</label>
                        <input 
                          type="text" value={regSubject} onChange={(e) => setRegSubject(e.target.value)}
                          style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '10px', fontWeight: '800' }}>Writing Speed (Pages/Hour)</label>
                        <input 
                          type="number" min="1" value={regSpeed} onChange={(e) => setRegSpeed(e.target.value)}
                          style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                        <label style={{ fontSize: '10px', fontWeight: '800' }}>Languages Known</label>
                        <input 
                          type="text" value={regLanguages} onChange={(e) => setRegLanguages(e.target.value)}
                          style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                        <label style={{ fontSize: '10px', fontWeight: '800' }}>Available Timings</label>
                        <input 
                          type="text" value={regTimings} onChange={(e) => setRegTimings(e.target.value)}
                          style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subsection: Location details */}
                  <div style={{ marginTop: '8px' }}>
                    <h4 style={{ fontSize: '11px', color: 'var(--accent-orange)', marginBottom: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '4px' }}>Location Settings</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '10px', fontWeight: '800' }}>City Location</label>
                          <input 
                            type="text" value={regCity} onChange={(e) => setRegCity(e.target.value)}
                            style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '10px', fontWeight: '800' }}>Full Address Coordinates</label>
                          <input 
                            type="text" value={regAddress} onChange={(e) => setRegAddress(e.target.value)}
                            style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                        <button 
                          type="button" 
                          onClick={() => {
                            setRegLiveLoc(true);
                            setRegCity('Hyderabad');
                            setRegAddress('Microsoft Campus, Gachibowli Area');
                            alert('Mock GPS tracking: coordinates set to Gachibowli Microsoft Campus.');
                          }} 
                          style={{
                            backgroundColor: regLiveLoc ? 'var(--accent-green)' : '#FFFFFF',
                            color: regLiveLoc ? '#FFFFFF' : 'var(--text-dark)',
                            border: '1.5px solid var(--border-editorial)',
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '6px 12px',
                            cursor: 'pointer'
                          }}
                        >
                          {regLiveLoc ? '✓ Live GPS Location Shared' : 'Share Live Location GPS Access'}
                        </button>
                        {regLiveLoc && <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Lat: 17.4424° N, Long: 78.3789° E</span>}
                      </div>
                    </div>
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
                      marginTop: '12px'
                    }}
                  >
                    Save & Complete Writer Onboarding
                  </button>

                </form>
              </div>
            </div>

            {/* Registration Details Sidebar summary */}
            <div style={{ gridColumn: 'span 4' }}>
              <div style={{ backgroundColor: 'var(--border-editorial)', color: 'var(--bg-sand)', padding: '24px', border: '1.5px solid var(--border-editorial)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '13px', color: 'var(--accent-orange)' }}>Registration Guidelines</h4>
                <p style={{ fontSize: '11px', opacity: 0.9, lineHeight: '1.4' }}>
                  Welcome to the INKLINK Writer Network. All physical handwritten assignments are managed securely under custom smart-payout locks.
                </p>
                <p style={{ fontSize: '11px', opacity: 0.9, lineHeight: '1.4' }}>
                  <strong>Verify Identity:</strong> Standard writer validation requires a valid Aadhaar scan.
                </p>
                <p style={{ fontSize: '11px', opacity: 0.9, lineHeight: '1.4' }}>
                  <strong>Live Location:</strong> Sharing live location coordinates connects you to nearby students and reduces delivery partner dispatch timings.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Handwriting Sample Upload Page */}
        {activeTab === 'samples' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
            
            {/* Control Panel: Left */}
            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
                <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>Handwriting Sample Uploads</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '10px', fontWeight: '800' }}>Choose Paper Category</label>
                    <select 
                      value={sampleCategory} 
                      onChange={(e) => setSampleCategory(e.target.value)}
                      style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', fontWeight: '600', outline: 'none' }}
                    >
                      <option value="ruled">Ruled Notebook Sample</option>
                      <option value="plain">Plain Page Sample</option>
                      <option value="diagram">Diagram / Sample Notes</option>
                      <option value="style">Different Handwriting Style</option>
                    </select>
                  </div>

                  <div style={{ border: '2px dashed var(--border-editorial)', padding: '24px', textAlign: 'center', backgroundColor: 'var(--bg-sand)', position: 'relative', cursor: 'pointer' }}>
                    <input 
                      type="file" multiple accept="image/*" onChange={handleImageUpload}
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    />
                    <Upload size={24} style={{ margin: '0 auto 8px auto', color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '11px', fontWeight: '800', display: 'block' }}>Drag & Drop Image Samples</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>JPG, PNG under 1MB</span>
                  </div>

                  {/* Seed testing options */}
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Seed Sample Scans (Testing Seeding)</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => addCuratedSample('https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=400&h=400&q=80')}
                        style={{ fontSize: '9px', padding: '5px 10px', border: '1px solid var(--border-editorial)', backgroundColor: 'var(--bg-sand)', cursor: 'pointer', fontWeight: '700' }}
                      >
                        + Lined Paper Scan
                      </button>
                      <button 
                        onClick={() => addCuratedSample('https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&h=400&q=80')}
                        style={{ fontSize: '9px', padding: '5px 10px', border: '1px solid var(--border-editorial)', backgroundColor: 'var(--bg-sand)', cursor: 'pointer', fontWeight: '700' }}
                      >
                        + Fountain Ink Plain Scan
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Dynamic Lined Notebook Simulation Panel */}
              <div className="notebook-container">
                <div className="notebook-header">
                  <span>FONTSIM PREVIEWER // STYLE: {myProfile.style.toUpperCase()}</span>
                </div>
                <textarea 
                  className="notebook-paper" 
                  style={{ fontFamily: "'Caveat', cursive", fontSize: '22px', border: 'none', resize: 'none', width: '100%', minHeight: '180px' }}
                  value={sampleStyleText}
                  onChange={(e) => setSampleStyleText(e.target.value)}
                />
              </div>

            </div>

            {/* Gallery list: Right */}
            <div style={{ gridColumn: 'span 6' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)', minHeight: '380px' }}>
                <h3 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>My Penmanship Scan Gallery ({(myProfile.images || []).length})</h3>
                
                {(myProfile.images || []).length === 0 ? (
                  <div style={{ border: '1.5px dashed var(--border-light)', padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', fontStyle: 'italic' }}>
                    No samples uploaded yet. Choose a category and upload handwriting scans to display.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {(myProfile.images || []).map((img, idx) => (
                      <div key={idx} style={{ border: '1.5px solid var(--border-editorial)', position: 'relative', height: '140px', overflow: 'hidden' }}>
                        <img src={img.url || img} alt="sample" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', bottom: '4px', left: '4px', fontSize: '8px', padding: '2px 6px', backgroundColor: 'var(--border-editorial)', color: 'var(--bg-sand)', fontWeight: '800', textTransform: 'uppercase' }}>
                          {img.category || 'Standard Sample'}
                        </span>
                        <button 
                          onClick={() => handleDeleteSample(idx)}
                          style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#E11D48', color: '#FFF', border: 'none', cursor: 'pointer', padding: '3px', borderRadius: '3px' }}
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 3: Pricing Setup Page */}
        {activeTab === 'pricing' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
            
            {/* Global parameters pricing: Left */}
            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '28px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>Configure General Penman Rates</h3>
                
                <form onSubmit={handleSaveGlobalRates} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '11px', fontWeight: '800' }}>Standard Gold Rate (₹ / Page) *</label>
                      <strong style={{ color: 'var(--accent-orange)' }}>₹{pricePerPage}</strong>
                    </div>
                    <input 
                      type="range" min="5" max="100" value={pricePerPage} onChange={(e) => setPricePerPage(e.target.value)}
                      style={{ accentColor: 'var(--accent-orange)', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '11px', fontWeight: '800' }}>Urgent Turnaround Delivery Fee (₹ / Extra Page) *</label>
                      <strong style={{ color: 'var(--accent-orange)' }}>+₹{urgentRate}</strong>
                    </div>
                    <input 
                      type="range" min="0" max="50" value={urgentRate} onChange={(e) => setUrgentRate(e.target.value)}
                      style={{ accentColor: 'var(--accent-orange)', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '11px', fontWeight: '800' }}>Delivery Surcharge base rates (₹ / order) *</label>
                      <strong style={{ color: 'var(--accent-orange)' }}>₹{deliveryCharges}</strong>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={deliveryCharges} onChange={(e) => setDeliveryCharges(e.target.value)}
                      style={{ accentColor: 'var(--accent-orange)', cursor: 'pointer' }}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', boxShadow: 'none', borderRadius: '0', fontSize: '11px', padding: '10px' }}
                  >
                    Save Global Rate Setup
                  </button>

                </form>
              </div>

              {/* pricing visual reference cards */}
              <div style={{ backgroundColor: 'var(--border-editorial)', color: 'var(--bg-sand)', padding: '20px', border: '1.5px solid var(--border-editorial)' }}>
                <h4 style={{ fontSize: '12px', color: 'var(--accent-orange)', marginBottom: '8px' }}>Example Rates & Estimates</h4>
                <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Standard Math Assignment (10 pgs):</span>
                    <strong>₹{10 * pricePerPage}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Urgent Chemistry Assignment (10 pgs):</span>
                    <strong>₹{(10 * pricePerPage) + (10 * urgentRate)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '6px' }}>
                    <span>Estimated Net Earning (85% payout):</span>
                    <strong style={{ color: 'var(--accent-green)' }}>₹{Math.round((10 * pricePerPage) * 0.85)}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject wise rates: Right */}
            <div style={{ gridColumn: 'span 6' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
                <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Subject-wise Pricing Overrides</h3>
                
                {/* Form to add custom subject price override */}
                <form onSubmit={handleAddSubjectPrice} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  <input 
                    type="text" required placeholder="Subject (e.g. Maths, Physics)" value={newSubjName} onChange={(e) => setNewSubjName(e.target.value)}
                    style={{ flexGrow: 1, padding: '8px 12px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                  />
                  <input 
                    type="number" min="5" max="200" required placeholder="₹ Rate" value={newSubjPrice} onChange={(e) => setNewSubjPrice(e.target.value)}
                    style={{ width: '80px', padding: '8px 12px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none', fontWeight: '800' }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '8px 14px', fontSize: '11px', borderRadius: '0', boxShadow: 'none' }}>Add Override</button>
                </form>

                {/* List of custom subject prices */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Subject wise Rates List</span>
                  {subjectPricingList.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'var(--bg-sand)',
                        padding: '10px 14px',
                        border: '1px solid var(--border-editorial)',
                        fontSize: '12px'
                      }}
                    >
                      <div>
                        <strong>{item.subject}</strong>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '10px' }}>Custom Override</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontWeight: '800', color: 'var(--accent-ink)' }}>₹{item.price} / page</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSubjectPrice(idx)}
                          style={{ border: 'none', color: '#E11D48', cursor: 'pointer', padding: '2px' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* VIEW 4: Available Jobs to Write/Requests Page */}
        {activeTab === 'jobs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
            
            {/* Filters panel: Left */}
            <div style={{ gridColumn: 'span 4' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <h3 style={{ fontSize: '14px' }}>Job Request Filters</h3>
                
                {/* Search */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', padding: '6px 12px' }}>
                  <Search size={14} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
                  <input 
                    type="text" placeholder="Search keywords..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ fontSize: '11px', outline: 'none', width: '100%' }}
                  />
                </div>

                {/* Filter Checkboxes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Distance & Deadlines</span>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filterNearby} onChange={(e) => setFilterNearby(e.target.checked)} style={{ accentColor: 'var(--accent-orange)' }} />
                    Nearby Writing Jobs (&lt; 3km)
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filterUrgent} onChange={(e) => setFilterUrgent(e.target.checked)} style={{ accentColor: 'var(--accent-orange)' }} />
                    Urgent Delivery (&lt; 24h deadline)
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filterHighPaying} onChange={(e) => setFilterHighPaying(e.target.checked)} style={{ accentColor: 'var(--accent-orange)' }} />
                    High Paying Rewards (&gt; ₹400)
                  </label>
                </div>

                {/* Subject Selector Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subject Areas</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['All', 'Chemistry', 'English', 'Math', 'History'].map((subj) => (
                      <button
                        key={subj}
                        onClick={() => setFilterSubject(subj)}
                        style={{
                          fontSize: '10px',
                          padding: '4px 10px',
                          border: '1.5px solid var(--border-editorial)',
                          backgroundColor: filterSubject === subj ? 'var(--border-editorial)' : '#FFFFFF',
                          color: filterSubject === subj ? 'var(--bg-sand)' : 'var(--text-dark)',
                          cursor: 'pointer',
                          fontWeight: '800'
                        }}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Jobs feed: Right */}
            <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '16px' }}>Available Assignment Board ({getFilteredJobs().length})</h3>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>Updates dynamically</span>
              </div>

              {getFilteredJobs().length === 0 ? (
                <div style={{ backgroundColor: '#FFFFFF', border: '1.5px dashed var(--border-editorial)', padding: '56px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Briefcase size={36} style={{ margin: '0 auto 12px auto' }} />
                  <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>No Available Requests Found</h4>
                  <p style={{ fontSize: '11px' }}>Try clearing your filters or search keywords to check other active postings.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {getFilteredJobs().map(job => (
                    <div 
                      key={job.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid var(--border-editorial)',
                        padding: '20px',
                        boxShadow: '4px 4px 0 var(--border-editorial)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-orange)', border: '1px solid var(--accent-orange)', padding: '2px 6px', backgroundColor: 'rgba(255,85,0,0.05)' }}>
                            {job.subject}
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>• {job.pages} Pages</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>• {job.distance} km away</span>
                        </div>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', margin: 0 }}>{job.title}</h4>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                          <span>Deadline: <strong>{job.deadline}</strong></span>
                          <span>Rating: <strong>★ {job.clientRating}</strong></span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div>
                          <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--accent-green)' }}>₹{Math.round(job.price * 0.85)}</span>
                          <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block' }}>Net (85% payout)</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            onClick={() => handleRejectJob(job.id)}
                            style={{ padding: '6px 10px', fontSize: '10px', border: '1.5px solid var(--border-editorial)', backgroundColor: '#FFFFFF', color: '#E11D48', fontWeight: '800', cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleAcceptJob(job.id)}
                            style={{ padding: '6px 12px', fontSize: '10px', border: '1.5px solid var(--border-editorial)', backgroundColor: 'var(--accent-green)', color: '#FFFFFF', fontWeight: '800', cursor: 'pointer' }}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW 5: Active Orders Dashboard */}
        {activeTab === 'orders' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
            
            {/* Active Jobs list: Left */}
            <div style={{ gridColumn: 'span 7' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)', minHeight: '380px' }}>
                <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>My Active Assigned Jobs ({activeJobs.length})</h3>
                
                {activeJobs.length === 0 ? (
                  <div style={{ border: '1.5px dashed var(--border-light)', padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                    No active assignments are currently tracked. Visit the "④ Available Jobs" tab to claim work.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {activeJobs.map(job => (
                      <div 
                        key={job.id} 
                        onClick={() => setSelectedActiveOrder(job)}
                        style={{ 
                          border: '1.5px solid var(--border-editorial)', 
                          padding: '16px', 
                          cursor: 'pointer',
                          backgroundColor: selectedActiveOrder?.id === job.id ? 'var(--bg-sand)' : '#FFFFFF',
                          boxShadow: selectedActiveOrder?.id === job.id ? 'none' : '3px 3px 0 var(--border-editorial)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '9px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>ORDER ID: #{job.id.replace('ord_', '')}</span>
                          <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>{job.status}</span>
                        </div>
                        <h4 style={{ fontSize: '13px', fontWeight: '800', margin: '0 0 6px 0' }}>{job.title}</h4>
                        
                        {/* Progress Bar */}
                        <div style={{ margin: '8px 0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '3px' }}>
                            <span>Writing Progress</span>
                            <strong>{job.progress}%</strong>
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(21,21,21,0.06)', border: '1px solid var(--border-editorial)', overflow: 'hidden' }}>
                            <div style={{ width: `${job.progress}%`, height: '100%', backgroundColor: 'var(--accent-green)' }}></div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Job Status Control panel: Right */}
            <div style={{ gridColumn: 'span 5' }}>
              {selectedActiveOrder ? (
                <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Status Control Panel</span>
                    <h3 style={{ fontSize: '16px', margin: '2px 0' }}>{selectedActiveOrder.title}</h3>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>Subject Area: <strong>{selectedActiveOrder.subject}</strong></div>
                    <div>Page Count: <strong>{selectedActiveOrder.pages} pages</strong></div>
                    <div>Client Distance: <strong>{selectedActiveOrder.distance} km</strong></div>
                    <div>Net Earnings: <strong style={{ color: 'var(--accent-green)' }}>₹{Math.round(selectedActiveOrder.price * 0.85)}</strong></div>
                  </div>

                  {/* Status update controls */}
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: '800' }}>Control Workflow Status</span>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button 
                        onClick={() => {
                          handleUpdateStatus(selectedActiveOrder.id, selectedActiveOrder.status);
                          // Update locally selected state status
                          setSelectedActiveOrder(prev => ({
                            ...prev,
                            status: prev.status === 'accepted' ? 'writing started' : prev.status === 'writing started' ? 'completed' : prev.status === 'completed' ? 'out of delivery' : prev.status,
                            progress: prev.status === 'accepted' ? 40 : prev.status === 'writing started' ? 100 : prev.status === 'completed' ? 100 : prev.progress
                          }));
                        }}
                        disabled={selectedActiveOrder.status === 'out of delivery'}
                        className="btn-primary"
                        style={{
                          width: '100%',
                          fontSize: '11px',
                          padding: '10px',
                          boxShadow: 'none',
                          borderRadius: '0',
                          backgroundColor: selectedActiveOrder.status === 'accepted' ? 'var(--accent-ink)' : selectedActiveOrder.status === 'writing started' ? 'var(--accent-green)' : 'var(--accent-orange)'
                        }}
                      >
                        {selectedActiveOrder.status === 'accepted' && 'Start Writing Drafts ➔'}
                        {selectedActiveOrder.status === 'writing started' && 'Complete Writing & Compile Scan ➔'}
                        {selectedActiveOrder.status === 'completed' && 'Dispatch for Delivery ➔'}
                        {selectedActiveOrder.status === 'out of delivery' && 'Delivering via GPS...'}
                      </button>

                      {selectedActiveOrder.status === 'out of delivery' && (
                        <button
                          onClick={() => {
                            setActiveTab('delivery');
                            alert('Opening Delivery page containing live GPS simulator map and verification code check.');
                          }}
                          style={{
                            padding: '10px',
                            backgroundColor: 'var(--border-editorial)',
                            color: 'var(--bg-sand)',
                            fontSize: '10px',
                            fontWeight: '800',
                            border: '1px solid var(--border-editorial)',
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          Go to ⑥ Delivery Management View
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div style={{ backgroundColor: 'var(--bg-sand)', border: '2px dashed var(--border-editorial)', padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
                  Select an active job from the left panel to update progress, compile scans, or dispatch details.
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW 6: Delivery Management Page */}
        {activeTab === 'delivery' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
            
            {/* Delivery configuration & OTP: Left */}
            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '14px' }}>Select Dispatch Delivery Partner</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px' }}>
                  <button 
                    onClick={() => setDeliveryOption('self')}
                    style={{
                      border: '1.5px solid var(--border-editorial)',
                      padding: '10px 4px',
                      fontSize: '9px',
                      fontWeight: '800',
                      backgroundColor: deliveryOption === 'self' ? 'var(--border-editorial)' : '#FFFFFF',
                      color: deliveryOption === 'self' ? 'var(--bg-sand)' : 'var(--text-dark)',
                      cursor: 'pointer'
                    }}
                  >
                    Self Delivery
                  </button>
                  <button 
                    onClick={() => setDeliveryOption('partner')}
                    style={{
                      border: '1.5px solid var(--border-editorial)',
                      padding: '10px 4px',
                      fontSize: '9px',
                      fontWeight: '800',
                      backgroundColor: deliveryOption === 'partner' ? 'var(--border-editorial)' : '#FFFFFF',
                      color: deliveryOption === 'partner' ? 'var(--bg-sand)' : 'var(--text-dark)',
                      cursor: 'pointer'
                    }}
                  >
                    Delivery Partner
                  </button>
                  <button 
                    onClick={() => setDeliveryOption('pickup')}
                    style={{
                      border: '1.5px solid var(--border-editorial)',
                      padding: '10px 4px',
                      fontSize: '9px',
                      fontWeight: '800',
                      backgroundColor: deliveryOption === 'pickup' ? 'var(--border-editorial)' : '#FFFFFF',
                      color: deliveryOption === 'pickup' ? 'var(--bg-sand)' : 'var(--text-dark)',
                      cursor: 'pointer'
                    }}
                  >
                    Pickup Option
                  </button>
                </div>

                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  {deliveryOption === 'self' && 'Self delivery: you deliver directly to coordinates. Retain 100% of delivery charge.'}
                  {deliveryOption === 'partner' && 'Delivery partner: Borzo/Dunzo rider picks up assignment sheet scan prints.'}
                  {deliveryOption === 'pickup' && 'Pickup option: student will pick up the notebook from your registered city address.'}
                </p>

                {/* OTP Verification form */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-orange)', display: 'block', marginBottom: '8px' }}>Delivery OTP Verification</span>
                  
                  <form onSubmit={(e) => handleVerifyDeliveryOTP(e, assignments.find(a => a.status === 'out of delivery')?.id || '1')} style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" required placeholder="Enter customer OTP (1234)" value={deliveryOTP} onChange={(e) => setDeliveryOTP(e.target.value)}
                      style={{ flexGrow: 1, padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '8px 14px', fontSize: '11px', borderRadius: '0', boxShadow: 'none' }}>Verify OTP</button>
                  </form>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                    Enter simulated code <strong>1234</strong> to release payments instantly!
                  </span>
                </div>

              </div>

              {/* Delivery logs */}
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '20px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>Delivery Status Logs</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {deliveryLogs.map((log, idx) => (
                    <div key={idx} style={{ fontSize: '10px', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>
                      <span style={{ color: 'var(--accent-orange)', fontWeight: '800', marginRight: '8px' }}>{log.time}</span>
                      <span>{log.log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* GPS tracker simulator map: Right */}
            <div style={{ gridColumn: 'span 6' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '14px' }}>GPS Map Route Simulator</h3>
                
                {/* Simulated Map Board */}
                <div 
                  style={{ 
                    height: '240px', 
                    backgroundColor: '#FAF9F6', 
                    border: '1.5px solid var(--border-editorial)', 
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundImage: 'radial-gradient(var(--border-editorial) 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }}
                >
                  {/* Mock Map Markers and Path */}
                  <div style={{ position: 'absolute', top: '120px', left: '10%', right: '10%', height: '2px', backgroundColor: 'var(--border-editorial)', borderStyle: 'dashed' }}></div>
                  
                  {/* Writer Marker */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '100px', 
                      left: `calc(10% + ${mapPosition * 0.8}%)`, 
                      transition: 'left 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      textAlign: 'center',
                      zIndex: 2
                    }}
                  >
                    <Navigation size={20} color="var(--accent-orange)" style={{ transform: 'rotate(90deg)' }} />
                    <span style={{ fontSize: '8px', fontWeight: '800', display: 'block', backgroundColor: 'var(--border-editorial)', color: 'var(--bg-sand)', padding: '1px 4px', borderRadius: '3px' }}>YOU</span>
                  </div>

                  {/* Customer Marker */}
                  <div style={{ position: 'absolute', top: '100px', right: '10%', textAlign: 'center' }}>
                    <MapPin size={22} color="var(--accent-green)" />
                    <span style={{ fontSize: '8px', fontWeight: '800', display: 'block', backgroundColor: 'var(--accent-green)', color: '#FFFFFF', padding: '1px 4px', borderRadius: '3px' }}>CLIENT</span>
                  </div>

                  <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '9px', fontFamily: 'monospace', backgroundColor: '#FFFFFF', border: '1px solid var(--border-editorial)', padding: '2px 6px' }}>
                    GPS Route: Gachibowli Area to Gowlidoddy
                  </span>
                  
                  {mapPosition === 100 && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,169,88,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#FFFFFF', border: '2px solid var(--accent-green)', padding: '6px 16px', color: 'var(--accent-green)' }}>WRITER ARRIVED AT DESTINATION</span>
                    </div>
                  )}

                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Distance Remaining: <strong>{liveMapActive ? `${Math.round((100 - mapPosition) * 0.05 * 10) / 10} km` : '2.5 km'}</strong>
                  </span>
                  <button 
                    onClick={handleStartDeliveryRoute}
                    disabled={liveMapActive || mapPosition === 100}
                    style={{
                      border: '1.5px solid var(--border-editorial)',
                      backgroundColor: (liveMapActive || mapPosition === 100) ? 'var(--bg-sand)' : 'var(--accent-orange)',
                      color: (liveMapActive || mapPosition === 100) ? 'var(--text-muted)' : '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '8px 14px',
                      cursor: (liveMapActive || mapPosition === 100) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {liveMapActive ? 'GPS Tracker Simulating...' : mapPosition === 100 ? 'GPS Route Completed' : 'Simulate GPS Route'}
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* VIEW 7: Worker Profile Page */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
            
            {/* Profile view showcase card: Left */}
            <div style={{ gridColumn: 'span 5' }}>
              <div 
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '2px solid var(--border-editorial)', 
                  padding: '24px', 
                  boxShadow: '4px 4px 0 var(--border-editorial)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <div style={{ width: '96px', height: '96px', borderRadius: '50%', border: '2px solid var(--border-editorial)', backgroundColor: 'var(--bg-sand)', overflow: 'hidden' }}>
                  {myProfile.avatar ? (
                    <img src={myProfile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '32px', fontWeight: '900', display: 'block', marginTop: '20px' }}>{myProfile.name.charAt(0)}</span>
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: '18px', margin: '4px 0' }}>{myProfile.name}</h3>
                  <span style={{ fontSize: '11px', color: 'var(--accent-orange)', fontWeight: '800', textTransform: 'uppercase' }}>★ {myProfile.rating} Rating</span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', width: '100%', paddingTop: '12px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                  <div>Penmanship Script: <strong>{myProfile.style}</strong></div>
                  <div>Subject Specialties: <strong>{myProfile.subjectSpecialization}</strong></div>
                  <div>Writing Speed: <strong>{myProfile.speed} pages/hour</strong></div>
                  <div>Languages Known: <strong>{myProfile.languages}</strong></div>
                  <div>Availability Hours: <strong>{myProfile.timings}</strong></div>
                  <div>Active Location: <strong>{myProfile.city}</strong></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid var(--border-light)', width: '100%', paddingTop: '12px' }}>
                  <div style={{ backgroundColor: 'var(--bg-sand)', padding: '8px', border: '1px solid var(--border-editorial)' }}>
                    <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block' }}>COMPLETED ORDERS</span>
                    <strong style={{ fontSize: '14px' }}>{myProfile.completed} Orders</strong>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-sand)', padding: '8px', border: '1px solid var(--border-editorial)' }}>
                    <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block' }}>PAGE BASE COST</span>
                    <strong style={{ fontSize: '14px' }}>₹{myProfile.rate} / pg</strong>
                  </div>
                </div>

              </div>
            </div>

            {/* Profile editing form: Right */}
            <div style={{ gridColumn: 'span 7' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
                <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Edit Public Worker Showcase</h3>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateProfileStorage({
                      name: profileName,
                      avatar: profileAvatar,
                      speed: Number(profileSpeed),
                      languages: profileLanguages,
                      subjectSpecialization: profileSubject
                    });
                    alert('Showcase profile updated successfully!');
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '10px', fontWeight: '800' }}>Display Showcase Name</label>
                    <input 
                      type="text" required value={profileName} onChange={(e) => setProfileName(e.target.value)}
                      style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '10px', fontWeight: '800' }}>Custom Photo URL / Avatar</label>
                    <input 
                      type="text" placeholder="e.g. Unsplash URL" value={profileAvatar} onChange={(e) => setProfileAvatar(e.target.value)}
                      style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '10px', fontWeight: '800' }}>Writing Speed (pg/hr)</label>
                      <input 
                        type="number" value={profileSpeed} onChange={(e) => setProfileSpeed(e.target.value)}
                        style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '10px', fontWeight: '800' }}>Showcase Subjects</label>
                      <input 
                        type="text" value={profileSubject} onChange={(e) => setProfileSubject(e.target.value)}
                        style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '10px', fontWeight: '800' }}>Languages List</label>
                    <input 
                      type="text" value={profileLanguages} onChange={(e) => setProfileLanguages(e.target.value)}
                      style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '10px', borderRadius: '0', boxShadow: 'none', fontSize: '11px', marginTop: '8px' }}>
                    Save Public Showcase Settings
                  </button>

                </form>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 8: Earnings & Wallet Page */}
        {activeTab === 'wallet' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
            
            {/* Balances & Settlement: Left */}
            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '24px', boxShadow: '4px 4px 0 var(--border-editorial)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available Ledger Balance</span>
                    <h2 style={{ fontSize: '32px', color: 'var(--text-dark)', marginTop: '4px' }}>₹{walletBalance}</h2>
                  </div>
                  <Wallet size={32} color="var(--accent-orange)" />
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', marginBottom: '16px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Withdrawable Earnings:</span>
                    <strong style={{ color: 'var(--accent-green)' }}>₹{withdrawableBalance}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Hold Processing Fees:</span>
                    <strong>₹{walletBalance - withdrawableBalance}</strong>
                  </div>
                </div>

                <form onSubmit={handleWithdrawFunds} style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}>Configure Bank Settlement Node</span>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '9px', fontWeight: '800' }}>UPI Identifier (e.g. rahul@oksbi)</label>
                    <input 
                      type="text" placeholder="name@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)}
                      style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '9px', fontWeight: '800' }}>Bank Account Number</label>
                      <input 
                        type="text" placeholder="1004810295" value={bankAcc} onChange={(e) => setBankAcc(e.target.value)}
                        style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '9px', fontWeight: '800' }}>IFS Code</label>
                      <input 
                        type="text" placeholder="SBIN000104" value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value)}
                        style={{ padding: '8px', border: '1.5px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={withdrawableBalance <= 0}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      backgroundColor: withdrawableBalance <= 0 ? 'var(--text-muted)' : 'var(--accent-green)',
                      fontSize: '11px',
                      padding: '10px',
                      boxShadow: 'none',
                      borderRadius: '0',
                      cursor: withdrawableBalance <= 0 ? 'not-allowed' : 'pointer',
                      border: '1.5px solid var(--border-editorial)'
                    }}
                  >
                    Withdraw via Bank Transfer ➔
                  </button>
                </form>

                {showWithdrawMsg && (
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
                    <div>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', fontWeight: '800', margin: '0 auto 12px auto' }}>✓</div>
                      <div style={{ fontSize: '12px', fontWeight: '800' }}>Processing Ledger Transfer...</div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>UPI / Bank settlement initiated.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Earnings stats & Ledger logs: Right */}
            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Proportional height CSS Chart simulation */}
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '20px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '14px' }}>Earnings Stats Overview</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'end', height: '140px', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--accent-orange)' }}></div>
                    <span style={{ fontSize: '10px', marginTop: '6px', fontWeight: '800' }}>Today (₹250)</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: '90px', backgroundColor: 'var(--accent-ink)' }}></div>
                    <span style={{ fontSize: '10px', marginTop: '6px', fontWeight: '800' }}>Weekly (₹1,450)</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: '120px', backgroundColor: 'var(--accent-green)' }}></div>
                    <span style={{ fontSize: '10px', marginTop: '6px', fontWeight: '800' }}>Monthly (₹4,890)</span>
                  </div>
                </div>
              </div>

              {/* Transactions logs list */}
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '20px', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>Recent Ledger Transactions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {transactions.map((txn, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>
                      <div>
                        <strong>{txn.orderId}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '9px', marginLeft: '8px' }}>{txn.date}</span>
                      </div>
                      <span style={{ color: txn.type === 'credit' ? 'var(--accent-green)' : '#E11D48', fontWeight: '800' }}>
                        {txn.type === 'credit' ? '+' : '-'} ₹{txn.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 9: Notifications & Chat Messages */}
        {activeTab === 'messages' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
            
            {/* Alerts list & Chat Channels selector: Left */}
            <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Alerts feed */}
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '16px', boxShadow: '3px 3px 0 var(--border-editorial)' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-orange)', marginBottom: '10px' }}>Alerts & Reminders</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '140px', overflowY: 'auto' }}>
                  {alerts.map(a => (
                    <div 
                      key={a.id} 
                      style={{ 
                        fontSize: '10px', 
                        padding: '6px', 
                        border: '1px solid var(--border-editorial)', 
                        backgroundColor: a.type === 'warning' ? 'rgba(255, 85, 0, 0.04)' : a.type === 'success' ? 'rgba(15, 169, 88, 0.04)' : 'var(--bg-sand)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800' }}>
                        <span>{a.type.toUpperCase()} alert</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{a.time}</span>
                      </div>
                      <p style={{ marginTop: '2px' }}>{a.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat channels selection list */}
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', padding: '16px', boxShadow: '3px 3px 0 var(--border-editorial)' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>Client In-App Chats</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'rohan', name: 'Rohan Kumar (Chemistry)', status: 'Active Writer' },
                    { id: 'priya', name: 'Priya Sharma (Lab Layout)', status: 'Feedback Request' },
                    { id: 'vikram', name: 'Vikram Dev (History Notes)', status: 'Rush Request' }
                  ].map(ch => (
                    <div 
                      key={ch.id} 
                      onClick={() => setActiveChannelId(ch.id)}
                      style={{
                        padding: '10px',
                        border: '1.5px solid var(--border-editorial)',
                        cursor: 'pointer',
                        backgroundColor: activeChannelId === ch.id ? 'var(--bg-sand)' : '#FFFFFF',
                        boxShadow: activeChannelId === ch.id ? 'none' : '2px 2px 0 var(--border-editorial)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '12px' }}>{ch.name}</strong>
                        <span style={{ fontSize: '8px', color: 'var(--accent-orange)', fontWeight: '800' }}>● Online</span>
                      </div>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Status: {ch.status}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Chat message window: Right */}
            <div style={{ gridColumn: 'span 7' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--border-editorial)', height: '400px', display: 'flex', flexDirection: 'column', boxShadow: '4px 4px 0 var(--border-editorial)' }}>
                
                {/* Chat window Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1.5px solid var(--border-editorial)', backgroundColor: 'var(--bg-sand)' }}>
                  <div>
                    <h4 style={{ fontSize: '12px', margin: 0, fontWeight: '800' }}>Chatting with {activeChannelId === 'rohan' ? 'Rohan Kumar' : activeChannelId === 'priya' ? 'Priya Sharma' : 'Vikram Dev'}</h4>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Secure Escrow Thread ID: #{activeChannelId}_locks</span>
                  </div>
                </div>

                {/* Messages history block */}
                <div style={{ flexGrow: 1, padding: '16px', overflowY: 'auto', backgroundColor: '#FAF9F6', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {chats[activeChannelId].map((msg, idx) => (
                    <div 
                      key={idx}
                      style={{
                        alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                        backgroundColor: msg.sender === 'You' ? 'var(--border-editorial)' : '#FFFFFF',
                        color: msg.sender === 'You' ? 'var(--bg-sand)' : 'var(--text-dark)',
                        padding: '8px 12px',
                        border: '1px solid var(--border-editorial)',
                        maxWidth: '80%',
                        fontSize: '11px',
                        borderRadius: '4px',
                        boxShadow: msg.sender === 'You' ? 'none' : '1.5px 1.5px 0 var(--border-editorial)'
                      }}
                    >
                      <p>{msg.text}</p>
                      <span style={{ display: 'block', fontSize: '8px', textAlign: 'right', marginTop: '3px', opacity: 0.7 }}>{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* Chat text Input Bar */}
                <form onSubmit={handleSendChatMessage} style={{ padding: '8px 12px', borderTop: '1.5px solid var(--border-editorial)', display: 'flex', gap: '8px', backgroundColor: '#FFFFFF' }}>
                  <input 
                    type="text" placeholder="Type instructions, margins, ink details..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                    style={{ flexGrow: 1, padding: '8px 12px', border: '1px solid var(--border-editorial)', fontSize: '12px', outline: 'none' }}
                  />
                  <button 
                    type="submit" 
                    style={{ backgroundColor: 'var(--border-editorial)', color: 'var(--bg-sand)', border: '1.5px solid var(--border-editorial)', padding: '8px 14px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                  >
                    <Send size={12} />
                  </button>
                </form>

              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
