export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiais
    .replace(/[\s_-]+/g, '-') // Substituir espaços e underscores por hífens
    .replace(/^-+|-+$/g, ''); // Remover hífens no início e no fim
}
