// src/components/PhpLoginRedirect.tsx
import React, { useEffect } from 'react';

const PhpLoginRedirect: React.FC = () => {
  useEffect(() => {
    // Redirect to PHP login page after a short delay
    const timer = setTimeout(() => {
      window.location.href = 'http://localhost/login';
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to FoodHome
        </h1>
        <p className="text-gray-600 mb-6">
          Redirecting you to the login page...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200 max-w-md mx-auto">
          <p className="text-yellow-800 text-sm">
            If you are not redirected automatically, 
            <a 
              href="http://localhost/login" 
              className="text-blue-600 hover:text-blue-800 underline ml-1"
            >
              click here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhpLoginRedirect;