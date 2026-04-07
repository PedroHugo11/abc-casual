'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ThemeController() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [pathname]);

  return null;
}