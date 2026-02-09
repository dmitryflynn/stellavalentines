import React, { useState, useEffect } from 'react';
import { NotebookPaper } from './components/NotebookPaper';
import { Typewriter } from './components/Typewriter';
import { InputBox } from './components/InputBox';
import { ValentineQuestion } from './components/ValentineQuestion';
import { HeartSuccess } from './components/HeartSuccess';

type AppState = 'question' | 'input' | 'valentine-question' | 'success';

const CORRECT_ANSWER = 'stella'; // Change this to your answer
const VISITED_KEY = 'valentine-visited';

function App() {
  const [state, setState] = useState<AppState>('question');
  const [userAnswer, setUserAnswer] = useState('');
  const [isError, setIsError] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);

  // Check if user has already answered correctly
  useEffect(() => {
    const hasVisited = localStorage.getItem(VISITED_KEY);
    if (hasVisited === 'true') {
      setState('success');
    } else {
      // Small delay before showing the typewriter
      const timer = setTimeout(() => setShowTypewriter(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAnswer = (answer: string) => {
    setUserAnswer(answer);
    if (answer.toLowerCase() === CORRECT_ANSWER.toLowerCase()) {
      setIsError(false);
      setState('valentine-question');
    } else {
      setIsError(true);
    }
  };

  const handleYes = () => {
    // Save that they've completed the flow
    localStorage.setItem(VISITED_KEY, 'true');
    setState('success');
  };

  return (
    <NotebookPaper>
      {state === 'question' && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          {showTypewriter && (
            <Typewriter
              text="What's my name?"
              speed={50}
              className="text-5xl md:text-6xl text-rose-800 mb-4"
              onComplete={() => setState('input')}
            />
          )}
        </div>
      )}

      {state === 'input' && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-5xl md:text-6xl text-rose-800 mb-4">
            What's my name?
          </h1>
          <InputBox onConfirm={handleAnswer} isError={isError} />
          {isError && (
            <p className="text-rose-500 mt-4 text-xl animate-pulse">
              Try again! 💔
            </p>
          )}
        </div>
      )}

      {state === 'valentine-question' && <ValentineQuestion onYes={handleYes} />}

      {state === 'success' && <HeartSuccess />}
    </NotebookPaper>
  );
}

export default App;