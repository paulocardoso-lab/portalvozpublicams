import "dotenv/config";
import { PrismaClient } from '@prisma/client'

console.log('DB URL check:', process.env.DATABASE_URL ? 'Found' : 'Missing');

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Criar Seções (Editorias)
  const sections = [
    { name: 'Política', slug: 'politica', description: 'Cobertura do Legislativo e Executivo de MS.' },
    { name: 'Cidades', slug: 'cidades', description: 'O que acontece nos 79 municípios do estado.' },
    { name: 'Pantanal', slug: 'pantanal', description: 'Ciência, meio ambiente e as vozes do bioma.' },
    { name: 'Indígenas', slug: 'indigenas', description: 'Territórios, cultura e direitos originários.' },
    { name: 'Agronegócio', slug: 'agronegocio', description: 'A força econômica e os desafios do campo.' },
  ]

  for (const s of sections) {
    await prisma.section.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    })
  }

  // 2. Criar um usuário Editor (para ser autor)
  const editor = await prisma.user.upsert({
    where: { email: 'editor@vozpublicams.com.br' },
    update: {},
    create: {
      email: 'editor@vozpublicams.com.br',
      name: 'Marina Ribeiro',
      role: 'EDITOR_CHIEF',
      status: 'ACTIVE',
    },
  })

  // 3. Criar uma matéria de exemplo
  await prisma.article.upsert({
    where: { slug: 'o-rio-que-sumiu-taquari-assoreamento' },
    update: {},
    create: {
      slug: 'o-rio-que-sumiu-taquari-assoreamento',
      title: 'O rio que sumiu: como o Taquari virou corredor de sedimentos',
      eyebrow: 'Especial Pantanal',
      lead: 'Em oito meses de apuração, nossa equipe percorreu 420 km do leito do principal afluente do Pantanal sul.',
      body: {
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'O Taquari amanhece cor de terra. Um pescador que há trinta anos puxa pintado dessas águas abaixa a voz para contar o que já não espera: "o rio acabou, moço".' }] }
        ]
      },
      status: 'PUBLISHED',
      publishedAt: new Date(),
      section: { connect: { slug: 'pantanal' } },
      authors: { connect: { id: editor.id } },
    },
  })

  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
