'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Organisations',
    href: '/',
    icon: Building2,
  },
  {
    label: 'Cities',
    href: '/cities',
    icon: MapPin,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const safePathname = pathname || '';

  return (
    <aside className="h-full w-56 border-r bg-background/60 backdrop-blur-sm flex flex-col">
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold tracking-tight">Navigation</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your hostels and cities
        </p>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            safePathname === item.href ||
            safePathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

