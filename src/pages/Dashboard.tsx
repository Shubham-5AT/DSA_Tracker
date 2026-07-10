import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgressStore, getTodayStr, getYesterdayStr } from '../store/useProgressStore';
import { calculateProgress } from '../utils/progressHelpers';
import { dsaPatterns } from '../data/dsaPatterns';
import { roadmapData } from '../data/roadmapData';
import { ArrowRight, BookOpen, Flame, CheckCircle2, GitMerge } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    dsaProgress, 
    roadmapProgress, 
    lastTouched,
    dailyLogs,
    customGoals,
    dailyRitualsChecked,
    streak,
    revisionQueue 
  } = useProgressStore();
  
  const stats = calculateProgress(dsaProgress, roadmapProgress);

  // 1. Calculate DSA patterns mastered
  const masteredPatterns = dsaPatterns.filter((pattern) => {
    return pattern.problems.every((prob) => dsaProgress[`${pattern.id}::${prob.id}`]);
  }).length;

  // 2. Resolve daily checklist stats
  const today = getTodayStr();
  const yesterday = getYesterdayStr();
  
  const todayLog = dailyLogs[today] || { dsaSolvedCount: 0, reviewsDoneCount: 0 };
  const dsaTarget = todayLog.rebased ? 2 : 1;
  const dsaSolved = todayLog.dsaSolvedCount || 0;
  
  const dueReviewsCount = Object.values(revisionQueue || {}).filter(
    (item) => item.nextReviewAt <= Date.now() + 60 * 1000
  ).length;

  const customCheckedCount = customGoals.filter(
    (goal) => !!dailyRitualsChecked[`${today}::${goal}`]
  ).length;

  const isTodayDone = todayLog.completed;
  const yesterdayLog = dailyLogs[yesterday];
  const showRebaseLink = (!yesterdayLog || !yesterdayLog.completed) && (!yesterdayLog || !yesterdayLog.rebased);

  // 3. SVG Line Chart Coordinates calculations
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const getChartData = () => {
    const arr = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const offset = d.getTimezoneOffset();
      const local = new Date(d.getTime() - offset * 60 * 1000);
      const dateStr = local.toISOString().slice(0, 10);
      
      const log = dailyLogs[dateStr];
      const val = log?.dsaSolvedCount || 0;
      arr.push({
        dateStr,
        label: weekdays[local.getUTCDay()],
        value: val,
      });
    }
    return arr;
  };

  const chartData = getChartData();
  const maxChartValue = Math.max(...chartData.map((d) => d.value), 3); // force minimum scaling height

  // Chart Canvas Constants
  const width = 600;
  const height = 180;
  const paddingLeft = 32;
  const paddingRight = 16;
  const paddingTop = 20;
  const paddingBottom = 30;
  
  const gridWidth = width - paddingLeft - paddingRight;
  const gridHeight = height - paddingTop - paddingBottom;

  // Resolve points
  const points = chartData.map((d, i) => {
    const x = paddingLeft + (i / 6) * gridWidth;
    const y = (paddingTop + gridHeight) - (d.value / maxChartValue) * gridHeight;
    return { x, y, ...d };
  });

  // Build SVG Path strings
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + gridHeight} L ${points[0].x} ${paddingTop + gridHeight} Z`
    : '';

  // 4. Resolve "Continue where you left off" item
  const getContinueItem = () => {
    if (!lastTouched) return null;

    if (lastTouched.type === 'dsa') {
      const pattern = dsaPatterns.find((p) => p.id === lastTouched.id);
      if (!pattern) return null;

      // Find the first uncompleted problem in this pattern
      const uncompletedProblems = pattern.problems.filter(
        (prob) => !dsaProgress[`${pattern.id}::${prob.id}`]
      );

      return {
        title: pattern.name,
        subtitle: `${pattern.problems.length - uncompletedProblems.length}/${pattern.problems.length} problems completed`,
        link: `/dsa?expand=${pattern.id}`,
        typeLabel: 'DSA Pattern'
      };
    } else {
      const phase = roadmapData.find((p) => p.id === lastTouched.id);
      if (!phase) return null;

      // Calculate phase progress percentage
      let phaseCompleted = 0;
      phase.items.forEach((item, index) => {
        if (item.isDsaLinked) {
          const totalDsa = dsaPatterns.reduce((sum, pat) => sum + pat.problems.length, 0);
          const completedDsa = Object.values(dsaProgress).filter(Boolean).length;
          if (completedDsa === totalDsa && totalDsa > 0) phaseCompleted++;
        } else {
          if (roadmapProgress[`${phase.id}::${index}`]) phaseCompleted++;
        }
      });

      return {
        title: phase.title,
        subtitle: `${phaseCompleted}/${phase.items.length} checkpoints cleared`,
        link: `/roadmap?expand=${phase.id}`,
        typeLabel: 'CS Roadmap Phase'
      };
    }
  };

  const continueItem = getContinueItem();

  return (
    <div className="space-y-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.15em] text-theme-muted-light dark:text-theme-muted-dark font-medium">Overview</p>
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-theme-text-light dark:text-theme-text-dark font-medium">
            Ascent Progress Log
          </h1>
        </div>
      </div>

      {/* Daily Rituals Summary Widget */}
      <div className="p-4 border border-theme-border-light dark:border-theme-border-dark rounded-lg bg-theme-text-light/[0.005] dark:bg-theme-text-dark/[0.005] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-theme-muted-light dark:text-theme-muted-dark">Today's Ritual Targets</span>
            {streak > 0 && (
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-badge-medium-bgLight text-badge-medium-text dark:bg-badge-medium-bgDark rounded flex items-center gap-1 shrink-0">
                <Flame size={10} className="fill-badge-medium-text/20 animate-pulse" /> {streak} Day Streak
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
            <span className="text-[12.5px] font-mono text-theme-text-light/80 dark:text-theme-text-dark/80">
              DSA: {dsaSolved}/{dsaTarget} Solved
            </span>
            <span className="text-[12.5px] font-mono text-theme-text-light/80 dark:text-theme-text-dark/80">
              Reviews: {dueReviewsCount > 0 ? `${dueReviewsCount} due` : 'Cleared'}
            </span>
            {customGoals.length > 0 && (
              <span className="text-[12.5px] font-mono text-theme-text-light/80 dark:text-theme-text-dark/80">
                Habits: {customCheckedCount}/{customGoals.length} checked
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {showRebaseLink && (
            <Link 
              to="/daily" 
              className="text-[11px] font-semibold text-badge-medium-text bg-badge-medium-bgLight dark:bg-badge-medium-bgDark hover:bg-badge-medium-bgLight/80 px-2.5 py-1 rounded flex items-center gap-1 transition-all"
            >
              <GitMerge size={12} /> Rebase Empty Commit
            </Link>
          )}

          {isTodayDone ? (
            <div className="text-[12px] text-badge-easy-text flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={15} /> Commit Goals Met
            </div>
          ) : (
            <Link 
              to="/daily" 
              className="text-[12.5px] font-medium text-accent dark:text-accent/90 flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              View Daily Tracker <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>

      {/* Main Metric Visual Row */}
      <div className="space-y-6">
        <div className="flex items-baseline gap-4">
          <span className="font-serif text-7xl md:text-[110px] leading-none tracking-tighter text-accent dark:text-accent/90">
            {stats.combinedPercent}%
          </span>
          <span className="text-[12px] font-mono tracking-widest text-theme-muted-light dark:text-theme-muted-dark uppercase mb-2 md:mb-4">
            Mastered
          </span>
        </div>

        {/* Aggregate Progress Bar */}
        <div className="w-full h-[3px] bg-theme-text-light/5 dark:bg-theme-text-dark/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${stats.combinedPercent}%` }}
          />
        </div>
      </div>

      {/* Primary Metrics List */}
      <div className="border-t border-b border-theme-border-light dark:border-theme-border-dark divide-y divide-theme-border-light/50 dark:divide-theme-border-dark/50">
        <div className="py-4 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-[14px] font-medium text-theme-text-light dark:text-theme-text-dark">DSA Patterns</h3>
            <p className="text-[12px] text-theme-muted-light dark:text-theme-muted-dark">Foundational algorithmic problem solving structures</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[16px] font-semibold text-theme-text-light dark:text-theme-text-dark">
              {masteredPatterns}
            </span>
            <span className="text-theme-muted-light dark:text-theme-muted-dark font-mono text-[12px]">/ 18 patterns mastered</span>
          </div>
        </div>

        <div className="py-4 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-[14px] font-medium text-theme-text-light dark:text-theme-text-dark">CS Roadmap</h3>
            <p className="text-[12px] text-theme-muted-light dark:text-theme-muted-dark">Core concepts, systems architectural benchmarks, proof of work</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[16px] font-semibold text-theme-text-light dark:text-theme-text-dark">
              {stats.completedRoadmap}
            </span>
            <span className="text-theme-muted-light dark:text-theme-muted-dark font-mono text-[12px]">/ {stats.totalRoadmap} checkpoints cleared</span>
          </div>
        </div>
      </div>

      {/* Resume Progress Section */}
      <div className="space-y-4">
        <h4 className="text-[11px] uppercase tracking-[0.12em] text-theme-muted-light dark:text-theme-muted-dark font-semibold">
          Continue where you left off
        </h4>
        
        {continueItem ? (
          <div className="p-5 border border-theme-border-light dark:border-theme-border-dark rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-theme-text-light/[0.01] dark:bg-theme-text-dark/[0.01] hover:border-theme-text-light/10 dark:hover:border-theme-text-dark/15 transition-all">
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider text-accent bg-accent/5 dark:text-accent/90 dark:bg-accent/10 px-1.5 py-0.5 rounded uppercase font-semibold shrink-0">
                  {continueItem.typeLabel}
                </span>
                <span className="text-[11px] font-mono text-theme-muted-light dark:text-theme-muted-dark">
                  {continueItem.subtitle}
                </span>
              </div>
              <h5 className="text-[15px] font-semibold text-theme-text-light dark:text-theme-text-dark truncate">
                {continueItem.title}
              </h5>
            </div>
            <Link 
              to={continueItem.link} 
              className="text-[13px] font-medium text-accent dark:text-accent/90 flex items-center gap-1 hover:gap-2 transition-all shrink-0 self-start sm:self-auto"
            >
              Resume <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="p-5 border border-dashed border-theme-border-light dark:border-theme-border-dark rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 text-theme-muted-light dark:text-theme-muted-dark">
            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-theme-muted-light/60" />
              <p className="text-[13px]">No recent activity logged. Ready to start your learning session?</p>
            </div>
            <Link 
              to="/dsa" 
              className="text-[13px] font-medium text-accent dark:text-accent/90 flex items-center gap-1 hover:gap-2 transition-all self-start md:self-auto"
            >
              Explore DSA Patterns <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* Hand-Crafted SVG Sparkline Graph */}
      <div className="space-y-4 pt-4 border-t border-theme-border-light/30 dark:border-theme-border-dark/30">
        <div className="flex justify-between items-baseline">
          <h4 className="text-[11px] uppercase tracking-[0.12em] text-theme-muted-light dark:text-theme-muted-dark font-semibold">
            DSA Practice Volume (Past 7 days)
          </h4>
          {hoveredPointIndex !== null && (
            <span className="text-[11px] font-mono text-accent dark:text-accent/90 font-medium">
              {chartData[hoveredPointIndex].value} solved on {chartData[hoveredPointIndex].label} ({chartData[hoveredPointIndex].dateStr})
            </span>
          )}
        </div>

        <div className="w-full border border-theme-border-light dark:border-theme-border-dark p-4 rounded-lg bg-theme-text-light/[0.002] dark:bg-theme-text-dark/[0.002]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
            {/* Gridlines */}
            {[0, 0.5, 1].map((ratio) => {
              const yVal = paddingTop + ratio * gridHeight;
              const gridLabel = Math.round(maxChartValue - ratio * maxChartValue);
              return (
                <g key={ratio} className="opacity-40">
                  <line 
                    x1={paddingLeft} 
                    y1={yVal} 
                    x2={width - paddingRight} 
                    y2={yVal} 
                    className="stroke-theme-border-light dark:stroke-theme-border-dark stroke-[1px] stroke-dasharray"
                    style={{ strokeDasharray: '4 4' }}
                  />
                  <text 
                    x={paddingLeft - 8} 
                    y={yVal + 3} 
                    textAnchor="end"
                    className="fill-theme-muted-light dark:fill-theme-muted-dark font-mono text-[9px] font-medium"
                  >
                    {gridLabel}
                  </text>
                </g>
              );
            })}

            {/* Line Shading Area */}
            {areaPath && (
              <path 
                d={areaPath} 
                className="fill-accent/5 dark:fill-accent/10"
              />
            )}

            {/* Progress line path */}
            {linePath && (
              <path 
                d={linePath} 
                className="stroke-accent dark:stroke-accent/95 stroke-[2px] fill-none"
              />
            )}

            {/* Nodes and interactions */}
            {points.map((p, index) => {
              const isHovered = hoveredPointIndex === index;
              return (
                <g key={index}>
                  {/* Invisible larger hover hit-target */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={14}
                    className="fill-transparent cursor-pointer"
                    onMouseEnter={() => setHoveredPointIndex(index)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  />
                  {/* Solid data dot */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 5 : 3.5}
                    className={`transition-all duration-150 fill-theme-bg-light dark:fill-theme-bg-dark stroke-accent dark:stroke-accent/95 ${
                      isHovered ? 'stroke-[3px]' : 'stroke-[2px]'
                    }`}
                  />
                  {/* X-axis labels */}
                  <text
                    x={p.x}
                    y={height - 8}
                    textAnchor="middle"
                    className="fill-theme-muted-light dark:fill-theme-muted-dark font-mono text-[9px] uppercase tracking-wider font-semibold"
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
