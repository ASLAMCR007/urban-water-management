export interface SystemLog {
  id: string;
  type: 'critical' | 'warning' | 'system';
  category: string;
  title: string;
  description: string;
  timestamp: string;
  timeLabel: string;
  iconName: string;
  actionRequired?: {
    type: 'shut_off' | 'adjust_dosing' | 'view_map' | 'schedule_task';
    label: string;
    secondaryLabel?: string;
  };
  acknowledged: boolean;
  dismissed: boolean;
  nodeId?: string;
}

export interface PipelineNode {
  id: string;
  name: string;
  flowRate: number; // L/s
  status: 'stable' | 'drop' | 'increase';
  health: 'optimal' | 'warning' | 'alert';
}

export interface WaterQualityMetrics {
  ph: {
    value: number;
    trend: number; // change
    history: number[]; // 24 points
  };
  turbidity: {
    value: number; // NTU
    maxSafe: number;
  };
  tds: {
    value: number; // ppm
    status: 'optimal' | 'warning' | 'critical';
  };
  chlorine: {
    value: number; // mg/L
    min: number;
    max: number;
  };
}

export interface SystemState {
  logs: SystemLog[];
  pipelines: PipelineNode[];
  quality: WaterQualityMetrics;
  reservoirLevel: number; // %
  totalDailyFlow: number; // kL
  valveShutOff: boolean;
}
