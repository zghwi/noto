"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { getFileById, getQuizByFileId, getFlashcardsByFileId, createXByFileId } from "@/utils/api";
import { 
  FileQuestion, 
  Sparkles, 
  Brain, 
  FileText,
  Calendar,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  Slash,
  Trophy,
  Clock
} from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function FileById() {
  const [file, setFile] = useState<
    | {
        id: string;
        name: string;
        data: any;
        contentType?: string;
        createdAt?: string;
      }
    | {
        type: string;
        error: boolean;
      }
    | null
  >();
  const [loading, setLoading] = useState<boolean>();
  const [generatingQuiz, setGeneratingQuiz] = useState<boolean>(false);
  const [generatingFlashcards, setGeneratingFlashcards] = useState<boolean>(false);
  const [existingQuiz, setExistingQuiz] = useState<any>(null);
  const [existingFlashcards, setExistingFlashcards] = useState<any>(null);
  const [copiedQuiz, setCopiedQuiz] = useState<boolean>(false);
  const [copiedFlashcards, setCopiedFlashcards] = useState<boolean>(false);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const file = await getFileById(id as string);
      if (file.error) {
        if (file.type == "Not Found") setFile(null);
        if (file.type == "Unauthorized") {
          localStorage.removeItem("token");
          redirect("/");
        }
      } else {
        setFile(file.data);
        
        const quiz = await getQuizByFileId(id as string);
        const flashcards = await getFlashcardsByFileId(id as string);
        
        if (!quiz.error && quiz.data) {
          setExistingQuiz(quiz.data);
        }
        
        if (!flashcards.error && flashcards.data) {
          setExistingFlashcards(flashcards.data);
        }
      }
      setLoading(false);
    })();
  }, []);

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);
    try {
      const res = await createXByFileId("quiz", id as string, 5);
      console.log(res);
      
      toast.success(res.data.message);
      
      const quiz = await getQuizByFileId(id as string);
      if (!quiz.error && quiz.data) {
        setExistingQuiz(quiz.data);
      }
    } catch (error) {
      toast.error("Failed to generate quiz");
      console.error(error);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    setGeneratingFlashcards(true);
    try {
      const res = await createXByFileId("flashcards", id as string, 5);
      console.log(res);
      toast.success(res.data.message);
      
      const flashcards = await getFlashcardsByFileId(id as string);
      if (!flashcards.error && flashcards.data) {
        setExistingFlashcards(flashcards.data);
      }
    } catch (error) {
      toast.error("Failed to generate flashcards");
      console.error(error);
    } finally {
      setGeneratingFlashcards(false);
    }
  };

  const handleCopyQuizLink = async () => {
    const link = `${window.location.origin}/~/quiz/${existingQuiz.id}`;
    await navigator.clipboard.writeText(link);
    setCopiedQuiz(true);
    toast.success("Quiz link copied to clipboard!");
    setTimeout(() => setCopiedQuiz(false), 2000);
  };

  const handleCopyFlashcardsLink = async () => {
    const link = `${window.location.origin}/~/flashcards/${existingFlashcards.id}`;
    await navigator.clipboard.writeText(link);
    setCopiedFlashcards(true);
    toast.success("Flashcards link copied to clipboard!");
    setTimeout(() => setCopiedFlashcards(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-orange-500";
    return "text-red-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!file || 'error' in file) {
    return (
      <div className="py-12">
        <Empty className="border rounded-xl">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileQuestion className="h-12 w-12" />
            </EmptyMedia>
            <EmptyTitle>File not found</EmptyTitle>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 20px 5px rgba(139, 92, 246, 0.2);
          }
        }
      `}</style>

      {/* Breadcrumb */}
      <Breadcrumb style={{ animation: 'slideIn 0.5s ease-out' }}>
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
            <BreadcrumbPage className="max-w-[200px] truncate">{file.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* File Info Card */}
      <div 
        className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow"
        style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both' }}
      >
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 flex-shrink-0 group-hover:scale-110 transition-transform">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold mb-2 break-words">{file.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {file.contentType && (
                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary">
                    {file.contentType}
                  </span>
                </div>
              )}
              {file.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(file.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Tools Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {existingQuiz || existingFlashcards ? "Your Learning Tools" : "Generate Learning Tools"}
          </h2>
          {(existingQuiz || existingFlashcards) && (
            <span className="text-sm text-muted-foreground">
              {[existingQuiz, existingFlashcards].filter(Boolean).length} of 2 generated
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quiz Card */}
          {existingQuiz ? (
            <div 
              className="group relative overflow-hidden rounded-xl border-2 border-primary/30 bg-card p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
              style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Brain className="h-6 w-6" />
                  </div>
                  {existingQuiz.score === -1 ? (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-green-500/20 text-green-600 dark:text-green-400 border-2 border-green-500/40">
                      <Clock className="h-4 w-4 mr-1.5" />
                      Ready
                    </span>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-lg font-bold ${
                        existingQuiz.score >= 90 ? "bg-green-500/20 text-green-600 dark:text-green-400 border-2 border-green-500/40" :
                        existingQuiz.score >= 70 ? "bg-orange-500/20 text-orange-600 dark:text-orange-400 border-2 border-orange-500/40" :
                        "bg-red-500/20 text-red-600 dark:text-red-400 border-2 border-red-500/40"
                      } border`}>
                        <Trophy className="h-4 w-4 mr-1.5" />
                        {existingQuiz.score}%
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {existingQuiz.score === -1 ? "Quiz Available" : "Quiz Completed"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {existingQuiz.score === -1 
                      ? "Your interactive quiz is ready. Test your knowledge or share it with others."
                      : `You scored ${existingQuiz.score}%. ${existingQuiz.score >= 90 ? "Excellent work!" : existingQuiz.score >= 70 ? "Good job!" : "Keep practicing!"}`
                    }
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  {existingQuiz.score === -1 && (
                    <Link href={`/~/files/${id}/quiz`} className="w-full">
                      <Button className="w-full rounded-full group/btn shadow-md hover:shadow-lg transition-shadow">
                        Start Quiz
                        <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  )}

                  <Button 
                    onClick={handleCopyQuizLink} 
                    variant="outline" 
                    className="w-full rounded-full"
                  >
                    {copiedQuiz ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </Button>

                  <Button 
                    onClick={handleGenerateQuiz} 
                    disabled={generatingQuiz} 
                    variant="ghost" 
                    className="w-full rounded-full text-xs"
                  >
                    {generatingQuiz ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-2" />
                        Regenerate Quiz
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
              style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-2 shadow-lg group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Generate Quiz</h3>
                  <p className="text-sm text-muted-foreground">
                    Create an interactive quiz with multiple choice questions based on your notes. Perfect for testing your knowledge.
                  </p>
                </div>
                
                <Button 
                  onClick={handleGenerateQuiz}
                  disabled={generatingQuiz}
                  className="w-full rounded-full group/btn shadow-md hover:shadow-lg transition-shadow"
                >
                  {generatingQuiz ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Quiz
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Flashcards Card */}
          {existingFlashcards ? (
            <div 
              className="group relative overflow-hidden rounded-xl border-2 border-primary/30 bg-card p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
              style={{ animation: 'fadeInUp 0.5s ease-out 0.3s both' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                    <Clock className="h-3 w-3 mr-1" />
                    Ready
                  </span>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Flashcards Available</h3>
                  <p className="text-sm text-muted-foreground">
                    Your flashcards are ready for review. Practice now or share them with others.
                  </p>
                </div>
                
                <div className="flex flex-col gap-2 pt-2">
                  <Link href={`/~/files/${id}/flashcards`} className="w-full">
                    <Button 
                      className="w-full rounded-full group/btn shadow-md hover:shadow-lg transition-shadow"
                    >
                      Start Studying
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleCopyFlashcardsLink}
                    variant="outline"
                    className="w-full rounded-full"
                  >
                    {copiedFlashcards ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handleGenerateFlashcards}
                    disabled={generatingFlashcards}
                    variant="ghost"
                    className="w-full rounded-full text-xs"
                  >
                    {generatingFlashcards ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-2" />
                        Regenerate Flashcards
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
              style={{ animation: 'fadeInUp 0.5s ease-out 0.3s both' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-2 shadow-lg group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Generate Flashcards</h3>
                  <p className="text-sm text-muted-foreground">
                    Transform your notes into digital flashcards for quick review. Great for memorization and active recall.
                  </p>
                </div>
                
                <Button 
                  onClick={handleGenerateFlashcards}
                  disabled={generatingFlashcards}
                  className="w-full rounded-full group/btn shadow-md hover:shadow-lg transition-shadow"
                >
                  {generatingFlashcards ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Flashcards...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Flashcards
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      {!existingQuiz && !existingFlashcards && (
        <div 
          className="rounded-xl border bg-muted/30 p-6"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.4s both' }}
        >
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">AI-Powered Generation</h3>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes your file content to create personalized learning materials. 
                The generation typically takes 10-30 seconds depending on the file size.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}