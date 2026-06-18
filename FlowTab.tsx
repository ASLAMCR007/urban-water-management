import { motion } from 'motion/react';
import { AlertCircle, Sliders, TrendingUp, TrendingDown, ArrowRight, Shield, Activity, MapPin } from 'lucide-react';
import { SystemState } from '../types';

interface FlowTabProps {
  state: SystemState;
  onAcknowledgeLeak: () => void;
  onSwitchTab: (tab: string) => void;
}

export default function FlowTab({ state, onAcknowledgeLeak, onSwitchTab }: FlowTabProps) {
  const containsAlert = state.pipelines.some((p) => p.health === 'alert') || state.valveShutOff;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 animate-fade-in"
    >
      <div>
        <h1 className="font-headline text-3xl font-light text-on-surfaces uppercase tracking-wide">Flow & Leakage</h1>
        <p className="font-mono text-xs text-on-surface-variant mt-1 uppercase tracking-wider">Real-time infrastructure health and distribution tracking.</p>
      </div>

      {/* Critical Alert Leak Banner */}
      {containsAlert && (
        <div className="glass border border-error rounded-2xl p-6 flex flex-col sm:flex-row items-start justify-between gap-4 relative overflow-hidden shadow-lg shadow-error/10">
          <div className="absolute inset-0 bg-error/5 pulse-animation"></div>
          <div className="relative z-10 flex gap-3">
            <AlertCircle className="h-6 w-6 text-error flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-[10px] text-error font-extrabold uppercase tracking-widest mb-1">Critical Pipeline Leak Indicator</div>
              <h2 className="text-base font-bold text-on-surfaces uppercase tracking-wider">Pressure Drop in Sector B</h2>
              <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed">
                Rapid depressurization detected on Main Line 4 (Node: NODE-04C). Potential major rupture or unauthorized diversion active.
              </p>
            </div>
          </div>
          <button
            onClick={onAcknowledgeLeak}
            className="relative z-10 self-end sm:self-center bg-error hover:bg-error/80 text-white font-mono text-xs font-semibold px-4 py-2 rounded-xl transition-all active:scale-95 flex-shrink-0 uppercase tracking-widest"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Grid Layouts */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Active Pipeline Status Container */}
        <div className="md:col-span-8 glass rounded-2xl p-6 border border-outline-variant">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline text-xs font-bold uppercase tracking-widest text-on-surfaces">Active Pipeline Status</h2>
            <Activity className="h-4 w-4 text-cyan-400" />
          </div>

          <div className="space-y-3">
            {state.pipelines.map((p) => {
              const isAlerting = p.health === 'alert' || (state.valveShutOff && p.id === 'NODE-04C');
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-4 border rounded-xl transition-all hover:bg-white/5 ${
                    isAlerting
                      ? 'border-error bg-error/5'
                      : 'border-outline-variant bg-white/2'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-8 rounded-full ${isAlerting ? 'bg-error pulse-animation' : 'bg-cyan-500'}`}></div>
                    <div>
                      <div className="text-sm font-bold text-on-surfaces uppercase tracking-wide">{p.name}</div>
                      <div className={`font-mono text-[10px] ${isAlerting ? 'text-error' : 'text-on-surface-variant'}`}>{p.id}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-mono text-sm font-extrabold ${isAlerting ? 'text-error animate-pulse' : 'text-cyan-400'}`}>
                      {state.valveShutOff && p.id === 'NODE-04C' ? '0.0 L/s' : `${p.flowRate} L/s`}
                    </div>
                    <div className={`text-[10px] uppercase font-bold mt-0.5 flex items-center justify-end gap-1 ${isAlerting ? 'text-error' : 'text-cyan-500'}`}>
                      {isAlerting ? (
                        <>
                          <TrendingDown className="h-3 w-3" /> Warning
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-3 w-3" /> Secure
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Theft Prevention Card (Abnormal flow) */}
        <div className="md:col-span-4 glass rounded-2xl p-6 flex flex-col justify-between border border-outline-variant">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Theft Prevention</div>
              <h2 className="font-headline text-lg font-bold text-on-surfaces mt-1 uppercase tracking-wider">Abnormal Flow</h2>
            </div>
            <Shield className="h-5 w-5 text-cyan-400" />
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Activity className="h-7 w-7 text-cyan-500" />
            </div>
            <div className="font-headline text-2xl font-light tracking-tight text-on-surfaces uppercase">2 FLAGGED</div>
            <p className="font-sans text-xs text-on-surface-variant text-center mt-2 max-w-[200px] leading-relaxed">
              Active nighttime flow anomalies in Sector C. Flow signatures bypass meter D-402, signaling secondary hydrant access.
            </p>
          </div>

          <button className="w-full bg-cyan-600 hover:bg-cyan-500 transition-colors text-black font-mono text-xs uppercase tracking-widest py-3 rounded-xl cursor-pointer font-bold mt-auto neon-border">
            Investigate Nodes
          </button>
        </div>

        {/* Geographic Map overlay card */}
        <div className="md:col-span-12 glass rounded-2xl border border-outline-variant overflow-hidden relative cursor-pointer group" onClick={() => onSwitchTab('map')}>
          <div className="absolute top-4 left-4 z-10 bg-[#050505]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-md">
            <div className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">Network Map Preview</div>
            <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">Click to expand geographic sensor coordinates</div>
          </div>

          {/* Map Preview image background */}
          <div className="w-full h-64 overflow-hidden relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3ijJnmSEdOY8Gj_kO0ut1fcMWmUNlQUp0PfJDT67zdzNuVoM1x7g_vHK-IAM8J7XxcUtWPmVgwGInOySbrm-ZM7cS_YX_XS_Lq0bvSW0q18wHz6Zs7u9J7gfmS-eqVrNvzupYABlbrLhHJ766wC3x06oXjlVEVAbm4yOVLjc6Y3sFGjIOJPFT1vK0OAakxgltZAyKdxXU50g3NXXqxPxEAnspb2A-u4DitEYHDGLZoDcSGm-Dj6QSr7HzyGa7Ccp9kuh8ESlyO9na"
              alt="Geographic pipeline map"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-40 group-hover:scale-[1.01] transition-transform duration-700"
            />
            {/* Visual pointers/highlights */}
            <div className="absolute inset-0">
              {/* Healthy node pin */}
              <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-[#050505] shadow-sm ring-2 ring-cyan-500/40 animate-pulse"></div>
                <span className="font-mono text-[9px] bg-[#050505]/95 px-1.5 py-0.5 rounded mt-1 font-bold text-cyan-400 border border-white/10">N-01A</span>
              </div>

              {/* Alert node */}
              <div className="absolute top-1/2 left-[58%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-5 h-5 bg-error rounded-full border-2 border-[#050505] shadow-md pulse-animation flex items-center justify-center">
                  <MapPin className="h-3 w-3 text-white fill-current" />
                </div>
                <span className="font-mono text-[9px] bg-[#050505]/95 px-1.5 py-0.5 rounded mt-1 font-bold text-error text-center shadow-sm border border-error">
                  NODE-04C ALERT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
