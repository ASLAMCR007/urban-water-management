import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import HomeTab from './components/HomeTab';
import QualityTab from './components/QualityTab';
import FlowTab from './components/FlowTab';
import AlertsTab from './components/AlertsTab';
import MapTab from './components/MapTab';
import SimulationControls from './components/SimulationControls';
import { initialLogs, initialPipelines, initialQuality } from './data/mockData';
import { SystemState } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [state, setState] = useState<SystemState>({
    logs: initialLogs,
    pipelines: initialPipelines,
    quality: initialQuality,
    reservoirLevel: 82,
    totalDailyFlow: 45.2,
    valveShutOff: false
  });

  // Calculate unacknowledged critical and warning alarms
  const unreadAlertsCount = state.logs.filter((l) => !l.acknowledged && !l.dismissed && l.type === 'critical').length;

  const handleAcknowledgeLeak = () => {
    setState((prev) => ({
      ...prev,
      logs: prev.logs.map((log) =>
        log.title.includes('Pressure Drop') ? { ...log, acknowledged: true } : log
      )
    }));
  };

  return (
    <div className="bg-surface text-on-surface font-sans min-h-screen flex flex-col antialiased">
      {/* Top App Bar */}
      <Header
        onOpenSettings={() => setIsSandboxOpen(true)}
        activeAlertsCount={unreadAlertsCount}
      />

      {/* Main Container */}
      <div className="flex-1 flex pt-16 md:pl-64">
        {/* Desktop Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSwitchTab={setActiveTab}
          activeAlertsCount={unreadAlertsCount}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 pt-4 pb-28 px-4 max-w-5xl mx-auto w-full">
          {activeTab === 'home' && (
            <HomeTab
              state={state}
              onSwitchTab={setActiveTab}
              onOpenSimulation={() => setIsSandboxOpen(true)}
            />
          )}

          {activeTab === 'quality' && (
            <QualityTab
              state={state}
              onChangeState={setState}
            />
          )}

          {activeTab === 'flow' && (
            <FlowTab
              state={state}
              onAcknowledgeLeak={handleAcknowledgeLeak}
              onSwitchTab={setActiveTab}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsTab
              state={state}
              onChangeState={setState}
              onOpenSimulation={() => setIsSandboxOpen(true)}
            />
          )}

          {activeTab === 'map' && (
            <MapTab
              state={state}
              onChangeState={setState}
            />
          )}
        </main>
      </div>

      {/* Mobile Sticky Bottom Nav Bar */}
      <BottomNav
        activeTab={activeTab}
        onSwitchTab={setActiveTab}
        activeAlertsCount={unreadAlertsCount}
      />

      {/* Interactive Simulation Controls */}
      <SimulationControls
        state={state}
        onChangeState={setState}
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
      />
    </div>
  );
}
