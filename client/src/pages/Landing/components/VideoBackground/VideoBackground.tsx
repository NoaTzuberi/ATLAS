import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroVideo from '../../../../assets/HeroVid/hero_final_v3.mp4';
import './VideoBackground.css';

gsap.registerPlugin(ScrollTrigger);

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let scrollTrigger: ScrollTrigger | undefined;
    const proxy = { time: 0 };

    function initScrollTrigger() {
      if (!video) return;

      scrollTrigger = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        onUpdate: (self) => {
          gsap.to(proxy, {
            time: self.progress * video.duration,
            duration: 1.2,
            overwrite: true,
            onUpdate: () => {
              video.currentTime = proxy.time;
            },
          });
        },
      });
    }

    if (video.readyState >= 1) {
      initScrollTrigger();
    } else {
      video.addEventListener('loadedmetadata', initScrollTrigger, { once: true });
    }

    function handleResize() {
      ScrollTrigger.refresh();
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      video.removeEventListener('loadedmetadata', initScrollTrigger);
      scrollTrigger?.kill();
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        className="video-background-video"
        src={heroVideo}
        muted
        playsInline
        preload="auto"
      />
      <div className="video-background-overlay" />
    </>
  );
}
