/* eslint-disable @typescript-eslint/no-explicit-any */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

interface AnimateWithGsapProps {
  target: string;
  animationProps: any;
  scrollProps?: any;
}

interface AnimateWithGsapTimelineProps {
  timeline: GSAPTimeline;
  rotationRef: any;
  rotationState: string;
  firstTarget: string;
  secondTarget: string;
  animationProps: any;
}

gsap.registerPlugin(ScrollTrigger);

export const animateWithGsap = ({
  target,
  animationProps,
  scrollProps,
}: AnimateWithGsapProps) => {
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: "restart reverse restart reverse",
      start: "top 85%",
      ...scrollProps,
    },
  });
};

export const animateWithGsapTimeline = ({
  timeline,
  rotationRef,
  rotationState,
  firstTarget,
  secondTarget,
  animationProps,
}: AnimateWithGsapTimelineProps) => {
  timeline.to(rotationRef.current.rotation, {
    y: rotationState,
    duration: 1,
    ease: "power2.inOut",
  });

  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<"
  );

  timeline.to(
    secondTarget,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<"
  );
};
