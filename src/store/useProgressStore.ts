import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface RevisionItem {
  patternId: string;
  problemId: string;
  flaggedAt: number;
  nextReviewAt: number;
  intervalDays: number;
  timesReviewed: number;
  lastRecallQuality?: 'good' | 'okay' | 'bad';
}

export interface DailyLog {
  dsaSolvedCount: number;
  reviewsDoneCount: number;
  rebased?: boolean;
  completed?: boolean;
}

export interface ProgressState {
  dsaProgress: Record<string, boolean>; // key: `${patternId}::${problemId}`
  roadmapProgress: Record<string, boolean>; // key: `${phaseId}::${itemIndex}`
  problemNotes: Record<string, string>; // key: `${patternId}::${problemId}`
  problemFeynman: Record<string, string>; // key: `${patternId}::${problemId}`
  problemTimeTaken: Record<string, number>; // key: `${patternId}::${problemId}`
  revisionQueue: Record<string, RevisionItem>; // key: `${patternId}::${problemId}`
  
  // Everyday Tracker State
  customGoals: string[];
  dailyRitualsChecked: Record<string, boolean>; // key: `${YYYY-MM-DD}::${goalName}`
  dailyLogs: Record<string, DailyLog>; // key: YYYY-MM-DD
  streak: number;
  
  lastTouched: { type: 'dsa' | 'roadmap'; id: string; timestamp: number } | null;
  theme: 'light' | 'dark' | 'system';

  toggleDsaProblem: (patternId: string, problemId: string) => void;
  saveProblemCompletionDetails: (patternId: string, problemId: string, feynman: string, timeTaken: number) => void;
  toggleRoadmapItem: (phaseId: string, itemIndex: number) => void;
  setNote: (patternId: string, problemId: string, note: string) => void;
  toggleRevisionFlag: (patternId: string, problemId: string) => void;
  logRevisionSession: (patternId: string, problemId: string, recall: 'good' | 'okay' | 'bad') => void;
  removeRevisionItem: (patternId: string, problemId: string) => void;
  setReviewDueNow: (patternId: string, problemId: string) => void; // debug helper
  
  // Everyday Tracker Actions
  addCustomGoal: (name: string) => void;
  removeCustomGoal: (name: string) => void;
  toggleCustomGoalChecked: (date: string, name: string) => void;
  triggerDailyRebase: () => void;
  checkDailyCompletion: () => void;
  recalculateStreak: () => void;

  exportProgress: () => string; // returns JSON string
  importProgress: (json: string) => void;
  resetAll: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// Global utility helpers for local YYYY-MM-DD strings
export const getTodayStr = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
};

export const getYesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
};

// Global utility helper to apply theme class
export const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && systemDark);
  
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

// Safe storage wrapper tailored to Zustand's persist configuration
const customZustandStorage = {
  getItem: (name: string): string | null => {
    try {
      const fullKey = `ascent:v1:${name}`;
      return localStorage.getItem(fullKey);
    } catch (e) {
      console.error(`[Zustand Storage] Failed to read key "${name}" from localStorage:`, e);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      const fullKey = `ascent:v1:${name}`;
      localStorage.setItem(fullKey, value);
    } catch (e) {
      console.error(`[Zustand Storage] Failed to write key "${name}" to localStorage:`, e);
    }
  },
  removeItem: (name: string): void => {
    try {
      const fullKey = `ascent:v1:${name}`;
      localStorage.removeItem(fullKey);
    } catch (e) {
      console.error(`[Zustand Storage] Failed to remove key "${name}" from localStorage:`, e);
    }
  }
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      dsaProgress: {},
      roadmapProgress: {},
      problemNotes: {},
      problemFeynman: {},
      problemTimeTaken: {},
      revisionQueue: {},
      
      // Everyday Tracker State
      customGoals: ["Read 5 pages of OS", "Clear Spaced Repetition Queue"],
      dailyRitualsChecked: {},
      dailyLogs: {},
      streak: 0,
      
      lastTouched: null,
      theme: 'system',

      toggleDsaProblem: (patternId, problemId) => {
        const key = `${patternId}::${problemId}`;
        const today = getTodayStr();
        set((state) => {
          const nextProgress = { ...state.dsaProgress };
          const wasChecked = !!nextProgress[key];
          nextProgress[key] = !wasChecked;

          // If unchecking, clear details
          const nextFeynman = { ...state.problemFeynman };
          const nextTime = { ...state.problemTimeTaken };
          const nextLogs = { ...state.dailyLogs };
          
          if (!nextLogs[today]) {
            nextLogs[today] = { dsaSolvedCount: 0, reviewsDoneCount: 0 };
          }
          
          if (wasChecked) {
            delete nextFeynman[key];
            delete nextTime[key];
            nextLogs[today].dsaSolvedCount = Math.max(0, (nextLogs[today].dsaSolvedCount || 0) - 1);
          } else {
            nextLogs[today].dsaSolvedCount = (nextLogs[today].dsaSolvedCount || 0) + 1;
          }

          return {
            dsaProgress: nextProgress,
            problemFeynman: nextFeynman,
            problemTimeTaken: nextTime,
            dailyLogs: nextLogs,
            lastTouched: {
              type: 'dsa',
              id: patternId,
              timestamp: Date.now(),
            },
          };
        });
        
        get().checkDailyCompletion();
      },

      saveProblemCompletionDetails: (patternId, problemId, feynman, timeTaken) => {
        const key = `${patternId}::${problemId}`;
        const today = getTodayStr();
        set((state) => {
          const nextProgress = { ...state.dsaProgress };
          nextProgress[key] = true;

          const nextFeynman = { ...state.problemFeynman };
          if (feynman.trim()) {
            nextFeynman[key] = feynman;
          } else {
            delete nextFeynman[key];
          }

          const nextTime = { ...state.problemTimeTaken };
          if (timeTaken > 0) {
            nextTime[key] = timeTaken;
          } else {
            delete nextTime[key];
          }

          const nextLogs = { ...state.dailyLogs };
          if (!nextLogs[today]) {
            nextLogs[today] = { dsaSolvedCount: 0, reviewsDoneCount: 0 };
          }
          nextLogs[today].dsaSolvedCount = (nextLogs[today].dsaSolvedCount || 0) + 1;

          return {
            dsaProgress: nextProgress,
            problemFeynman: nextFeynman,
            problemTimeTaken: nextTime,
            dailyLogs: nextLogs,
            lastTouched: {
              type: 'dsa',
              id: patternId,
              timestamp: Date.now(),
            },
          };
        });
        
        get().checkDailyCompletion();
      },

      toggleRoadmapItem: (phaseId, itemIndex) => {
        const key = `${phaseId}::${itemIndex}`;
        set((state) => {
          const nextProgress = { ...state.roadmapProgress };
          nextProgress[key] = !nextProgress[key];
          return {
            roadmapProgress: nextProgress,
            lastTouched: {
              type: 'roadmap',
              id: phaseId,
              timestamp: Date.now(),
            },
          };
        });
      },

      setNote: (patternId, problemId, note) => {
        const key = `${patternId}::${problemId}`;
        set((state) => {
          const nextNotes = { ...state.problemNotes };
          if (note.trim() === '') {
            delete nextNotes[key];
          } else {
            nextNotes[key] = note;
          }
          return {
            problemNotes: nextNotes,
            lastTouched: {
              type: 'dsa',
              id: patternId,
              timestamp: Date.now(),
            },
          };
        });
      },

      toggleRevisionFlag: (patternId, problemId) => {
        const key = `${patternId}::${problemId}`;
        set((state) => {
          const nextQueue = { ...state.revisionQueue };
          if (nextQueue[key]) {
            delete nextQueue[key];
          } else {
            nextQueue[key] = {
              patternId,
              problemId,
              flaggedAt: Date.now(),
              nextReviewAt: Date.now(), // Due immediately when bookmarked
              intervalDays: 1,
              timesReviewed: 0,
            };
          }
          return { revisionQueue: nextQueue };
        });
        
        get().checkDailyCompletion();
      },

      logRevisionSession: (patternId, problemId, recall) => {
        const key = `${patternId}::${problemId}`;
        const today = getTodayStr();
        set((state) => {
          const nextQueue = { ...state.revisionQueue };
          const item = nextQueue[key];
          if (!item) return {};

          let factor = 1.0;
          let nextInterval = item.intervalDays;

          if (recall === 'bad') {
            nextInterval = 1;
          } else if (recall === 'okay') {
            factor = 1.5;
            nextInterval = item.timesReviewed === 0 ? 3 : Math.ceil(item.intervalDays * factor);
          } else if (recall === 'good') {
            factor = 2.5;
            nextInterval = item.timesReviewed === 0 ? 7 : Math.ceil(item.intervalDays * factor);
          }

          nextQueue[key] = {
            ...item,
            timesReviewed: item.timesReviewed + 1,
            intervalDays: nextInterval,
            nextReviewAt: Date.now() + nextInterval * 24 * 60 * 60 * 1000,
            lastRecallQuality: recall,
          };

          const nextLogs = { ...state.dailyLogs };
          if (!nextLogs[today]) {
            nextLogs[today] = { dsaSolvedCount: 0, reviewsDoneCount: 0 };
          }
          nextLogs[today].reviewsDoneCount = (nextLogs[today].reviewsDoneCount || 0) + 1;

          return {
            revisionQueue: nextQueue,
            dailyLogs: nextLogs
          };
        });
        
        get().checkDailyCompletion();
      },

      removeRevisionItem: (patternId, problemId) => {
        const key = `${patternId}::${problemId}`;
        set((state) => {
          const nextQueue = { ...state.revisionQueue };
          delete nextQueue[key];
          return { revisionQueue: nextQueue };
        });
        
        get().checkDailyCompletion();
      },

      setReviewDueNow: (patternId, problemId) => {
        const key = `${patternId}::${problemId}`;
        set((state) => {
          const nextQueue = { ...state.revisionQueue };
          if (nextQueue[key]) {
            nextQueue[key] = {
              ...nextQueue[key],
              nextReviewAt: Date.now() - 60 * 1000, // due now
            };
          }
          return { revisionQueue: nextQueue };
        });
        
        get().checkDailyCompletion();
      },

      // Everyday Tracker Actions
      addCustomGoal: (name) => {
        if (!name.trim()) return;
        set((state) => {
          if (state.customGoals.includes(name)) return {};
          return { customGoals: [...state.customGoals, name] };
        });
        get().checkDailyCompletion();
      },

      removeCustomGoal: (name) => {
        set((state) => {
          // Clean checked entries for this goal
          const nextChecked = { ...state.dailyRitualsChecked };
          Object.keys(nextChecked).forEach((k) => {
            if (k.endsWith(`::${name}`)) {
              delete nextChecked[k];
            }
          });
          return {
            customGoals: state.customGoals.filter((g) => g !== name),
            dailyRitualsChecked: nextChecked
          };
        });
        get().checkDailyCompletion();
      },

      toggleCustomGoalChecked: (date, name) => {
        const key = `${date}::${name}`;
        set((state) => {
          const nextChecked = { ...state.dailyRitualsChecked };
          nextChecked[key] = !nextChecked[key];
          return { dailyRitualsChecked: nextChecked };
        });
        get().checkDailyCompletion();
      },

      triggerDailyRebase: () => {
        const today = getTodayStr();
        const yesterday = getYesterdayStr();
        set((state) => {
          const nextLogs = { ...state.dailyLogs };
          
          if (!nextLogs[today]) {
            nextLogs[today] = { dsaSolvedCount: 0, reviewsDoneCount: 0 };
          }
          if (!nextLogs[yesterday]) {
            nextLogs[yesterday] = { dsaSolvedCount: 0, reviewsDoneCount: 0 };
          }

          // Mark yesterday saved by rebase
          nextLogs[yesterday].rebased = true;
          nextLogs[yesterday].completed = true;

          // Double today's requirements
          nextLogs[today].rebased = true;

          return { dailyLogs: nextLogs };
        });
        get().checkDailyCompletion();
      },

      checkDailyCompletion: () => {
        const today = getTodayStr();
        set((state) => {
          const nextLogs = { ...state.dailyLogs };
          if (!nextLogs[today]) {
            nextLogs[today] = { dsaSolvedCount: 0, reviewsDoneCount: 0 };
          }

          const log = nextLogs[today];

          // 1. DSA Met (target 1, or 2 if rebased)
          const targetDsa = log.rebased ? 2 : 1;
          const dsaMet = (log.dsaSolvedCount || 0) >= targetDsa;

          // 2. Reviews Met (no pending items in queue)
          const dueCount = Object.values(state.revisionQueue || {}).filter(
            (item) => item.nextReviewAt <= Date.now() + 60 * 1000
          ).length;
          const reviewsMet = dueCount === 0;

          // 3. Custom Goals Met
          const customMet = state.customGoals.every(
            (goal) => !!state.dailyRitualsChecked[`${today}::${goal}`]
          );

          const nowComplete = dsaMet && reviewsMet && customMet;
          
          if (log.completed !== nowComplete) {
            log.completed = nowComplete;
            return { dailyLogs: nextLogs };
          }

          return {};
        });

        get().recalculateStreak();
      },

      recalculateStreak: () => {
        set((state) => {
          const logs = state.dailyLogs;
          const today = getTodayStr();
          const yesterday = getYesterdayStr();

          const isDateMet = (dateStr: string) => {
            const log = logs[dateStr];
            return log ? !!log.completed : false;
          };

          let currentStreak = 0;
          let date = new Date();

          if (isDateMet(today)) {
            currentStreak = 1;
            while (true) {
              date.setDate(date.getDate() - 1);
              const prevStr = date.toISOString().slice(0, 10);
              if (isDateMet(prevStr)) {
                currentStreak++;
              } else {
                break;
              }
            }
          } else if (isDateMet(yesterday)) {
            currentStreak = 1;
            date.setDate(date.getDate() - 1); // start from yesterday
            while (true) {
              date.setDate(date.getDate() - 1);
              const prevStr = date.toISOString().slice(0, 10);
              if (isDateMet(prevStr)) {
                currentStreak++;
              } else {
                break;
              }
            }
          } else {
            currentStreak = 0;
          }

          return { streak: currentStreak };
        });
      },

      exportProgress: () => {
        const { dsaProgress, roadmapProgress, problemNotes, problemFeynman, problemTimeTaken, revisionQueue, customGoals, dailyRitualsChecked, dailyLogs, streak, theme } = get();
        return JSON.stringify({
          dsaProgress,
          roadmapProgress,
          problemNotes,
          problemFeynman,
          problemTimeTaken,
          revisionQueue,
          customGoals,
          dailyRitualsChecked,
          dailyLogs,
          streak,
          theme,
          exportedAt: Date.now(),
          app: "ascent"
        }, null, 2);
      },

      importProgress: (json) => {
        try {
          const data = JSON.parse(json);
          if (data && typeof data === 'object') {
            set({
              dsaProgress: data.dsaProgress || {},
              roadmapProgress: data.roadmapProgress || {},
              problemNotes: data.problemNotes || {},
              problemFeynman: data.problemFeynman || {},
              problemTimeTaken: data.problemTimeTaken || {},
              revisionQueue: data.revisionQueue || {},
              customGoals: data.customGoals || [],
              dailyRitualsChecked: data.dailyRitualsChecked || {},
              dailyLogs: data.dailyLogs || {},
              streak: data.streak || 0,
              theme: data.theme || 'system',
            });
            applyTheme(data.theme || 'system');
          } else {
            throw new Error("Invalid format");
          }
        } catch (e) {
          console.error("Failed to import progress", e);
          throw new Error("Could not parse file. Verify it is a valid exported JSON progress file.");
        }
      },

      resetAll: () => {
        set({
          dsaProgress: {},
          roadmapProgress: {},
          problemNotes: {},
          problemFeynman: {},
          problemTimeTaken: {},
          revisionQueue: {},
          customGoals: ["Read 5 pages of OS", "Clear Spaced Repetition Queue"],
          dailyRitualsChecked: {},
          dailyLogs: {},
          streak: 0,
          theme: 'system',
        });
        applyTheme('system');
      },

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
    }),
    {
      name: 'ascent-storage',
      storage: createJSONStorage(() => customZustandStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      }
    }
  )
);
