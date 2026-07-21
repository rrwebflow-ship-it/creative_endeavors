'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCycleDay } from '@/lib/getWorkout';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/day/${getCycleDay()}`);
  }, [router]);

  return <div className="min-h-screen bg-[#0F0F0F]" />;
}
