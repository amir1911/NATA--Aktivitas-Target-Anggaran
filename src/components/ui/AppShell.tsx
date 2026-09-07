'use client';

import { useState, useEffect, useCallback } from 'react';
import SplashScreen from '@/components/ui/SplashScreen';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Only show splash once per browser session
    const already = sessionStorage.getItem('nata_splash_shown');
    if (!already) {
      setShowSplash(true);
    }
  }, []);

  const handleSplashFinish = useCallback(() => {
    sessionStorage.setItem('nata_splash_shown', '1');
    setShowSplash(false);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      {children}
    </>
  );
}
