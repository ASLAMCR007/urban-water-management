import { LayoutDashboard, Droplets, Droplet, Bell, Map } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSwitchTab: (tab: string) => void;
  activeAlertsCount: number;
}

export default function BottomNav({ activeTab, onSwitchTab, activeAlertsCount }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'quality', label: 'Quality', icon: Droplets },
    { id: 'flow', label: 'Flow', icon: Droplet },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: activeAlertsCount },
    { id: 'map', label: 'Map', icon: Map }
  ];

  return (
    <nav className="glass border-t border-outline-variant fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSwitchTab(item.id)}
            className={`flex flex-col items-center justify-center relative py-1 transition-transform duration-150 cursor-pointer ${
              isActive
                ? 'bg-white/5 text-primary rounded-full px-4 py-1.5 active:scale-95 text-center neon-border'
                : 'text-on-surface-variant hover:text-primary active:scale-90 w-16'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className={`font-mono text-[9px] mt-0.5 ${isActive ? 'font-bold' : ''}`}>{item.label}</span>

            {/* Alert counter indicator */}
            {item.badge !== undefined && item.badge > 0 && !isActive && (
              <span className="absolute top-0 right-3.5 w-2 h-2 bg-error rounded-full border border-surface"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
