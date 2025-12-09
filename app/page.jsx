"use client";

import { Suspense, lazy } from "react";
import { AuthProvider } from "@/lib/authContext";
import { Toaster } from "@/components/ui/toaster";

const LandingPage = lazy(() => import("./_components/landing/LandingPage"));

export default function Home() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
          </div>
        }
      >
        <LandingPage />
      </Suspense>
      <Toaster />
    </AuthProvider>
  );
}
