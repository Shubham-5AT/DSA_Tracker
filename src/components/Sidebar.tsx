import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';
import { calculateProgress } from '../utils/progressHelpers';
import { 
  LayoutDashboard, 
  Code2, 
  Compass, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Monitor,
  Clock,
  Flame
} from 'lucide-react';

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { dsaProgress, roadmapProgress, theme, setTheme, revisionQueue, streak } = useProgressStore();
  const stats = calculateProgress(dsaProgress, roadmapProgress);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    if (onCollapseChange) {
      onCollapseChange(nextState);
    }
  };

  // Count reviews due today
  const dueCount = Object.values(revisionQueue || {}).filter(
    (item) => item.nextReviewAt <= Date.now() + 60 * 1000
  ).length;

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/daily', label: 'Daily Rituals', icon: Flame, badgeText: streak > 0 ? `⚡ ${streak}` : undefined },
    { to: '/dsa', label: 'DSA Tracker', icon: Code2 },
    { to: '/roadmap', label: 'CS Roadmap', icon: Compass },
    { to: '/revision', label: 'Revision', icon: Clock, badge: dueCount > 0 ? dueCount : undefined },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen bg-theme-bg-light dark:bg-theme-bg-dark border-r border-theme-border-light dark:border-theme-border-dark flex flex-col justify-between transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-[64px]' : 'w-[240px]'
      }`}
    >
      {/* Top Header Section */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-theme-border-light/50 dark:border-theme-border-dark/50">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-mono tracking-widest text-accent dark:text-accent/90 font-semibold uppercase">ASCENT</span>
            </div>
          )}
          <button 
            onClick={toggleCollapse}
            className={`p-1.5 rounded hover:bg-theme-text-light/5 dark:hover:bg-theme-text-dark/5 text-theme-muted-light dark:text-theme-muted-dark transition-colors ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 px-2.5 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center justify-between px-3 py-2.5 rounded text-[14px] font-medium transition-all group ${
                  isActive 
                    ? 'bg-accent/8 text-accent dark:bg-accent/10 dark:text-accent/90 font-semibold' 
                    : 'text-theme-muted-light hover:text-theme-text-light dark:text-theme-muted-dark dark:hover:text-theme-text-dark hover:bg-theme-text-light/[0.02] dark:hover:bg-theme-text-dark/[0.02]'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
            >
              <div className="flex items-center gap-3 truncate">
                <item.icon size={18} className="shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>
              {!isCollapsed && (
                <>
                  {'badge' in item && item.badge !== undefined && (
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-badge-hard-bgLight text-badge-hard-text dark:bg-badge-hard-bgDark shrink-0">
                      {item.badge}
                    </span>
                  )}
                  {'badgeText' in item && item.badgeText !== undefined && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-badge-medium-bgLight text-badge-medium-text dark:bg-badge-medium-bgDark shrink-0">
                      {item.badgeText}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section (Progress and Theme Toggle) */}
      <div className="p-4 border-t border-theme-border-light/50 dark:border-theme-border-dark/50 space-y-4">
        {/* Progress Display */}
        {!isCollapsed ? (
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline text-[11px] uppercase tracking-wider text-theme-muted-light dark:text-theme-muted-dark">
              <span>Overall Progress</span>
              <span className="font-mono text-theme-text-light dark:text-theme-text-dark">{stats.combinedPercent}%</span>
            </div>
            <div className="w-full h-1 bg-theme-text-light/5 dark:bg-theme-text-dark/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${stats.combinedPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div 
            className="w-full flex justify-center text-[11px] font-mono font-bold text-accent dark:text-accent/90"
            title={`Overall progress: ${stats.combinedPercent}%`}
          >
            {stats.combinedPercent}%
          </div>
        )}

        {/* Theme Toggles */}
        <div className={`flex items-center justify-between ${isCollapsed ? 'flex-col gap-2' : 'flex-row'}`}>
          {!isCollapsed && (
            <span className="text-[11px] uppercase tracking-wider text-theme-muted-light dark:text-theme-muted-dark">Theme</span>
          )}
          <div className="flex bg-theme-text-light/5 dark:bg-theme-text-dark/5 p-0.5 rounded-md">
            {(['light', 'dark', 'system'] as const).map((t) => {
              const Icon = t === 'light' ? Sun : t === 'dark' ? Moon : Monitor;
              const isActive = theme === t;
              return (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`p-1 rounded transition-all ${
                    isActive 
                      ? 'bg-theme-bg-light dark:bg-theme-bg-dark text-accent dark:text-accent/90 shadow-subtle' 
                      : 'text-theme-muted-light hover:text-theme-text-light dark:text-theme-muted-dark dark:hover:text-theme-text-dark'
                  }`}
                  title={`${t.charAt(0).toUpperCase() + t.slice(1)} mode`}
                >
                  <Icon size={14} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
