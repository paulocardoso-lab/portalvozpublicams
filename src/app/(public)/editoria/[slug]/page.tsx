import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { DesktopSection } from '@/components/section/DesktopSection';
import { MobileMasthead } from '@/components/layout/MobileMasthead';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import Link from 'next/link';
import { ImgPH } from '@/components/shared/ImgPH';
import Image from 'next/image';

const publicAuthorSelect = {
  id: true,
  name: true,
  slug: true,
  avatar: true,
} as const;

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const section = await prisma.section.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        include: { authors: { select: publicAuthorSelect } },
        orderBy: { publishedAt: 'desc' },
        take: 12,
      }
    }
  });

  if (!section) notFound();

  const articles = section.articles;
  const featured = articles[0];
  const list = articles.slice(1);
  
  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <DesktopSection section={section} articles={articles} />
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden flex flex-col min-h-screen bg-vp-bg w-full">
        <MobileMasthead />
        
        <div className="px-4 py-6 border-b-2 border-vp-text">
          <div className="eyebrow text-[10px] mb-1">Editoria</div>
          <h1 className="font-display text-[42px] leading-none mb-3">{section.name}</h1>
          <p className="font-serif text-[15px] text-vp-text-2 leading-[1.5]">
            {section.description || `Cobertura de ${section.name} em MS.`}
          </p>
        </div>

        <div className="px-4 py-4 flex flex-col gap-6 pb-24">
          {featured && (
            <article className="pb-6 border-b border-vp-border">
              <Link href={`/materia/${featured.slug}`}>
                {featured.heroImage ? (
                  <div className="relative aspect-[16/9] w-full mb-3 rounded-sm overflow-hidden">
                    <Image src={featured.heroImage} alt="" fill className="object-cover" />
                  </div>
                ) : (
                  <ImgPH label="destaque" height={200} className="mb-3" />
                )}
              </Link>
              <h2 className="font-display text-[26px] leading-tight mb-2">{featured.title}</h2>
              <p className="font-serif text-[14px] text-vp-text-2 line-clamp-3">{featured.lead}</p>
            </article>
          )}

          {list.map((art) => (
            <article key={art.id} className="grid grid-cols-[100px_1fr] gap-3 pb-4 border-b border-vp-border">
              <Link href={`/materia/${art.slug}`}>
                {art.heroImage ? (
                  <div className="relative aspect-square w-full rounded-sm overflow-hidden">
                    <Image src={art.heroImage} alt="" fill className="object-cover" />
                  </div>
                ) : (
                  <ImgPH label="" width={100} height={100} />
                )}
              </Link>
              <div>
                <h3 className="font-display text-[18px] leading-tight mb-1">{art.title}</h3>
                <div className="byline text-[10px]">há 2h · {art.authors?.[0]?.name}</div>
              </div>
            </article>
          ))}
        </div>

        <MobileTabBar active="search" />
      </div>
    </>
  );
}
