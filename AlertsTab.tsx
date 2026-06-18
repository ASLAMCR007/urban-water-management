import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, ShieldAlert, Sliders, Check, Octagon, Flame, Wrench, Siren, SlidersHorizontal, Trash2 } from 'lucide-react';
import { SystemLog, SystemState } from '../types';

interface AlertsTabProps {
  state: SystemState;
  onChangeState: (updater: (prev: SystemState) => SystemState) => void;
  onOpenSimulation: () => void;
}

export default function AlertsTab({ state, onChangeState, onOpenSimulation }: AlertsTabProps) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'system'>('all');

  // Filter logs that are not dismissed
  const logs = state.logs.filter((l) => !l.dismissed);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

  const activeCriticalCount = logs.filter((l) => l.type === 'critical' && !l.acknowledged).length;

  const handleManualAction = (logId: string, actionType: string) => {
    if (actionType === 'shut_off') {
      onChangeState((prev) => ({
        ...prev,
        valveShutOff: !prev.valveShutOff,
        logs: prev.logs.map((log) =>
          log.id === logId ? { ...log, acknowledged: true } : log
        )
      }));
    } else if (actionType === 'adjust_dosing') {
      onChangeState((prev) => ({
        ...prev,
        quality: { ...prev.quality, ph: { ...prev.quality.ph, value: 7.2 } },
        logs: prev.logs.map((log) =>
          log.id === logId ? { ...log, acknowledged: true } : log
        )
      }));
    } else {
      onChangeState((prev) => ({
        ...prev,
        logs: prev.logs.map((log) =>
          log.id === logId ? { ...log, acknowledged: true } : log
        )
      }));
    }
  };

  const handleDismissLog = (logId: string) => {
    onChangeState((prev) => ({
      ...prev,
      logs: prev.logs.map((log) =>
        log.id === logId ? { ...log, dismissed: true } : log
      )
    }));
  };

  // Helper to map icon names
  const renderLogIcon = (iconName: string, type: string) => {
    const cls = type === 'critical' ? 'text-error' : type === 'warning' ? 'text-secondary' : 'text-tertiary';
    if (iconName === 'water_drop') return <Flame className={`h-5 w-5 ${cls}`} />;
    if (iconName === 'warning') return <ShieldAlert className={`h-5 w-5 ${cls}`} />;
    if (iconName === 'science') return <SlidersHorizontal className={`h-5 w-5 ${cls}`} />;
    return <Wrench className={`h-5 w-5 ${cls}`} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 animate-fade-in"
    >
      {/* Title & Badge */}
      <div className="flex justify-between items-end mb-1">
        <div>
          <h1 className="font-headline text-3xl font-light text-on-surfaces uppercase tracking-wide">System Logs</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1 uppercase tracking-wider">Real-time telemetry reports, alerts, and notifications.</p>
        </div>

        {activeCriticalCount > 0 && (
          <div className="text-right hidden sm:block">
            <div className="font-headline text-5xl font-light text-error leading-none">{activeCriticalCount}</div>
            <div className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">Active Critical</div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-outline-variant">
        {(['all', 'critical', 'warning', 'system'] as const).map((tab) => {
          const isActive = filter === tab;
          let label = tab.charAt(0).toUpperCase() + tab.slice(1);
          let dotColor = '';

          if (tab === 'critical') dotColor = 'bg-error';
          if (tab === 'warning') dotColor = 'bg-cyan-500';
          if (tab === 'system') dotColor = 'bg-green-400';

          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border ${
                isActive
                  ? 'bg-cyan-500 border-cyan-500 text-black font-bold neon-border'
                  : 'glass border-outline-variant text-on-surface-variant hover:bg-white/5 hover:text-on-surfaces'
              }`}
            >
              {dotColor && <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>}
              {label}
            </button>
          );
        })}

        <button
          onClick={onOpenSimulation}
          className="ml-auto flex items-center gap-1.5 text-xs text-cyan-400 hover:underline cursor-pointer font-mono uppercase tracking-widest font-bold whitespace-nowrap"
        >
          <Sliders className="h-4 w-4" /> Sandbox
        </button>
      </div>

      {/* Notification list container */}
      <div className="flex flex-col gap-4 min-h-[300px]">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center glass rounded-2xl border border-outline-variant/60">
            <Check className="h-10 w-10 text-cyan-400 mb-3 bg-white/5 border border-white/10 rounded-full p-2" />
            <h3 className="font-headline text-lg font-bold text-on-surfaces uppercase tracking-wide">All Systems Optimal</h3>
            <p className="font-mono text-xs text-on-surface-variant max-w-xs mt-2 uppercase tracking-wide leading-relaxed">
              No active alerts matching this filter. Try simulated triggers in the sandbox.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredLogs.map((log) => {
              const matchesValveOffline = state.valveShutOff && log.actionRequired?.type === 'shut_off';
              return (
                <motion.article
                  key={log.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`glass rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:border-cyan-500/40 ${
                    log.type === 'critical'
                      ? 'border-error border-l-4'
                      : log.type === 'warning'
                      ? 'border-outline-variant border-l-4 border-l-cyan-500'
                      : 'border-outline-variant hover:border-cyan-500/30'
                  }`}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none">
                    {renderLogIcon(log.iconName, log.type)}
                  </div>

                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0">{renderLogIcon(log.iconName, log.type)}</span>
                      <span className={`font-mono text-[10px] uppercase font-bold tracking-widest ${
                        log.type === 'critical'
                          ? 'text-error'
                          : log.type === 'warning'
                          ? 'text-cyan-400'
                          : 'text-green-400'
                      }`}>
                        {log.category}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-on-surface-variant uppercase">{log.timeLabel}</span>
                  </div>

                  <h3 className="font-headline text-lg font-bold text-on-surfaces mb-1 relative z-10 uppercase tracking-wide">
                    {log.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-4 relative z-10 leading-relaxed max-w-2xl">
                    {log.description}
                  </p>

                  <div className="flex flex-wrap gap-2 relative z-10">
                    {log.actionRequired && (
                      <>
                        <button
                          onClick={() => handleManualAction(log.id, log.actionRequired!.type)}
                          disabled={log.acknowledged || matchesValveOffline}
                          className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold select-none flex items-center gap-2 active:scale-95 transition-transform ${
                            log.acknowledged || matchesValveOffline
                              ? 'bg-white/5 text-on-surface-variant border border-outline-variant cursor-not-allowed'
                              : log.type === 'critical'
                              ? 'bg-error text-white hover:bg-error/80 cursor-pointer'
                              : 'bg-cyan-600 text-black hover:bg-cyan-500 cursor-pointer neon-border'
                          }`}
                        >
                          {log.acknowledged || matchesValveOffline ? (
                            <>
                              <Check className="h-3.5 w-3.5" /> Action Commenced
                            </>
                          ) : (
                            <>
                              {log.actionRequired.label}
                            </>
                          )}
                        </button>

                        {log.actionRequired.secondaryLabel && (
                          <button
                            onClick={() => handleDismissLog(log.id)}
                            className="border border-white/10 hover:bg-white/5 text-on-surfaces px-4 py-2.5 rounded-xl font-mono text-xs cursor-pointer active:scale-95 transition-transform font-bold uppercase tracking-widest"
                          >
                            {log.actionRequired.secondaryLabel}
                          </button>
                        )}
                      </>
                    )}

                    {!log.actionRequired && (
                      <button
                        onClick={() => handleDismissLog(log.id)}
                        className="text-on-surface-variant font-mono text-xs hover:text-cyan-400 hover:underline px-2 py-1 flex items-center gap-1.5 ml-auto cursor-pointer uppercase tracking-widest"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Hide alert
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
