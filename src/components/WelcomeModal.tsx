"use client";

import { useEffect } from "react";

interface WelcomeModalProps {
  userName: string;
  onClose: () => void;
  onCreateKey: () => void;
}

export function WelcomeModal({ userName, onClose, onCreateKey }: WelcomeModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const firstName = userName?.split(" ")[0] || "there";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Single step, minimal */}
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-3">Welcome, {firstName}!</h2>
          <p className="text-neutral-400">
            Create an API key to start generating OG images.
          </p>
        </div>

        <button
          onClick={() => {
            onCreateKey();
            onClose();
          }}
          className="w-full px-4 py-3 bg-white text-black hover:bg-neutral-200 rounded-xl font-medium transition-colors"
        >
          Create API Key
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 text-sm text-neutral-500 hover:text-white transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
