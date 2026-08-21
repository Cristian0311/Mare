export type TaskPriority = 'URGENTE' | 'ALTA' | 'MEDIA' | 'BAJA';
export type TaskStatus = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'CANCELADA';
export type SyncState = 'PENDIENTE' | 'SINCRONIZANDO' | 'SINCRONIZADO' | 'ERROR';

export type AlertType = 'inventory' | 'financial' | 'commercial' | 'order' | 'reservation' | 'supplier';
export type AlertSeverity = 'critical' | 'urgent' | 'warning' | 'info';
export type ApprovalStatus = 'not_required' | 'pending' | 'approved' | 'rejected';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  triggerType:
    | 'stock_low'
    | 'stock_depletion'
    | 'stagnant_product'
    | 'trending_product'
    | 'low_margin'
    | 'loss_sale'
    | 'unprofitable_promo'
    | 'high_perf_promo'
    | 'reservation_aging'
    | 'order_aging'
    | 'supplier_cost_increase';
  conditions: {
    minStock?: number;
    marginThresholdPct?: number;
    orderAgeHours?: number;
    stagnantDays?: number;
    trendingGrowthPct?: number;
  };
  actionType:
    | 'create_alert'
    | 'create_task'
    | 'flag_product'
    | 'log_event'
    | 'suggest_promotion'
    | 'require_approval';
  isSensitive: boolean; // Requires manual admin approval
  enabled: boolean;
  simulationMode: boolean; // Simulation mode
  lastTriggeredAt?: string;
  triggeredCount: number;
  createdAt: string;
}

export interface AutomationAlert {
  id: string;
  ruleId?: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  entityType?: 'product' | 'order' | 'reservation' | 'promotion' | 'supplier';
  entityId?: string;
  entityName?: string;
  actionRecommendation: string;
  requiresApproval: boolean;
  approvalStatus: ApprovalStatus;
  approvalReason?: string;
  actionPayload?: {
    proposedDiscountPercent?: number;
    proposedPriceCup?: number;
    suggestedOrderQty?: number;
    targetAssignee?: string;
  };
  groupedCount: number;
  isRead: boolean;
  createdAt: string;
}

export interface TaskHistoryItem {
  id: string;
  actor: string;
  action: string;
  note?: string;
  timestamp: string;
}

export interface AutomationTask {
  id: string;
  alertId?: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeName: string; // Emily, Cristian, Admin
  dueDate: string;
  entityType?: string;
  entityId?: string;
  history: TaskHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AutomationLog {
  id: string;
  actor: string; // SYSTEM, ENGINE, ADMIN_NAME
  action:
    | 'RULE_TRIGGERED'
    | 'ALERT_CREATED'
    | 'TASK_CREATED'
    | 'TASK_UPDATED'
    | 'APPROVAL_GRANTED'
    | 'APPROVAL_REJECTED'
    | 'RULE_TOGGLED'
    | 'CONFIG_UPDATED';
  details: string;
  entityName?: string;
  timestamp: string;
}

export interface AutomationConfig {
  stockMinDefault: number;
  orderAgeLimitHours: number;
  minMarginThresholdPercent: number;
  stagnantDaysThreshold: number;
  trendingSalesGrowthPercent: number;
  requireApprovalForSensitive: boolean;
  simulationModeGlobal: boolean;
  lastEngineRunAt?: string;
  syncState: SyncState;
}

export interface DailySummary {
  date: string;
  totalSalesCup: number;
  totalOrders: number;
  unitsSold: number;
  activeReservations: number;
  pendingAlertsCount: number;
  estimatedProfitCup: number;
  keyActionItem: string;
}
