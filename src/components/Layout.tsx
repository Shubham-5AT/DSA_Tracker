import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AnimatePresence, motion } from 'framer-motion';

export const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex w-full relative">
      {/* Sidebar Navigation */}
      <Sidebar onCollapseChange={setSidebarCollapsed} />

      {/* Main Content Area */}
      <div 
        className="flex-1 min-h-screen flex flex-col transition-all duration-300"
        style={{ paddingLeft: sidebarCollapsed ? '64px' : '240px' }}
      >
        <main className="flex-1 w-full max-w-[1000px] mx-auto px-6 py-12 md:px-12 md:py-16">
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
