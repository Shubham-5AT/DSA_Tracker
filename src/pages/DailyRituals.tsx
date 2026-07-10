import React, { useState } from 'react';
import { useProgressStore, getTodayStr, getYesterdayStr } from '../store/useProgressStore';
import { 
  Flame, 
  Plus, 
  Trash2, 
  Check, 
  GitMerge, 
  AlertCircle
} from 'lucide-react';

export const DailyRituals: React.FC = () => {
  const {
    customGoals,
    dailyRitualsChecked,
    dailyLogs,
    streak,
    revisionQueue,
    addCustomGoal,
    removeCustomGoal,
    toggleCustomGoalChecked,
    triggerDailyRebase
  } = useProgressStore();

  const [newGoalName, setNewGoalName] = useState('');

  const today = getTodayStr();
  const yesterday = getYesterdayStr();

  // Resolve today's statistics
  const todayLog = dailyLogs[today] || { dsaSolvedCount: 0, reviewsDoneCount: 0 };
  const dsaTarget = todayLog.rebased ? 2 : 1;
  const dsaSolved = todayLog.dsaSolvedCount || 0;
  const isDsaGoalMet = dsaSolved >= dsaTarget;

  // Resolve due reviews count
  const dueReviewsCount = Object.values(revisionQueue || {}).filter(
    (item) => item.nextReviewAt <= Date.now() + 60 * 1000
  ).length;
  const isReviewsGoalMet = dueReviewsCount === 0;

  // Check if yesterday was missed and is eligible for Git Rebase
  const yesterdayLog = dailyLogs[yesterday];
  const yesterdayMissed = !yesterdayLog || !yesterdayLog.completed;
  const isRebaseEligible = yesterdayMissed && (!yesterdayLog || !yesterdayLog.rebased);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalName.trim()) {
      addCustomGoal(newGoalName.trim());
      setNewGoalName('');
    }
  };

  // Generate list of the past 7 days for the weekly commits logs visualizer
  const getPastSevenDays = () => {
    const arr = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const offset = d.getTimezoneOffset();
      const local = new Date(d.getTime() - offset * 60 * 1000);
      const dateStr = local.toISOString().slice(0, 10);
      
      // Determine state
      const log = dailyLogs[dateStr];
      let status: 'empty' | 'complete' | 'rebased' | 'in-progress' = 'empty';
      
      if (log?.completed) {
        status = log.rebased ? 'rebased' : 'complete';
      } else if (dateStr === today) {
        status = 'in-progress';
      } else if (log && (log.dsaSolvedCount > 0 || log.reviewsDoneCount > 0)) {
        status = 'in-progress';
      }

      arr.push({
        dateStr,
        dayLabel: weekdays[local.getUTCDay()],
        dayNum: local.getUTCDate(),
        status
      });
    }
    return arr;
  };

  const weekDays = getPastSevenDays();

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.15em] text-theme-muted-light dark:text-theme-muted-dark font-medium">Daily Consistency</p>
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-theme-text-light dark:text-theme-text-dark font-medium">
            Daily Rituals
          </h1>
        </div>

        {/* Streak visualizer */}
        <div className="flex items-center gap-2 px-3 py-1.5 border border-theme-border-light dark:border-theme-border-dark rounded-md bg-theme-text-light/[0.01] dark:bg-theme-text-dark/[0.01] shrink-0 self-start sm:self-auto">
          <Flame size={16} className={streak > 0 ? "text-badge-medium-text fill-badge-medium-text/20 animate-pulse" : "text-theme-muted-light/40"} />
          <span className="text-[12px] font-mono font-medium text-theme-text-light dark:text-theme-text-dark">
            Streak: {streak} {streak === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {/* Week commits visualizer grid */}
      <div className="space-y-3">
        <h4 className="text-[11px] uppercase tracking-[0.12em] text-theme-muted-light dark:text-theme-muted-dark font-semibold">
          Consistency Heatmap (Past 7 days)
        </h4>
        <div className="grid grid-cols-7 gap-2 max-w-[450px]">
          {weekDays.map((wd) => {
            const isToday = wd.dateStr === today;
            let bgClass = "bg-theme-text-light/5 dark:bg-theme-text-dark/5 text-theme-muted-light/60";
            
            if (wd.status === 'complete') {
              bgClass = "bg-badge-easy-bgLight dark:bg-badge-easy-bgDark text-badge-easy-text border-badge-easy-borderLight dark:border-badge-easy-borderDark border";
            } else if (wd.status === 'rebased') {
              bgClass = "bg-badge-medium-bgLight dark:bg-badge-medium-bgDark text-badge-medium-text border-badge-medium-borderLight dark:border-badge-medium-borderDark border";
            } else if (wd.status === 'in-progress') {
              bgClass = "bg-accent/5 text-accent border border-accent/20 dark:text-accent/90";
            }

            return (
              <div 
                key={wd.dateStr} 
                className={`flex flex-col items-center justify-center p-2.5 rounded-md ${bgClass} transition-all`}
                title={`${wd.dateStr}: ${wd.status}`}
              >
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold opacity-60">{wd.dayLabel}</span>
                <span className="text-[14px] font-mono font-bold mt-0.5">{wd.dayNum}</span>
                {isToday && (
                  <div className="w-1 h-1 bg-accent rounded-full mt-1 animate-ping" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Git Rebase Grace Banner */}
      {isRebaseEligible && (
        <div className="p-5 border border-badge-medium-borderLight dark:border-badge-medium-borderDark bg-badge-medium-bgLight/40 dark:bg-badge-medium-bgDark/20 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-[13px] font-semibold text-badge-medium-text flex items-center gap-1.5">
              <AlertCircle size={14} /> Endangered Streak: Empty commit yesterday
            </h4>
            <p className="text-[12px] text-theme-muted-light dark:text-theme-muted-dark leading-relaxed max-w-[550px]">
              You missed your daily targets yesterday. To protect your streak, you can **Git Rebase** yesterday's targets onto today's branch. This will require you to solve **2 DSA problems** today.
            </p>
          </div>
          <button
            onClick={triggerDailyRebase}
            className="px-4 py-2 bg-badge-medium-text hover:bg-badge-medium-text/90 text-white rounded text-[12px] font-semibold flex items-center gap-1.5 transition-all shrink-0 self-start md:self-auto"
          >
            <GitMerge size={14} /> Rebase Commit
          </button>
        </div>
      )}

      {/* Daily checklist */}
      <div className="space-y-4">
        <h4 className="text-[11px] uppercase tracking-[0.12em] text-theme-muted-light dark:text-theme-muted-dark font-semibold">
          Today's Commit goals
        </h4>
        
        <div className="border border-theme-border-light dark:border-theme-border-dark rounded-lg divide-y divide-theme-border-light dark:divide-theme-border-dark bg-theme-text-light/[0.005] dark:bg-theme-text-dark/[0.005]">
          {/* DSA Goal */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className={`custom-checkbox mt-0.5 shrink-0 ${isDsaGoalMet ? 'checked' : 'border-dashed cursor-not-allowed opacity-60'}`}>
                {isDsaGoalMet && <Check size={11} strokeWidth={3} />}
              </div>
              <div>
                <p className={`text-[13.5px] font-medium ${isDsaGoalMet ? 'completed-text' : 'text-theme-text-light dark:text-theme-text-dark'}`}>
                  Solve daily DSA practice problem {todayLog.rebased && <span className="text-[10px] font-mono bg-badge-medium-bgLight text-badge-medium-text dark:bg-badge-medium-bgDark px-1 rounded ml-1 font-semibold uppercase">REBASED TARGET (2)</span>}
                </p>
                <p className="text-[11px] text-theme-muted-light dark:text-theme-muted-dark">
                  Mark problems completed in the DSA Tracker.
                </p>
              </div>
            </div>
            <span className="font-mono text-[12px] text-theme-muted-light dark:text-theme-muted-dark shrink-0 pl-7 sm:pl-0">
              {dsaSolved} / {dsaTarget} solved
            </span>
          </div>

          {/* Spaced Repetition Goal */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className={`custom-checkbox mt-0.5 shrink-0 ${isReviewsGoalMet ? 'checked' : 'border-dashed cursor-not-allowed opacity-60'}`}>
                {isReviewsGoalMet && <Check size={11} strokeWidth={3} />}
              </div>
              <div>
                <p className={`text-[13.5px] font-medium ${isReviewsGoalMet ? 'completed-text' : 'text-theme-text-light dark:text-theme-text-dark'}`}>
                  Clear all Spaced Repetition reviews due today
                </p>
                <p className="text-[11px] text-theme-muted-light dark:text-theme-muted-dark">
                  Complete recall session logs for scheduled items in the Revision tab.
                </p>
              </div>
            </div>
            <span className="font-mono text-[12px] text-theme-muted-light dark:text-theme-muted-dark shrink-0 pl-7 sm:pl-0">
              {dueReviewsCount > 0 ? `${dueReviewsCount} reviews pending` : 'All cleared'}
            </span>
          </div>

          {/* Custom user goals checklist */}
          {customGoals.map((goal) => {
            const isChecked = !!dailyRitualsChecked[`${today}::${goal}`];

            return (
              <div key={goal} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 group">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleCustomGoalChecked(today, goal)}
                    className={`custom-checkbox mt-0.5 shrink-0 ${isChecked ? 'checked' : ''}`}
                  >
                    {isChecked && <Check size={11} strokeWidth={3} />}
                  </button>
                  <div>
                    <p className={`text-[13.5px] font-medium ${isChecked ? 'completed-text' : 'text-theme-text-light dark:text-theme-text-dark'}`}>
                      {goal}
                    </p>
                  </div>
                </div>

                {/* Quick Delete */}
                <button
                  onClick={() => removeCustomGoal(goal)}
                  className="p-1 rounded text-theme-muted-light/30 hover:text-badge-hard-text hover:bg-badge-hard-bgLight/40 dark:hover:bg-badge-hard-bgDark/30 opacity-0 group-hover:opacity-100 transition-all self-end sm:self-auto"
                  title="Remove daily ritual habit"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit rituals manager input section */}
      <div className="space-y-4 pt-4 border-t border-theme-border-light/50 dark:border-theme-border-dark/50">
        <div className="space-y-1.5">
          <h4 className="text-[13px] font-semibold text-theme-text-light dark:text-theme-text-dark">
            Rituals Manager
          </h4>
          <p className="text-[12px] text-theme-muted-light dark:text-theme-muted-dark">
            Define custom, recurring habits or goals you want to complete each day.
          </p>
        </div>

        <form onSubmit={handleAddGoal} className="flex gap-2 max-w-[450px]">
          <input
            type="text"
            placeholder="Add habit (e.g. Read 10 pages of OS)..."
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            className="flex-1 px-3 py-1.5 text-[13px] bg-theme-text-light/[0.01] dark:bg-theme-text-dark/[0.01] border border-theme-border-light dark:border-theme-border-dark rounded-md focus:outline-none focus:border-accent dark:focus:border-accent/80 font-sans transition-all text-theme-text-light dark:text-theme-text-dark"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 text-[12px] font-semibold bg-accent hover:bg-accent-hover text-white dark:bg-accent dark:text-theme-bg-dark dark:hover:bg-accent/80 rounded-md flex items-center gap-1 transition-all shrink-0"
          >
            <Plus size={14} /> Add
          </button>
        </form>
      </div>
    </div>
  );
};
