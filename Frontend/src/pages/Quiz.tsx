import { useState } from 'react';
import { Button } from '../components/ui/Button';

export function Quiz() {
  const [step, setStep] = useState(0);

  const handleNext = () => setStep(1);

  if (step === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 md:px-12 bg-[#F8F6F4] min-h-[70vh]">
        <div className="max-w-3xl w-full flex flex-col items-center text-center">
          <img src="/assets/generated/quiz-result-radiance.png" alt="Quiz Result" className="w-48 h-48 object-cover rounded-full mb-8 shadow-sm" />
          <p className="text-sm font-serif italic text-[#C4A999] mb-4">Your Signature Routine</p>
          <h1 className="text-4xl md:text-5xl font-serif mb-6 text-primary">The Radiance Regimen</h1>
          <p className="text-sm text-muted mb-8 max-w-lg">Based on your answers, we've selected a hydrating and brightening routine designed to protect your skin barrier while targeting dullness.</p>
          <Button onClick={() => setStep(0)}>RETake Quiz</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 md:px-12 bg-[#F8F6F4] min-h-[70vh]">
      <div className="max-w-2xl w-full flex flex-col items-center text-center">
        <p className="text-sm font-serif italic text-[#C4A999] mb-4">Personalized For You</p>
        <h1 className="text-5xl md:text-6xl font-serif mb-8 text-primary leading-tight">Discover Your Signature Routine</h1>
        <p className="text-sm text-muted mb-12 max-w-md leading-relaxed">
          Answer a few quick questions about your skin type, concerns, and lifestyle. Our intelligent engine will curate a personalized 4-step regimen designed to deliver real results.
        </p>
        <Button onClick={handleNext}>BEGIN ANALYSIS</Button>
      </div>
    </div>
  );
}

