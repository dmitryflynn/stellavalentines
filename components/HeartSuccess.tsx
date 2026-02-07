
import React, { useEffect, useState } from 'react';
import { GoogleGenAI } from "@google/genai";

type Genre = 'Comedy' | 'Action' | 'Horror';

export const HeartSuccess: React.FC = () => {
  const [poem, setPoem] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showMovieUI, setShowMovieUI] = useState(false);
  const [suggestedMovie, setSuggestedMovie] = useState<{ title: string; desc: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchPoem = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Write a very short, sweet, 2-line Valentine's poem about a date at Carillon Point Kirkland. Keep it minimalistic and cute. NO MARKDOWN. JUST TEXT.",
        });
        setPoem(response.text?.trim() || "You are the one I love, My Valentine forever.");
      } catch (error) {
        setPoem("A day by the water, a night under stars, My heart is yours, wherever we are.");
      } finally {
        setLoading(false);
      }
    };
    fetchPoem();
  }, []);

  const generateMovie = async (genre: Genre) => {
    setIsGenerating(true);
    setSuggestedMovie(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `List 5 different highly-rated ${genre} movies for a Valentine's date night. For each, format as: "TITLE | DESCRIPTION". One per line. No markdown or numbering.`,
      });
      const text = response.text?.trim() || "";
      const movies = text.split('\n').filter(line => line.includes('|'));
          if (movies.length > 0) {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            const [title, desc] = randomMovie.split('|').map(s => s.trim());
            if (title && desc) {
              setSuggestedMovie({ title, desc });
            } else {
            setSuggestedMovie({ title: text || "About Time", desc: "A beautiful story about love and moments." });
            }
          }
    } catch (error) {
      setSuggestedMovie({ title: "About Time", desc: "A beautiful story about love and moments." });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-12 text-center animate-[fadeIn_1s_ease-out]">
      {/* Movie Button - Positioned further right and dark red */}
      <div className="absolute top-[-50px] right-[-20px] md:right-[-80px] z-20">
        <button 
          onClick={() => setShowMovieUI(!showMovieUI)}
          className="bg-transparent border-2 border-rose-900/30 text-rose-900 hover:text-rose-700 hover:border-rose-900/60 px-5 py-1.5 rounded-full text-xl font-handwritten transition-all transform hover:rotate-3 active:scale-95 shadow-sm"
        >
          Movie?
        </button>
        
        {showMovieUI && (
          <div className="absolute top-14 right-0 bg-white/90 backdrop-blur-sm border border-rose-200 p-4 rounded-xl shadow-xl w-48 animate-[fadeIn_0.3s_ease-out]">
            <p className="text-sm mb-2 opacity-60 font-sans uppercase tracking-widest text-rose-900 font-bold">Pick a vibe:</p>
            <div className="flex flex-col gap-2">
              {(['Comedy', 'Action', 'Horror'] as Genre[]).map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    generateMovie(genre);
                    setShowMovieUI(false);
                  }}
                  disabled={isGenerating}
                  className="text-left text-2xl text-rose-900 hover:text-rose-600 transition-colors disabled:opacity-30 font-handwritten"
                >
                  - {genre}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative mb-12">
        <svg 
          viewBox="0 0 100 100" 
          className="w-64 h-64 md:w-80 md:h-80 drop-shadow-xl animate-[heartArrival_1s_cubic-bezier(0.175, 0.885, 0.32, 1.275)_forwards]"
        >
          <path
            d="M50 88 L43 82 C16 56 1 42 1 25 C1 11 12 1 26 1 C34 1 42 4 47 11 C52 4 60 1 68 1 C82 1 94 11 94 25 C94 42 78 56 51 82 L50 88 Z"
            className="fill-rose-600"
          />
        </svg>
      </div>

      <div className="space-y-8 px-4">
        <h1 className="text-7xl md:text-8xl text-rose-700 font-handwritten leading-tight drop-shadow-sm">
          I Love You!
        </h1>
        
        <div className="min-h-[120px] flex flex-col justify-center">
          {isGenerating ? (
            <div className="text-3xl text-rose-400 animate-pulse font-handwritten">
              Thinking of a perfect movie...
            </div>
          ) : suggestedMovie ? (
            <div className="animate-[fadeIn_0.5s_ease-out]">
              <div className="text-4xl text-rose-800 font-bold font-handwritten mb-2">
                🎬 {suggestedMovie.title}
              </div>
              <div className="text-2xl text-slate-700 font-handwritten max-w-md mx-auto italic">
                "{suggestedMovie.desc}"
              </div>
              <button 
                onClick={() => setSuggestedMovie(null)}
                className="mt-4 text-sm text-rose-400 hover:text-rose-600 font-sans uppercase tracking-tighter"
              >
                (Show original poem)
              </button>
            </div>
          ) : !loading ? (
            <div className="text-3xl md:text-4xl text-slate-800 font-handwritten leading-relaxed max-w-xl mx-auto italic opacity-90 animate-[fadeIn_1.5s_ease-in_forwards]">
               {poem}
            </div>
          ) : null}
        </div>
      </div>

      <style>{`
        @keyframes heartArrival {
          0% { 
            transform: scale(0) rotate(-45deg); 
            opacity: 0; 
          }
          100% { 
            transform: scale(1) rotate(0deg); 
            opacity: 1; 
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
