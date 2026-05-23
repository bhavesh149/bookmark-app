"use client";

import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function GoogleOneTap() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a callback ref to initialize Google One Tap once the script loads
  const handleScriptLoad = async () => {
    if (!mounted) return;
    
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("Google One Tap: NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set in .env.local");
      return;
    }

    // Check if user is already logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session) return; // Don't show One Tap if already logged in

    // Generate nonce for Supabase auth
    const generateNonce = async () => {
      const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
      const encoder = new TextEncoder();
      const encodedNonce = encoder.encode(nonce);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return { nonce, hashedNonce };
    };

    const { nonce, hashedNonce } = await generateNonce();

    // @ts-ignore
    if (typeof window !== "undefined" && window.google) {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          try {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce: nonce,
            });

            if (error) throw error;
            
            toast.success("Successfully logged in!");
            router.push("/dashboard");
            router.refresh();
          } catch (error) {
            console.error("Error logging in with Google One Tap", error);
            toast.error("Failed to login with Google");
          }
        },
        nonce: hashedNonce,
        use_fedcm_for_prompt: false, // Fallback to legacy iframe for localhost testing
        auto_select: true, // Automatically select the account if there's only one
      });

      // @ts-ignore
      window.google.accounts.id.prompt();
    }
  };

  if (!mounted) return null;

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={handleScriptLoad}
    />
  );
}
