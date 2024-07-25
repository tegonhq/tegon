'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';

interface LogoProps {
  width: number;
  height: number;
}

export default function StaticLogo({ width, height }: LogoProps) {
  const { theme } = useTheme();

  if (theme === 'light') {
    return (
      <Image
        src="/logo_text.svg"
        key={2}
        alt="logo"
        width={width}
        height={height}
      />
    );
  }

  return (
    <Image
      src="/logo_white_text.svg"
      alt="logo"
      key={1}
      width={width}
      height={height}
    />
  );
}
