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
    title: 'Home',
    icon: (
      <HomeIcon className='h-full w-full dark:text-neutral-50' />
    ),
    href: '/',
  },
  {
    title: 'Products',
    icon: (
      <Package className='h-full w-full dark:text-neutral-50' />
    ),
    href: '/products',
  },
  {
    title: 'Components',
    icon: (
      <Component className='h-full w-full dark:text-neutral-50' />
    ),
    href: '/components',
  },
  {
    title: 'Activity',
    icon: (
      <Activity className='h-full w-full dark:text-neutral-50' />
    ),
    href: '/activities',
  },
  {
    title: 'Change Log',
    icon: (
      <ScrollText className='h-full w-full dark:text-neutral-50' />
    ),
    href: '/changelog',
  },
  {
    title: 'Email',
    icon: (
      <Mail className='h-full w-full dark:text-neutral-50' />
    ),
    href: 'mailto:contact@example.com',
  },
  {
    title: 'Theme',
    icon: (
      <Moon className='h-full w-full dark:text-neutral-50 in-active:text-neutral-200' />
    ),
    icon2: (
      <Sun className='h-full w-full dark:text-neutral-50 in-active:dark:text-gray-800' />
    ),
    href: '',
  },
];

export function AppleStyleDock() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className='z-10 fixed bottom-2 left-1/2 max-w-full -translate-x-1/2'>
      <Dock
        className='items-end pb-3 cursor-pointer bg-transparent dark:bg-transparent border border-neutral-800 dark:border-white/60 backdrop-blur-[3px]'
      >
        {data.map((item, idx) => (
          item.title === 'Theme' ? (
            <DockItem
              key={idx}
              className='aspect-square rounded-full bg-black/10 hover:bg-gray-200 dark:bg-white/30 dark:hover:bg-neutral-800 backdrop-blur-[50px] active:bg-slate-800 dark:active:bg-yellow-400'
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
                  className='aspect-square rounded-full bg-black/10 hover:bg-gray-100 dark:bg-white/30 dark:hover:bg-neutral-800 backdrop-blur-[50px]'
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
