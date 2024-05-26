import { useEffect, useRef, useState, useCallback } from "react";
import { hightlightsSlides } from "../constants";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";

type VideoRef = {
  [key: string]: HTMLVideoElement | null;
};

interface VideoState {
  isEnd: boolean;
  startPlay: boolean;
  videoId: number;
  isLastVideo: boolean;
  isPlaying: boolean;
}

enum ActionType {
  End = "video-end",
  Last = "video-last",
  Reset = "video-reset",
  Play = "play",
  Pause = "pause",
}

const VideoCarousel = () => {
  const videoRef = useRef<VideoRef>({});
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLDivElement | null)[]>([]);
  const [video, setVideo] = useState<VideoState>({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });
  const [loadedData, setLoadedData] = useState<unknown[]>([]);
  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  useEffect(() => {
    if (loadedData.length > 3) {
      const currentVideo = videoRef.current[videoId];
      if (currentVideo) {
        if (!isPlaying) {
          currentVideo.pause();
        } else if (startPlay) {
          currentVideo.play();
        }
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleLoadedMetadata = useCallback((e: unknown) => {
    setLoadedData((prev) => [...prev, e]);
  }, []);

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((prevVideo) => ({
          ...prevVideo,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    let currentProgress = 0;
    const span = videoSpanRef.current[videoId];
    const videoElement = videoRef.current[videoId];

    if (span && videoElement) {
      const anim = gsap.to(span, {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (progress !== currentProgress) {
            currentProgress = progress;
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw",
            });
            gsap.to(span, {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], { width: "12px" });
          }
          gsap.to(span, {
            backgroundColor: "#afafaf",
          });
        },
      });

      if (videoId === 0) {
        anim.restart();
      }

      const animUpdate = () => {
        anim.progress(
          videoElement.currentTime / hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay, isPlaying]);

  const handleProcess = useCallback((type: ActionType, i: number) => {
    switch (type) {
      case ActionType.End:
        setVideo((prevVideo) => ({
          ...prevVideo,
          isEnd: true,
          videoId: i + 1,
        }));
        break;
      case ActionType.Last:
        setVideo((prevVideo) => ({ ...prevVideo, isLastVideo: true }));
        break;
      case ActionType.Reset:
        setVideo((prevVideo) => ({
          ...prevVideo,
          videoId: 0,
          isLastVideo: false,
        }));
        break;
      case ActionType.Play:
      case ActionType.Pause:
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;
      default:
        break;
    }
  }, []);

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline
                  preload="auto"
                  className={`${
                    list.id === 2 && "translate-x-44"
                  } pointer-events-none`}
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() =>
                    i !== 3
                      ? handleProcess(ActionType.End, i)
                      : handleProcess(ActionType.Last, i)
                  }
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetadata(e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {hightlightsSlides.map((_, i) => (
            <div
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              ></span>
            </div>
          ))}
        </div>
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess(ActionType.Reset, videoId)
                : !isPlaying
                ? () => handleProcess(ActionType.Play, videoId)
                : () => handleProcess(ActionType.Pause, videoId)
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
