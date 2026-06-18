import { motion } from 'motion/react';
import { ArrowUpDown, Activity, CheckCircle2, AlertOctagon, Map, BarChart3, Headphones, Sliders } from 'lucide-react';
import { SystemState } from '../types';

interface HomeTabProps {
  state: SystemState;
  onSwitchTab: (tab: string) => void;
  onOpenSimulation: () => void;
}

export default function HomeTab({ state, onSwitchTab, onOpenSimulation }: HomeTabProps) {
  const activeAlerts = state.logs.filter((l) => !l.acknowledged && !l.dismissed && l.type === 'critical');
  const isHealthy = activeAlerts.length === 0 && !state.valveShutOff;

  // Let's compute a dynamic daily flow depending on simulated states
  const displayDailyFlow = state.valveShutOff ? '31.4k' : '45.2k';

  // Bar heights for the hourly chart
  const barHeights = state.valveShutOff
    ? [25, 35, 45, 55, 40, 30, 20] // dropped flow rates
    : [40, 60, 80, 100, 70, 50, 30];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 animate-fade-in"
    >
      {/* Summary Cards Grid */}
      <section aria-label="System Summary" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Daily Flow Card */}
        <div className="glass rounded-2xl p-6 flex flex-col justify-between neon-border relative overflow-hidden group hover:border-cyan-500/70 transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">Total Daily Flow</span>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
          </div>
          <div className="font-headline text-4xl font-light tracking-tighter text-on-surfaces mb-2">
            {displayDailyFlow} <span className="text-sm text-cyan-500 mb-1">L</span>
          </div>
          <div className="w-full h-8 mt-1">
            <svg className="w-full h-full stroke-cyan-500 fill-none stroke-2" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path
                className="sparkline-path"
                d="M0,15 Q10,5 20,12 T40,6 T60,17 T80,7 T100,12"
              ></path>
            </svg>
          </div>
        </div>

        {/* Reservoir Level Card */}
        <div className="glass rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/70 transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">Reservoir Level</span>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40"></div>
          </div>
          <div className="font-headline text-4xl font-light tracking-tighter text-on-surfaces mb-2">
            {state.reservoirLevel}<span className="text-sm text-cyan-500 mb-1">%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${state.reservoirLevel}%` }}
            ></div>
          </div>
        </div>

        {/* System Health Card */}
        <div className="glass rounded-2xl p-6 flex items-center justify-between group hover:border-cyan-500/70 transition-all">
          <div>
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">System Health</span>
            <span className={`font-headline text-2xl font-bold ${isHealthy ? 'text-cyan-400' : 'text-error'}`}>
              {isHealthy ? 'OPTIMAL' : `${activeAlerts.length} ALERTS`}
            </span>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 duration-200 ${isHealthy ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-error-container'}`}>
            {isHealthy ? (
              <CheckCircle2 className="h-6 w-6 text-cyan-400" />
            ) : (
              <AlertOctagon className="h-6 w-6 text-error fill-current text-white" />
            )}
          </div>
        </div>
      </section>

      {/* Real-time Chart Section */}
      <section aria-label="Hourly Flow Visualization" className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-on-surfaces">Hourly Flow Rate</h2>
          <span className="font-mono text-xs text-cyan-400 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 animate-pulse" /> LIVE_TELEMETRY
          </span>
        </div>

        <div className="w-full h-48 bg-white/5 rounded-xl border border-white/10 relative flex items-end p-2 gap-2">
          {barHeights.map((ht, idx) => (
            <div
              key={idx}
              className={`flex-1 rounded-t-sm transition-all duration-500 cursor-pointer ${
                idx === 3 ? 'bg-cyan-500' : 'bg-white/10 hover:bg-white/20'
              }`}
              style={{ height: `${ht}%` }}
              title={`Flow index: ${ht}`}
            ></div>
          ))}

          {/* Grid lines inside chart */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-2 border-l border-b border-white/5">
            <div className="w-full h-px bg-white/5"></div>
            <div className="w-full h-px bg-white/5"></div>
            <div className="w-full h-px bg-white/5"></div>
            <div className="w-full h-px"></div>
          </div>
        </div>

        <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant font-mono">
          <span>08:00</span>
          <span>10:00</span>
          <span>12:00</span>
          <span>14:00</span>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section aria-label="Quick Actions">
        <h3 className="font-mono text-[10px] text-on-surface-variant uppercase mb-3 px-1 tracking-widest">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onSwitchTab('map')}
            className="glass rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-cyan-500/40 transition-all active:scale-95 cursor-pointer"
          >
            <Map className="h-5 w-5 text-cyan-400" />
            <span className="text-xs text-on-surfaces text-center font-bold uppercase tracking-wider">Map view</span>
          </button>

          <button
            onClick={onOpenSimulation}
            className="glass rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-cyan-500/40 transition-all active:scale-95 cursor-pointer"
          >
            <Sliders className="h-5 w-5 text-cyan-400" />
            <span className="text-xs text-on-surfaces text-center font-bold uppercase tracking-wider">Simulation</span>
          </button>

          <button
            onClick={() => onSwitchTab('alerts')}
            className="glass rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-cyan-500/40 transition-all active:scale-95 cursor-pointer"
          >
            <Headphones className="h-5 w-5 text-cyan-400" />
            <span className="text-xs text-on-surfaces text-center font-bold uppercase tracking-wider">Log Stream</span>
          </button>
        </div>
      </section>
    </motion.div>
  );
}
