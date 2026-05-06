import React from 'react';
import { MobileHome } from '@/components/home/MobileHome';
import { DesktopHome } from '@/components/home/DesktopHome';

export default function Home() {
  return (
    <>
      <div className="md:hidden">
        <MobileHome />
      </div>
      <div className="hidden md:block">
        <DesktopHome />
      </div>
    </>
  );
}
