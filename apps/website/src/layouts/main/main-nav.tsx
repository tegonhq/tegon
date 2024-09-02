import { buttonVariants } from '@tegonhq/ui/components/button';
import { cn } from '@tegonhq/ui/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export function MainNav() {
  const { theme } = useTheme();

  return (
    <div className="mr-4 hidden md:flex mt-2">
      <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
        {theme === 'dark' ? (
          <Image
            src="/logo_white_text.svg"
            key={2}
            alt="logo"
            width={120}
            height={50}
          />
        ) : (
          <Image
            src="/logo_text.svg"
            key={2}
            alt="logo"
            width={120}
            height={50}
          />
        )}
      </Link>
      <nav className="flex items-center gap-4 lg:gap-6">
        <a
          href="https://docs.tegon.ai/actions/overview"
          target="_blank"
          className={cn(
            'flex items-center',
            buttonVariants({ variant: 'ghost' }),
          )}
        >
          Actions
        </a>
        <a
          href="https://docs.tegon.ai"
          target="_blank"
          className={cn(
            'flex items-center',
            buttonVariants({ variant: 'ghost' }),
          )}
        >
          Docs
        </a>
        <a
          href="https://github.com/tegonhq/tegon/releases"
          target="_blank"
          className={cn(
            'flex items-center',
            buttonVariants({ variant: 'ghost' }),
          )}
        >
          Releases
        </a>
        <Link
          href="/company"
          target="_blank"
          className={cn(
            'flex items-center',
            buttonVariants({ variant: 'ghost' }),
          )}
        >
          Our story
        </Link>
      </nav>
    </div>
  );
}
