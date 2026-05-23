"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bookmark,
  ArrowRight,
  Shield,
  Zap,
  Search,
  Star,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  Lock,
  Globe,
  Plus,
  Wifi,
  Menu,
  X,
  BookmarkCheck,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/auth/logout-button";

interface LandingPageProps {
  user: any;
}

interface MockBookmark {
  id: string;
  title: string;
  url: string;
  tags: string[];
  favorite: boolean;
  category: string;
}

const INITIAL_MOCK_BOOKMARKS: MockBookmark[] = [
  {
    id: "1",
    title: "Next.js App Router Documentation",
    url: "nextjs.org/docs",
    tags: ["nextjs", "react", "frontend"],
    favorite: true,
    category: "Development",
  },
  {
    id: "2",
    title: "Supabase Database & Auth Docs",
    url: "supabase.com",
    tags: ["supabase", "backend", "database"],
    favorite: true,
    category: "Backend",
  },
  {
    id: "3",
    title: "Framer Motion — Production-ready animations",
    url: "framer.com/motion",
    tags: ["animation", "react", "frontend"],
    favorite: false,
    category: "Design",
  },
  {
    id: "4",
    title: "Tailwind CSS v4.0 Release Notes",
    url: "tailwindcss.com",
    tags: ["css", "tailwind", "frontend"],
    favorite: false,
    category: "Design",
  },
  {
    id: "5",
    title: "Linear — The issue tracker you've been waiting for",
    url: "linear.app",
    tags: ["productivity", "pm"],
    favorite: true,
    category: "Productivity",
  },
];

export function LandingPage({ user }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [mockBookmarks, setMockBookmarks] = useState<MockBookmark[]>(
    INITIAL_MOCK_BOOKMARKS
  );
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newTag, setNewTag] = useState("");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock add bookmark function
  const handleAddMockBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;
    const item: MockBookmark = {
      id: Date.now().toString(),
      title: newTitle,
      url: newUrl,
      tags: newTag ? newTag.split(",").map((t) => t.trim().toLowerCase()) : ["general"],
      favorite: false,
      category: "Personal",
    };
    setMockBookmarks([item, ...mockBookmarks]);
    setNewTitle("");
    setNewUrl("");
    setNewTag("");
  };

  // Mock toggle favorite
  const handleToggleFavorite = (id: string) => {
    setMockBookmarks(
      mockBookmarks.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b))
    );
  };

  // Mock delete
  const handleDeleteMock = (id: string) => {
    setMockBookmarks(mockBookmarks.filter((b) => b.id !== id));
  };

  // Extract all tags from mock bookmarks
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockBookmarks.forEach((b) => b.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [mockBookmarks]);

  // Filtered bookmarks in landing page mockup
  const filteredMockBookmarks = useMemo(() => {
    return mockBookmarks.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = !selectedTag || b.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [mockBookmarks, searchQuery, selectedTag]);

  const faqs = [
    {
      q: "What is Linkora?",
      a: "Linkora is a modern, ultra-fast bookmark manager designed for developers and digital creators. It supports instant tags, search, real-time multi-tab synchronization, and secure owner-only database isolation via Row Level Security (RLS).",
    },
    {
      q: "Are my saved links completely private?",
      a: "Yes, 100%. Every single bookmark is tied securely to your personal account using Supabase Auth. With custom Postgres RLS policies, nobody—not even database managers—can query or view your links without your authorization.",
    },
    {
      q: "How does the real-time sync work?",
      a: "Linkora connects to a lightweight, reactive PostgreSQL database via secure WebSockets. If you add, delete, or star a bookmark in one tab or device, the update is reflected everywhere instantly without reloading the browser.",
    },
    {
      q: "Can I self-host or integrate it with other tools?",
      a: "Absolutely. Since Linkora is built with Next.js 16 and Supabase, it is highly modular. Our backend triggers and schema code are open and fully customizable for your organization.",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Dynamic Ambient Background Gradients */}
      <div className="absolute inset-0 pattern-dots" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg premium-btn flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-lg font-bold tracking-tight">
              link<span className="text-primary">ora</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#interactive-demo" className="hover:text-foreground transition-colors">Interactive Demo</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="h-9 px-4 rounded-xl premium-btn text-sm font-medium flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="h-9 px-4 rounded-xl hover:bg-muted/50 text-sm font-medium flex items-center transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="h-9 px-4 rounded-xl premium-btn text-sm font-medium flex items-center shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -mr-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <nav className="flex flex-col gap-4 text-sm font-medium text-muted-foreground">
                  <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/50">Features</a>
                  <a href="#interactive-demo" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/50">Interactive Demo</a>
                  <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/50">Pricing</a>
                  <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/50">FAQ</a>
                </nav>
                <div className="pt-4 border-t border-border/40 flex flex-col gap-3">
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="w-full h-11 rounded-xl premium-btn font-medium flex items-center justify-center gap-2 shadow-md"
                      >
                        Go to Dashboard <ArrowRight className="h-4 w-4" />
                      </Link>
                      <LogoutButton />
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="w-full h-11 rounded-xl border border-border bg-card font-medium flex items-center justify-center transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/login"
                        className="w-full h-11 rounded-xl premium-btn font-medium flex items-center justify-center shadow-md"
                      >
                        Get Started Free
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass text-xs font-semibold text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Linkora SaaS Bookmark Manager v2.0 is Live</span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
              Save smarter. <br />
              <span className="gradient-text">Find instantly.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-normal max-w-2xl mx-auto">
              The premium SaaS bookmark engine for developers. Secure RLS database architecture, lightning-fast instant search, and real-time syncing.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={user ? "/dashboard" : "/login"}
              className="w-full sm:w-auto h-12 px-8 rounded-xl premium-btn font-semibold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {user ? "Go to Dashboard" : "Start Saving Now — Free"}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#interactive-demo"
              className="w-full sm:w-auto h-12 px-8 rounded-xl border border-border bg-card/40 backdrop-blur text-foreground font-semibold flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
            >
              Interactive Mockup
            </a>
          </motion.div>
        </div>
      </section>

      {/* Interactive Mockup Dashboard Showcase */}
      <section id="interactive-demo" className="py-12 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-card/90 border border-border/80 rounded-3xl overflow-hidden shadow-2xl glow-md glass"
          >
            {/* Header of simulated dashboard */}
            <div className="border-b border-border/40 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Wifi className="h-3.5 w-3.5 text-emerald-500" />
                  Linkora Live Engine Mockup
                </span>
              </div>
              <div className="w-full sm:w-72 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search live mockup..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-background/80 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/45"
                />
              </div>
            </div>

            {/* Content body */}
            <div className="grid grid-cols-1 md:grid-cols-3 min-h-[420px]">
              {/* Sidebar tags/categories */}
              <div className="border-r border-border/40 p-6 space-y-6 bg-muted/10">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">
                    Filter by Tag
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        !selectedTag ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-muted-foreground"
                      }`}
                    >
                      All Tags
                    </button>
                    {allTags.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTag(t === selectedTag ? null : t)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          t === selectedTag ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-muted-foreground"
                        }`}
                      >
                        #{t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">
                    Add Live Mock Bookmark
                  </h4>
                  <form onSubmit={handleAddMockBookmark} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Bookmark Title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="URL (e.g. google.com)"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Tags (comma separated)"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-lg premium-btn text-xs font-semibold flex items-center justify-center gap-1 hover:opacity-90"
                    >
                      <Plus className="h-3.5 w-3.5" /> Save to Mockup
                    </button>
                  </form>
                </div>
              </div>

              {/* Mockup Card Lists */}
              <div className="md:col-span-2 p-6 space-y-4 max-h-[460px] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Mock bookmarks ({filteredMockBookmarks.length})
                  </h3>
                  {selectedTag && (
                    <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">
                      Filtering tag: #{selectedTag}
                    </span>
                  )}
                </div>

                <AnimatePresence mode="popLayout">
                  {filteredMockBookmarks.length > 0 ? (
                    filteredMockBookmarks.map((bookmark) => (
                      <motion.div
                        layout
                        key={bookmark.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 rounded-xl bg-card border border-border/60 flex items-start justify-between gap-4 hover:border-primary/50 transition-colors shadow-sm relative group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider text-[10px] bg-muted px-2 py-0.5 rounded-md">
                              {bookmark.category}
                            </span>
                            <span className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-0.5">
                              {bookmark.url}
                              <ExternalLink className="h-3 w-3" />
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-foreground">{bookmark.title}</h4>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {bookmark.tags.map((t) => (
                              <span key={t} className="text-[11px] text-muted-foreground font-medium bg-muted/65 px-2 py-0.5 rounded-full">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleToggleFavorite(bookmark.id)}
                            className="p-1.5 rounded-lg hover:bg-muted text-amber-500 transition-colors"
                          >
                            <Star className={`h-4 w-4 ${bookmark.favorite ? "fill-amber-500" : ""}`} />
                          </button>
                          <button
                            onClick={() => handleDeleteMock(bookmark.id)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center py-12"
                    >
                      <BookmarkCheck className="h-8 w-8 text-muted-foreground/60 mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">No mock bookmarks match your query.</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Try resetting the tag filter or adding a new mock bookmark!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition & Bento Box Features */}
      <section id="features" className="py-20 bg-muted/20 border-y border-border/40">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
        >
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Everything you need to stay organized</h2>
            <p className="text-muted-foreground text-sm">
              Linkora features state-of-the-art developer-friendly bookmark capabilities designed for modern fast-paced web flows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border/50 p-8 rounded-2xl space-y-4 hover:border-primary/50 transition-colors group">
              <div className="h-10 w-10 rounded-xl premium-btn flex items-center justify-center text-white shadow-md">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Postgres Row Level Security (RLS)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your bookmarks are protected by hardened backend RLS policies. Only authenticated owners can read, write, update, or search their database rows.
              </p>
            </div>

            <div className="bg-card border border-border/50 p-8 rounded-2xl space-y-4 hover:border-primary/50 transition-colors group">
              <div className="h-10 w-10 rounded-xl premium-btn flex items-center justify-center text-white shadow-md">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Instant Real-time Syncing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Powered by web sockets and Supabase publications. Save links in one tab, and watch them render instantly everywhere else without page reloads.
              </p>
            </div>

            <div className="bg-card border border-border/50 p-8 rounded-2xl space-y-4 hover:border-primary/50 transition-colors group">
              <div className="h-10 w-10 rounded-xl premium-btn flex items-center justify-center text-white shadow-md">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Intuitive Tag & Category Organization</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Assign tags to group items instantly. Fast filtration mechanisms enable you to toggle between favorites, active projects, and specific topics effortlessly.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Premium Pricing SaaS Tier */}
      <section id="pricing" className="py-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
        >
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Simple, predictable pricing</h2>
            <p className="text-muted-foreground text-sm">
              Use our full suite of premium features absolutely free, or unlock developer capabilities.
            </p>
            
            {/* Period switcher */}
            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-muted border border-border/40 mt-4">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  billingPeriod === "monthly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  billingPeriod === "yearly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                Yearly <span className="text-[10px] text-primary bg-primary/10 px-1 py-0.5 rounded-md">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free tier */}
            <div className="bg-card border border-border p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Free Plan</h4>
                  <h3 className="text-3xl font-extrabold text-foreground mt-2">$0</h3>
                  <p className="text-xs text-muted-foreground mt-1">Free forever</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  The essential bookmark toolkit for individual creators and developers looking to keep reference pages structured.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Up to 250 saved bookmarks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Instant tag organization</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Real-time tabs synchronization</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Owner Row Level Security (RLS)</span>
                  </div>
                </div>
              </div>
              <Link
                href={user ? "/dashboard" : "/login"}
                className="w-full h-11 border border-border bg-card hover:bg-muted/50 rounded-xl font-semibold flex items-center justify-center text-sm transition-colors mt-8"
              >
                {user ? "Go to Dashboard" : "Get Started Now"}
              </Link>
            </div>

            {/* Pro tier */}
            <div className="bg-card border border-primary/50 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden glow-sm">
              {/* Premium tag */}
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-bl-xl">
                Popular
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Developer Pro</h4>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold text-foreground">
                      {billingPeriod === "monthly" ? "$5" : "$4"}
                    </span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {billingPeriod === "yearly" ? "Billed annually ($48)" : "Billed monthly"}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground font-normal">
                  Unlock limitless power with advanced AI categorization tools, deep keyword extraction, and collaborative bookmark lists.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-medium text-foreground">Unlimited saved bookmarks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Auto-tagging & full description metadata</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Priority Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Shared collaborative team lists</span>
                  </div>
                </div>
              </div>
              <Link
                href={user ? "/dashboard" : "/login"}
                className="w-full h-11 premium-btn rounded-xl font-semibold flex items-center justify-center text-sm shadow-md hover:opacity-95 transition-opacity mt-8"
              >
                {user ? "Go to Dashboard" : "Upgrade to Pro"}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-20 bg-muted/10 border-t border-border/40">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
        >
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-sm">
              Still got questions? We've compiled a few quick explanations.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-border/50 bg-card rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-medium text-foreground hover:bg-muted/10 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/30 bg-muted/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-md premium-btn flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">
              link<span className="text-primary">ora</span>
            </span>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Linkora Inc. Designed for premium bookmarking. All rights reserved.
          </p>

          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">GitHub</span>
              <Globe className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
