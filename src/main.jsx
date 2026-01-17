import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}

      // ⭐ VERY IMPORTANT ⭐
      afterSignInUrl="/dashboard"     // <-- ADD THIS
      afterSignUpUrl="/dashboard"     // <-- ADD THIS

      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#4F46E5",
          colorPrimaryHover: "#6366F1",
          colorText: "#0F172A",
          colorTextSecondary: "#475569",
          colorBackground: "#FFFFFF",
          borderRadius: "0.75rem",
          fontSize: "1rem",
        },

        layout: {
          shimmer: false,
        },

        elements: {
          rootBox: "bg-white",

          card: `
            shadow-xl rounded-2xl border border-gray-100 
            bg-white
          `,

          headerTitle: "text-3xl font-extrabold text-gray-900",
          headerSubtitle: "text-gray-600 text-sm mb-4",

          formFieldLabel: "text-gray-700 font-medium mb-1",

          formFieldInput: `
            border border-gray-300 rounded-xl px-4 py-3 
            focus:ring-2 focus:ring-indigo-400
            focus:border-indigo-400
            transition-all
          `,

          formButtonPrimary: `
            bg-gradient-to-r from-indigo-500 to-purple-500 
            hover:from-purple-500 hover:to-indigo-500 
            text-white font-semibold py-3 rounded-xl
            shadow-md hover:shadow-lg transition-all
          `,

          socialButtonsBlockButton: `
            rounded-xl border border-gray-200 shadow-sm 
            hover:bg-gray-50 transition
          `,

          footer: "hidden",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>
);
