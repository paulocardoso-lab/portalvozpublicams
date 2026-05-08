import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function rewriteArticleContent(title: string, lead: string, fullText: string) {
  const prompt = `
    Você é um editor sênior do portal de notícias "Voz Pública MS".
    Sua tarefa é reescrever o título e o lead de uma matéria capturada via RSS para garantir que:
    1. O conteúdo seja original (evite plágio e melhore SEO).
    2. O tom seja profissional, imparcial e focado no interesse público de Mato Grosso do Sul.
    3. O título seja impactante e contenha palavras-chave importantes.

    ENTRADA:
    Título Original: ${title}
    Lead Original: ${lead}
    Trecho do Conteúdo: ${fullText.substring(0, 2000)}

    DÊ O RESULTADO APENAS EM FORMATO JSON:
    {
      "title": "Novo título reescrito",
      "lead": "Novo lead reescrito com aproximadamente 200-300 caracteres",
      "tags": ["Tag1", "Tag2", "Tag3"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Limpar o texto caso venha com markdown code blocks
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini rewrite error:", error);
    return { title, lead, tags: [] }; // Fallback para o original
  }
}
