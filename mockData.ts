import { SystemLog, PipelineNode, WaterQualityMetrics } from '../types';

export const initialLogs: SystemLog[] = [
  {
    id: 'log-1',
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
  },
  {
    id: 'log-2',
    type: 'critical',
    category: 'SECURITY BREACH',
    title: 'Theft Alert: Sector D',
    description: 'Abnormal flow signature detected bypassing meter D-402. Consistent with unauthorized access to secondary hydrants.',
    timestamp: 'Today',
    timeLabel: '08:15 AM',
    iconName: 'warning',
    actionRequired: {
      type: 'view_map',
      label: 'View Map Location'
    },
    acknowledged: false,
    dismissed: false,
    nodeId: 'NODE-04C'
  },
  {
    id: 'log-3',
    type: 'warning',
    category: 'QUALITY WARNING',
    title: 'pH Level Warning - Reservoir A',
    description: 'Sensors indicate pH levels trending towards 6.2. Outside optimal threshold of 6.5 - 8.5. Recommend automated dosing adjustment.',
    timestamp: 'Yesterday',
    timeLabel: 'Yesterday, 14:30',
    iconName: 'science',
    actionRequired: {
      type: 'adjust_dosing',
      label: 'Adjust Dosing',
      secondaryLabel: 'View Trend Data'
    },
    acknowledged: false,
    dismissed: false,
    nodeId: 'RES-01'
  },
  {
    id: 'log-4',
    type: 'system',
    category: 'ROUTINE SYSTEM',
    title: 'Pump Maintenance Due',
    description: 'Station 3 Main Pump has reached 5,000 operational hours. Scheduled maintenance required to ensure efficiency.',
    timestamp: 'Nov 12',
    timeLabel: 'Nov 12, 09:00',
    iconName: 'build',
    actionRequired: {
      type: 'schedule_task',
      label: 'Schedule Task',
      secondaryLabel: 'Dismiss'
    },
    acknowledged: false,
    dismissed: false,
    nodeId: 'SYS-PMP3'
  }
];

export const initialPipelines: PipelineNode[] = [
  {
    id: 'NODE-01A',
    name: 'Village 1 Supply',
    flowRate: 45.2,
    status: 'stable',
    health: 'optimal'
  },
  {
    id: 'NODE-02B',
    name: 'Village 2 Trunk',
    flowRate: 38.7,
    status: 'stable',
    health: 'optimal'
  },
  {
    id: 'NODE-04C',
    name: 'Sector B Distribution',
    flowRate: 12.1,
    status: 'drop',
    health: 'alert'
  }
];

export const initialQuality: WaterQualityMetrics = {
  ph: {
    value: 7.2,
    trend: 0.1,
    history: [7.1, 7.05, 7.12, 7.08, 6.95, 6.88, 6.75, 6.62, 6.5, 6.45, 6.55, 6.6, 6.78, 6.82, 6.9, 6.85, 7.02, 7.01, 7.06, 7.15, 7.22, 7.25, 7.21, 7.2]
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
};
