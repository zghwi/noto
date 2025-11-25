"use client";

import { getUser, getFilesDetails, quizAverage, cardsPacks } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  FileText,
  ArrowRight,
  Plus,
  School,
  File,
  Layers,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Root() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    username: string;
  }>();
  const [files, setFiles] = useState<{
    id: string,
    name: string,
    createdAt: string,
    contentType: string
  }[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  const [quizAvg, setQuizAvg] = useState<number | "--">("--");
  const [cardsPacksLen, setCardsPacksLen] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const avg = await quizAverage();
      const ncp = await cardsPacks();
      setQuizAvg(avg);
      setCardsPacksLen(ncp.data.length);
      setLoading(true);
      const user = await getUser();
      const files = await getFilesDetails();
      if (user.error || files.error) {
        if (user.type == "Unauthorized" || files.type == "Unauthorized") {
          toast.error("Session expired");
        }
        router.push("/signin");
      } else {
        setUser(user.data);
        setFiles(files.data);
        setTimeOfDay(getGreeting());
        setLoading(false);
      }
    })();
  }, []);

  function getGreeting() {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      return "morning";
    } else if (hour < 18) {
      return "afternoon";
    } else {
      return "evening";
    }
  }

  function getGreetingEmoji() {
    const hour = new Date().getHours();
    if (hour < 12) return "☀️";
    if (hour < 18) return "🌤️";
    return "🌙";
  }

  function timeAgo(isoDate: string): string {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
    if (weeks < 5) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }

  const stats = [
    {
      icon: <School className="h-5 w-5" />,
      label: "Average Quiz Score",
      value: files?.length == 0 ? "--" : quizAvg,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: files?.length as number > 1 ? "Files Uploaded" : "File Uploaded",
      value: files?.length,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: <Layers className="h-5 w-5" />,
      label: "Card Packs Generated",
      value: cardsPacksLen,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 w-full">
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
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
      `}</style>

      <div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12 border border-primary/20"
        style={{ animation: 'scaleIn 0.6s ease-out' }}
      >
        <div className="absolute top-4 right-4 text-4xl" style={{ animation: 'float 3s ease-in-out infinite' }}>
          {getGreetingEmoji()}
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Good {timeOfDay}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Ready to turn your notes into interactive learning experiences?
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full group cursor-pointer"
              asChild
            >
              <Link href="/~/files">
                View Files
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
            style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1 + 0.2}s both` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <p className={`text-3xl font-bold mb-1 ${
                index === 0 ? (
                  typeof stat.value === "number" && stat.value as number >= 90 ? "text-green-500" : (
                    typeof stat.value === "number" && stat.value as number >= 70 ? "text-orange-500" : stat.value === "--" ? "text-gray-400" : "text-red-500"
                  )
                ) : ""
              }`}>
                {index === 0 ? stat.value + '%' : stat.value}
              </p>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recently Uploaded</h2>
          <Link 
            href="/~/files" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
          >
            View all
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {files && files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {files?.slice(0, 4).map((file, index) => (
              <Link 
                key={file.id}
                href={`/~/files/${file.id}`}
                className="group relative p-4 border rounded-xl bg-card hover:shadow-md hover:border-primary/50 transition-all duration-300"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1 + 0.6}s both`
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0 group-hover:scale-110">
                    <File className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold group-hover:text-primary transition-colors truncate mb-1">
                      {file.name}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {timeAgo(file.createdAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-muted/30"
            style={{ animation: 'fadeInUp 0.5s ease-out 0.6s both' }}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No files yet</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
              Upload your first notes to get started with AI-powered learning tools
            </p>
            <Button asChild className="rounded-full cursor-pointer">
              <Link href="/~/files">
                <Plus className="h-4 w-4 mr-2" />
                Upload First File
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
