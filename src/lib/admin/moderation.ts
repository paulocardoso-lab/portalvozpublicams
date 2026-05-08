/**
 * spamFilter — Utilitário simples para detecção de spam e moderação automática.
 */
export function isSpam(content: string): { spam: boolean; reason?: string } {
  const lowercase = content.toLowerCase();
  
  // 1. Palavras-chave de spam comuns
  const spamKeywords = [
    'ganhe dinheiro', 'trabalhe em casa', 'clique aqui', 'bit.ly', 't.co', 
    'oportunidade única', 'renda extra', 'investimento garantido',
    'viagra', 'casino', 'betting', 'poker', 'apostas'
  ];

  for (const word of spamKeywords) {
    if (lowercase.includes(word)) {
      return { spam: true, reason: `Keyword detectada: ${word}` };
    }
  }

  // 2. Excesso de links
  const linkCount = (content.match(/https?:\/\//g) || []).length;
  if (linkCount > 2) {
    return { spam: true, reason: 'Excesso de links (possível bot)' };
  }

  // 3. Texto todo em maiúsculas (gritaria)
  if (content.length > 20 && content === content.toUpperCase()) {
    return { spam: true, reason: 'Texto em maiúsculas (gritaria)' };
  }

  return { spam: false };
}

/**
 * censorProfanity — Substitui palavras ofensivas por asteriscos.
 */
export function censorProfanity(content: string): string {
  const profanity = [
    'porra', 'caralho', 'fuder', 'foda', 'merda', 'cacete' // Exemplo básico
  ];

  let censored = content;
  for (const word of profanity) {
    const regex = new RegExp(word, 'gi');
    censored = censored.replace(regex, '****');
  }

  return censored;
}
