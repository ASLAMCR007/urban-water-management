import { Waves, User, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  activeAlertsCount: number;
}

export default function Header({ onOpenSettings, activeAlertsCount }: HeaderProps) {
  return (
    <header className="glass flex justify-between items-center w-full px-6 h-16 fixed top-0 z-40 border-b border-outline-variant">
      <div className="flex items-center gap-2 hover:bg-white/5 transition-colors p-2 rounded-lg cursor-pointer active:scale-95 duration-100">
        <Waves className="h-6 w-6 text-primary" />
        <span className="font-headline text-xl font-bold text-primary tracking-widest uppercase">AquaControl IoT</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 status-pulse pulse-animation"></div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">TELEMETRY_STREAM // LIVE</span>
        </div>

        <button
          onClick={onOpenSettings}
          className="text-primary hover:bg-white/5 transition-colors p-2 rounded-full active:scale-95 duration-100 flex items-center justify-center relative border border-outline-variant"
          title="Simulation Control"
        >
          <Settings className="h-5 w-5 animate-spin-slow" />
          {activeAlertsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface"></span>
          )}
        </button>

        <button className="text-primary hover:bg-white/5 transition-colors p-2 rounded-full active:scale-95 duration-100 flex items-center justify-center border border-outline-variant">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
