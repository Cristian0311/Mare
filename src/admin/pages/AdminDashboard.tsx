import { useState, useEffect } from 'react';
import { Package, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Activity, ShoppingBag, Eye, RefreshCcw, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrency } from '../../contexts/CurrencyContext';
import { orderService } from '../../services/orders';
import { productService } from '../../services/products';
import { analyticsService } from '../../services/analytics';
import { safeFetch } from '../../lib/utils/promise';
import { motion } from 'motion/react';

import { metricsService } from '../../services/metrics';

export function AdminDashboard() {
  const { formatPrice } = useCurrency();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    ventasTotales: 0,
    pedidosNuevos: 0,
    clientesActivos: 0,
    productosStock: 0,
    visitasTotales: 0,
    crecimientoVentas: 0,
    crecimientoPedidos: 0
  });
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [orders, products, dashboardAnalytics, salesTrends, visits] = await Promise.all([
        safeFetch(() => orderService.getAllOrders(), [], 4000),
        safeFetch(() => productService.getAllProducts(), [], 4000),
        safeFetch(() => analyticsService.getDashboardStats('30d'), { 
          current: { totalSales: 0, ordersCount: 0, avgOrder: 0, wholesaleOrders: 0, newCustomers: 0 },
          previous: { totalSales: 0, ordersCount: 0, avgOrder: 0, wholesaleOrders: 0, newCustomers: 0 },
          variations: { totalSales: 0, ordersCount: 0, avgOrder: 0, newCustomers: 0, wholesaleOrders: 0 },
          range: { from: '', to: '' }
        }, 4000),
        safeFetch(() => analyticsService.getSalesTrends('30d'), [], 4000),
        safeFetch(() => metricsService.getGlobalVisits(), 0, 4000)
      ]);
      
      const ventasTotales = orders
        .filter(o => o.status === 'completed' || o.status === 'delivered')
        .reduce((sum, order) => sum + (order.total_cup || 0), 0);
        
      const pedidosNuevos = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
      
      const activeClients = new Set(orders.map(o => o.customer?.phone)).size;

      setStats({
        ventasTotales,
        pedidosNuevos,
        clientesActivos: activeClients,
        productosStock: products.filter(p => p.activo !== false).length,
        visitasTotales: visits,
        crecimientoVentas: dashboardAnalytics.variations.totalSales,
        crecimientoPedidos: dashboardAnalytics.variations.ordersCount
      });

      setTrends(salesTrends);
      setRecentOrders(orders.slice(0, 10)); // Mostrar un poco más en el dashboard rediseñado
    } catch (err) {
      console.error("Error loading dashboard data", err);
    }
    setIsLoading(false);
  };

  const kpis = [
    {
      title: 'Ventas Acumuladas',
      value: formatPrice(stats.ventasTotales),
      trend: `${stats.crecimientoVentas >= 0 ? '+' : ''}${stats.crecimientoVentas.toFixed(1)}%`,
      trendUp: stats.crecimientoVentas >= 0,
      icon: DollarSign,
      color: 'text-mare-gold',
      bg: 'bg-mare-gold/10'
    },
    {
      title: 'Pedidos Activos',
      value: stats.pedidosNuevos.toString(),
      trend: `${stats.crecimientoPedidos >= 0 ? '+' : ''}${stats.crecimientoPedidos.toFixed(1)}%`,
      trendUp: stats.crecimientoPedidos >= 0,
      icon: ShoppingBag,
      color: 'text-mare-turquoise',
      bg: 'bg-mare-turquoise/10'
    },
    {
      title: 'Catálogo Activo',
      value: stats.productosStock.toString(),
      trend: 'Inventario real',
      trendUp: true,
      icon: Package,
      color: 'text-mare-navy',
      bg: 'bg-mare-navy/10'
    },
    {
      title: 'Visitas Globales',
      value: stats.visitasTotales.toLocaleString(),
      trend: 'Tráfico Real',
      trendUp: true,
      icon: Eye,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      action: {
        label: 'Reset',
        onClick: async () => {
          if (confirm('¿Deseas resetear el contador de visitas a 1?')) {
            try {
              await metricsService.resetGlobalVisits();
              loadDashboardData();
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-mare-navy border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando Dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-mare-navy uppercase tracking-tight">Panel de Control</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-mare-turquoise uppercase tracking-[0.2em]">Resumen Operativo</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supabase Cloud</span>
          </div>
        </div>
        <button 
          onClick={loadDashboardData}
          className="group flex items-center rounded-2xl px-6 py-3.5 font-black uppercase tracking-widest text-[10px] bg-white text-mare-navy border border-gray-100 hover:border-mare-navy shadow-sm transition-all active:scale-95"
        >
          <RefreshCcw size={14} className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
          Refrescar Datos
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:border-mare-gold/30 transition-all group cursor-default relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-gray-50/50 -mr-16 -mt-16 rounded-full"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                  <Icon size={28} strokeWidth={2.5} />
                </div>
                <div className={`flex items-center text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full ${
                  kpi.trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                }`}>
                  {kpi.trendUp ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                  {kpi.trend}
                </div>
              </div>
              
              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <h3 className="text-4xl font-black text-mare-navy tracking-tight">{kpi.value}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{kpi.title}</p>
                </div>
                {kpi.action && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); kpi.action?.onClick(); }}
                    className="mb-1 px-3 py-1.5 rounded-xl bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:bg-mare-navy hover:text-white transition-all shadow-sm"
                  >
                    {kpi.action.label}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Middle Section (Charts/Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Placeholder for Sales Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col relative"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
              <h2 className="text-sm font-black text-mare-navy uppercase tracking-widest flex items-center">
                <TrendingUp size={18} className="mr-3 text-mare-gold" />
                Flujo de Ingresos
              </h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 ml-7">Últimos 30 días</span>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-widest">Mensual</span>
            </div>
          </div>
          
          <div className="flex-1 min-h-[350px]">
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="colorSalesDashboard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#001F3F" stopOpacity={0.08}/>
                      <stop offset="95%" stopColor="#001F3F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: '900', fill: '#9CA3AF' }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: '900', fill: '#9CA3AF' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '20px', 
                      border: '1px solid #F3F4F6', 
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', 
                      fontSize: '11px',
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      padding: '12px 16px'
                    }}
                    cursor={{ stroke: '#001F3F', strokeWidth: 1, strokeDasharray: '4 4' }}
                    formatter={(value: number) => [formatPrice(value), 'Ventas']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#001F3F" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorSalesDashboard)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/30">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <Activity size={32} className="text-gray-200" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center px-4">
                  No hay datos suficientes<br/><span className="text-mare-turquoise">Intenta realizar una venta primero</span>
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions / Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col"
        >
          <h2 className="text-sm font-black text-mare-navy uppercase tracking-widest flex items-center mb-8">
            <Activity size={18} className="mr-3 text-mare-turquoise" />
            Últimos Pedidos
          </h2>
          
          <div className="space-y-1 flex-1 overflow-y-auto max-h-[400px] hide-scrollbar pr-1">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, idx) => (
                <div key={order.id}>
                  <div 
                    className="flex gap-4 group cursor-pointer p-3 hover:bg-gray-50 rounded-2xl transition-all" 
                    onClick={() => window.location.href = `/mare0311/pedidos/${order.id}`}
                  >
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-mare-navy group-hover:bg-mare-navy group-hover:text-white transition-all shadow-sm">
                      <ShoppingBag size={20} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-xs font-black text-mare-navy uppercase tracking-tight truncate leading-none">
                        {order.customer?.nombre || 'Pedido #' + order.order_number}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] font-black text-mare-green">
                          {formatPrice(order.total_cup)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={14} className="text-mare-turquoise" />
                    </div>
                  </div>
                  {idx < recentOrders.length - 1 && (
                    <div className="h-px w-full border-t border-dashed border-gray-100 my-1 mx-4"></div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-100">
                <ShoppingBag size={40} className="mx-auto text-gray-200 mb-3" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Esperando pedidos...</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => window.location.href = '/mare0311/pedidos'}
            className="w-full mt-8 py-4 rounded-2xl bg-mare-navy text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-mare-navy/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Ver Historial Completo
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
