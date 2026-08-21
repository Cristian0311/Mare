import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Setup
  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/log", (req, res) => { 
    console.log("BROWSER ERROR:", req.body); 
    res.send("ok"); 
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

  // Determine if we should run in production mode
  // Resilient check: if dist/index.html exists, we are likely in production
  const hasDist = fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'));
  const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true" || hasDist;
  const distPath = path.join(process.cwd(), 'dist');

  // Vite middleware for development
  if (!isProduction) {
    console.log("Running in DEVELOPMENT mode with Vite middleware");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Running in PRODUCTION mode serving from:", distPath);
    app.use(express.static(distPath));
    
    // Prevent fallback to index.html for missing assets
    app.use('/assets', (req, res) => {
      res.status(404).send('Not found');
    });

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}



startServer();

