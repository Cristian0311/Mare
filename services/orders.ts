export interface CreateOrderParams {
  order_number: string;
  order_type: 'retail';
  customer_data: { nombre: string; telefono: string; whatsapp?: string; correo?: string; };
  advisor_id?: string;
  subtotal_cup: number;
  delivery_fee_cup: number;
  total_cup: number;
  province_id?: string;
  municipality_id?: string;
  address?: string;
  customer_notes?: string;
  items: Array<{ product_id: string; product_name: string; unit_price_cup: number; quantity: number; subtotal_cup: number; variant_info?: any; }>;
}

export class OrderService {
  async createOrder(params: CreateOrderParams) {
    // Mare no crea pedidos en una base paralela. El pedido se entrega por WhatsApp.
    return {
      id: params.order_number,
      order_number: params.order_number,
      status: 'pending',
      ...params
    };
  }

  async getAllOrders() { return []; }
  async getOrders() { return { data: [], count: 0 }; }
  async getOrderById() { return null; }
  async updateOrderStatus() { throw new Error('Los pedidos operativos se administran en el CRM.'); }
  async updateOrder() { throw new Error('Los pedidos operativos se administran en el CRM.'); }
}

export const orderService = new OrderService();
