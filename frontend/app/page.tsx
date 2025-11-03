"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Brain,
  Zap,
  Check,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthorized } from "@/utils/api";

export default function NotoLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    (async () => {
      const ok = await isAuthorized();
      if (ok) redirect("/~");
    })();
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Learning",
      description:
        "Transform your notes into personalized quizzes and flashcards automatically.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Interactive Tools",
      description:
        "Engage with your material through dynamic exercises that adapt to your learning style.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Generation",
      description:
        "Create comprehensive study materials in seconds, not hours.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Smart Organization",
      description:
        "Keep all your notes and learning tools organized in one intuitive platform.",
    },
  ];

  const benefits = [
    "Turn passive notes into active learning",
    "Retain information 3x faster",
    "Study smarter, not harder",
    "Access your materials anywhere",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-900">
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/logo_png.png" alt="Noto" className="h-29 w-29" />
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                How It Works
              </a>
              <button
                className="px-6 py-2 rounded-full text-white font-medium transition-all hover:scale-105"
                style={{ backgroundColor: "oklch(0.606 0.25 292.717)" }}
              >
                <Link href="/signup">Get Started</Link>
              </button>
            </div>

            <button
              className="md:hidden text-gray-900 dark:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                className="block text-gray-700 dark:text-gray-300"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block text-gray-700 dark:text-gray-300"
              >
                How It Works
              </a>
              <button
                className="w-full px-6 py-2 rounded-full text-white font-medium"
                style={{ backgroundColor: "oklch(0.606 0.25 292.717)" }}
              >
                <Link href="/signup">Get Started</Link>
              </button>
            </div>
          </div>
        )}
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-purple-200 dark:border-purple-900">
              <Sparkles
                className="w-4 h-4"
                style={{ color: "oklch(0.606 0.25 292.717)" }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI-Powered Study Tools
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
              Turn Your Notes Into
              <span
                className="block mt-2"
                style={{ color: "oklch(0.606 0.25 292.717)" }}
              >
                Interactive Learning
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Noto transforms your notes into personalized quizzes, flashcards,
              and study guides using advanced AI. Learn faster, retain more, and
              ace your exams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="group px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:scale-105 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: "oklch(0.606 0.25 292.717)" }}
              >
                <Link href="/signup">Start Learning</Link>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/** TODO: add screenshots and demos to the hero section  */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 dark:from-purple-600/20 dark:to-pink-600/20 blur-3xl"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-xl">
                  <div
                    className="w-12 h-12 rounded-lg mb-4"
                    style={{ backgroundColor: "oklch(0.606 0.25 292.717)" }}
                  ></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 rounded-xl">
                  <div
                    className="w-12 h-12 rounded-lg mb-4"
                    style={{ backgroundColor: "oklch(0.606 0.25 292.717)" }}
                  ></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-6 rounded-xl">
                  <div
                    className="w-12 h-12 rounded-lg mb-4"
                    style={{ backgroundColor: "oklch(0.606 0.25 292.717)" }}
                  ></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Powerful Features for Smarter Learning
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to transform the way you study and retain
              information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: "oklch(0.606 0.25 292.717)",
                    color: "white",
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-gray-900/40"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              How Noto Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Three simple steps to better learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Notes",
                desc: "Import notes from any source - typed, handwritten, or PDF",
              },
              {
                step: "02",
                title: "AI Processes",
                desc: "Our AI analyzes and structures your content for optimal learning",
              },
              {
                step: "03",
                title: "Start Learning",
                desc: "Access personalized quizzes and flashcards instantly",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div
                    className="text-6xl font-bold mb-4"
                    style={{ color: "oklch(0.606 0.25 292.717)", opacity: 0.2 }}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div
            className="bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 rounded-3xl p-12 text-white shadow-2xl"
            style={{
              background: `linear-gradient(135deg, oklch(0.606 0.25 292.717), oklch(0.556 0.25 320))`,
            }}
          >
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-6">
                Why should you use Noto?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              <button
                className="mt-8 px-8 py-4 bg-white rounded-full font-semibold text-lg hover:scale-105 transition-all shadow-lg"
                style={{ color: "oklch(0.606 0.25 292.717)" }}
              >
                <Link href="/signup">Become a smart student</Link>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
            Start turning your notes into interactive learning tools today.
          </p>
          <button
            className="px-10 py-5 rounded-full text-white font-semibold text-xl transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
            style={{ backgroundColor: "oklch(0.606 0.25 292.717)" }}
          >
            <Link href="/signup">Get started</Link>
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800 dark:border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-gray-800 dark:border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src="/logo_png.png" alt="Noto" className="h-30 w-30" />
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              © {new Date().getFullYear()} Noto. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
