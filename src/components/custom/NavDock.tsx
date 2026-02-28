import {
  Activity,
  Component,
  HomeIcon,
  Mail,
  Moon,
  Package,
  ScrollText,
  Sun,
} from 'lucide-react';

import { Dock, DockIcon, DockItem, DockLabel } from '@/components/motion-primitives/dock';

import { useTheme } from "@/hooks/useTheme";

import { WaitLink } from "@/components/custom/LinkWait";

const data = [
  {
    href: '/',
    icon: (
      <HomeIcon className='h-full w-full dark:text-foreground in-active:dark:text-background' />
    ),
    title: 'Home',
  },
  {
    href: '/products',
    icon: (
      <Package className='h-full w-full dark:text-foreground in-active:dark:text-background' />
    ),
    title: 'Products',
  },
  {
    href: '/components',
    icon: (
      <Component className='h-full w-full dark:text-foreground in-active:dark:text-background' />
    ),
    title: 'Components',
  },
  {
    href: '/activities',
    icon: (
      <Activity className='h-full w-full dark:text-foreground in-active:dark:text-background' />
    ),
    title: 'Activity',
  },
  {
    href: '/changelog',
    icon: (
      <ScrollText className='h-full w-full dark:text-foreground in-active:dark:text-background' />
    ),
    title: 'Change Log',
  },
  {
    href: 'mailto:contact@example.com',
    icon: (
      <Mail className='h-full w-full in-active:dark:text-background dark:text-foreground' />
    ),
    title: 'Email',
  },
  {
    href: '',
    icon: (
      <Moon className='h-full w-full in-active:dark:text-background dark:text-foreground' />
    ),
    icon2: (
      <Sun className='h-full w-full dark:text-foreground in-active:dark:text-background' />
    ),
    title: 'Theme',
  },
];

export function AppleStyleDock() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className='z-10 fixed bottom-2 left-1/2 max-w-full -translate-x-1/2'>
      <Dock
        className='items-end pb-3 cursor-pointer bg-transparent dark:bg-transparent border border-black/20 dark:border-foreground/30 backdrop-blur-[3px]'
      >
        {data.map((item, idx) => (
          item.title === 'Theme' ? (
            <DockItem
              key={idx}
              className='aspect-square rounded-full bg-black/10 hover:bg-black/15 dark:bg-foreground/20 dark:hover:bg-foreground/10 backdrop-blur-[50px] active:bg-neon dark:active:bg-neon'
              onClick={toggleTheme}
            >
              <DockLabel>{item.title}</DockLabel>
              {theme === 'dark' ?
                <DockIcon key='dark' className='animate-in fade-in'>{item.icon2}</DockIcon> :
                <DockIcon key='light' className='animate-in fade-in'>{item.icon}</DockIcon>
              }
            </DockItem>
          ) : (
            <WaitLink
              key={idx}
              to={item.href}
              waitTime={700}
              className='cursor-pointer'
            >
              <DockItem
                key={idx}
                className='aspect-square rounded-full bg-black/10 hover:bg-black/15 dark:bg-foreground/20 dark:hover:bg-foreground/10 backdrop-blur-[50px] active:bg-neon dark:active:bg-neon'
              >
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>{item.icon}</DockIcon>
              </DockItem>
            </WaitLink>
          )
        ))}
      </Dock>
    </div>
  );
}
