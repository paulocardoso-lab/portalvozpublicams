import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// ── rewriteArticleContent ────────────────────────────────────────────────────
// Rewrites title, lead and generates tags from raw source text.

export async function rewriteArticleContent(title: string, lead: string, fullText: string) {
  const textSample = fullText.substring(0, 6000).trim();

  const prompt = `Você é um editor sênior do portal "Voz Pública MS", de jornalismo independente em Mato Grosso do Sul.

Recebi uma matéria capturada via RSS. Sua tarefa é:
1. Reescrever o TÍTULO para ser claro, impactante e conter as palavras-chave da notícia.
2. Reescrever o LEAD (primeiro parágrafo) com 150-250 caracteres, respondendo: quem, o quê, quando, onde.
3. Sugerir de 3 a 5 TAGS relevantes relacionadas ao conteúdo e ao contexto de Mato Grosso do Sul.

REGRAS:
- Use APENAS informações presentes no texto abaixo. NÃO invente fatos.
- Tom: jornalístico, imparcial, objetivo.
- Não mencione o nome de outros portais no título ou lead.
- Se o texto for insuficiente para um lead informativo, use o título como base.

ENTRADA:
Título: ${title}
Lead atual: ${lead}
Conteúdo completo:
${textSample}

Responda APENAS com JSON válido, sem markdown, sem explicações:
{"title":"...","lead":"...","tags":["...","...","..."]}`;

  try {
    const result = await model.generateContent(prompt);
    const text = (await result.response).text().replace(/```json|```/g, '').trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in Gemini response');
    const parsed = JSON.parse(jsonMatch[0]);
    if (typeof parsed.title !== 'string' || !parsed.title.trim()) parsed.title = title;
    if (typeof parsed.lead !== 'string' || !parsed.lead.trim()) parsed.lead = lead || title;
    if (!Array.isArray(parsed.tags)) parsed.tags = [];
    return parsed as { title: string; lead: string; tags: string[] };
  } catch (error) {
    console.error('Gemini rewriteArticleContent error:', error);
    return { title, lead: lead || title, tags: [] };
  }
}

// ── humanizeArticleContent ───────────────────────────────────────────────────
// Rewrites the full body paragraphs in a human, journalistic voice.
// Returns an array of rewritten paragraph strings, preserving the original
// structure and facts — never adding or removing information.

export async function humanizeArticleContent(
  title: string,
  paragraphs: string[]
): Promise<string[]> {
  if (paragraphs.length === 0) return [];

  // Keep prompt under ~7000 chars to stay in flash's fast window
  const bodyText = paragraphs
    .map((p, i) => `[${i + 1}] ${p}`)
    .join('\n\n')
    .substring(0, 7000);

  const prompt = `Você é um jornalista experiente do portal "Voz Pública MS".

Reescreva os parágrafos abaixo de forma HUMANA e OBJETIVA, como se você estivesse contando a história para um leitor inteligente — sem jargões de agência de notícias, sem linguagem de press release, sem frases passivas desnecessárias.

REGRAS ABSOLUTAS:
- Preserve TODOS os fatos, datas, nomes, números e citações do original. NÃO invente nem omita dados.
- Mantenha a mesma ordem de informações e o mesmo número de parágrafos.
- Cada parágrafo reescrito deve ter conteúdo equivalente ao parágrafo original numerado.
- Não funda dois parágrafos em um, não divida um em dois.
- Tom: direto, claro, humano. Evite advérbios excessivos e construções burocráticas.
- Não mencione outros portais ou veículos de comunicação no corpo do texto.

TÍTULO DA MATÉRIA: ${title}

PARÁGRAFOS ORIGINAIS:
${bodyText}

Responda APENAS com JSON válido contendo um array de strings, uma por parágrafo, na mesma ordem:
["parágrafo 1 reescrito","parágrafo 2 reescrito",...]`;

  try {
    const result = await model.generateContent(prompt);
    const text = (await result.response).text().replace(/```json|```/g, '').trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array in Gemini response');
    const parsed: unknown = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) throw new Error('Response is not an array');

    const rewritten = parsed
      .map((p: unknown) => (typeof p === 'string' ? p.trim() : ''))
      .filter(Boolean);

    // Safety: if Gemini returned fewer paragraphs than we sent, pad with originals
    if (rewritten.length < paragraphs.length) {
      for (let i = rewritten.length; i < paragraphs.length; i++) {
        rewritten.push(paragraphs[i]);
      }
    }

    return rewritten;
  } catch (error) {
    console.error('Gemini humanizeArticleContent error:', error);
    // Fallback: return originals unchanged
    return paragraphs;
  }
}
