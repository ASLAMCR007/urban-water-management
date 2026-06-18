import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Info, Sliders, CheckCircle2, AlertOctagon, Droplets, Waves, ShieldAlert, Radio } from 'lucide-react';
import { SystemState, PipelineNode } from '../types';

interface MapTabProps {
  state: SystemState;
  onChangeState: (updater: (prev: SystemState) => SystemState) => void;
}

export default function MapTab({ state, onChangeState }: MapTabProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('NODE-04C');

  const selectedNode = state.pipelines.find((p) => p.id === selectedNodeId) || state.pipelines[0];

  const handleToggleNodeHealth = (nodeId: string) => {
    onChangeState((prev) => ({
      ...prev,
      pipelines: prev.pipelines.map((p) =>
        p.id === nodeId
          ? {
              ...p,
              health: p.health === 'optimal' ? 'alert' : 'optimal',
              flowRate: p.health === 'optimal' ? 8.5 : 45.2
            }
          : p
      )
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 animate-fade-in"
    >
      <div>
        <h1 className="font-headline text-3xl font-light text-on-surfaces uppercase tracking-wide">Geographic Sensor Map</h1>
        <p className="font-mono text-xs text-on-surface-variant mt-1 uppercase tracking-wider">Live distribution network tracking, pressure sensors, and pipeline safety views.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Geographic interactive vector outline container */}
        <div className="lg:col-span-8 glass border border-outline-variant rounded-2xl overflow-hidden relative min-h-[420px] shadow-lg shadow-cyan-500/5">
          <div className="absolute top-4 left-4 z-10 bg-[#050505]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-md">
            <div className="font-mono text-xs text-cyan-400 font-bold flex items-center gap-1.5 uppercase tracking-widest">
              <Radio className="h-4 w-4 animate-ping text-cyan-500" /> Network Map Live
            </div>
            <div className="text-[10px] text-on-surface-variant mt-1 font-mono uppercase">Select pins below to view node details</div>
          </div>

          <div className="w-full h-[420px] pointer-events-auto relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3ijJnmSEdOY8Gj_kO0ut1fcMWmUNlQUp0PfJDT67zdzNuVoM1x7g_vHK-IAM8J7XxcUtWPmVgwGInOySbrm-ZM7cS_YX_XS_Lq0bvSW0q18wHz6Zs7u9J7gfmS-eqVrNvzupYABlbrLhHJ766wC3x06oXjlVEVAbm4yOVLjc6Y3sFGjIOJPFT1vK0OAakxgltZAyKdxXU50g3NXXqxPxEAnspb2A-u4DitEYHDGLZoDcSGm-Dj6QSr7HzyGa7Ccp9kuh8ESlyO9na"
              alt="Hydrologic Map Grid"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-30"
            />

            <div className="absolute inset-0">
              {/* Animated Pipe Flow Line 1 */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 50 120 Q 200 180 320 230"
                  fill="none"
                  stroke={state.valveShutOff ? '#72787f' : '#06b6d4'}
                  strokeDasharray="5,5"
                  strokeWidth="2"
                  className={state.valveShutOff ? '' : 'pulse-animation'}
                ></path>

                <path
                  d="M 320 230 Q 420 280 500 350"
                  fill="none"
                  stroke={state.valveShutOff ? '#72787f' : '#06b6d4'}
                  strokeDasharray="5,5"
                  strokeWidth="2"
                  className={state.valveShutOff ? '' : 'pulse-animation'}
                ></path>
              </svg>

              {/* Pin NODE-01A (Village 1) */}
              <button
                onClick={() => setSelectedNodeId('NODE-01A')}
                className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group focus:outline-none"
              >
                <div className={`w-8 h-8 rounded-full border-2 border-outline flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 ${
                  selectedNodeId === 'NODE-01A' ? 'bg-cyan-500 ring-4 ring-cyan-500/20 text-black' : 'bg-white/5 border border-white/10 text-cyan-400'
                }`}>
                  <Waves className="h-4 w-4" />
                </div>
                <div className="mt-1.5 font-mono text-[9px] bg-[#050505]/95 border border-white/10 px-1.5 py-0.5 rounded shadow-sm text-cyan-400 font-bold uppercase">
                  N-01A
                </div>
              </button>

              {/* Pin NODE-02B (Village 2) */}
              <button
                onClick={() => setSelectedNodeId('NODE-02B')}
                className="absolute top-[42%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group focus:outline-none"
              >
                <div className={`w-8 h-8 rounded-full border-2 border-outline flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 ${
                  selectedNodeId === 'NODE-02B' ? 'bg-cyan-500 ring-4 ring-cyan-500/20 text-black' : 'bg-white/5 border border-white/10 text-cyan-400'
                }`}>
                  <Waves className="h-4 w-4" />
                </div>
                <div className="mt-1.5 font-mono text-[9px] bg-[#050505]/95 border border-white/10 px-1.5 py-0.5 rounded shadow-sm text-cyan-400 font-bold uppercase">
                  N-02B
                </div>
              </button>

              {/* Pin NODE-04C (Sector B) - Critical Leak */}
              <button
                onClick={() => setSelectedNodeId('NODE-04C')}
                className="absolute top-2/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group focus:outline-none"
              >
                <div className={`w-9 h-9 rounded-full border-2 border-[#050505] flex items-center justify-center shadow-md transition-all duration-300 hover:scale-115 active:scale-90 ${
                  selectedNodeId === 'NODE-04C'
                    ? 'bg-error ring-4 ring-error/30 scale-105'
                    : 'bg-error/20 hover:bg-error ring-2 ring-error/20'
                }`}>
                  <ShieldAlert className={`h-4.5 w-4.5 ${selectedNodeId === 'NODE-04C' ? 'text-white' : 'text-error'} pulse-animation`} />
                </div>
                <div className="mt-1.5 font-mono text-[9px] bg-[#050505]/95 border border-error px-1.5 py-0.5 rounded shadow-sm text-error font-extrabold text-center">
                  NODE-04C<br />ALERT
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Node Inspector Details Panel (Right side) */}
        <div className="lg:col-span-4 glass rounded-2xl p-6 shadow-lg border border-outline-variant">
          <h2 className="font-headline text-xs font-bold uppercase tracking-widest text-[#06b6d4] mb-4">Sensor Inspector</h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="border border-white/10 rounded-xl p-4 bg-white/2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-on-surfaces uppercase tracking-wide">{selectedNode.name}</h3>
                    <span className="font-mono text-xs text-on-surface-variant font-bold">{selectedNode.id}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                    selectedNode.health === 'optimal' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-error-container text-error border border-error/20'
                  }`}>
                    {selectedNode.health === 'optimal' ? 'Optimal' : 'Alert'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                  <div>
                    <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest font-bold block mb-0.5">Flow Rate</span>
                    <span className="text-xl font-headline font-light tracking-tight text-on-surfaces">
                      {state.valveShutOff && selectedNode.id === 'NODE-04C' ? '0.0' : selectedNode.flowRate} <span className="text-xs text-cyan-500 font-mono">L/s</span>
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest font-bold block mb-0.5">Telemetry</span>
                    <span className="text-xs uppercase font-mono font-bold text-on-surfaces flex items-center gap-1">
                      {selectedNode.health === 'optimal' ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5" /> Synchronous
                        </>
                      ) : (
                        <>
                          <AlertOctagon className="h-4 w-4 text-error mt-0.5 animate-pulse" /> Rupture
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inspector Operations Controls */}
              <div className="space-y-3 pt-2">
                <h4 className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block px-1 font-bold">Inspector Controls</h4>

                <button
                  onClick={() => handleToggleNodeHealth(selectedNode.id)}
                  className={`w-full py-3 rounded-xl font-mono text-xs uppercase tracking-widest font-bold border transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedNode.health === 'optimal'
                      ? 'border-error text-error hover:bg-error/10'
                      : 'bg-cyan-600 text-black border-cyan-500 hover:bg-cyan-500 neon-border'
                  }`}
                >
                  {selectedNode.health === 'optimal' ? 'Trigger Mock Rupture' : 'Reset Node Health'}
                </button>

                {selectedNode.id === 'NODE-04C' && (
                  <button
                    onClick={() => {
                      onChangeState((prev) => ({ ...prev, valveShutOff: !prev.valveShutOff }));
                    }}
                    className={`w-full py-3 rounded-xl font-mono text-xs uppercase tracking-widest font-bold border transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                      state.valveShutOff
                        ? 'bg-cyan-600 text-black border-cyan-500 hover:bg-cyan-500 neon-border'
                        : 'border-white/10 text-on-surfaces hover:bg-white/5'
                    }`}
                  >
                    <Sliders className="h-4 w-4" />
                    {state.valveShutOff ? 'Open Main shut-off valve' : 'Shut off valve NODE-04C'}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
