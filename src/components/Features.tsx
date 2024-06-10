import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { animateWithGsap } from "../utils/animations";
import { explore1Img, explore2Img, exploreVideo } from "../utils";
import { useRef } from "react";
const Features = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    gsap.to("#explore-Video", {
      scrollTrigger: {
        trigger: "#explore-Video",
        toggleActions: "play pause reverse restart ",
        start: "-10% bottom",
      },
      onComplete: () => {
        videoRef.current?.play();
      },
    });
    animateWithGsap({
      target: "#features-title",
      animationProps: { y: 0, opacity: 1 },
    });

    animateWithGsap({
      target: ".g-text",
      animationProps: { y: 0, opacity: 1 },
    });

    animateWithGsap({
      target: ".g_grow",
      animationProps: { scale: 1, opacity: 1, ease: "power1" },
      scrollProps: { scrub: 5.5 },
    });
  }, []);
  return (
    <section className="relative h-full overflow-hidden common-padding bg-zinc">
      <div className="screen-max-with">
        <div className="w-full mb-12">
          <h1 id="features-title" className="section-heading">
            Explore the full story.
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center overflow-hidden">
          <div className="pl-24 mt-32 mb-24">
            <h2 className="text-5xl font-semibold lg:text-7xl">iPhone</h2>
            <h2 className="text-5xl font-semibold lg:text-7xl">
              Forged in titanium.
            </h2>
          </div>
          <div className="flex-col flex-center sm:px-10">
            <div className="relative flex items-center w-full h-[50vh]">
              <video
                playsInline
                id="explore-Video"
                className="object-cover object-center w-full h-full"
                preload="none"
                muted
                autoPlay
                ref={videoRef}
              >
                <source src={exploreVideo} typeof="video/mp4" />
              </video>
            </div>
            <div className="relative flex flex-col w-full">
              <div className="feature-video-container">
                <div className="flex-1 overflow-hidden h-[50vh]">
                  <img
                    src={explore1Img}
                    alt="titanium"
                    className="feature-video g_grow"
                  />
                </div>
                <div className="flex-1 overflow-hidden h-[50vh]">
                  <img
                    src={explore2Img}
                    alt="titanium2"
                    className="feature-video g_grow"
                  />
                </div>
              </div>
              <div className="feature-text-container">
                <div className="flex-1 flex-center">
                  <p className="feature-text g-text">
                    iPhone 15 Pro is{" "}
                    <span className="text-white">
                      the first iPhone to feature an aerospace-grade titanium
                      design
                    </span>
                    , using the same alloy that spacecrafts use for missions to
                    Mars.
                  </p>
                </div>
                <div className="flex-1 flex-center">
                  <p className="feature-text g-text">
                    Titanium has one of the best strength-to-weight ratios of
                    any metal, making these our{" "}
                    <span className="text-white">
                      lightest Pro models ever.
                    </span>
                    You'll notice the difference the moment you pick one up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
