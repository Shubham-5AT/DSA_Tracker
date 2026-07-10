import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';
import { roadmapData } from '../data/roadmapData';
import { dsaPatterns } from '../data/dsaPatterns';
import { calculateProgress } from '../utils/progressHelpers';
import { ChevronDown, ChevronUp, Check, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Roadmap: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { roadmapProgress, toggleRoadmapItem, dsaProgress } = useProgressStore();
  
  // 1. Calculate overall stats
  const stats = calculateProgress(dsaProgress, roadmapProgress);

  // 2. Expand / Collapse State
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  // Pre-expand phase if passed in URL query e.g. /roadmap?expand=phase-1
  useEffect(() => {
    const expandParam = searchParams.get('expand');
    if (expandParam) {
      setExpandedPhases((prev) => ({ ...prev, [expandParam]: true }));
      // Scroll to that element smoothly
      setTimeout(() => {
        const el = document.getElementById(`phase-${expandParam}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [searchParams]);

  const togglePhaseExpand = (phaseId: string) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.15em] text-theme-muted-light dark:text-theme-muted-dark font-medium">Curriculum pathway</p>
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-theme-text-light dark:text-theme-text-dark font-medium">
            Computer Science Roadmap
          </h1>
        </div>

        {/* CS Roadmap Progress Header */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline text-[11px] uppercase tracking-wider text-theme-muted-light dark:text-theme-muted-dark font-medium">
            <span>Overall Roadmap Progress</span>
            <span className="font-mono text-theme-text-light dark:text-theme-text-dark">
              {stats.completedRoadmap} / {stats.totalRoadmap} checkpoints ({Math.round(stats.roadmapPercent)}%)
            </span>
          </div>
          <div className="w-full h-[3px] bg-theme-text-light/5 dark:bg-theme-text-dark/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${stats.roadmapPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Accordion Phase Rows */}
      <div className="space-y-4">
        {roadmapData.map((phase) => {
          // Calculate phase specific items count and checked count
          const totalItems = phase.items.length;
          let completedCount = 0;
          
          phase.items.forEach((item, index) => {
            if (item.isDsaLinked) {
              const totalDsa = dsaPatterns.reduce((sum, pat) => sum + pat.problems.length, 0);
              const completedDsa = Object.values(dsaProgress).filter(Boolean).length;
              if (completedDsa === totalDsa && totalDsa > 0) {
                completedCount++;
              }
            } else {
              const key = `${phase.id}::${index}`;
              if (roadmapProgress[key]) {
                completedCount++;
              }
            }
          });

          const phasePercent = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;
          const isPhaseDone = completedCount === totalItems;
          const isExpanded = !!expandedPhases[phase.id];

          return (
            <div 
              key={phase.id}
              id={`phase-${phase.id}`}
              className={`border border-theme-border-light dark:border-theme-border-dark rounded-lg overflow-hidden bg-theme-bg-light dark:bg-theme-bg-dark transition-all duration-300 ${
                isPhaseDone ? 'border-left-[3px] border-l-badge-easy-text' : 'border-l-transparent'
              }`}
              style={{
                borderLeftColor: isPhaseDone ? '#4A6D55' : 'transparent',
                borderLeftWidth: isPhaseDone ? '3px' : '1px'
              }}
            >
              {/* Header */}
              <div 
                onClick={() => togglePhaseExpand(phase.id)}
                className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-theme-text-light/[0.01] dark:hover:bg-theme-text-dark/[0.01] transition-all select-none"
              >
                <div className="flex-1 space-y-1 pr-4">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h3 className="text-[15px] font-semibold text-theme-text-light dark:text-theme-text-dark">
                      {phase.title}
                    </h3>
                    <span className="text-[11px] font-mono text-theme-muted-light dark:text-theme-muted-dark">
                      {phase.subtitle}
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="flex items-center gap-3 max-w-[320px] pt-1">
                    <div className="w-full h-[2px] bg-theme-text-light/5 dark:bg-theme-text-dark/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          isPhaseDone ? 'bg-badge-easy-text' : 'bg-accent'
                        }`}
                        style={{ width: `${phasePercent}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] tracking-wider text-theme-muted-light dark:text-theme-muted-dark shrink-0">
                      {completedCount}/{totalItems}
                    </span>
                  </div>
                </div>

                <div className="text-theme-muted-light dark:text-theme-muted-dark">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Items Panel */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden border-t border-theme-border-light/50 dark:border-theme-border-dark/50"
                  >
                    <div className="px-5 py-3 divide-y divide-theme-border-light/40 dark:divide-theme-border-dark/40">
                      {phase.items.map((item, index) => {
                        const key = `${phase.id}::${index}`;
                        
                        // Resolve linked DSA completion state
                        let isChecked = false;
                        let inlineDsaText = '';
                        if (item.isDsaLinked) {
                          const totalDsa = dsaPatterns.reduce((sum, pat) => sum + pat.problems.length, 0);
                          const completedDsa = Object.values(dsaProgress).filter(Boolean).length;
                          isChecked = completedDsa === totalDsa && totalDsa > 0;
                          const percentStr = totalDsa > 0 ? Math.round((completedDsa / totalDsa) * 100) : 0;
                          inlineDsaText = ` (${percentStr}% complete)`;
                        } else {
                          isChecked = !!roadmapProgress[key];
                        }

                        return (
                          <div key={item.id} className="py-3 flex items-start gap-3.5 text-[13.5px]">
                            {/* Checkbox wrapper */}
                            {item.isDsaLinked ? (
                              <div 
                                className={`custom-checkbox mt-0.5 shrink-0 select-none opacity-60 cursor-not-allowed ${
                                  isChecked ? 'checked' : 'border-dashed'
                                }`}
                                title="Calculated automatically from DSA Tracker progress"
                              >
                                {isChecked ? (
                                  <Check size={11} strokeWidth={3} />
                                ) : (
                                  <Link2 size={10} className="text-theme-muted-light dark:text-theme-muted-dark" />
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => toggleRoadmapItem(phase.id, index)}
                                className={`custom-checkbox mt-0.5 shrink-0 ${isChecked ? 'checked' : ''}`}
                              >
                                {isChecked && <Check size={11} strokeWidth={3} />}
                              </button>
                            )}

                            {/* Label */}
                            <div className="space-y-1.5 flex-1">
                              <p className={`font-medium ${
                                isChecked 
                                  ? 'completed-text' 
                                  : 'text-theme-text-light dark:text-theme-text-dark'
                              }`}>
                                {item.text}
                                {item.isDsaLinked && (
                                  <span className="font-mono text-[11px] text-accent dark:text-accent/90 font-medium ml-1">
                                    {inlineDsaText}
                                  </span>
                                )}
                              </p>

                              {/* Subparts details */}
                              {item.subitems && item.subitems.length > 0 && (
                                <ul className="pl-4 list-disc space-y-1 text-[12px] text-theme-muted-light dark:text-theme-muted-dark leading-relaxed">
                                  {item.subitems.map((sub) => (
                                    <li key={sub.id} className="marker:text-accent/50 dark:marker:text-accent/30">
                                      {sub.text}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
