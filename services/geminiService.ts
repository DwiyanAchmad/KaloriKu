import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFoodImage = async (base64Image: string): Promise<NutritionData> => {
  // Remove header data if present (e.g., "data:image/jpeg;base64,")
  const base64Data = base64Image.split(',')[1] || base64Image;

  const modelId = "gemini-2.5-flash"; // Using Flash for speed and multimodal capabilities

  const prompt = `
    Analisis gambar makanan ini. Identifikasi makanan tersebut dan perkirakan kandungan nutrisinya untuk porsi yang terlihat.
    
    1. Berikan estimasi kalori, protein (gram), karbohidrat (gram), lemak (gram), serat (gram), dan gula (gram).
    2. Perkirakan "servingSize" (ukuran porsi) yang terlihat (contoh: "1 piring (250g)", "1 potong besar").
    3. Identifikasi dan buat daftar "detectedItems" yaitu semua komponen makanan utama yang terlihat (contoh: "Nasi Putih", "Ayam Bakar", "Tahu Goreng", "Sayur Asem").
    4. Berikan "macroInsights" untuk protein, karbohidrat, lemak, dan gula. Jelaskan secara singkat sumbernya atau kualitasnya dalam konteks makanan ini (misal: "Protein tinggi dari daging sapi" atau "Gula alami dari buah").
    
    Berikan penjelasan singkat tentang makanan tersebut dan tips kesehatan singkat.
    Pastikan semua teks dalam Bahasa Indonesia yang natural.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING, description: "Nama makanan dalam Bahasa Indonesia" },
            servingSize: { type: Type.STRING, description: "Perkiraan ukuran porsi visual" },
            detectedItems: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Daftar komponen makanan yang terdeteksi" 
            },
            calories: { type: Type.NUMBER, description: "Total kalori (kcal)" },
            protein: { type: Type.NUMBER, description: "Protein dalam gram" },
            carbs: { type: Type.NUMBER, description: "Karbohidrat dalam gram" },
            fat: { type: Type.NUMBER, description: "Lemak dalam gram" },
            fiber: { type: Type.NUMBER, description: "Serat dalam gram" },
            sugar: { type: Type.NUMBER, description: "Gula dalam gram" },
            explanation: { type: Type.STRING, description: "Penjelasan singkat tentang makanan ini" },
            healthTips: { type: Type.STRING, description: "Saran kesehatan singkat terkait makanan ini" },
            macroInsights: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.STRING, description: "Insight tentang protein" },
                carbs: { type: Type.STRING, description: "Insight tentang karbohidrat" },
                fat: { type: Type.STRING, description: "Insight tentang lemak" },
                sugar: { type: Type.STRING, description: "Insight tentang gula" },
              },
              required: ["protein", "carbs", "fat", "sugar"]
            }
          },
          required: ["foodName", "calories", "protein", "carbs", "fat", "fiber", "sugar", "explanation", "healthTips", "servingSize", "macroInsights", "detectedItems"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response text received from Gemini");
    }

    const data = JSON.parse(jsonText) as NutritionData;
    return data;
  } catch (error) {
    console.error("Error analyzing food:", error);
    throw error;
  }
};