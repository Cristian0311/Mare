import { Product } from '../types';

export const aiService = {
  async recommendPlacement(products: Product[]): Promise<Array<{ productId: string, placement: "Oferta" | "Recién Llegado" | "Destacado", reason: string }>> {
    try {
      // We only send relevant fields to save tokens
      const simplifiedProducts = products.map(p => ({
        id: p.id,
        nombre: p.nombre,
        precio: p.precioMN,
        precioAnterior: p.precioAnteriorMN,
        stock: p.stock_quantity,
        fechaCreacion: p.fechaCreacion,
        nuevo: p.nuevo,
        oferta: p.oferta,
        destacado: p.destacado
      }));

      const response = await fetch("/api/ai/recommend-placement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ products: simplifiedProducts })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al obtener recomendación de la IA");
      }

      return await response.json();
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  }
};
