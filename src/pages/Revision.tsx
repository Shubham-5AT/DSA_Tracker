import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';
import { dsaPatterns } from '../data/dsaPatterns';
import { 
  Clock, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  ArrowRight,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Revision: React.FC = () => {
  const { 
    revisionQueue, 
    logRevisionSession, 
    removeRevisionItem, 
    setReviewDueNow 
  } = useProgressStore();

  const [activeTab, setActiveTab] = useState<'due' | 'upcoming' | 'all'>('due');
  const [visibleHints, setVisibleHints] = useState<Record<string, boolean>>({});

  // Resolve detailed problem information for each queue item
  const resolvedItems = Object.values(revisionQueue).map((item) => {
    const pattern = dsaPatterns.find((p) => p.id === item.patternId);
    const problem = pattern?.problems.find((prob) => prob.id === item.problemId);
    
    // An item is due if nextReviewAt <= current time (with 1-minute buffer for smooth display)
    const isDue = item.nextReviewAt <= Date.now() + 60 * 1000;

    return {
      ...item,
      patternName: pattern?.name || 'Unknown Pattern',
      problemName: problem?.name || 'Unknown Problem',
      problemUrl: problem?.url || '#',
      difficulty: problem?.difficulty || 'Medium',
      platform: problem?.platform || 'LeetCode',
      topics: problem?.topics || '',
      timeComplexity: problem?.timeComplexity || '',
      spaceComplexity: problem?.spaceComplexity || '',
      isDue,
    };
  });

  // Categorize
  const dueItems = resolvedItems.filter((i) => i.isDue);
  const upcomingItems = resolvedItems.filter((i) => !i.isDue);

  const displayItems = 
    activeTab === 'due' 
      ? dueItems 
      : activeTab === 'upcoming' 
      ? upcomingItems 
      : resolvedItems;

  return (
    <div className="space-y-12">
      {/* Header Info */}
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.15em] text-theme-muted-light dark:text-theme-muted-dark font-medium">Retention engine</p>
        <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-theme-text-light dark:text-theme-text-dark font-medium">
          Spaced Repetition Reviews
        </h1>
      </div>

      {/* Revision Stats Cards (typographic rows) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-b border-theme-border-light dark:border-theme-border-dark divide-y sm:divide-y-0 sm:divide-x divide-theme-border-light dark:divide-theme-border-dark">
        <div className="py-4 sm:py-5 sm:pr-4 flex justify-between sm:flex-col gap-2">
          <span className="text-[11px] uppercase tracking-wider text-theme-muted-light dark:text-theme-muted-dark">Due for review</span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-badge-hard-text">{dueItems.length}</span>
        </div>
        <div className="py-4 sm:py-5 sm:px-6 flex justify-between sm:flex-col gap-2">
          <span className="text-[11px] uppercase tracking-wider text-theme-muted-light dark:text-theme-muted-dark">Upcoming queue</span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-accent dark:text-accent/90">{upcomingItems.length}</span>
        </div>
        <div className="py-4 sm:py-5 sm:pl-6 flex justify-between sm:flex-col gap-2">
          <span className="text-[11px] uppercase tracking-wider text-theme-muted-light dark:text-theme-muted-dark">Total bookmarked</span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-theme-text-light dark:text-theme-text-dark">{resolvedItems.length}</span>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex border-b border-theme-border-light/50 dark:border-theme-border-dark/50 gap-4">
        {(['due', 'upcoming', 'all'] as const).map((tab) => {
          const count = tab === 'due' ? dueItems.length : tab === 'upcoming' ? upcomingItems.length : resolvedItems.length;
          const isActive = activeTab === tab;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[13px] font-medium transition-all relative ${
                isActive 
                  ? 'text-accent dark:text-accent/90 font-semibold' 
                  : 'text-theme-muted-light dark:text-theme-muted-dark hover:text-theme-text-light dark:hover:text-theme-text-dark'
              }`}
            >
              <span className="capitalize">{tab} reviews</span>
              <span className="font-mono text-[10px] ml-1.5 opacity-60">({count})</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Revision Queue List */}
      <div className="space-y-4">
        {displayItems.length > 0 ? (
          <div className="divide-y divide-theme-border-light/50 dark:divide-theme-border-dark/50">
            {displayItems.map((item) => {
              const formattedDate = new Date(item.nextReviewAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={`${item.patternId}::${item.problemId}`} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Problem details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono tracking-wider text-theme-muted-light dark:text-theme-muted-dark bg-theme-text-light/5 dark:bg-theme-text-dark/5 px-1.5 py-0.5 rounded uppercase">
                        {item.patternName}
                      </span>
                      <span className="text-[10px] font-mono text-theme-muted-light/60 border border-theme-border-light dark:border-theme-border-dark px-1 py-0.5 rounded">
                        Interval: {item.intervalDays} {item.intervalDays === 1 ? 'day' : 'days'}
                      </span>
                      {(item.timeComplexity || item.spaceComplexity) && (
                        <span className="text-[10px] font-mono text-theme-muted-light/70 dark:text-theme-muted-dark/70 bg-theme-text-light/5 dark:bg-theme-text-dark/5 px-1.5 py-0.5 rounded border border-theme-border-light/40 dark:border-theme-border-dark/40 select-none">
                          {item.timeComplexity && `T: ${item.timeComplexity}`}
                          {item.timeComplexity && item.spaceComplexity && ' | '}
                          {item.spaceComplexity && `S: ${item.spaceComplexity}`}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a 
                        href={item.problemUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[14px] font-medium text-theme-text-light dark:text-theme-text-dark hover:text-accent dark:hover:text-accent/90 inline-flex items-center gap-1 transition-all"
                      >
                        {item.problemName}
                        <ExternalLink size={12} className="opacity-40" />
                      </a>

                      {/* Help Trigger for sub-topics */}
                      <button
                        onClick={() => {
                          const key = `${item.patternId}::${item.problemId}`;
                          setVisibleHints((prev) => ({
                            ...prev,
                            [key]: !prev[key]
                          }));
                        }}
                        className={`p-0.5 rounded transition-all shrink-0 ${
                          visibleHints[`${item.patternId}::${item.problemId}`]
                            ? 'text-accent dark:text-accent/90 hover:bg-accent/5'
                            : 'text-theme-muted-light/40 hover:text-theme-muted-light hover:bg-theme-text-light/5 dark:hover:bg-theme-text-dark/5'
                        }`}
                        title="Show topic details"
                      >
                        <HelpCircle size={12} />
                      </button>
                    </div>

                    {visibleHints[`${item.patternId}::${item.problemId}`] && item.topics && (
                      <div className="text-[11.5px] font-mono text-theme-muted-light dark:text-theme-muted-dark flex items-center gap-1.5 opacity-90 transition-all select-none pt-0.5">
                        <span>💡 Study this to solve:</span>
                        <span className="font-semibold text-accent dark:text-accent/80">{item.topics}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-theme-muted-light dark:text-theme-muted-dark">
                      <Calendar size={12} className="opacity-60" />
                      <span>
                        {item.isDue ? 'Due now' : `Review scheduled: ${formattedDate}`}
                      </span>
                    </div>
                  </div>

                  {/* Recall & Debug Action Section */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Recall logs (only if due for review, or shown for active reviews) */}
                    <div className="flex items-center border border-theme-border-light dark:border-theme-border-dark rounded bg-theme-text-light/[0.01] dark:bg-theme-text-dark/[0.01] p-0.5 gap-1 shrink-0">
                      {/* Good Recall */}
                      <button
                        onClick={() => logRevisionSession(item.patternId, item.problemId, 'good')}
                        className="px-2 py-1 text-[11px] font-medium text-badge-easy-text hover:bg-badge-easy-bgLight dark:hover:bg-badge-easy-bgDark rounded transition-all"
                        title="Strong recall. Multiply interval by 2.5x."
                      >
                        Mastered
                      </button>

                      {/* Okay Recall */}
                      <button
                        onClick={() => logRevisionSession(item.patternId, item.problemId, 'okay')}
                        className="px-2 py-1 text-[11px] font-medium text-badge-medium-text hover:bg-badge-medium-bgLight dark:hover:bg-badge-medium-bgDark rounded transition-all"
                        title="Moderate recall. Multiply interval by 1.5x."
                      >
                        Passable
                      </button>

                      {/* Bad Recall */}
                      <button
                        onClick={() => logRevisionSession(item.patternId, item.problemId, 'bad')}
                        className="px-2 py-1 text-[11px] font-medium text-badge-hard-text hover:bg-badge-hard-bgLight dark:hover:bg-badge-hard-bgDark rounded transition-all"
                        title="Forgot or struggled. Reset interval to 1 day."
                      >
                        Struggled
                      </button>
                    </div>

                    {/* Debug set due now button */}
                    {!item.isDue && (
                      <button
                        onClick={() => setReviewDueNow(item.patternId, item.problemId)}
                        className="p-1.5 rounded hover:bg-theme-text-light/5 dark:hover:bg-theme-text-dark/5 text-theme-muted-light/60 hover:text-theme-text-light transition-all"
                        title="Debug: Make due now"
                      >
                        <RefreshCw size={12} />
                      </button>
                    )}

                    {/* Delete bookmark */}
                    <button
                      onClick={() => removeRevisionItem(item.patternId, item.problemId)}
                      className="p-1.5 rounded hover:bg-badge-hard-bgLight dark:hover:bg-badge-hard-bgDark text-theme-muted-light/40 hover:text-badge-hard-text transition-all"
                      title="Remove bookmark"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-theme-border-light dark:border-theme-border-dark rounded-lg text-theme-muted-light dark:text-theme-muted-dark space-y-1">
            <Clock size={20} className="mx-auto text-theme-muted-light/50 mb-2" />
            <p className="text-[13px] font-medium">No items found in this category</p>
            <p className="text-[11px]">
              {activeTab === 'due' 
                ? 'Great job! You have cleared all reviews for today.' 
                : 'Bookmark problems in the DSA Tracker to build your revision schedule.'}
            </p>
            {activeTab === 'due' && resolvedItems.length > 0 && (
              <button 
                onClick={() => setActiveTab('upcoming')}
                className="text-[11px] font-medium text-accent dark:text-accent/90 underline pt-2 block mx-auto"
              >
                View upcoming items
              </button>
            )}
          </div>
        )}
      </div>

      {/* Return footer */}
      {displayItems.length === 0 && (
        <div className="pt-2 text-center">
          <Link 
            to="/dsa" 
            className="text-[13px] font-medium text-accent dark:text-accent/90 inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            Visit DSA Problem List <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Interval Reference Guide Accordion */}
      <div className="pt-8 border-t border-theme-border-light/50 dark:border-theme-border-dark/50">
        <details className="group cursor-pointer">
          <summary className="text-[12px] font-medium text-theme-muted-light dark:text-theme-muted-dark list-none flex items-center gap-1.5 hover:text-theme-text-light dark:hover:text-theme-text-dark select-none">
            <span className="transition-transform group-open:rotate-90 text-[8px] opacity-60">▶</span>
            Spaced Repetition Reference Guide
          </summary>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-theme-border-light dark:border-theme-border-dark text-theme-muted-light dark:text-theme-muted-dark uppercase tracking-wider text-[10px]">
                  <th className="py-2 pr-4 font-mono font-medium">Recall Grade</th>
                  <th className="py-2 px-4 font-mono font-medium">Initial Interval</th>
                  <th className="py-2 px-4 font-mono font-medium">Subsequent Multiplier</th>
                  <th className="py-2 pl-4 font-mono font-medium">Behavior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border-light/40 dark:divide-theme-border-dark/40 text-theme-text-light/80 dark:text-theme-text-dark/80">
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-badge-hard-text">Struggled (bad)</td>
                  <td className="py-2.5 px-4 font-mono">1 day</td>
                  <td className="py-2.5 px-4 font-mono">Reset to 1 day</td>
                  <td className="py-2.5 pl-4 text-theme-muted-light dark:text-theme-muted-dark">Resets recall scheduling for poor memory retention.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-badge-medium-text">Passable (okay)</td>
                  <td className="py-2.5 px-4 font-mono">3 days</td>
                  <td className="py-2.5 px-4 font-mono">1.5x (rounded up)</td>
                  <td className="py-2.5 pl-4 text-theme-muted-light dark:text-theme-muted-dark">Gradually expands intervals for moderate retention.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-badge-easy-text">Mastered (good)</td>
                  <td className="py-2.5 px-4 font-mono">7 days</td>
                  <td className="py-2.5 px-4 font-mono">2.5x (rounded up)</td>
                  <td className="py-2.5 pl-4 text-theme-muted-light dark:text-theme-muted-dark">Quickly schedules reviews far out for strong retention.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
};
