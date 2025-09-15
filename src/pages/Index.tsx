import { Link } from '@tanstack/react-router';

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center">
      <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Welcome to Applaa Arcade!
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
        Explore classic games and modern web applications, all crafted with premium design and functionality.
      </p>
      <Link
        to="/space-invaders"
        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Play Space Invaders
      </Link>
    </div>
  );
};

export default Index;