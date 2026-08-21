export type BIPeriod = 'today' | 'yesterday' | '7d' | '30d' | 'this_month' | 'last_month' | 'custom';

export interface BIDateRange {
  startDate: string;
  endDate: string;
  label: string;
  prevStartDate: string;
  prevEndDate: string;
}

export interface BIFilters {
  period: BIPeriod;
  customStartDate?: string;
  customEndDate?: string;
  categoryId?: string;
  supplierId?: string;
  orderType?: 'all' | 'retail' | 'wholesale' | 'reservation';
  searchQuery?: string;
}

export interface ExecutiveSummary {
  grossSales: number;
  discounts: number;
  netSales: number;
  totalOrders: number;
  avgTicket: number;
  totalProfit: number;
  avgMarginPercent: number;
  unitsSold: number;
  totalReservationsCount: number;
  reservationsValue: number;
  wholesaleSales: number;
  wholesaleOrdersCount: number;
  
  // Comparisons against previous period
  prevNetSales: number;
  netSalesGrowth: number;
  prevOrdersCount: number;
  ordersGrowth: number;
  prevAvgTicket: number;
  avgTicketGrowth: number;
  prevProfit: number;
  profitGrowth: number;
}

export interface ProductBIPerformance {
  id: string;
  nombre: string;
  sku: string;
  categoriaNombre?: string;
  subcategoriaNombre?: string;
  unitsSold: number;
  grossSales: number;
  discounts: number;
  netSales: number;
  totalCost: number;
  totalProfit: number;
  marginPercent: number;
  currentStock: number;
  costCup: number;
  priceCup: number;
  growthPercent?: number; // vs previous period
  isStagnant: boolean; // Stock > 0 & 0 or very low sales in period
  isZeroSales: boolean;
  status: 'active' | 'inactive';
}

export interface InventoryBIMetrics {
  totalItemsCount: number;
  totalUnitsInStock: number;
  outOfStockCount: number;
  lowStockCount: number;
  highRotationCount: number;
  lowRotationCount: number;
  
  // Valuations
  inventoryCostValue: number; // sum(stock * cost)
  potentialRetailValue: number; // sum(stock * retail_price)
  potentialGrossProfit: number; // potentialRetailValue - inventoryCostValue
  stagnantCapitalCost: number; // sum(cost * stock) for items with 0 sales in 30+ days
}

export interface ReservationBIMetrics {
  totalReservations: number;
  totalValueCup: number;
  depositReceived30Percent: number;
  remainingPending70Percent: number;
  completedReservations: number;
  canceledReservations: number;
  pendingReservations: number;
  cancellationRatePercent: number;
  topProfitableReservedProducts: Array<{
    productId: string;
    productName: string;
    reservedCount: number;
    totalRevenue: number;
    estimatedProfit: number;
    marginPercent: number;
  }>;
}

export interface WholesaleBIMetrics {
  totalWholesaleSales: number;
  totalWholesaleOrders: number;
  avgWholesaleTicket: number;
  wholesaleProfit: number;
  wholesaleMarginPercent: number;
  totalWholesaleClientsCount: number;
  topWholesaleProducts: Array<{
    productId: string;
    productName: string;
    unitsSold: number;
    packagesSold: number;
    revenue: number;
    profit: number;
  }>;
}

export interface SupplierBIMetrics {
  supplierId: string;
  supplierName: string;
  contactName?: string;
  productsCount: number;
  costChangesCount: number;
  lastCostIncreaseDate?: string;
  avgCostIncreasePercent?: number;
  associatedSalesRevenue: number;
  associatedProfit: number;
  associatedMarginPercent: number;
  costIncreaseAlerts: Array<{
    productId: string;
    productName: string;
    oldCost: number;
    newCost: number;
    increasePercent: number;
    currentMarginPercent: number;
  }>;
}

export interface PromotionBIMetrics {
  promotionId: string;
  promotionName: string;
  type: string;
  salesGenerated: number;
  ordersCount: number;
  discountsGranted: number;
  netRevenue: number;
  profit: number;
  marginPercent: number;
  status: 'successful' | 'margin_eroding' | 'neutral' | 'inactive';
  recommendationNote: string;
}

export interface ComboBIMetrics {
  bundleId: string;
  bundleName: string;
  bundlesSold: number;
  totalRevenue: number;
  totalProfit: number;
  marginPercent: number;
  customerSavingsDelivered: number;
}

export interface CustomerBIMetrics {
  totalCustomers: number;
  newCustomersPeriod: number;
  recurringCustomersPeriod: number;
  repeatPurchaseRatePercent: number;
  avgCustomerLifetimeValue: number;
  frequentBuyersCount: number;
  topSpendingCustomers: Array<{
    id: string;
    nombre: string;
    whatsapp?: string;
    ordersCount: number;
    totalSpentCup: number;
    lastOrderDate: string;
  }>;
}

export interface RecommendationBIMetrics {
  impressions: number;
  clicks: number;
  addToCartCount: number;
  convertedPurchasesCount: number;
  conversionRatePercent: number;
  attributedRevenueCup: number;
}

export interface CategoryBIMetrics {
  categoryId: string;
  categoryName: string;
  unitsSold: number;
  netSales: number;
  profit: number;
  marginPercent: number;
  growthPercent: number;
}

export interface BIAlert {
  id: string;
  type: 'low_stock' | 'stagnant_product' | 'low_margin' | 'negative_margin' | 'unprofitable_promo' | 'high_growth' | 'supplier_cost_increase';
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  productId?: string;
  supplierId?: string;
  actionRecommendation: string;
}

export interface BITrend {
  direction: 'growing' | 'dropping' | 'stable';
  entityType: 'product' | 'category' | 'channel' | 'overall';
  entityName: string;
  metricLabel: string;
  changeValuePercent: number;
  periodComparisonLabel: string;
  description: string;
}

export interface AIAnalystReport {
  timestamp: string;
  executiveSummaryText: string;
  keyInsights: string[];
  actionableRecommendations: string[];
  dataConfidenceLevel: 'Baja' | 'Media' | 'Alta';
  hasSufficientData: boolean;
}

export interface CompleteBIMetricsResponse {
  filters: BIFilters;
  dateRange: BIDateRange;
  executiveSummary: ExecutiveSummary;
  productPerformance: ProductBIPerformance[];
  topSellingProducts: ProductBIPerformance[];
  topProfitableProducts: ProductBIPerformance[];
  lowRotationProducts: ProductBIPerformance[];
  zeroSalesProducts: ProductBIPerformance[];
  growingProducts: ProductBIPerformance[];
  droppingProducts: ProductBIPerformance[];
  inventory: InventoryBIMetrics;
  reservations: ReservationBIMetrics;
  wholesale: WholesaleBIMetrics;
  suppliers: SupplierBIMetrics[];
  promotions: PromotionBIMetrics[];
  combos: ComboBIMetrics[];
  customers: CustomerBIMetrics;
  recommendations: RecommendationBIMetrics;
  categories: CategoryBIMetrics[];
  trends: BITrend[];
  alerts: BIAlert[];
  aiReport?: AIAnalystReport;
  hasEnoughData: boolean;
  dataNotes?: string;
}
