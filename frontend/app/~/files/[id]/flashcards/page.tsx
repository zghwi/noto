"use client";

import { getFileByIdDetails, getFlashcardsByFileId } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flashcard } from "@/components/ui/flashcard";
import {
  Layers,
  ArrowRight,
  ArrowLeft,
  Home,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trophy,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

type FlashcardType = {
  front: string;
  back: string;
};

export default function FileFlashcards() {
  const [flashcardsData, setFlashcardsData] = useState<{
    id: string;
    userId: string;
    fileId: string;
    flashcards: string;
  } | null>();
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [fileDetails, setFileDetails] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const f = await getFileByIdDetails(id as string);
      if (!f.error) setFileDetails(f.data);
      const res = await getFlashcardsByFileId(id as string);
      if (!res.error) {
        const cards = JSON.parse(res.data.cards);
        setFlashcardsData(res.data);
        setFlashcards(cards);
      } else {
        if (res.type === "Not Found") {
          setFlashcardsData(null);
          setFlashcards([]);
        }
      }
      setLoading(false);
    })();
  }, []);

  const handleNext = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleMastered = () => {
    const newMastered = new Set(masteredCards);
    newMastered.add(currentCard);
    setMasteredCards(newMastered);
    handleNext();
  };

  const handleNeedsPractice = () => {
    handleNext();
  };

  const handleReset = () => {
    setCurrentCard(0);
    setMasteredCards(new Set());
    setShowSummary(false);
  };

  const progress = ((currentCard + 1) / flashcards.length) * 100;
  const masteredCount = masteredCards.size;
  const needsPracticeCount = flashcards.length - masteredCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!flashcardsData || flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <XCircle className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold">Flashcards not found</h2>
        <Button onClick={() => router.push("/~/files")} variant="outline">
          <Home className="h-4 w-4 mr-2" />
          Go to Files
        </Button>
      </div>
    );
  }

  if (showSummary) {
    const masteredPercentage = Math.round((masteredCount / flashcards.length) * 100);

    return (
      <div className="max-w-4xl mx-auto py-12 space-y-6">
        <style jsx global>{`
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>

        <Breadcrumb style={{ animation: 'scaleIn 0.5s ease-out' }}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/~">~</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/~/files">Your Files</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/~/files/${id}`}>{fileDetails.name}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Flashcards</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card 
          className="p-8 text-center space-y-6 relative overflow-hidden"
          style={{ animation: 'scaleIn 0.5s ease-out 0.1s both' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <Trophy className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-2">Study Session Complete!</h2>
            <p className="text-muted-foreground mb-6">Here's your progress</p>
            
            <div className="text-7xl font-bold mb-6" style={{
              background: `linear-gradient(135deg, ${
                masteredPercentage >= 80 ? '#10b981' : masteredPercentage >= 50 ? '#f59e0b' : '#ef4444'
              }, ${
                masteredPercentage >= 80 ? '#059669' : masteredPercentage >= 50 ? '#d97706' : '#dc2626'
              })`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {masteredPercentage}%
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{masteredCount}</div>
                <div className="text-sm text-muted-foreground">Mastered</div>
              </div>
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <RotateCcw className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{needsPracticeCount}</div>
                <div className="text-sm text-muted-foreground">Needs Practice</div>
              </div>
            </div>

            <p className="text-lg font-medium mb-6">
              {masteredPercentage >= 80 ? "🎉 Excellent! You've mastered most of these cards!" :
               masteredPercentage >= 50 ? "👏 Good progress! Keep reviewing to master them all!" :
               "💪 Keep practicing! You'll get there!"}
            </p>
            
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={handleReset} size="lg" variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Study Again
              </Button>
              <Button onClick={() => router.push(`/~/files/${id}`)} size="lg" variant="outline">
                Back to File
              </Button>
              <Button onClick={() => router.push("/~/files")} size="lg">
                View All Files
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">Your Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcards.map((card, index) => (
              <Card 
                key={index}
                className={cn(
                  "p-4 space-y-2",
                  masteredCards.has(index) ? "border-green-500/50 bg-green-500/5" : "border-orange-500/50 bg-orange-500/5"
                )}
                style={{ animation: `scaleIn 0.5s ease-out ${index * 0.05}s both` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Card {index + 1}</span>
                  {masteredCards.has(index) ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <RotateCcw className="h-5 w-5 text-orange-500" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{card.front}</p>
                  <p className="text-sm text-muted-foreground">{card.back}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentCard];

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Breadcrumb style={{ animation: 'fadeInUp 0.5s ease-out' }}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/~">~</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/~/files">Your Files</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/~/files/${id}`}>{fileDetails.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Flashcards</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-4" style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Flashcard Review</h1>
              <p className="text-sm text-muted-foreground">
                Card {currentCard + 1} of {flashcards.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{masteredCards.size} mastered</span>
            <span>{flashcards.length - masteredCards.size} remaining</span>
          </div>
        </div>
      </div>

      <div 
        className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6"
        style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}
      >
        <div className="min-h-[400px] md:min-h-[500px]">
          <Flashcard 
            front={currentFlashcard.front}
            back={currentFlashcard.back}
            className="h-full"
          />
        </div>

        <Card className="p-4 h-fit lg:sticky lg:top-8 lg:w-[200px]">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Progress</span>
          </div>
          <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
            {flashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCard(index)}
                className={cn(
                  "w-10 h-10 rounded-lg border-2 font-medium transition-all hover:scale-105",
                  currentCard === index && "border-primary bg-primary text-white",
                  currentCard !== index && masteredCards.has(index) && "border-green-500 bg-green-500/10 text-green-600",
                  currentCard !== index && !masteredCards.has(index) && "border-border hover:border-primary/50"
                )}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div 
        className="flex flex-col sm:flex-row gap-3 justify-center"
        style={{ animation: 'fadeInUp 0.5s ease-out 0.3s both' }}
      >
        <Button
          onClick={handleNeedsPractice}
          variant="outline"
          size="lg"
          className="flex-1 sm:flex-initial"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Needs Practice
        </Button>
        <Button
          onClick={handleMastered}
          size="lg"
          className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Mastered
        </Button>
      </div>

      <div 
        className="flex items-center justify-between"
        style={{ animation: 'fadeInUp 0.5s ease-out 0.4s both' }}
      >
        <Button
          onClick={handlePrevious}
          disabled={currentCard === 0}
          variant="outline"
          size="lg"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          size="lg"
        >
          {currentCard === flashcards.length - 1 ? "Finish" : "Next Card"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}