import React, { useState, useEffect } from 'react';
import { Step } from './types';
import { QUESTIONS } from './constants';
import { NotebookPaper } from './components/NotebookPaper';
import { InputBox } from './components/InputBox';
import { ValentineQuestion } from './components/ValentineQuestion';
import { HeartSuccess } from './components/HeartSuccess';

const VISITED_KEY = 'valentine-visited';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.GAME);
  const [errorCount, setErrorCount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical mobile breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if user has already completed the flow
  useEffect(() => {
    const hasVisited = localStorage.getItem(VISITED_KEY);
    if (hasVisited === 'true') {
      setCurrentStep(Step.SUCCESS);
    }
  }, []);

  // Prevent scrolling on question pages, allow on success page
  useEffect(() => {
    if (currentStep === Step.SUCCESS) {
      // Allow scrolling on success page
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    } else {
      // Prevent scrolling on question pages
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [currentStep]);

  const activeQuestionIndex = QUESTIONS.findIndex(q => q.id === currentStep);
  const activeQuestion = activeQuestionIndex !== -1 ? QUESTIONS[activeQuestionIndex] : null;

  const handleAnswer = (val: string) => {
    if (!activeQuestion) return;

    const isCorrect = activeQuestion.answer.some(ans =>
      val.toLowerCase().trim().includes(ans.toLowerCase())
    );

    if (isCorrect) {
      setIsError(false);
      setErrorCount(0);

      if (activeQuestionIndex < QUESTIONS.length - 1) {
        setCurrentStep(QUESTIONS[activeQuestionIndex + 1].id);
      } else {
        setCurrentStep(Step.VALENTINE);
      }
    } else {
      setIsError(true);
      setErrorCount(prev => prev + 1);
      setTimeout(() => setIsError(false), 500);
    }
  };

  const handleYes = () => {
    // Save that they've completed the flow
    localStorage.setItem(VISITED_KEY, 'true');
    setCurrentStep(Step.SUCCESS);
  };

  const renderContent = () => {
    switch (currentStep) {
      case Step.GAME:
      case Step.DESTINATION:
      case Step.DINING:
        return isMobile ? (
          // Mobile version - centered and responsive
          <div className="flex flex-col items-center justify-center min-h-screen animate-[fadeIn_0.5s_ease-out] px-4">
            <h1 className="text-2xl md:text-3xl mb-4 opacity-40 font-handwritten">
              Question {activeQuestionIndex + 1}:
            </h1>
            <div className="text-3xl md:text-4xl mb-8 md:mb-12 font-handwritten text-slate-800 text-center max-w-2xl">
              {activeQuestion?.question}
            </div>

            <InputBox onConfirm={handleAnswer} isError={isError} />

            {errorCount > 0 && (
              <div className="mt-8 md:mt-12 p-4 bg-rose-50/50 border-l-4 border-rose-300 rounded-r text-slate-600 font-handwritten text-lg md:text-2xl animate-[fadeIn_0.5s_ease-out] max-w-lg">
                <span className="font-bold text-rose-500 italic">Hint:</span> {activeQuestion?.hint}
              </div>
            )}
          </div>
        ) : (
          // Desktop version - original positioning
          <div className="animate-[fadeIn_0.5s_ease-out]">
            <h1 className="text-3xl mb-4 opacity-40 font-handwritten">
              Question {activeQuestionIndex + 1}:
            </h1>
            <div className="text-5xl mb-12 font-handwritten text-slate-800">
              {activeQuestion?.question}
            </div>

            <InputBox onConfirm={handleAnswer} isError={isError} />

            {errorCount > 0 && (
              <div className="mt-12 p-4 bg-rose-50/50 border-l-4 border-rose-300 rounded-r text-slate-600 font-handwritten text-2xl animate-[fadeIn_0.5s_ease-out]">
                <span className="font-bold text-rose-500 italic">Hint:</span> {activeQuestion?.hint}
              </div>
            )}
          </div>
        );

      case Step.VALENTINE:
        return <ValentineQuestion onYes={handleYes} />;

      case Step.SUCCESS:
        return <HeartSuccess />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <NotebookPaper>
        {renderContent()}
      </NotebookPaper>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export { App };
export default App;