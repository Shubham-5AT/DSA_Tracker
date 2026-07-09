import React, { useState } from 'react';
import { useProgressStore } from '../store/useProgressStore';
import { 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  AlertTriangle,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, setTheme, exportProgress, importProgress, resetAll } = useProgressStore();

  // Reset confirmation state
  const [resetConfirmation, setResetConfirmation] = useState('');
  const [showResetWarning, setShowResetWarning] = useState(false);

  // Import Status
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleExport = () => {
    try {
      const json = exportProgress();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ascent-progress-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportStatus(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        importProgress(text);
        setImportStatus({ success: true, message: 'Progress loaded successfully.' });
        // Clear status after delay
        setTimeout(() => setImportStatus(null), 3000);
      } catch (err: any) {
        setImportStatus({ success: false, message: err.message || 'Import failed.' });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (resetConfirmation.trim().toLowerCase() === 'reset') {
      resetAll();
      setResetConfirmation('');
      setShowResetWarning(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Info */}
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.15em] text-theme-muted-light dark:text-theme-muted-dark font-medium font-sans">Configuration</p>
        <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-theme-text-light dark:text-theme-text-dark font-medium">
          Settings
        </h1>
      </div>

      {/* Settings Grid / Sections */}
      <div className="space-y-8 divide-y divide-theme-border-light dark:divide-theme-border-dark">
        {/* Theme Settings Row */}
        <div className="py-6 first:pt-0 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1 max-w-[400px]">
            <h3 className="text-[14px] font-medium text-theme-text-light dark:text-theme-text-dark">Appearance</h3>
            <p className="text-[12px] text-theme-muted-light dark:text-theme-muted-dark">
              Customize the look and feel of the Ascent dashboard. The system mode matches your OS preferences.
            </p>
          </div>
          
          <div className="flex bg-theme-text-light/5 dark:bg-theme-text-dark/5 p-1 rounded-md shrink-0 self-start md:self-auto">
            {(['light', 'dark', 'system'] as const).map((t) => {
              const Icon = t === 'light' ? Sun : t === 'dark' ? Moon : Monitor;
              const isActive = theme === t;
              return (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-[12px] rounded font-medium transition-all ${
                    isActive 
                      ? 'bg-theme-bg-light dark:bg-theme-bg-dark text-accent dark:text-accent/90 shadow-subtle' 
                      : 'text-theme-muted-light hover:text-theme-text-light dark:text-theme-muted-dark dark:hover:text-theme-text-dark'
                  }`}
                >
                  <Icon size={14} />
                  <span className="capitalize">{t}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Data Sync Row */}
        <div className="py-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1 max-w-[400px]">
            <h3 className="text-[14px] font-medium text-theme-text-light dark:text-theme-text-dark">Backup & Sync</h3>
            <p className="text-[12px] text-theme-muted-light dark:text-theme-muted-dark">
              Export your progress as a static JSON file or restore records from a previously exported backup file.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-start md:self-auto w-full sm:w-auto">
            {/* Export */}
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-4 py-2 text-[12px] font-medium border border-theme-border-light dark:border-theme-border-dark hover:border-theme-text-light/20 dark:hover:border-theme-text-dark/20 text-theme-text-light dark:text-theme-text-dark rounded transition-all bg-theme-text-light/[0.01] dark:bg-theme-text-dark/[0.01]"
            >
              <Download size={14} /> Export Backup
            </button>

            {/* Import file upload label */}
            <label className="flex items-center justify-center gap-2 px-4 py-2 text-[12px] font-medium border border-theme-border-light dark:border-theme-border-dark hover:border-theme-text-light/20 dark:hover:border-theme-text-dark/20 text-theme-text-light dark:text-theme-text-dark rounded cursor-pointer transition-all bg-theme-text-light/[0.01] dark:bg-theme-text-dark/[0.01]">
              <Upload size={14} /> Import Backup
              <input 
                type="file" 
                accept=".json"
                onChange={handleImport}
                className="hidden" 
              />
            </label>
          </div>
        </div>

        {/* Import Messages Alert block */}
        {importStatus && (
          <div className={`p-4 border rounded-md text-[13px] ${
            importStatus.success 
              ? 'bg-badge-easy-bgLight dark:bg-badge-easy-bgDark border-badge-easy-borderLight text-badge-easy-text' 
              : 'bg-badge-hard-bgLight dark:bg-badge-hard-bgDark border-badge-hard-borderLight text-badge-hard-text'
          }`}>
            <p className="flex items-center gap-2">
              {importStatus.success ? <Check size={16} /> : <AlertTriangle size={16} />}
              {importStatus.message}
            </p>
          </div>
        )}

        {/* Reset progress Row */}
        <div className="py-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-1 max-w-[400px]">
            <h3 className="text-[14px] font-medium text-badge-hard-text">Danger Zone</h3>
            <p className="text-[12px] text-theme-muted-light dark:text-theme-muted-dark">
              Irreversibly erase all checked problems, saved personal notes, and roadmap statuses from localStorage.
            </p>
          </div>

          <div className="self-start md:self-auto shrink-0 space-y-3 w-full sm:w-80">
            {!showResetWarning ? (
              <button
                onClick={() => setShowResetWarning(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[12px] font-semibold text-badge-hard-text hover:text-white border border-badge-hard-text/20 dark:border-badge-hard-text/30 hover:border-badge-hard-text hover:bg-badge-hard-text rounded transition-all"
              >
                <Trash2 size={14} /> Clear All Progress
              </button>
            ) : (
              <div className="p-4 border border-badge-hard-borderLight dark:border-badge-hard-borderDark bg-badge-hard-bgLight dark:bg-badge-hard-bgDark rounded-lg space-y-3.5">
                <p className="text-[11px] text-badge-hard-text font-medium flex items-center gap-1.5">
                  <AlertTriangle size={14} /> This action cannot be undone.
                </p>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-theme-muted-light dark:text-theme-muted-dark block">
                    Type "reset" to confirm
                  </label>
                  <input
                    type="text"
                    placeholder="reset"
                    value={resetConfirmation}
                    onChange={(e) => setResetConfirmation(e.target.value)}
                    className="w-full px-3 py-1.5 text-[13px] bg-theme-bg-light dark:bg-theme-bg-dark border border-badge-hard-borderLight dark:border-badge-hard-borderDark rounded focus:outline-none focus:border-badge-hard-text text-theme-text-light dark:text-theme-text-dark font-sans"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    disabled={resetConfirmation.toLowerCase() !== 'reset'}
                    className={`flex-1 px-3 py-1.5 text-[11px] font-semibold text-white rounded transition-all ${
                      resetConfirmation.toLowerCase() === 'reset' 
                        ? 'bg-badge-hard-text hover:bg-badge-hard-text/90' 
                        : 'bg-theme-muted-light/30 dark:bg-theme-muted-dark/30 cursor-not-allowed text-theme-muted-light dark:text-theme-muted-dark'
                    }`}
                  >
                    Clear Everything
                  </button>
                  <button
                    onClick={() => {
                      setShowResetWarning(false);
                      setResetConfirmation('');
                    }}
                    className="px-3 py-1.5 text-[11px] font-semibold border border-theme-border-light dark:border-theme-border-dark text-theme-text-light dark:text-theme-text-dark rounded hover:bg-theme-text-light/5 dark:hover:bg-theme-text-dark/5 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
