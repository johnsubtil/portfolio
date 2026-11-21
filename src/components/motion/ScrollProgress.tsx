import { useRef } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';

export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    bar.current?.style.setProperty('--progress', value.toFixed(4));
  });
  return <div ref={bar} className="scroll-progress" aria-hidden="true" />;
}
