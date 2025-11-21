
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, GeneratedPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for structured output
const planSchema = {
  type: Type.OBJECT,
  properties: {
    motivation: {
      type: Type.STRING,
      description: "Uma frase motivacional muito curta (máximo 20 palavras) e impactante."
    },
    workoutRoutine: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayName: { type: Type.STRING, description: "Ex: Segunda-feira ou Dia A" },
          focus: { type: Type.STRING, description: "Ex: Peito e Tríceps" },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sets: { type: Type.STRING },
                reps: { type: Type.STRING },
                notes: { type: Type.STRING, description: "Dica técnica muito breve (max 10 palavras)." }
              }
            }
          }
        }
      }
    },
    nutritionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "Ex: Café da Manhã" },
          totalCalories: { type: Type.NUMBER },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                portion: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER }
              }
            }
          },
          substitutions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Lista de 2 opções curtas para troca."
          }
        }
      }
    }
  },
  required: ["motivation", "workoutRoutine", "nutritionPlan"]
};

export const generateUserPlan = async (profile: UserProfile): Promise<GeneratedPlan> => {
  const modelId = "gemini-2.5-flash"; 

  const prompt = `
    Crie um plano de treino e dieta para: ${profile.name}
    Objetivo: ${profile.goal} | Nível: ${profile.level}
    Dados: ${profile.age} anos, ${profile.weight}kg, ${profile.height}cm
    
    CONTEXTO:
    - Equipamento: ${profile.equipment}
    - Limitações Físicas: "${profile.physicalLimitations || "Nenhuma"}" (Adapte o treino se houver).
    - Ponto Fraco Alimentar: "${profile.foodCravings || "Nenhum"}" (Se houver, inclua 1 receita fit no lanche).
    - Futebol: ${profile.playsSoccer ? "Sim" : "Não"}

    REGRAS CRÍTICAS DE FORMATAÇÃO:
    1. SEJA EXTREMAMENTE CONCISO. Evite textos longos.
    2. A 'motivation' deve ter no MÁXIMO 2 frases curtas.
    3. NÃO escreva blocos de texto gigantes.
    4. Responda apenas com o JSON.

    Idioma: Português (pt-BR).
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: planSchema,
        temperature: 0.5, // Temperatura reduzida para evitar alucinação/loops
      },
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");
    
    // Limpeza Robusta de JSON
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
        return JSON.parse(cleanText) as GeneratedPlan;
    } catch (parseError) {
        console.error("Erro de Parsing JSON:", parseError);
        throw new Error("Erro ao processar o formato do plano. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro ao gerar plano:", error);
    throw error;
  }
};

export const generateDailyQuote = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Gere uma frase curta e muito inspiradora sobre fitness. Apenas a frase, sem aspas.",
    });
    return response.text || "A disciplina é a ponte entre metas e realizações.";
  } catch (e) {
    return "O único treino ruim é aquele que não aconteceu.";
  }
};

export const sendSupplementChatMessage = async (history: string[], newMessage: string): Promise<string> => {
  try {
    const systemPrompt = `
      Você é um especialista em nutrição esportiva.
      Seja direto e amigável. Responda em Português do Brasil.
      Priorize respostas curtas e práticas.
    `;
    
    const fullPrompt = `${systemPrompt}\n\nHistórico:\n${history.join('\n')}\n\nUsuário: ${newMessage}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    return response.text || "Desculpe, não consegui processar sua dúvida agora.";
  } catch (error) {
    console.error(error);
    return "Erro ao conectar com o especialista. Tente novamente.";
  }
}
