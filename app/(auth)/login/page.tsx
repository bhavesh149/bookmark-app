"use client";

import { GoogleSignInButton } from "@/components/auth/google-button";
import { Bookmark, Zap, Shield, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-5" />

      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-dots" />

      {/* Gradient orbs - updated to warm amber/gold */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[128px] pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-card/90 backdrop-blur-2xl border border-border/80 rounded-[2rem] p-8 shadow-2xl glow-md"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="h-16 w-16 rounded-[1.25rem] premium-btn flex items-center justify-center shadow-lg glow-md relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="text-white font-bold text-3xl z-10">L</span>
            </motion.div>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-extrabold tracking-tight mb-3"
            >
              link<span className="text-primary">ora</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-sm font-medium"
            >
              The premium bookmark engine.
              <br />Save privately. Sync instantly.
            </motion.p>
          </div>

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-3 mb-10"
          >
            <FeatureItem
              icon={<Shield className="h-4 w-4" />}
              label="Secure RLS"
            />
            <FeatureItem
              icon={<RefreshCw className="h-4 w-4" />}
              label="Real-time"
            />
            <FeatureItem
              icon={<Zap className="h-4 w-4" />}
              label="Instant"
            />
          </motion.div>

          {/* Google Sign In */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GoogleSignInButton />
          </motion.div>

          {/* Footer */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-xs text-muted-foreground/80 mt-8 leading-relaxed"
          >
            By continuing, you agree to our Terms of Service <br/> and Privacy Policy.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/60 transition-colors">
      <div className="text-primary/90">{icon}</div>
      <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
