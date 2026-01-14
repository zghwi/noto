"use client";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import confettiData from "@/public/animations/Confetti.json";
import { useEffect, useRef } from "react";

type Props = {
  visible: boolean;
  onAnimationFinish?: () => void;
};

export default function Confetti({ visible, onAnimationFinish }: Props) {
  const animationRef = useRef<LottieRefCurrentProps>(null);
  useEffect(() => {
    if (visible) {
      animationRef.current?.play();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <Lottie
        lottieRef={animationRef}
        animationData={confettiData}
        autoplay
        loop={false}
        style={{ width: "100%", height: "100%" }}
        onComplete={onAnimationFinish}
      />
    </div>
  );
}
