import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, HamburgerButton } from './Sidebar';
import { AnimatePresence, motion } from 'framer-motion';
import { useProgressStore } from '../store/useProgressStore';

export const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { streak } = useProgressStore();

  return (
    <div className="min-h-screen flex w-full relative">
      {/* Sidebar Navigation */}
      <Sidebar 
        onCollapseChange={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div 
        className="flex-1 min-h-screen flex flex-col transition-all duration-300"
        style={{ paddingLeft: sidebarCollapsed ? 'var(--sidebar-collapsed-w, 64px)' : 'var(--sidebar-expanded-w, 240px)' }}
      >
        {/* Mobile Top Bar */}
        <header className="md:hidden sticky top-0 z-20 flex items-center justify-between h-14 px-4 bg-theme-bg-light/95 dark:bg-theme-bg-dark/95 backdrop-blur-sm border-b border-theme-border-light dark:border-theme-border-dark">
          <div className="flex items-center gap-3">
            <HamburgerButton onClick={() => setMobileMenuOpen(true)} />
            <span className="text-[14px] font-mono tracking-widest text-accent dark:text-accent/90 font-semibold uppercase">ASCENT</span>
          </div>
          {streak > 0 && (
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-badge-medium-bgLight text-badge-medium-text dark:bg-badge-medium-bgDark">
              ⚡ {streak}
            </span>
          )}
        </header>

        <main className="flex-1 w-full max-w-[1000px] mx-auto px-4 py-8 md:px-12 md:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
