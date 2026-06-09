import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

// ── rewriteArticleContent ────────────────────────────────────────────────────
// Rewrites title, lead and generates tags from raw source text.

export async function rewriteArticleContent(
  title: string,
  lead: string,
  fullText: string,
  sections: { slug: string; name: string }[] = []
) {
  const textSample = fullText.substring(0, 6000).trim();

  const sectionBlock = sections.length > 0
    ? `\n4. Escolher a EDITORIA mais adequada para esta matéria entre as opções abaixo. Retorne o slug exato.\nEDITORIAS DISPONÍVEIS:\n${sections.map(s => `- ${s.slug}: ${s.name}`).join('\n')}\n`
    : '';

  const sectionJsonField = sections.length > 0 ? `,"sectionSlug":"<slug exato da editoria escolhida>"` : '';

  const prompt = `Você é um editor sênior do portal "Voz Pública MS", de jornalismo independente em Mato Grosso do Sul.

Recebi uma matéria capturada via RSS. Sua tarefa é:
1. Reescrever o TÍTULO para ser claro, impactante e conter as palavras-chave da notícia.
2. Reescrever o LEAD (primeiro parágrafo) com 150-250 caracteres, respondendo: quem, o quê, quando, onde.
3. Sugerir de 3 a 5 TAGS relevantes relacionadas ao conteúdo e ao contexto de Mato Grosso do Sul.${sectionBlock}

REGRAS:
- Use APENAS informações presentes no texto abaixo. NÃO invente fatos.
- Tom: jornalístico, imparcial, objetivo.
- Não mencione o nome de outros portais no título ou lead.
- Se o texto for insuficiente para um lead informativo, use o título como base.
- Para a editoria: escolha a que melhor representa o TEMA PRINCIPAL da matéria. Se nenhuma for adequada, omita o campo sectionSlug.

ENTRADA:
Título: ${title}
Lead atual: ${lead}
Conteúdo completo:
${textSample}

Responda APENAS com JSON válido, sem markdown, sem explicações:
{"title":"...","lead":"...","tags":["...","...","..."]${sectionJsonField}}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    });
    const text = (completion.choices[0].message.content || '').replace(/```json|```/g, '').trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in OpenAI response');
    const parsed = JSON.parse(jsonMatch[0]);
    if (typeof parsed.title !== 'string' || !parsed.title.trim()) parsed.title = title;
    if (typeof parsed.lead !== 'string' || !parsed.lead.trim()) parsed.lead = lead || title;
    if (!Array.isArray(parsed.tags)) parsed.tags = [];
    if (typeof parsed.sectionSlug !== 'string') parsed.sectionSlug = null;
    return parsed as { title: string; lead: string; tags: string[]; sectionSlug: string | null };
  } catch (error) {
    console.error('OpenAI rewriteArticleContent error:', error);
    return { title, lead: lead || title, tags: [], sectionSlug: null };
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
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });
    const text = (completion.choices[0].message.content || '').replace(/```json|```/g, '').trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array in OpenAI response');
    const parsed: unknown = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) throw new Error('Response is not an array');

    const rewritten = parsed
      .map((p: unknown) => (typeof p === 'string' ? p.trim() : ''))
      .filter(Boolean);

    if (rewritten.length < paragraphs.length) {
      for (let i = rewritten.length; i < paragraphs.length; i++) {
        rewritten.push(paragraphs[i]);
      }
    }

    return rewritten;
  } catch (error) {
    console.error('OpenAI humanizeArticleContent error:', error);
    return paragraphs;
  }
}
