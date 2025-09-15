import { Link } from '@tanstack/react-router';
import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:bg-gray-900/90 dark:border-gray-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Rocket className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Applaa Arcade
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium dark:text-gray-300 dark:hover:text-blue-400">
              Home
            </Link>
            <Link to="/space-invaders" className="text-gray-700 hover:text-blue-600 transition-colors font-medium dark:text-gray-300 dark:hover:text-blue-400">
              Space Invaders
            </Link>
            {/* Add more navigation links here as needed */}
          </nav>
        </div>
      </div>
    </header>
  );
}