import { LayoutDashboard, Droplets, Droplet, Bell, Map } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSwitchTab: (tab: string) => void;
  activeAlertsCount: number;
}

export default function Sidebar({ activeTab, onSwitchTab, activeAlertsCount }: SidebarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'quality', label: 'Quality', icon: Droplets },
    { id: 'flow', label: 'Flow', icon: Droplet },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: activeAlertsCount },
    { id: 'map', label: 'Map', icon: Map }
  ];

  return (
    <nav className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 glass z-40 py-6 px-4 gap-2 border-r border-outline-variant">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSwitchTab(item.id)}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg cursor-pointer transition-all active:scale-98 font-sans ${
              isActive
                ? 'bg-white/5 text-primary border-l-2 border-primary font-semibold shadow-sm neon-border'
                : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surfaces'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-xs uppercase tracking-wider font-bold">{item.label}</span>
            </div>

            {item.badge !== undefined && item.badge > 0 && (
              <span className="bg-error text-on-error font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
