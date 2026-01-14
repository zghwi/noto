"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  front: string;
  back: string;
  className?: string;
}

export function Flashcard({ front, back, className }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={cn("perspective-1000", className)}>
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .flip-card {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card.flipped {
          transform: rotateY(180deg);
        }
        .flip-card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>

      <div
        className={cn("flip-card cursor-pointer", isFlipped && "flipped")}
        onClick={handleFlip}
      >
        <div className="flip-card-face">
          <Card className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-xl transition-shadow border-2 border-primary/20">
            <div className="text-center space-y-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                Question
              </div>
              <p className="text-xl md:text-2xl font-semibold leading-relaxed">
                {front}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
                <RotateCcw className="h-4 w-4" />
                <span>Click to reveal answer</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flip-card-face flip-card-back">
          <Card className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-500/5 to-green-500/10 hover:shadow-xl transition-shadow border-2 border-green-500/20">
            <div className="text-center space-y-4">
              <div className="text-xs uppercase tracking-wide text-green-600 dark:text-green-400 font-semibold">
                Answer
              </div>
              <p className="text-xl md:text-2xl font-semibold leading-relaxed">
                {back}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
                <RotateCcw className="h-4 w-4" />
                <span>Click to see question</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
