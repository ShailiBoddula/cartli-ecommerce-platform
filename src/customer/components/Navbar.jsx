import { useState } from 'react';
import TopBar from './TopBar';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import AuthModal from './AuthModal';

const Navbar = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('signin');

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50">
        <TopBar />
        <div className="hidden md:block">
          <DesktopNav
            isAuthModalOpen={isAuthModalOpen}
            setIsAuthModalOpen={setIsAuthModalOpen}
            authTab={authTab}
            setAuthTab={setAuthTab}
          />
        </div>
        <div className="md:hidden">
          <MobileNav
            isAuthModalOpen={isAuthModalOpen}
            setIsAuthModalOpen={setIsAuthModalOpen}
            authTab={authTab}
            setAuthTab={setAuthTab}
          />
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialTab={authTab}
        />
      </div>
      <main>
        {console.log('Navbar children:', children)}
        {children}
      </main>
    </div>
  );
};

export default Navbar;