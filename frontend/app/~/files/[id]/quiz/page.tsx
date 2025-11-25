"use client";

import { getQuizByFileId, updateQuizScore } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Clock,
  Target,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

type Question = {
  question: string;
  options: string[];
  answer_idx: number;
  explanation: string;
};

export default function FileQuiz() {
  const [quiz, setQuiz] = useState<{
    id: string;
    userId: string;
    fileId: string;
    score: number;
    questions: string;
  } | null>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await getQuizByFileId(id as string);
      if (!res.error) {
        const q = JSON.parse(res.data.questions);
        setQuiz(res.data);
        setQuestions(q);
        setSelectedAnswers(new Array(q.length).fill(-1));
      } else {
        if (res.type === "Not Found") {
          setQuiz(null);
          setQuestions([]);
        }
      }
      setLoading(false);
    })();
  }, []);

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer_idx) {
        correct++;
      }
    });
    const finalScore = Math.round((correct / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    await updateQuizScore(quiz!.id, finalScore);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== -1;
  const allAnswered = selectedAnswers.every((a) => a !== -1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <XCircle className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold">Quiz not found</h2>
        <Button onClick={() => router.push("/~/files")} variant="outline">
          <Home className="h-4 w-4 mr-2" />
          Go to Files
        </Button>
      </div>
    );
  }

  if (quiz.score !== -1) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-6">
        <Card className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Quiz Already Completed</h2>
            <p className="text-muted-foreground mb-4">
              You've already taken this quiz and scored
            </p>
            <div className="text-5xl font-bold text-primary mb-2">{quiz.score}%</div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push(`/~/files/${id}`)} variant="outline">
              Back to File
            </Button>
            <Button onClick={() => router.push("/~/files")}>
              View All Files
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const correctCount = selectedAnswers.filter(
      (ans, idx) => ans === questions[idx].answer_idx
    ).length;
    const incorrectCount = questions.length - correctCount;

    return (
      <div className="max-w-4xl mx-auto py-12 space-y-6">
        <style jsx global>{`
          @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>

        <Card 
          className="p-8 text-center space-y-6 relative overflow-hidden"
          style={{ animation: 'scaleIn 0.5s ease-out' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <Trophy className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-muted-foreground mb-6">Here's how you did</p>
            
            <div className="text-7xl font-bold mb-6" style={{
              background: `linear-gradient(135deg, ${
                score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444'
              }, ${
                score >= 90 ? '#059669' : score >= 70 ? '#d97706' : '#dc2626'
              })`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {score}%
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correctCount}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{incorrectCount}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
            </div>

            <p className="text-lg font-medium mb-6">
              {score >= 90 ? "🎉 Excellent work! You've mastered this material!" :
               score >= 70 ? "👏 Good job! Keep practicing to improve!" :
               "💪 Keep studying! You'll get better with practice!"}
            </p>
            
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push(`/~/files/${id}`)} variant="outline">
                Back to File
              </Button>
              <Button onClick={() => router.push("/~/files")}>
                View All Files
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">Review Your Answers</h3>
          {questions.map((q, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === q.answer_idx;
            
            return (
              <Card 
                key={index} 
                className="p-6 space-y-4"
                style={{ animation: `scaleIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    isCorrect ? "bg-green-500/10" : "bg-red-500/10"
                  )}>
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-3">
                      {index + 1}. {q.question}
                    </h4>
                    <div className="space-y-2 mb-3">
                      {q.options.map((option, optIdx) => (
                        <div
                          key={optIdx}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-all",
                            optIdx === q.answer_idx && "border-green-500 bg-green-500/10",
                            optIdx === userAnswer && optIdx !== q.answer_idx && "border-red-500 bg-red-500/10",
                            optIdx !== q.answer_idx && optIdx !== userAnswer && "border-border"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{option}</span>
                            {optIdx === q.answer_idx && (
                              <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                            )}
                            {optIdx === userAnswer && optIdx !== q.answer_idx && (
                              <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <p className="text-sm">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">Explanation: </span>
                        <span className="text-muted-foreground">{q.explanation}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
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

      <div className="space-y-4" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Quiz Time!</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Take your time</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{selectedAnswers.filter(a => a !== -1).length} answered</span>
            <span>{questions.length - selectedAnswers.filter(a => a !== -1).length} remaining</span>
          </div>
        </div>
      </div>

      <div 
        className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6"
        style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both' }}
      >
        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                {currentQuestion + 1}
              </div>
              <h2 className="text-xl font-semibold leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            <div className="space-y-3 pt-4">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 text-left transition-all hover:scale-[1.02]",
                    selectedAnswers[currentQuestion] === index
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                      selectedAnswers[currentQuestion] === index
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {selectedAnswers[currentQuestion] === index && (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-4 h-fit lg:sticky lg:top-8 lg:w-[200px]">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Quick Navigation</span>
          </div>
          <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={cn(
                  "w-10 h-10 rounded-lg border-2 font-medium transition-all hover:scale-105",
                  currentQuestion === index && "border-primary bg-primary text-white",
                  currentQuestion !== index && selectedAnswers[index] !== -1 && "border-green-500 bg-green-500/10 text-green-600",
                  currentQuestion !== index && selectedAnswers[index] === -1 && "border-border hover:border-primary/50"
                )}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div 
        className="flex items-center justify-between"
        style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}
      >
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
          size="lg"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentQuestion === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            size="lg"
            className="gap-2"
          >
            <Trophy className="h-4 w-4" />
            {allAnswered ? "Submit Quiz" : `Answer ${questions.length - selectedAnswers.filter(a => a !== -1).length} more`}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            size="lg"
          >
            {isAnswered ? "Next Question" : "Select an answer"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>    
    </div>
  );
}