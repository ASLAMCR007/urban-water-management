import { AlertTriangle, Power, Sliders, RotateCcw, Droplets } from 'lucide-react';
import { SystemState } from '../types';

interface SimulationControlsProps {
  state: SystemState;
  onChangeState: (updater: (prev: SystemState) => SystemState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SimulationControls({ state, onChangeState, isOpen, onClose }: SimulationControlsProps) {
  if (!isOpen) return null;

  const triggerLeak = () => {
    onChangeState((prev) => {
      const alreadyHas = prev.logs.some((l) => l.title === 'Pressure Drop - Village 2' && !l.dismissed);
      let updatedLogs = [...prev.logs];
      if (!alreadyHas) {
        updatedLogs.unshift({
          id: `log-${Date.now()}`,
          type: 'critical',
          category: 'CRITICAL PRIORITY',
          title: 'Pressure Drop - Village 2',
          description: 'Sudden drop of 15 PSI detected in main supply line. Flow velocity indicates a potential major rupture or unauthorized diversion.',
          timestamp: 'Today',
          timeLabel: '10:42 AM',
          iconName: 'water_drop',
          actionRequired: {
            type: 'shut_off',
            label: 'Shut Off Valve',
            secondaryLabel: 'Dispatch Crew'
          },
          acknowledged: false,
          dismissed: false,
          nodeId: 'NODE-04C'
        });
      }
      return {
        ...prev,
        logs: updatedLogs,
        pipelines: prev.pipelines.map((p) =>
          p.id === 'NODE-04C' ? { ...p, flowRate: 8.2, status: 'drop', health: 'alert' } : p
        )
      };
    });
  };

  const triggerTurbiditySpike = () => {
    onChangeState((prev) => {
      const alreadyHas = prev.logs.some((l) => l.title === 'Turbidity Level Violation' && !l.dismissed);
      let updatedLogs = [...prev.logs];
      if (!alreadyHas) {
        updatedLogs.unshift({
          id: `log-${Date.now()}`,
          type: 'warning',
          category: 'QUALITY WARNING',
          title: 'Turbidity Level Violation',
          description: 'Sensors report turbidity at 5.8 NTU in treatment plant B output. Exceeds standard limit.',
          timestamp: 'Today',
          timeLabel: 'Just Now',
          iconName: 'opacity',
          acknowledged: false,
          dismissed: false
        });
      }
      return {
        ...prev,
        logs: updatedLogs,
        quality: {
          ...prev.quality,
          turbidity: { ...prev.quality.turbidity, value: 5.8 }
        }
      };
    });
  };

  const adjustReservoir = (val: number) => {
    onChangeState((prev) => ({
      ...prev,
      reservoirLevel: val
    }));
  };

  const resetSimulation = () => {
    onChangeState((prev) => ({
      ...prev,
      reservoirLevel: 82,
      valveShutOff: false,
      pipelines: [
        { id: 'NODE-01A', name: 'Village 1 Supply', flowRate: 45.2, status: 'stable', health: 'optimal' },
        { id: 'NODE-02B', name: 'Village 2 Trunk', flowRate: 38.7, status: 'stable', health: 'optimal' },
        { id: 'NODE-04C', name: 'Sector B Distribution', flowRate: 12.1, status: 'drop', health: 'alert' }
      ],
      quality: {
        ph: {
          value: 7.2,
          trend: 0.1,
          history: prev.quality.ph.history
        },
        turbidity: {
          value: 1.2,
          maxSafe: 5.0
        },
        tds: {
          value: 210,
          status: 'optimal'
        },
        chlorine: {
          value: 0.8,
          min: 0.2,
          max: 2.0
        }
      },
      logs: prev.logs.map((log) => ({
        ...log,
        acknowledged: false,
        dismissed: false
      }))
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass max-w-md w-full rounded-2xl p-6 shadow-xl relative animate-in fade-in zoom-in duration-200 neon-border">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-cyan-400" />
            <h3 className="font-headline font-light uppercase tracking-wider text-on-surfaces text-lg">Simulation Sandbox</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-white/5 rounded-full p-1.5 transition-colors font-headline font-bold">
            ✕
          </button>
        </div>

        <p className="font-sans text-xs text-on-surface-variant mb-6 uppercase tracking-wider leading-relaxed">
          Toggle events below to observe reactively updated system logs, status alerts, sparklines, and map diagnostics.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block font-mono text-[9px] text-on-surface-variant uppercase tracking-widest mb-2 font-bold">
              Reservoir Level ({state.reservoirLevel}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={state.reservoirLevel}
              onChange={(e) => adjustReservoir(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="pt-2">
            <label className="block font-mono text-[9px] text-on-surface-variant uppercase tracking-widest mb-2 font-bold">Simulate Situations</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={triggerLeak}
                className="flex items-center justify-center gap-2 border border-error/40 text-error hover:bg-error/10 px-3 py-2.5 rounded-xl active:scale-95 transition-transform text-xs font-mono uppercase font-bold tracking-wider"
              >
                <AlertTriangle className="h-4 w-4" />
                Village 2 Leak
              </button>

              <button
                onClick={triggerTurbiditySpike}
                className="flex items-center justify-center gap-2 border border-cyan-500/40 text-cyan-400 hover:bg-white/5 px-3 py-2.5 rounded-xl active:scale-95 transition-transform text-xs font-mono uppercase font-bold tracking-wider"
              >
                <Droplets className="h-4 w-4" />
                NTU Spike
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex gap-3">
            <button
              onClick={() => {
                onChangeState((prev) => ({ ...prev, valveShutOff: !prev.valveShutOff }));
              }}
              className={`flex-1 flex items-center justify-center gap-2 border px-3 py-2.5 rounded-xl active:scale-95 transition-transform text-xs font-mono uppercase font-bold tracking-wider ${
                state.valveShutOff
                  ? 'bg-error text-white border-error'
                  : 'border-white/10 text-on-surfaces hover:bg-white/5'
              }`}
            >
              <Power className="h-4 w-4" />
              {state.valveShutOff ? 'Valve: Closed' : 'Valve: Open'}
            </button>

            <button
              onClick={resetSimulation}
              className="flex-1 flex items-center justify-center gap-2 border border-white/10 text-on-surface-variant hover:bg-white/5 px-3 py-2.5 rounded-xl active:scale-95 transition-transform text-xs font-mono uppercase font-bold tracking-wider"
            >
              <RotateCcw className="h-4 w-4" />
              Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
