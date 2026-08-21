import { supabase } from '../lib/supabase/client';

export type AnalyticsRange = 'today' | 'yesterday' | '7d' | '30d' | 'this_month' | 'last_month' | 'this_year' | 'custom';

export interface DateRange {
  from: string;
  to: string;
}

export class AnalyticsService {
  private getDateRange(range: AnalyticsRange, customRange?: DateRange): DateRange {
    const now = new Date();
    const to = now.toISOString();
    let from = new Date();

    switch (range) {
      case 'today':
        from.setHours(0, 0, 0, 0);
        break;
      case 'yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        from = yesterday;
        const yesterdayEnd = new Date();
        yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
        yesterdayEnd.setHours(23, 59, 59, 999);
        return { from: from.toISOString(), to: yesterdayEnd.toISOString() };
      case '7d':
        from.setDate(from.getDate() - 7);
        break;
      case '30d':
        from.setDate(from.getDate() - 30);
        break;
      case 'this_month':
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        break;
      case 'last_month':
        from.setMonth(from.getMonth() - 1);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        const lastMonthEnd = new Date(from);
        lastMonthEnd.setMonth(lastMonthEnd.getMonth() + 1);
        lastMonthEnd.setDate(0);
        lastMonthEnd.setHours(23, 59, 59, 999);
        return { from: from.toISOString(), to: lastMonthEnd.toISOString() };
      case 'this_year':
        from.setMonth(0, 1);
        from.setHours(0, 0, 0, 0);
        break;
      case 'custom':
        if (customRange) return customRange;
        break;
    }

    return { from: from.toISOString(), to };
  }

  private getPreviousDateRange(range: AnalyticsRange, current: DateRange): DateRange {
    const from = new Date(current.from);
    const to = new Date(current.to);
    const diff = to.getTime() - from.getTime();
    
    const prevTo = new Date(from.getTime() - 1);
    const prevFrom = new Date(prevTo.getTime() - diff);
    
    return { from: prevFrom.toISOString(), to: prevTo.toISOString() };
  }

  async getDashboardStats(range: AnalyticsRange = '30d', customRange?: DateRange) {
    const currentRange = this.getDateRange(range, customRange);
    const prevRange = this.getPreviousDateRange(range, currentRange);

    const fetchStats = async (r: DateRange) => {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total_cup, status, order_type, created_at')
        .gte('created_at', r.from)
        .lte('created_at', r.to);

      if (error) throw error;

      const validOrders = orders.filter(o => o.status !== 'cancelled');
      const totalSales = validOrders.reduce((sum, o) => sum + (o.total_cup || 0), 0);
      const ordersCount = validOrders.length;
      const avgOrder = ordersCount > 0 ? totalSales / ordersCount : 0;
      const wholesaleOrders = validOrders.filter(o => o.order_type === 'wholesale').length;
      
      const { count: newCustomers } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', r.from)
        .lte('created_at', r.to);

      return {
        totalSales,
        ordersCount,
        avgOrder,
        wholesaleOrders,
        newCustomers: newCustomers || 0
      };
    };

    const [current, previous] = await Promise.all([
      fetchStats(currentRange),
      fetchStats(prevRange)
    ]);

    const calculateVariation = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    return {
      current,
      previous,
      variations: {
        totalSales: calculateVariation(current.totalSales, previous.totalSales),
        ordersCount: calculateVariation(current.ordersCount, previous.ordersCount),
        avgOrder: calculateVariation(current.avgOrder, previous.avgOrder),
        newCustomers: calculateVariation(current.newCustomers, previous.newCustomers),
        wholesaleOrders: calculateVariation(current.wholesaleOrders, previous.wholesaleOrders)
      },
      range: currentRange
    };
  }

  async getSalesTrends(range: AnalyticsRange = '30d', customRange?: DateRange) {
    const r = this.getDateRange(range, customRange);
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total_cup, created_at, status')
      .gte('created_at', r.from)
      .lte('created_at', r.to)
      .neq('status', 'cancelled')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group by day for now
    const trends: Record<string, { date: string; sales: number; orders: number }> = {};
    
    orders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString();
      if (!trends[date]) {
        trends[date] = { date, sales: 0, orders: 0 };
      }
      trends[date].sales += order.total_cup || 0;
      trends[date].orders += 1;
    });

    return Object.values(trends);
  }

  async getTopProducts(range: AnalyticsRange = '30d', customRange?: DateRange, limit = 5) {
    const r = this.getDateRange(range, customRange);
    
    // We need to join orders with order_items
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        product_id,
        product_name,
        quantity,
        subtotal_cup,
        order:orders!inner(created_at, status)
      `)
      .gte('order.created_at', r.from)
      .lte('order.created_at', r.to)
      .neq('order.status', 'cancelled');

    if (error) throw error;

    const products: Record<string, { id: string; name: string; quantity: number; revenue: number }> = {};

    data.forEach((item: any) => {
      if (!products[item.product_id]) {
        products[item.product_id] = { id: item.product_id, name: item.product_name, quantity: 0, revenue: 0 };
      }
      products[item.product_id].quantity += item.quantity;
      products[item.product_id].revenue += item.subtotal_cup;
    });

    const sortedByQuantity = Object.values(products).sort((a, b) => b.quantity - a.quantity).slice(0, limit);
    const sortedByRevenue = Object.values(products).sort((a, b) => b.revenue - a.revenue).slice(0, limit);

    return {
      byQuantity: sortedByQuantity,
      byRevenue: sortedByRevenue
    };
  }

  async getTopCategories(range: AnalyticsRange = '30d', customRange?: DateRange) {
    const r = this.getDateRange(range, customRange);
    
    // Join order_items with products to get categories
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        quantity,
        subtotal_cup,
        product:products!inner(category_id),
        order:orders!inner(created_at, status)
      `)
      .gte('order.created_at', r.from)
      .lte('order.created_at', r.to)
      .neq('order.status', 'cancelled');

    if (error) throw error;

    const { data: categories } = await supabase.from('categories').select('id, name');
    const catMap = (categories || []).reduce((acc: any, c) => ({ ...acc, [c.id]: c.name }), {});

    const stats: Record<string, { id: string; name: string; quantity: number; revenue: number }> = {};

    data.forEach((item: any) => {
      const catId = item.product?.category_id || 'unclassified';
      const catName = catMap[catId] || 'Sin categoría';

      if (!stats[catId]) {
        stats[catId] = { id: catId, name: catName, quantity: 0, revenue: 0 };
      }
      stats[catId].quantity += item.quantity;
      stats[catId].revenue += item.subtotal_cup;
    });

    return Object.values(stats).sort((a, b) => b.revenue - a.revenue);
  }

  async getLocationAnalytics(range: AnalyticsRange = '30d', customRange?: DateRange) {
    const r = this.getDateRange(range, customRange);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        province:provinces(name),
        municipality:municipalities(name),
        total_cup,
        status
      `)
      .gte('created_at', r.from)
      .lte('created_at', r.to)
      .neq('status', 'cancelled');

    if (error) throw error;

    const provinces: Record<string, { name: string; orders: number; sales: number }> = {};
    const municipalities: Record<string, { name: string; province: string; orders: number; sales: number }> = {};

    data.forEach((order: any) => {
      const provName = order.province?.name || 'No definida';
      const munName = order.municipality?.name || 'No definido';

      if (!provinces[provName]) provinces[provName] = { name: provName, orders: 0, sales: 0 };
      provinces[provName].orders++;
      provinces[provName].sales += order.total_cup;

      const munKey = `${provName}-${munName}`;
      if (!municipalities[munKey]) municipalities[munKey] = { name: munName, province: provName, orders: 0, sales: 0 };
      municipalities[munKey].orders++;
      municipalities[munKey].sales += order.total_cup;
    });

    return {
      provinces: Object.values(provinces).sort((a, b) => b.sales - a.sales),
      municipalities: Object.values(municipalities).sort((a, b) => b.sales - a.sales).slice(0, 10)
    };
  }

}

export const analyticsService = new AnalyticsService();
