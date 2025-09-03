import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SearchBar } from './SearchBar';

function WordRotate({ words = [], stepMs = 220, pauseMs = 900 }) {
  const i = useRef(0);
  const [angle, setAngle] = useState(-6);
  const [stage, setStage] = useState('pauseTop'); // pauseTop → toBottom → bounceBottom1 → bounceBottom2 → pauseBottom → toTop → bounceTop1 → bounceTop2 → loop
  const t = useRef(null);

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) return;
    if (stage === 'pauseTop' || stage === 'pauseBottom') {
      clearTimeout(t.current);
      t.current = setTimeout(
        () => setStage(stage === 'pauseTop' ? 'toBottom' : 'toTop'),
        pauseMs
      );
    }
    return () => clearTimeout(t.current);
  }, [stage, pauseMs, reduced]);

  useEffect(() => {
    if (reduced) return;
    if (stage === 'toBottom') setAngle(6);
    if (stage === 'bounceBottom1') setAngle(2);
    if (stage === 'bounceBottom2') setAngle(4);
    if (stage === 'toTop') setAngle(-6);
    if (stage === 'bounceTop1') setAngle(-2);
    if (stage === 'bounceTop2') setAngle(-4);
  }, [stage, reduced]);

  const onEnd = () => {
    if (reduced) return;
    if (stage === 'toBottom') {
      i.current = (i.current + 1) % words.length;      // change as bounce starts
      return setStage('bounceBottom1');
    }
    if (stage === 'bounceBottom1') return setStage('bounceBottom2');
    if (stage === 'bounceBottom2') return setStage('pauseBottom');
    if (stage === 'toTop') {
      i.current = (i.current + 1) % words.length;      // change as bounce starts
      return setStage('bounceTop1');
    }
    if (stage === 'bounceTop1') return setStage('bounceTop2');
    if (stage === 'bounceTop2') return setStage('pauseTop');
  };

  const transition =
    stage === 'toBottom' || stage === 'toTop'
      ? `transform ${stepMs}ms cubic-bezier(.2,.8,0,1.1)`
      : stage.includes('bounce')
        ? `transform ${stepMs}ms cubic-bezier(.2,.7,0,1)`
        : 'none';

  return (
    <span className="inline-flex align-middle items-center">
      <span
        onTransitionEnd={onEnd}
        className="inline-flex px-1 py-0.5 rounded-md bg-schemesPrimaryFixedDim text-schemesOnPrimaryFixedVariant Blueprint-body-large-emphasized"
        style={{
          transform: `rotate(${reduced ? 0 : angle}deg)`,
          transformOrigin: '50% 60%',
          transition,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-live="polite"
      >
        {words[i.current]}
      </span>
    </span>
  );
}

export default function FrontPage() {
  const words = ['creative', 'resilient', 'curious', 'connected'];

  return (
    <div className="bg-schemesPrimaryFixed">
      <div className="max-w-[1600px] mx-auto p-16">
        <div className="flex flex-row gap-8 w-full">
          <div className="flex flex-col items-start justify-start gap-4">
            <div className="Blueprint-display-large-emphasized text-schemesOnPrimaryFixed max-w-2xl">
              Proudly celebrating our Melbourne Jewish community
            </div>
            <div className="Blueprint-body-large text-schemesOnPrimaryFixedVariant max-w-xl">
              Helpful, friendly, and <WordRotate words={words} />. Find events, stories, podcasts, and<br />support.
            </div>
            <SearchBar placeholder="Search events, articles, podcasts..." />
            <QuickLinks links={[
              { title: 'Events', href: '/events' },
              { title: 'Podcasts', href: '/podcasts' },
              { title: 'Stories', href: '/articles' },
              { title: 'Aid', href: '/aid_listing' },
              { title: 'Directory', href: '/directory' },
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
}

const QuickLinks = ({ links = [] }) => {
  return (
    <div className="flex flex-row gap-4">
      {links.map((link, i) => (
        <a
          key={i}
          href={link.href || '#'}
          className="flex-1 no-underline"
        >
          <div className="Blueprint-label-large px-4 py-1.5 rounded-lg bg-schemesOnPrimaryContainer text-schemesOnPrimaryFixed">
            {link.title}
          </div>
        </a>
      ))}
    </div>
  );
}
