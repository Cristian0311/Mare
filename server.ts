import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import cron from "node-cron";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''; // Usamos la anon key (Asegúrate de que RLS permita updates a los productos desde el servidor, o configura SUPABASE_SERVICE_ROLE_KEY en Render)
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey; 
const supabase = createClient(supabaseUrl, supabaseRoleKey);

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ============================================================================
// TAREAS EN SEGUNDO PLANO (CRON JOBS)
// ============================================================================
// Se ejecuta todos los días a las 3:00 AM para rotar el catálogo (Destacados)
cron.schedule('0 3 * * *', async () => {
  console.log("Iniciando rotación automática del catálogo por IA (CRON)...");
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log("CRON Omitido: GEMINI_API_KEY no configurado");
      return;
    }
    
    // Obtener productos activos
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, description, stock_quantity, views_count, price_cup')
      .eq('status', 'active')
      .eq('available', true);
      
    if (error || !products || products.length === 0) {
      console.log("CRON Omitido: No se pudieron obtener los productos o no hay productos.");
      return;
    }

    const prompt = `
      Eres el gerente de e-commerce de la tienda MARÉ.
      Aquí tienes la lista actual de productos activos de la tienda:
      ${JSON.stringify(products)}
      
      Tu tarea es analizar el stock, las vistas (views_count) y el precio, y seleccionar EXACTAMENTE 8 productos para marcar como "Destacados" (is_featured = true) hoy.
      Criterios: 
      - Prioriza productos con buenas vistas o precios atractivos.
      - Si hay poco stock (pero mayor a 0), puede ser un buen gancho.
      
      Devuelve SOLO un JSON Array de strings con los IDs de los 8 productos seleccionados.
    `;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const selectedIds: string[] = JSON.parse(response.text || "[]");
    
    if (selectedIds.length > 0) {
      // 1. Quitar destacado a todos
      await supabase.from('products').update({ destacado: false }).neq('id', '00000000-0000-0000-0000-000000000000');
      // 2. Poner destacado a los seleccionados
      await supabase.from('products').update({ destacado: true }).in('id', selectedIds);
      console.log(`Rotación de catálogo exitosa. ${selectedIds.length} productos destacados actualizados.`);
    }
  } catch (err) {
    console.error("Error en el cron de rotación:", err);
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/log", (req, res) => { 
    try {
      console.log("BROWSER ERROR:", req.body); 
      fs.appendFileSync('browser_errors.log', JSON.stringify(req.body) + '\n');
    } catch (e) {
      console.error("Failed to append to browser_errors.log:", e);
    }
    res.send("ok"); 
  });

  // Generador de Vectores (Embeddings) para Búsqueda Semántica
  app.post("/api/ai/embeddings", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Texto requerido" });
      }
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY no configurado" });
      }

      const ai = getGeminiClient();
      const response = await ai.models.embedContent({
        model: "text-embedding-004",
        contents: text,
      });

      res.json({ embedding: response.embeddings?.[0]?.values || [] });
    } catch (error: any) {
      console.error("Gemini Error (Embeddings):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Recommendation Route
  app.post("/api/ai/recommend-placement", async (req, res) => {
    try {
      const { products } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY no configurado" });
      }

      const prompt = `Analiza la siguiente lista de productos de un e-commerce y sugiere en qué sección del inicio deberían ubicarse: "Oferta", "Recién Llegado" o "Destacado".
      
      Criterios sugeridos:
      - Recién Llegado: Productos creados recientemente.
      - Oferta: Productos con precio reducido o stock alto que se quiera liquidar.
      - Destacado: Productos de alta gama, populares o con buen margen.

      Productos: ${JSON.stringify(products)}

      Responde ÚNICAMENTE con un JSON válido que sea un array de objetos con: { productId: string, placement: "Oferta" | "Recién Llegado" | "Destacado", reason: string }`;

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                productId: { type: Type.STRING },
                placement: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["productId", "placement", "reason"]
            }
          }
        }
      });

      res.json(JSON.parse(response.text || "[]"));
    } catch (error: any) {
      console.error("Gemini Error (Recommend):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Analyst Report Route
  app.post("/api/ai/analyze-metrics", async (req, res) => {
    try {
      const { data } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY no configurado" });
      }

      const prompt = `Actúa como el Analista de Inteligencia Comercial de la tienda MARÉ en Cuba.
Analiza las siguientes métricas del negocio del período (${data.periodLabel}):
- Ventas Netas: $${data.executiveSummary.netSales} CUP
- Pedidos Totales: ${data.executiveSummary.totalOrders}
- Ticket Promedio: $${data.executiveSummary.avgTicket} CUP
- Margen Promedio: ${data.executiveSummary.avgMarginPercent}%
- Valor Inventario Costo: $${data.inventory.inventoryCostValue} CUP
- Capital Inmovilizado: $${data.inventory.stagnantCapitalCost} CUP
- Top Producto: ${data.topProductName || 'N/A'}
- Alertas Activas: ${data.alertsCount}

Responde en formato JSON válido con las siguientes claves exactas:
{
  "executiveSummaryText": "resumen ejecutivo en 2 oraciones sencillas",
  "keyInsights": ["insight 1", "insight 2", "insight 3"],
  "actionableRecommendations": ["recomendación 1", "recomendación 2"]
}`;

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummaryText: { type: Type.STRING },
              keyInsights: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              actionableRecommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["executiveSummaryText", "keyInsights", "actionableRecommendations"]
          }
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Gemini Error (Analyst):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && process.env.VITE_DEV !== "false") {
    console.log("Starting Vite in middleware mode (development)...");
    try {
      const vite = await createViteServer({
        server: { 
          middlewareMode: true, 
          host: '0.0.0.0', 
          port: PORT,
          hmr: process.env.DISABLE_HMR !== 'true',
        },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite middleware attached successfully.");
    } catch (e) {
      console.error("Critical: Failed to initialize Vite server:", e);
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    console.log("Serving static production build from:", distPath);
    
    if (!fs.existsSync(distPath)) {
      console.error("CRITICAL: dist directory NOT FOUND. Make sure to run 'npm run build' first.");
    }
    
    app.use(express.static(distPath));
    
    // Prevent fallback to index.html for missing assets
    app.use('/assets', (req, res) => {
      res.status(404).send('Not found');
    });

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n============================================================`);
    console.log(`MARÉ SERVER STARTED SUCCESSFULLY`);
    console.log(`PORT: ${PORT}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'Present' : 'Missing'}`);
    console.log(`============================================================\n`);
  });

  server.on('error', (err: any) => {
    console.error('Express Server Error:', err);
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Exiting cleanly so runner can restart...`);
      process.exit(1);
    }
  });

  // Graceful shutdown handling
  const shutdown = (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log("Closed out remaining connections.");
      process.exit(0);
    });

    // Force close after 2 seconds
    setTimeout(() => {
      console.error("Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 2000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on('uncaughtException', (err: any) => {
    console.error('Uncaught Exception:', err);
    if (err?.code === 'EADDRINUSE') {
      process.exit(1);
    }
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

