import React from 'react';
import Header from './Header';
import { MadeWithApplaa } from './made-with-applaa';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-950 dark:to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <MadeWithApplaa />
    </div>
  );
}