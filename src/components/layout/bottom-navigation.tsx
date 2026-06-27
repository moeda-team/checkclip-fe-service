"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { Home, Heart, Plus, Trophy, User } from 'lucide-react';
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home size={24} />, path: '/' },
  { id: 'health', label: 'Health', icon: <Heart size={24} />, path: '/health' },
  { id: 'add', label: 'Add', icon: <Plus size={24} />, path: '/add' },
  { id: 'challenges', label: 'Challenges', icon: <Trophy size={24} />, path: '/challenges' },
  { id: 'profile', label: 'Profile', icon: <User size={24} />, path: '/profile' },
];

interface BottomNavigationProps {
  activeItem?: string;
  className?: string;
}

export function BottomNavigation({
  activeItem = 'home',
  className,
}: BottomNavigationProps) {
  const router = useRouter();

  return (
    <nav
      data-slot="bottom-nav"
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-[72px] bg-surface rounded-[24px] shadow-[--shadow-floating] flex items-center justify-around px-4 z-999",
        className
      )}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          className={cn(
            "bg-none border-none cursor-pointer flex flex-col items-center gap-1 p-2 rounded-[16px] transition-all min-w-[44px] min-h-[44px]",
            activeItem === item.id
              ? "opacity-100 text-primary"
              : "text-foreground opacity-50 hover:opacity-70"
          )}
          onClick={() => router.push(item.path)}
        >
          <span className="flex items-center justify-center md:scale-110">{item.icon}</span>
          <span className="text-[12px] font-medium font-sans md:text-[13px]">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
