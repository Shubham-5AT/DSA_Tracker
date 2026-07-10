import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';
import { dsaPatterns } from '../data/dsaPatterns';
import { calculateProgress } from '../utils/progressHelpers';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  FileText, 
  ExternalLink,
  Check,
  Bookmark,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DsaTracker: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { 
    dsaProgress, 
    toggleDsaProblem, 
    problemNotes, 
    setNote, 
    revisionQueue, 
    toggleRevisionFlag,
    problemFeynman,
    problemTimeTaken,
    saveProblemCompletionDetails
  } = useProgressStore();
  
  const stats = calculateProgress(dsaProgress, {}); // only need DSA calculations

  // 1. Expand / Collapse State
  const [expandedPatterns, setExpandedPatterns] = useState<Record<string, boolean>>({});

  // Pre-expand pattern if passed in URL query e.g. /dsa?expand=arrays-hashing
  useEffect(() => {
    const expandParam = searchParams.get('expand');
    if (expandParam) {
      setExpandedPatterns((prev) => ({ ...prev, [expandParam]: true }));
      // Scroll to that element smoothly
      setTimeout(() => {
        const el = document.getElementById(`pattern-${expandParam}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [searchParams]);

  // 2. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unstarted' | 'inprogress' | 'mastered'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');

  // 3. Keep track of patterns that have already completed in the session to avoid repetitive pulsing
  const [completedPatterns, setCompletedPatterns] = useState<Record<string, boolean>>({});
  const [justMasteredPatternId, setJustMasteredPatternId] = useState<string | null>(null);

  // 4. Notes Expansion State
  const [activeNotesProblems, setActiveNotesProblems] = useState<Record<string, boolean>>({});

  // 5. Feynman Modal State
  const [completingProblem, setCompletingProblem] = useState<{ patternId: string; problemId: string; name: string } | null>(null);
  const [feynmanText, setFeynmanText] = useState('');
  const [timeTaken, setTimeTaken] = useState<number>(30);

  // 6. Topic Hints State
  const [visibleHints, setVisibleHints] = useState<Record<string, boolean>>({});

  // 7. Template Language Toggle
  const [templateLanguage, setTemplateLanguage] = useState<'python' | 'cpp'>('python');

  // 8. Detect and trigger pattern completion pulse
  useEffect(() => {
    dsaPatterns.forEach((pattern) => {
      const totalProblems = pattern.problems.length;
      const completedCount = pattern.problems.filter(
        (prob) => dsaProgress[`${pattern.id}::${prob.id}`]
      ).length;
      
      const isDone = completedCount === totalProblems;
      const wasDone = completedPatterns[pattern.id];

      if (isDone && !wasDone) {
        // Trigger pulse animation
        setJustMasteredPatternId(pattern.id);
        const timer = setTimeout(() => setJustMasteredPatternId(null), 1800);
        
        setCompletedPatterns((prev) => ({ ...prev, [pattern.id]: true }));
        return () => clearTimeout(timer);
      } else if (!isDone && wasDone) {
        // Remove from completed if unchecked
        setCompletedPatterns((prev) => ({ ...prev, [pattern.id]: false }));
      }
    });
  }, [dsaProgress, completedPatterns]);

  // Pre-fill initial completed patterns on mount
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    dsaPatterns.forEach((pattern) => {
      const totalProblems = pattern.problems.length;
      const completedCount = pattern.problems.filter(
        (prob) => dsaProgress[`${pattern.id}::${prob.id}`]
      ).length;
      if (completedCount === totalProblems) {
        initial[pattern.id] = true;
      }
    });
    setCompletedPatterns(initial);
  }, []);

  const togglePatternExpand = (patternId: string) => {
    setExpandedPatterns((prev) => ({
      ...prev,
      [patternId]: !prev[patternId]
    }));
  };

  const toggleNotesExpand = (problemKey: string) => {
    setActiveNotesProblems((prev) => ({
      ...prev,
      [problemKey]: !prev[problemKey]
    }));
  };

  // 7. Filter & Search Logic
  const filteredPatterns = dsaPatterns
    .map((pattern) => {
      // Filter problems first
      const problemsMatchingFilters = pattern.problems.filter((problem) => {
        const problemKey = `${pattern.id}::${problem.id}`;
        const isChecked = !!dsaProgress[problemKey];

        // Search match
        const matchesSearch = problem.name.toLowerCase().includes(searchQuery.toLowerCase());

        // Status match
        let matchesStatus = true;
        if (statusFilter === 'unstarted') matchesStatus = !isChecked;
        if (statusFilter === 'mastered') matchesStatus = isChecked;
        if (statusFilter === 'inprogress') {
          const patternProblems = pattern.problems;
          const completedCount = patternProblems.filter((p) => dsaProgress[`${pattern.id}::${p.id}`]).length;
          matchesStatus = completedCount > 0 && completedCount < patternProblems.length;
        }

        // Difficulty match
        const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;

        return matchesSearch && matchesStatus && matchesDifficulty;
      });

      return {
        ...pattern,
        filteredProblems: problemsMatchingFilters
      };
    })
    .filter((pattern) => pattern.filteredProblems.length > 0);

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.15em] text-theme-muted-light dark:text-theme-muted-dark font-medium">Core curriculum</p>
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-theme-text-light dark:text-theme-text-dark font-medium">
            DSA Pattern Tracker
          </h1>
        </div>

        {/* DSA Progress Header Card */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline text-[11px] uppercase tracking-wider text-theme-muted-light dark:text-theme-muted-dark font-medium">
            <span>Aggregate DSA Mastery</span>
            <span className="font-mono text-theme-text-light dark:text-theme-text-dark">
              {stats.completedDsa} / {stats.totalDsa} problems ({Math.round(stats.dsaPercent)}%)
            </span>
          </div>
          <div className="w-full h-[3px] bg-theme-text-light/5 dark:bg-theme-text-dark/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${stats.dsaPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter / Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 py-4 border-t border-b border-theme-border-light dark:border-theme-border-dark bg-theme-text-light/[0.01] dark:bg-theme-text-dark/[0.01] px-3 rounded-lg">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted-light dark:text-theme-muted-dark" />
          <input 
            type="text" 
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-[13px] bg-transparent border border-theme-border-light dark:border-theme-border-dark rounded-md focus:outline-none focus:border-accent dark:focus:border-accent/80 font-sans transition-all text-theme-text-light dark:text-theme-text-dark"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-[12px] bg-theme-bg-light dark:bg-theme-bg-dark border border-theme-border-light dark:border-theme-border-dark rounded-md focus:outline-none text-theme-muted-light dark:text-theme-muted-dark hover:text-theme-text-light dark:hover:text-theme-text-dark cursor-pointer font-sans"
          >
            <option value="all">Status: All</option>
            <option value="unstarted">Unstarted</option>
            <option value="inprogress">In Progress</option>
            <option value="mastered">Mastered</option>
          </select>

          {/* Difficulty Filter */}
          <select 
            value={difficultyFilter}
            onChange={(e: any) => setDifficultyFilter(e.target.value)}
            className="px-2.5 py-1.5 text-[12px] bg-theme-bg-light dark:bg-theme-bg-dark border border-theme-border-light dark:border-theme-border-dark rounded-md focus:outline-none text-theme-muted-light dark:text-theme-muted-dark hover:text-theme-text-light dark:hover:text-theme-text-dark cursor-pointer font-sans"
          >
            <option value="all">Difficulty: All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Accordion Pattern Rows */}
      <div className="space-y-4">
        {filteredPatterns.length > 0 ? (
          filteredPatterns.map((pattern) => {
            const totalProblems = pattern.problems.length;
            const completedCount = pattern.problems.filter(
              (prob) => dsaProgress[`${pattern.id}::${prob.id}`]
            ).length;
            const isPatternDone = completedCount === totalProblems;
            const patternPercent = totalProblems > 0 ? (completedCount / totalProblems) * 100 : 0;
            const isExpanded = !!expandedPatterns[pattern.id];
            
            const isPulseActive = justMasteredPatternId === pattern.id;

            return (
              <div 
                key={pattern.id} 
                id={`pattern-${pattern.id}`}
                className={`border border-theme-border-light dark:border-theme-border-dark rounded-lg overflow-hidden bg-theme-bg-light dark:bg-theme-bg-dark transition-all duration-300 ${
                  isPatternDone ? 'border-left-[3px] border-l-badge-easy-text' : 'border-l-transparent'
                } ${isPulseActive ? 'animate-pulse-mastered border-l-[3px]' : ''}`}
                style={{
                  borderLeftColor: isPatternDone || isPulseActive ? '#4A6D55' : 'transparent',
                  borderLeftWidth: isPatternDone || isPulseActive ? '3px' : '1px'
                }}
              >
                {/* Accordion Header */}
                <div 
                  onClick={() => togglePatternExpand(pattern.id)}
                  className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-theme-text-light/[0.01] dark:hover:bg-theme-text-dark/[0.01] transition-all select-none"
                >
                  <div className="flex-1 space-y-1 pr-4">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h3 className="text-[15px] font-semibold text-theme-text-light dark:text-theme-text-dark">
                        {pattern.name}
                      </h3>
                      <span className="text-[11px] font-mono text-theme-muted-light dark:text-theme-muted-dark">
                        {pattern.description}
                      </span>
                    </div>

                    {/* Progress details line */}
                    <div className="flex items-center gap-3 max-w-[320px] pt-1">
                      <div className="w-full h-[2px] bg-theme-text-light/5 dark:bg-theme-text-dark/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ease-out ${
                            isPatternDone ? 'bg-badge-easy-text' : 'bg-accent'
                          }`}
                          style={{ width: `${patternPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] tracking-wider text-theme-muted-light dark:text-theme-muted-dark shrink-0">
                        {completedCount}/{totalProblems}
                      </span>
                    </div>
                  </div>

                  <div className="text-theme-muted-light dark:text-theme-muted-dark">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Problems List Panel */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden border-t border-theme-border-light/50 dark:border-theme-border-dark/50"
                    >
                      {/* Pattern Template Section */}
                      {(pattern.templateCode || pattern.templateCodeCpp) && (
                        <div className="px-5 py-3 border-b border-theme-border-light/40 dark:border-theme-border-dark/40 bg-theme-text-light/[0.005] dark:bg-theme-text-dark/[0.005]">
                          <details className="group cursor-pointer">
                            <summary className="text-[12.5px] font-medium text-accent dark:text-accent/90 list-none flex items-center justify-between hover:text-accent/80 select-none">
                              <span className="flex items-center gap-1.5">
                                <span className="transition-transform group-open:rotate-90 text-[8px] opacity-60">▶</span>
                                View Code Template ({templateLanguage === 'python' ? 'Python' : 'C++'})
                              </span>
                              
                              {/* Language Switcher */}
                              <div className="flex items-center border border-theme-border-light dark:border-theme-border-dark rounded bg-theme-text-light/5 dark:bg-theme-text-dark/5 p-0.5" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => setTemplateLanguage('python')}
                                  className={`px-2 py-0.5 text-[10px] font-mono rounded transition-all ${
                                    templateLanguage === 'python'
                                      ? 'bg-theme-bg-light dark:bg-theme-bg-dark text-accent dark:text-accent/90 shadow-sm border border-theme-border-light dark:border-theme-border-dark'
                                      : 'text-theme-muted-light/60 hover:text-theme-text-light'
                                  }`}
                                >
                                  Python
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setTemplateLanguage('cpp')}
                                  className={`px-2 py-0.5 text-[10px] font-mono rounded transition-all ${
                                    templateLanguage === 'cpp'
                                      ? 'bg-theme-bg-light dark:bg-theme-bg-dark text-accent dark:text-accent/90 shadow-sm border border-theme-border-light dark:border-theme-border-dark'
                                      : 'text-theme-muted-light/60 hover:text-theme-text-light'
                                  }`}
                                >
                                  C++
                                </button>
                              </div>
                            </summary>
                            <div className="mt-2.5">
                              <pre className="p-3 bg-theme-text-light/[0.02] dark:bg-theme-text-dark/[0.02] border border-theme-border-light dark:border-theme-border-dark rounded text-[11px] font-mono text-theme-text-light/95 dark:text-theme-text-dark/95 overflow-x-auto select-all leading-relaxed whitespace-pre w-full max-w-full">
                                {templateLanguage === 'python' ? pattern.templateCode : (pattern.templateCodeCpp || '// C++ Template not yet seeded.')}
                              </pre>
                            </div>
                          </details>
                        </div>
                      )}

                      <div className="px-5 py-3 divide-y divide-theme-border-light/40 dark:divide-theme-border-dark/40">
                        {pattern.filteredProblems.map((problem) => {
                          const problemKey = `${pattern.id}::${problem.id}`;
                          const isChecked = !!dsaProgress[problemKey];
                          const note = problemNotes[problemKey] || '';
                          const isNoteOpen = !!activeNotesProblems[problemKey];
                          const isBookmarked = !!revisionQueue?.[problemKey];

                          // Difficulty Styling
                          const diffClass = 
                            problem.difficulty === 'Easy' 
                              ? 'text-badge-easy-text bg-badge-easy-bgLight dark:bg-badge-easy-bgDark border-badge-easy-borderLight dark:border-badge-easy-borderDark' 
                              : problem.difficulty === 'Medium'
                              ? 'text-badge-medium-text bg-badge-medium-bgLight dark:bg-badge-medium-bgDark border-badge-medium-borderLight dark:border-badge-medium-borderDark'
                              : 'text-badge-hard-text bg-badge-hard-bgLight dark:bg-badge-hard-bgDark border-badge-hard-borderLight dark:border-badge-hard-borderDark';

                          return (
                            <div key={problem.id} className="py-2.5 space-y-2">
                              {/* Row Wrapper — stacks vertically on mobile */}
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[13px]">
                                {/* Top: Checkbox + Title + Hint */}
                                <div className="flex items-center gap-2 min-w-0">
                                  {/* Custom Checkbox */}
                                  <button
                                    onClick={() => {
                                      if (isChecked) {
                                        toggleDsaProblem(pattern.id, problem.id);
                                      } else {
                                        setFeynmanText('');
                                        setTimeTaken(30);
                                        setCompletingProblem({
                                          patternId: pattern.id,
                                          problemId: problem.id,
                                          name: problem.name
                                        });
                                      }
                                    }}
                                    className={`custom-checkbox shrink-0 ${isChecked ? 'checked' : ''}`}
                                  >
                                    {isChecked && <Check size={11} strokeWidth={3} />}
                                  </button>

                                  {/* Problem Title link */}
                                  <a 
                                    href={problem.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className={`font-medium inline-flex items-center gap-1 hover:text-accent dark:hover:text-accent/90 transition-all min-w-0 ${
                                      isChecked ? 'completed-text' : 'text-theme-text-light dark:text-theme-text-dark'
                                    }`}
                                  >
                                    <span className="truncate">{problem.name}</span>
                                    <ExternalLink size={11} className="opacity-40 hover:opacity-100 transition-opacity shrink-0" />
                                    {problem.isPremium && (
                                      <span className="text-[9px] font-mono text-theme-muted-light/60 px-1 border border-theme-border-light dark:border-theme-border-dark rounded shrink-0">
                                        Premium
                                      </span>
                                    )}
                                  </a>

                                  {/* Help Trigger for sub-topics */}
                                  <button
                                    onClick={() => {
                                      setVisibleHints((prev) => ({
                                        ...prev,
                                        [problemKey]: !prev[problemKey]
                                      }));
                                    }}
                                    className={`p-0.5 rounded transition-all shrink-0 ${
                                      visibleHints[problemKey]
                                        ? 'text-accent dark:text-accent/90 hover:bg-accent/5'
                                        : 'text-theme-muted-light/40 hover:text-theme-muted-light hover:bg-theme-text-light/5 dark:hover:bg-theme-text-dark/5'
                                    }`}
                                    title="Show topic details"
                                  >
                                    <HelpCircle size={12} />
                                  </button>
                                </div>

                                {/* Badges & Action Buttons row — wraps below title on mobile */}
                                <div className="flex flex-wrap items-center gap-2 pl-7 sm:pl-0">
                                  {/* Difficulty */}
                                  <span className={`px-2 py-0.5 border text-[10px] font-mono rounded-full font-medium ${diffClass}`}>
                                    {problem.difficulty}
                                  </span>

                                  {/* Platform */}
                                  <span className="text-[10px] font-mono text-theme-muted-light dark:text-theme-muted-dark border border-theme-border-light dark:border-theme-border-dark px-1.5 py-0.5 rounded bg-theme-text-light/[0.01] dark:bg-theme-text-dark/[0.01]">
                                    {problem.platform}
                                  </span>

                                  {/* Time & Space Complexity */}
                                  {(problem.timeComplexity || problem.spaceComplexity) && (
                                    <span className="text-[10px] font-mono text-theme-muted-light/70 dark:text-theme-muted-dark/70 bg-theme-text-light/5 dark:bg-theme-text-dark/5 px-1.5 py-0.5 rounded border border-theme-border-light/40 dark:border-theme-border-dark/40 select-none">
                                      {problem.timeComplexity && `T: ${problem.timeComplexity}`}
                                      {problem.timeComplexity && problem.spaceComplexity && ' | '}
                                      {problem.spaceComplexity && `S: ${problem.spaceComplexity}`}
                                    </span>
                                  )}

                                  {/* Spaced Repetition Flag Trigger */}
                                  <button 
                                    onClick={() => toggleRevisionFlag(pattern.id, problem.id)}
                                    className={`p-1 rounded transition-colors ${
                                      isBookmarked 
                                        ? 'text-accent dark:text-accent/90 hover:bg-accent/5' 
                                        : 'text-theme-muted-light/50 hover:text-theme-muted-light hover:bg-theme-text-light/5 dark:hover:bg-theme-text-dark/5'
                                    }`}
                                    title={isBookmarked ? "Remove from revision" : "Add to spaced repetition revision"}
                                  >
                                    <Bookmark size={13} fill={isBookmarked ? "currentColor" : "none"} />
                                  </button>

                                  {/* Expand Note Trigger */}
                                  <button 
                                    onClick={() => toggleNotesExpand(problemKey)}
                                    className={`p-1 rounded transition-colors ${
                                      isNoteOpen || note 
                                        ? 'text-accent dark:text-accent/90 hover:bg-accent/5' 
                                        : 'text-theme-muted-light/50 hover:text-theme-muted-light hover:bg-theme-text-light/5 dark:hover:bg-theme-text-dark/5'
                                    }`}
                                    title="Add personal notes"
                                  >
                                    <FileText size={13} />
                                  </button>
                                </div>
                              </div>

                              {/* Topic Details Hint Panel */}
                              {visibleHints[problemKey] && problem.topics && (
                                <div className="pl-7 text-[11.5px] font-mono text-theme-muted-light dark:text-theme-muted-dark flex items-center gap-1.5 opacity-90 transition-all select-none pb-1">
                                  <span>💡 Study this to solve:</span>
                                  <span className="font-semibold text-accent dark:text-accent/80">{problem.topics}</span>
                                </div>
                              )}

                              {/* Editable Notes Textarea & Feynman explanation Display */}
                              {isNoteOpen && (
                                <div className="pl-7 space-y-4 pt-2">
                                  {/* Feynman and Time details if completed */}
                                  {isChecked && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 border border-theme-border-light dark:border-theme-border-dark rounded bg-theme-text-light/[0.01] dark:bg-theme-text-dark/[0.01]">
                                      <div className="space-y-1">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-theme-muted-light dark:text-theme-muted-dark block">Feynman Concept Explanation</span>
                                        <p className="text-[12.5px] italic text-theme-text-light/90 dark:text-theme-text-dark/90 leading-relaxed">
                                          "{problemFeynman[problemKey] || 'No Feynman explanation recorded.'}"
                                        </p>
                                      </div>
                                      <div className="space-y-1">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-theme-muted-light dark:text-theme-muted-dark block">Solve Time Taken</span>
                                        <p className="text-[12.5px] font-mono font-medium text-accent dark:text-accent/90">
                                          {problemTimeTaken[problemKey] ? `${problemTimeTaken[problemKey]} minutes` : 'Not recorded.'}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* General Study Notes */}
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-theme-muted-light dark:text-theme-muted-dark block">General Study Notes</span>
                                    <textarea
                                      value={note}
                                      onChange={(e) => setNote(pattern.id, problem.id, e.target.value)}
                                      placeholder="Take notes on algorithms, complex constraints, or alternative approaches..."
                                      rows={3}
                                      className="w-full bg-theme-text-light/[0.02] dark:bg-theme-text-dark/[0.02] border border-theme-border-light dark:border-theme-border-dark rounded-md p-3 text-[12px] text-theme-text-light dark:text-theme-text-dark focus:outline-none focus:border-accent dark:focus:border-accent/80 font-sans transition-all resize-y"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center border border-dashed border-theme-border-light dark:border-theme-border-dark rounded-lg text-theme-muted-light dark:text-theme-muted-dark space-y-1">
            <p className="text-[13px] font-medium">No matching patterns or problems found</p>
            <p className="text-[11px]">Adjust your search query or filter values.</p>
          </div>
        )}
      </div>

      {/* Feynman Technique Completion Modal */}
      <AnimatePresence>
        {completingProblem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blurred Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCompletingProblem(null)}
              className="absolute inset-0 bg-theme-bg-dark/40 dark:bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative w-full max-w-[500px] bg-theme-bg-light dark:bg-theme-bg-dark border border-theme-border-light dark:border-theme-border-dark p-6 rounded-lg shadow-hover space-y-6 z-10"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent dark:text-accent/90 font-semibold">Log Completion</span>
                <h3 className="text-[16px] font-semibold text-theme-text-light dark:text-theme-text-dark">
                  {completingProblem.name}
                </h3>
              </div>

              <div className="space-y-4">
                {/* Feynman Technique explanation */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-theme-muted-light dark:text-theme-muted-dark block">
                    Feynman Concept Explanation (Explain what you did in simple terms)
                  </label>
                  <textarea
                    value={feynmanText}
                    onChange={(e) => setFeynmanText(e.target.value)}
                    placeholder="E.g., We iterate through the array using a map to look up if the difference (target - current) exists. If it does, return indices..."
                    rows={4}
                    className="w-full bg-theme-text-light/[0.01] dark:bg-theme-text-dark/[0.01] border border-theme-border-light dark:border-theme-border-dark rounded-md p-3 text-[12px] focus:outline-none focus:border-accent dark:focus:border-accent/80 font-sans transition-all resize-none text-theme-text-light dark:text-theme-text-dark"
                  />
                </div>

                {/* Time taken */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-theme-muted-light dark:text-theme-muted-dark block">
                    Time taken to solve (minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={timeTaken}
                    onChange={(e) => setTimeTaken(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 text-[13px] bg-theme-bg-light dark:bg-theme-bg-dark border border-theme-border-light dark:border-theme-border-dark rounded focus:outline-none focus:border-accent dark:focus:border-accent/80 font-sans text-theme-text-light dark:text-theme-text-dark"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    saveProblemCompletionDetails(
                      completingProblem.patternId,
                      completingProblem.problemId,
                      feynmanText,
                      timeTaken
                    );
                    setCompletingProblem(null);
                  }}
                  className="flex-1 px-4 py-2 text-[12px] font-semibold text-white bg-accent hover:bg-accent-hover dark:text-theme-bg-dark dark:bg-accent dark:hover:bg-accent/80 rounded transition-all"
                >
                  Log Completed
                </button>
                <button
                  onClick={() => setCompletingProblem(null)}
                  className="px-4 py-2 text-[12px] font-semibold border border-theme-border-light dark:border-theme-border-dark text-theme-text-light dark:text-theme-text-dark hover:bg-theme-text-light/5 dark:hover:bg-theme-text-dark/5 rounded transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
