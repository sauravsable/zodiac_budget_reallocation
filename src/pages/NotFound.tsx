import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-6">
      <div className="text-center animate-fade-in">
        <h1 className="text-6xl font-extrabold text-blue-600 mb-2">404</h1>
        <p className="text-2xl font-semibold text-gray-800 mb-4">
          Page not found
        </p>
        <p className="text-md text-gray-600 mb-6">
          Sorry, the page <span className="font-mono text-red-500">{location.pathname}</span> does not exist.
        </p>
        <a
          href="/budget-allocation"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition-colors duration-200"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
