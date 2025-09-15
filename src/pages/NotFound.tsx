import { useRouterState, Link } from "@tanstack/react-router";
import { useEffect } from "react";

const NotFound = ({ error }: { error?: Error }) => {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname,
      error,
    );
  }, [pathname, error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-6xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">404</h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300 mb-6">Oops! Page not found</p>
        {error && (
          <p className="text-red-500 dark:text-red-400 mb-4">
            Error: {error.message || "An unexpected error occurred."}
          </p>
        )}
        <Link to="/" className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;