import { useState, useEffect } from 'react';
import { InkLinkLanding } from './views/InkLinkLanding';
import { ClientDashboard } from './views/ClientDashboard';
import { WriterDashboard } from './views/WriterDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { SignupPage } from './views/SignupPage';
import { registerOrGetWriter } from './utils/writers';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('landing');

  // Retrieve existing session from localStorage if present
  // (Disabled on initial load to always display landing page with login/signup buttons)
  useEffect(() => {
    // Session restoration disabled to start clean on fresh page loads
  }, []);

  const handleLoginSuccess = (user) => {
    let finalUser = user;
    if (user.role === 'writer') {
      const writerProfile = registerOrGetWriter(user);
      if (writerProfile) {
        finalUser = {
          ...user,
          details: {
            ...user.details,
            penmanship: writerProfile.style,
            background: writerProfile.background,
            rate: writerProfile.rate,
            sampleText: writerProfile.sampleText,
            images: writerProfile.images || [],
            rating: writerProfile.rating,
            completed: writerProfile.completed,
            id: writerProfile.id
          }
        };
      }
    }
    setCurrentUser(finalUser);
    setView('dashboard');
    localStorage.setItem('inklink_session', JSON.stringify(finalUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('landing');
    localStorage.removeItem('inklink_session');
  };

  const handleGoToDashboard = () => {
    setView('dashboard');
  };

  const handleGoBack = () => {
    setView('landing');
  };

  return (
    <>
      {view === 'landing' && (
        <InkLinkLanding
          currentUser={currentUser}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          onGoToDashboard={handleGoToDashboard}
          onGoToSignup={() => setView('signup')}
        />
      )}
      {view === 'signup' && (
        <SignupPage
          onSignupSuccess={handleLoginSuccess}
          onGoBack={handleGoBack}
          onOpenLogin={() => {
            setView('landing');
            // Auto open login modal by simulating a click on the login header button
            setTimeout(() => {
              const loginButtons = Array.from(document.querySelectorAll('button'));
              const loginBtn = loginButtons.find(b => b.textContent && b.textContent.includes('Login'));
              if (loginBtn) loginBtn.click();
            }, 150);
          }}
        />
      )}
      {view === 'dashboard' && (
        <>
          {currentUser?.role === 'client' && (
            <ClientDashboard user={currentUser} onLogout={handleLogout} onGoBack={handleGoBack} />
          )}
          {currentUser?.role === 'writer' && (
            <WriterDashboard user={currentUser} onLogout={handleLogout} onGoBack={handleGoBack} />
          )}
          {currentUser?.role === 'admin' && (
            <AdminDashboard user={currentUser} onLogout={handleLogout} onGoBack={handleGoBack} />
          )}
          {!currentUser && (
            <InkLinkLanding
              currentUser={null}
              onLoginSuccess={handleLoginSuccess}
              onLogout={handleLogout}
              onGoToDashboard={handleGoToDashboard}
              onGoToSignup={() => setView('signup')}
            />
          )}
        </>
      )}
    </>
  );
}
