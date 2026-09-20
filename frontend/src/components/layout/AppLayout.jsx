import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMapPage = location.pathname === '/map';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-ocean-bg text-ocean-text">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:flex flex-shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile Offcanvas Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-ocean-sidebar/75 backdrop-blur-sm z-[9998] lg:hidden"
            />
            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-[9999] w-64 lg:hidden shadow-2xl h-full flex flex-col bg-ocean-sidebar"
            >
              <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main
          className={`flex-1 w-full relative ${
            isMapPage
              ? 'p-0 overflow-hidden flex flex-col h-[calc(100vh-4rem)] bg-slate-950'
              : 'p-4 lg:p-6 overflow-y-auto'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
