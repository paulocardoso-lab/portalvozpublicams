import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { DesktopSection } from '@/components/section/DesktopSection';
import { MobileMasthead } from '@/components/layout/MobileMasthead';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import Link from 'next/link';
import { ImgPH } from '@/components/shared/ImgPH';
import Image from 'next/image';
import { formatPortalDate } from '@/lib/portal-time';

const PAGE_SIZE = 12;

const publicAuthorSelect = {
  id: true,
  name: true,
  slug: true,
  avatar: true,
} as const;

export default async function SectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  const section = await prisma.section.findUnique({ where: { slug } });
  if (!section) notFound();

  const [total, articles] = await Promise.all([
    prisma.article.count({
      where: { sectionId: section.id, status: 'PUBLISHED' },
    }),
    prisma.article.findMany({
      where: { sectionId: section.id, status: 'PUBLISHED' },
      include: {
        authors: { select: publicAuthorSelect },
        _count: { select: { comments: { where: { status: 'APPROVED' } } } },
      },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const featured = articles[0];
  const list = articles.slice(1);

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <DesktopSection
          section={section}
          articles={articles}
          total={total}
          page={page}
          totalPages={totalPages}
        />
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden flex flex-col min-h-screen bg-vp-bg w-full">
        <MobileMasthead />

        <div className="px-4 py-5 border-b-2 border-vp-text">
          <div className="eyebrow text-[10px] mb-1">Editoria</div>
          <h1 className="font-display text-[32px] sm:text-[42px] leading-none mb-3">{section.name}</h1>
          <p className="font-serif text-[14px] sm:text-[15px] text-vp-text-2 leading-normal">
            {section.description || `Cobertura de ${section.name} em MS.`}
          </p>
        </div>

        <div className="px-4 py-4 flex flex-col gap-6 pb-20 sm:pb-6">
          {featured && (
            <article className="pb-6 border-b border-vp-border">
              <Link href={`/materia/${featured.slug}`}>
                {featured.heroImage ? (
                  <div className="relative aspect-video w-full mb-3 rounded-sm overflow-hidden">
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
                <div className="byline text-[10px]">
                  {art.publishedAt
                    ? formatPortalDate(art.publishedAt, { day: 'numeric', month: 'short' })
                    : ''} · {art.authors?.[0]?.name}
                </div>
              </div>
            </article>
          ))}

          {/* Paginação mobile */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1 pt-4 font-sans text-[13px]">
              {page > 1 && (
                <Link href={`/editoria/${slug}?page=${page - 1}`} className="vp-btn px-3 py-1.5 border border-vp-border">
                  ←
                </Link>
              )}
              <span className="px-3 py-1.5 text-vp-text-3">{page} / {totalPages}</span>
              {page < totalPages && (
                <Link href={`/editoria/${slug}?page=${page + 1}`} className="vp-btn px-3 py-1.5 border border-vp-border">
                  →
                </Link>
              )}
            </div>
          )}
        </div>

        <MobileTabBar active="search" />
      </div>
    </>
  );
}
