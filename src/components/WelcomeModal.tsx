"use client";

import { useState, useEffect } from "react";

interface WelcomeModalProps {
  userName: string;
  onClose: () => void;
  onCreateKey: () => void;
}

export function WelcomeModal({ userName, onClose, onCreateKey }: WelcomeModalProps) {
  const [step, setStep] = useState(0);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const steps = [
    {
      icon: "👋",
      title: `Welcome, ${userName?.split(" ")[0] || "there"}!`,
      description: "You're all set to start generating beautiful OG images. Let me show you around.",
    },
    {
      icon: "🔑",
      title: "Get Your API Key",
      description: "API keys unlock higher rate limits (500/month free) and let you track usage. Create one to get started.",
    },
    {
      icon: "🎨",
      title: "Customize & Generate",
      description: "Use our editor to design your images, then grab the URL. Works with any framework or static site.",
    },
    {
      icon: "🚀",
      title: "You're Ready!",
      description: "Add the URL to your meta tags and your site will have beautiful social previews. It's that simple.",
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-8 shadow-2xl">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step ? "bg-white w-6" : "bg-neutral-700 hover:bg-neutral-600"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-6">{currentStep.icon}</div>
          <h2 className="text-2xl font-bold mb-3">{currentStep.title}</h2>
          <p className="text-neutral-400 leading-relaxed">{currentStep.description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl font-medium transition-colors"
            >
              Back
            </button>
          )}
          
          {isLastStep ? (
            <button
              onClick={() => {
                onCreateKey();
                onClose();
              }}
              className="flex-1 px-4 py-3 bg-white text-black hover:bg-neutral-200 rounded-xl font-medium transition-colors"
            >
              Create API Key
            </button>
          ) : (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 px-4 py-3 bg-white text-black hover:bg-neutral-200 rounded-xl font-medium transition-colors"
            >
              {step === 0 ? "Get Started" : "Next"}
            </button>
          )}
        </div>

        {/* Skip */}
        <button
          onClick={onClose}
          className="w-full mt-4 text-sm text-neutral-500 hover:text-white transition-colors"
        >
          Skip intro
        </button>
      </div>
    </div>
  );
}
