-- FASE 60 — AUTOMATIZACIÓN INTELIGENTE Y OPERACIÓN AVANZADA MARÉ
-- File: 20260811_20_automation.sql

-- 1. Automation Rules Table
CREATE TABLE IF NOT EXISTS public.automation_rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL,
    conditions JSONB DEFAULT '{}'::jsonb,
    action_type TEXT NOT NULL,
    is_sensitive BOOLEAN DEFAULT false,
    enabled BOOLEAN DEFAULT true,
    simulation_mode BOOLEAN DEFAULT false,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    triggered_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Automation Alerts Table
CREATE TABLE IF NOT EXISTS public.automation_alerts (
    id TEXT PRIMARY KEY,
    rule_id TEXT REFERENCES public.automation_rules(id) ON DELETE SET NULL,
    type TEXT NOT NULL, -- 'inventory', 'financial', 'commercial', 'order', 'reservation', 'supplier'
    severity TEXT NOT NULL, -- 'critical', 'urgent', 'warning', 'info'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    entity_name TEXT,
    action_recommendation TEXT,
    requires_approval BOOLEAN DEFAULT false,
    approval_status TEXT DEFAULT 'not_required', -- 'not_required', 'pending', 'approved', 'rejected'
    approval_reason TEXT,
    action_payload JSONB DEFAULT '{}'::jsonb,
    grouped_count INTEGER DEFAULT 1,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Automation Tasks Table
CREATE TABLE IF NOT EXISTS public.automation_tasks (
    id TEXT PRIMARY KEY,
    alert_id TEXT REFERENCES public.automation_alerts(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL, -- 'URGENTE', 'ALTA', 'MEDIA', 'BAJA'
    status TEXT NOT NULL DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA'
    assignee_name TEXT DEFAULT 'Emily',
    due_date DATE,
    entity_type TEXT,
    entity_id TEXT,
    history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Automation Audit Logs Table
CREATE TABLE IF NOT EXISTS public.automation_logs (
    id TEXT PRIMARY KEY,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    entity_name TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Automation Config Table
CREATE TABLE IF NOT EXISTS public.automation_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    stock_min_default INTEGER DEFAULT 5,
    order_age_limit_hours INTEGER DEFAULT 24,
    min_margin_threshold_percent NUMERIC DEFAULT 15,
    stagnant_days_threshold INTEGER DEFAULT 30,
    trending_sales_growth_percent NUMERIC DEFAULT 50,
    require_approval_for_sensitive BOOLEAN DEFAULT true,
    simulation_mode_global BOOLEAN DEFAULT false,
    last_engine_run_at TIMESTAMP WITH TIME ZONE,
    sync_state TEXT DEFAULT 'SINCRONIZADO',
    CONSTRAINT single_row CHECK (id = 1)
);

-- Indexes for optimal Supabase Free query execution
CREATE INDEX IF NOT EXISTS idx_automation_alerts_status ON public.automation_alerts(approval_status, is_read, severity);
CREATE INDEX IF NOT EXISTS idx_automation_tasks_status_priority ON public.automation_tasks(status, priority, due_date);
CREATE INDEX IF NOT EXISTS idx_automation_logs_timestamp ON public.automation_logs(timestamp DESC);

-- Enable RLS
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_config ENABLE ROW LEVEL SECURITY;

-- Strict RLS Policies (Admin Users Only)
CREATE POLICY "Admins full access on automation_rules" ON public.automation_rules
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins full access on automation_alerts" ON public.automation_alerts
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins full access on automation_tasks" ON public.automation_tasks
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins full access on automation_logs" ON public.automation_logs
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins full access on automation_config" ON public.automation_config
    FOR ALL USING (auth.uid() IS NOT NULL);
