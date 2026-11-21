import { useEffect, useRef, useState } from 'react';
import { motion, MotionConfig, useMotionValueEvent, useScroll } from 'motion/react';
import { useMotionPreference } from './useMotionPreference';
import '../../styles/hero.css';

interface HeroSceneProps {
  copy: {
    lineOne: string;
    lineTwo: string;
    description: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
}

export default function HeroScene({ copy }: HeroSceneProps) {
  const [ready, setReady] = useState(false);
  const reduced = useMotionPreference();
  const hero = useRef<HTMLElement>(null);
  useEffect(() => setReady(true), []);

  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (!reduced) hero.current?.style.setProperty('--hero-progress', value.toFixed(3));
  });
  useEffect(() => {
    if (reduced) hero.current?.style.removeProperty('--hero-progress');
  }, [reduced]);

  const entrance = (distance: number | string) => !ready ? undefined : reduced
    ? { opacity: 1, y: 0 }
    : { opacity: [0, 1], y: [distance, 0] };
  const timing = (delay: number) => ({
    duration: reduced ? 0 : .9,
    delay: reduced ? 0 : delay,
    ease: [.2, .65, .3, 1] as const,
  });

  return <MotionConfig reducedMotion="user">
    <section className="hero" aria-labelledby="hero-title" data-hero ref={hero}>
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-main wrap">
        <div className="hero-composition">
          <h1 id="hero-title">
            <span className="hero-line"><motion.span initial={false} animate={entrance('110%')} transition={timing(.1)}>{copy.lineOne}</motion.span></span>
            <span className="hero-line"><motion.span initial={false} animate={entrance('110%')} transition={timing(.22)}>{copy.lineTwo}.</motion.span></span>
          </h1>
          <motion.p initial={false} animate={entrance(20)} transition={timing(.4)}>{copy.description}</motion.p>
          <motion.div className="hero-actions" initial={false} animate={entrance(20)} transition={timing(.52)}>
            <a className="hero-cta" href={copy.primary.href}>{copy.primary.label}</a>
            <a className="hero-link" href={copy.secondary.href}>{copy.secondary.label}</a>
          </motion.div>
        </div>
      </div>
    </section>
  </MotionConfig>;
}
