
import React, { useState } from 'react';
import { Step } from './types';
import { QUESTIONS } from './constants';
import { NotebookPaper } from './components/NotebookPaper';
import { InputBox } from './components/InputBox';
import { ValentineQuestion } from './components/ValentineQuestion';
import { HeartSuccess } from './components/HeartSuccess';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.DESTINATION);
  const [errorCount, setErrorCount] = useState(0);
  const [isError, setIsError] = useState(false);

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

  const renderContent = () => {
    switch (currentStep) {
      case Step.DESTINATION:
      case Step.DINING:
        return (
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
        return <ValentineQuestion onYes={() => setCurrentStep(Step.SUCCESS)} />;

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

export default App;
