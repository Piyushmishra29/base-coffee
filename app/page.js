'use client';
import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
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

  // The nav and scroll chrome are gated on the intro finishing. If that signal
  // is ever missed the site would have no navigation at all, so release them
  // on a timer regardless.
  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), 4500);
    return () => clearTimeout(t);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
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
    </MotionConfig>
  );
}
