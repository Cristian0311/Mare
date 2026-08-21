import {
  AutomationRule,
  AutomationAlert,
  AutomationTask,
  AutomationLog,
  AutomationConfig,
  DailySummary,
  TaskStatus,
  SyncState,
} from '../types/automation';
import { productService } from './products';
import { orderService } from './orders';
import { promotionService } from './promotion';
import { supplierService } from './supplier';
import { supabase } from '../lib/supabase/client';

class AutomationService {
  // Mapping helpers (snake_case to camelCase and vice versa)
  private mapRuleToCamel(r: any): AutomationRule {
    return {
      id: r.id,
      name: r.name,
      description: r.description,
      triggerType: r.trigger_type,
      conditions: r.conditions,
      actionType: r.action_type,
      isSensitive: r.is_sensitive,
      enabled: r.enabled,
      simulationMode: r.simulation_mode,
      lastTriggeredAt: r.last_triggered_at,
      triggeredCount: r.triggered_count,
      createdAt: r.created_at,
    };
  }

  private mapAlertToCamel(a: any): AutomationAlert {
    return {
      id: a.id,
      ruleId: a.rule_id,
      type: a.type,
      severity: a.severity,
      title: a.title,
      description: a.description,
      entityType: a.entity_type,
      entityId: a.entity_id,
      entityName: a.entity_name,
      actionRecommendation: a.action_recommendation,
      requiresApproval: a.requires_approval,
      approvalStatus: a.approval_status,
      approvalReason: a.approval_reason,
      actionPayload: a.action_payload,
      groupedCount: a.grouped_count,
      isRead: a.is_read,
      createdAt: a.created_at,
    };
  }

  private mapTaskToCamel(t: any): AutomationTask {
    return {
      id: t.id,
      alertId: t.alert_id,
      title: t.title,
      description: t.description,
      priority: t.priority,
      status: t.status,
      assigneeName: t.assignee_name,
      dueDate: t.due_date,
      entityType: t.entity_type,
      entityId: t.entity_id,
      history: t.history || [],
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    };
  }

  private mapConfigToCamel(c: any): AutomationConfig {
    return {
      stockMinDefault: c.stock_min_default,
      orderAgeLimitHours: c.order_age_limit_hours,
      minMarginThresholdPercent: c.min_margin_threshold_percent,
      stagnantDaysThreshold: c.stagnant_days_threshold,
      trendingSalesGrowthPercent: c.trending_sales_growth_percent,
      requireApprovalForSensitive: c.require_approval_for_sensitive,
      simulationModeGlobal: c.simulation_mode_global,
      lastEngineRunAt: c.last_engine_run_at,
      syncState: (c.sync_state as SyncState) || 'SINCRONIZADO',
    };
  }

  // --- Getters (Supabase) ---
  public async getRules(): Promise<AutomationRule[]> {
    const { data, error } = await supabase
      .from('automation_rules')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching automation rules:', error);
      return [];
    }
    return (data || []).map(this.mapRuleToCamel);
  }

  public async getAlerts(): Promise<AutomationAlert[]> {
    const { data, error } = await supabase
      .from('automation_alerts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching automation alerts:', error);
      return [];
    }
    return (data || []).map(this.mapAlertToCamel);
  }

  public async getTasks(): Promise<AutomationTask[]> {
    const { data, error } = await supabase
      .from('automation_tasks')
      .select('*')
      .order('due_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching automation tasks:', error);
      return [];
    }
    return (data || []).map(this.mapTaskToCamel);
  }

  public async getLogs(): Promise<AutomationLog[]> {
    const { data, error } = await supabase
      .from('automation_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error('Error fetching automation logs:', error);
      return [];
    }
    return data || [];
  }

  public async getConfig(): Promise<AutomationConfig> {
    const { data, error } = await supabase
      .from('automation_config')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching automation config:', error);
      return {
        stockMinDefault: 5,
        orderAgeLimitHours: 24,
        minMarginThresholdPercent: 15,
        stagnantDaysThreshold: 30,
        trendingSalesGrowthPercent: 50,
        requireApprovalForSensitive: true,
        simulationModeGlobal: false,
        syncState: 'ERROR',
      };
    }
    return this.mapConfigToCamel(data);
  }

  // --- Actions ---
  public async toggleRule(ruleId: string, enabled: boolean): Promise<void> {
    const { error } = await supabase
      .from('automation_rules')
      .update({ enabled })
      .eq('id', ruleId);
    
    if (!error) {
      const { data: rule } = await supabase.from('automation_rules').select('name').eq('id', ruleId).single();
      await this.addLog(
        'ADMIN',
        'RULE_TOGGLED',
        `Regla "${rule?.name || ruleId}" ${enabled ? 'activada' : 'pausada'}.`,
        rule?.name
      );
    }
  }

  public async toggleRuleSimulation(ruleId: string, simulationMode: boolean): Promise<void> {
    const { error } = await supabase
      .from('automation_rules')
      .update({ simulation_mode: simulationMode })
      .eq('id', ruleId);
    
    if (!error) {
      const { data: rule } = await supabase.from('automation_rules').select('name').eq('id', ruleId).single();
      await this.addLog(
        'ADMIN',
        'RULE_TOGGLED',
        `Modo simulación para "${rule?.name || ruleId}" ${simulationMode ? 'activado' : 'desactivado'}.`,
        rule?.name
      );
    }
  }

  public async updateConfig(newConfig: Partial<AutomationConfig>): Promise<void> {
    const dbUpdate: any = {};
    if (newConfig.stockMinDefault !== undefined) dbUpdate.stock_min_default = newConfig.stockMinDefault;
    if (newConfig.orderAgeLimitHours !== undefined) dbUpdate.order_age_limit_hours = newConfig.orderAgeLimitHours;
    if (newConfig.minMarginThresholdPercent !== undefined) dbUpdate.min_margin_threshold_percent = newConfig.minMarginThresholdPercent;
    if (newConfig.stagnantDaysThreshold !== undefined) dbUpdate.stagnant_days_threshold = newConfig.stagnantDaysThreshold;
    if (newConfig.trendingSalesGrowthPercent !== undefined) dbUpdate.trending_sales_growth_percent = newConfig.trendingSalesGrowthPercent;
    if (newConfig.requireApprovalForSensitive !== undefined) dbUpdate.require_approval_for_sensitive = newConfig.requireApprovalForSensitive;
    if (newConfig.simulationModeGlobal !== undefined) dbUpdate.simulation_mode_global = newConfig.simulationModeGlobal;
    
    const { error } = await supabase
      .from('automation_config')
      .update(dbUpdate)
      .eq('id', 1);
    
    if (!error) {
      await this.addLog('ADMIN', 'CONFIG_UPDATED', 'Configuración de automatizaciones actualizada.');
    }
  }

  // --- Core Engine Evaluation ---
  public async runAutomationEngine(isSimulationRun = false): Promise<{
    newAlertsCount: number;
    newTasksCount: number;
    simulationNotes: string[];
  }> {
    let newAlertsCount = 0;
    const newTasksCount = 0;
    const simulationNotes: string[] = [];

    try {
      const config = await this.getConfig();
      const rawProducts = await productService.getAllProducts();
      const products = rawProducts.map((p: any) => ({
        ...p,
        stock: p.stock ?? p.stock_quantity ?? 0,
        status: p.activo !== false ? 'activo' : 'inactivo',
        precio: p.precioMN ?? p.precioCUP ?? p.precio ?? 0,
        costo: p.cost_cup ?? p.costo ?? 0
      }));
      
      const ordersRes = await orderService.getAllOrders();
      const orders = ordersRes || [];
      
      const rules = await this.getRules();
      const alerts = await this.getAlerts();
      const tasks = await this.getTasks();

      const globalSim = config.simulationModeGlobal || isSimulationRun;

      for (const rule of rules) {
        if (!rule.enabled) continue;

        // 1. Stock Low Rule
        if (rule.triggerType === 'stock_low') {
          const threshold = rule.conditions.minStock ?? config.stockMinDefault;
          const lowStockProds = products.filter((p) => p.stock <= threshold && p.status === 'activo');

          if (lowStockProds.length > 0) {
            const simMode = rule.simulationMode || globalSim;
            if (simMode) {
              simulationNotes.push(`Simulación: Se habrían detectado ${lowStockProds.length} productos con stock <= ${threshold}.`);
            } else {
              const existingAlert = alerts.find(a => a.ruleId === rule.id && a.title.includes('Stock Bajo'));
              if (!existingAlert) {
                await supabase.from('automation_alerts').insert({
                  id: crypto.randomUUID(),
                  rule_id: rule.id,
                  type: 'inventory',
                  severity: 'warning',
                  title: `⚠️ Stock Bajo (${lowStockProds.length} productos)`,
                  description: `Productos en umbral mínimo: ${lowStockProds.map((p) => p.nombre).slice(0, 3).join(', ')}${lowStockProds.length > 3 ? '...' : ''}`,
                  entity_type: 'product',
                  entity_name: `${lowStockProds.length} productos`,
                  action_recommendation: 'Revisar reabastecimiento sugerido con proveedores.',
                  requires_approval: false,
                  approval_status: 'not_required',
                  grouped_count: lowStockProds.length,
                  is_read: false
                });
                newAlertsCount++;
                await supabase.from('automation_rules').update({ triggered_count: rule.triggeredCount + 1 }).eq('id', rule.id);
              }
            }
          }
        }

        // 2. Loss Sale Risk Rule
        if (rule.triggerType === 'loss_sale') {
          const lossProds = products.filter((p) => p.precio < p.costo && p.status === 'activo');
          for (const p of lossProds) {
            const simMode = rule.simulationMode || globalSim;
            if (simMode) {
              simulationNotes.push(`Simulación: Producto "${p.nombre}" en venta bajo costo ($${p.precio} vs. costo $${p.costo}).`);
            } else {
              const exists = alerts.some((a) => a.entityId === p.id && a.title.includes('POSIBLE PÉRDIDA'));
              if (!exists) {
                const proposedPrice = Math.round(p.costo * 1.25);
                await supabase.from('automation_alerts').insert({
                  id: crypto.randomUUID(),
                  rule_id: rule.id,
                  type: 'financial',
                  severity: 'critical',
                  title: `🔴 POSIBLE PÉRDIDA: "${p.nombre}"`,
                  description: `Precio actual ($${p.precio} CUP) por debajo del costo unitario ($${p.costo} CUP).`,
                  entity_type: 'product',
                  entity_id: p.id,
                  entity_name: p.nombre,
                  action_recommendation: `Reajustar precio a al menos $${proposedPrice} CUP para asegurar margen del 20%.`,
                  requires_approval: true,
                  approval_status: 'pending',
                  action_payload: { proposedPriceCup: proposedPrice },
                  is_read: false
                });
                newAlertsCount++;
                await supabase.from('automation_rules').update({ triggered_count: rule.triggeredCount + 1 }).eq('id', rule.id);
              }
            }
          }
        }
      }

      await supabase.from('automation_config').update({ last_engine_run_at: new Date().toISOString() }).eq('id', 1);
      await this.addLog(
        'MOTOR_AUTOMATIZACION',
        'RULE_TRIGGERED',
        `Evaluación completada. Se generaron ${newAlertsCount} alertas y ${newTasksCount} tareas.${globalSim ? ' [MODO SIMULACIÓN]' : ''}`
      );
    } catch (e) {
      console.error('Error in automation engine execution:', e);
    }

    return { newAlertsCount, newTasksCount, simulationNotes };
  }

  public async approveAlertAction(alertId: string, adminName = 'Admin', note = ''): Promise<{ success: boolean; message: string }> {
    const { data: alert, error } = await supabase.from('automation_alerts').select('*').eq('id', alertId).single();
    if (error || !alert) return { success: false, message: 'Alerta no encontrada.' };

    await supabase.from('automation_alerts').update({
      approval_status: 'approved',
      approval_reason: note || 'Aprobado por administración',
      is_read: true
    }).eq('id', alertId);

    await this.addLog(
      adminName,
      'APPROVAL_GRANTED',
      `Acción aprobada para alerta: "${alert.title}". Nota: ${note}`,
      alert.entity_name
    );

    return { success: true, message: 'Acción aprobada con éxito.' };
  }

  public async rejectAlertAction(alertId: string, adminName = 'Admin', note = ''): Promise<void> {
    const { data: alert } = await supabase.from('automation_alerts').select('*').eq('id', alertId).single();
    await supabase.from('automation_alerts').update({
      approval_status: 'rejected',
      approval_reason: note || 'Rechazado por administración',
      is_read: true
    }).eq('id', alertId);

    if (alert) {
      await this.addLog(
        adminName,
        'APPROVAL_REJECTED',
        `Acción rechazada para alerta: "${alert.title}". Nota: ${note}`,
        alert.entity_name
      );
    }
  }

  public async createTask(taskData: Omit<AutomationTask, 'id' | 'createdAt' | 'updatedAt' | 'history'>): Promise<AutomationTask> {
    const id = crypto.randomUUID();
    const history = [
      {
        id: crypto.randomUUID(),
        actor: 'ADMIN',
        action: 'TAREA_CREADA',
        note: 'Creada manualmente por el administrador',
        timestamp: new Date().toISOString(),
      },
    ];

    const { data, error } = await supabase.from('automation_tasks').insert({
      id,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: taskData.status,
      assignee_name: taskData.assigneeName,
      due_date: taskData.dueDate,
      entity_type: taskData.entityType,
      entity_id: taskData.entityId,
      history
    }).select().single();

    if (error) throw error;

    await this.addLog('ADMIN', 'TASK_CREATED', `Tarea creada: "${taskData.title}" asignada a ${taskData.assigneeName}`);
    return this.mapTaskToCamel(data);
  }

  public async updateTaskStatus(taskId: string, newStatus: TaskStatus, actorName = 'Admin', note = ''): Promise<void> {
    const { data: task } = await supabase.from('automation_tasks').select('*').eq('id', taskId).single();
    if (task) {
      const history = task.history || [];
      history.push({
        id: crypto.randomUUID(),
        actor: actorName,
        action: `CAMBIO_ESTADO_${newStatus}`,
        note: note || `Estado actualizado a ${newStatus}`,
        timestamp: new Date().toISOString(),
      });

      await supabase.from('automation_tasks').update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        history
      }).eq('id', taskId);

      await this.addLog(actorName, 'TASK_UPDATED', `Tarea "${task.title}" cambió a ${newStatus}`);
    }
  }

  public async getDailySummary(): Promise<DailySummary> {
    try {
      const orders = await orderService.getAllOrders();
      const todayStr = new Date().toISOString().slice(0, 10);

      const todayOrders = orders.filter((o: any) => {
        const d = (o.created_at || '').slice(0, 10);
        return d === todayStr && o.status !== 'cancelled';
      });

      const totalSalesCup = todayOrders.reduce((sum: number, o: any) => sum + (o.total_cup || 0), 0);
      const alerts = await this.getAlerts();
      const pendingAlerts = alerts.filter((a) => a.approvalStatus === 'pending').length;

      return {
        date: todayStr,
        totalSalesCup,
        totalOrders: todayOrders.length,
        unitsSold: 0, // Simplified
        activeReservations: 0,
        pendingAlertsCount: pendingAlerts,
        estimatedProfitCup: Math.round(totalSalesCup * 0.3),
        keyActionItem: pendingAlerts > 0 ? `Atender ${pendingAlerts} alertas pendientes.` : 'Operación estable.',
      };
    } catch (e) {
      return {
        date: new Date().toISOString().slice(0, 10),
        totalSalesCup: 0,
        totalOrders: 0,
        unitsSold: 0,
        activeReservations: 0,
        pendingAlertsCount: 0,
        estimatedProfitCup: 0,
        keyActionItem: 'Iniciando sistema...',
      };
    }
  }

  private async addLog(actor: string, action: AutomationLog['action'], details: string, entityName?: string) {
    await supabase.from('automation_logs').insert({
      id: crypto.randomUUID(),
      actor,
      action,
      details,
      entity_name: entityName,
      timestamp: new Date().toISOString()
    });
  }
}

export const automationService = new AutomationService();
