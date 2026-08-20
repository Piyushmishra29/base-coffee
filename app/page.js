'use client';
import { useCallback, useState } from 'react';
import SmoothScroll from '@/components/SmoothScroll';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Manifesto from '@/components/Manifesto';
import MenuRail from '@/components/MenuRail';
import BaseBuddy from '@/components/BaseBuddy';
import ReelWall from '@/components/ReelWall';
import Events from '@/components/Events';
import Visit from '@/components/Visit';
import Footer from '@/components/Footer';
import ScrollMark from '@/components/ScrollMark';

export default function Page() {
  const [introDone, setIntroDone] = useState(false);
  const onIntroDone = useCallback(() => setIntroDone(true), []);

  return (
    <>
      <SmoothScroll />
      <Nav ready={introDone} />
      <ScrollMark ready={introDone} />
      <main id="top">
        <Hero onIntroDone={onIntroDone} />
        <Manifesto />
        <MenuRail />
        <BaseBuddy />
        <ReelWall />
        <Events />
        <Visit />
      </main>
      <Footer />
      <div className="grain" aria-hidden />
    </>
  );
}
