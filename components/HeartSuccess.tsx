import React, { useEffect, useState } from 'react';
import { GoogleGenAI } from "@google/genai";

type Genre = 'Comedy' | 'Action' | 'Horror';

interface UploadedPhoto {
  url: string;
  uploadedAt: number;
}

export const HeartSuccess: React.FC = () => {
  const [poem, setPoem] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showMovieUI, setShowMovieUI] = useState(false);
  const [suggestedMovie, setSuggestedMovie] = useState<{ title: string; desc: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Photo upload states
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // Admin reset states
  const [showResetUI, setShowResetUI] = useState(false);

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
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const response = await fetch('/api/photos');
      if (response.ok) {
        const photos = await response.json();
        setUploadedPhotos(photos);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Send file directly as blob with correct content type
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (response.ok) {
        const newPhoto = await response.json();
        setUploadedPhotos(prev => [newPhoto, ...prev]);
      } else {
        const error = await response.json();
        console.error('Upload failed:', error);
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      // Reset the input so the same file can be uploaded again
      event.target.value = '';
    }
  };

  const handleReset = () => {
    if (window.confirm('⚠️ RESET EVERYTHING?\n\nThis will:\n- Clear localStorage (reset questions)\n- Require page refresh\n\nNote: Photos in Vercel Blob will stay (use "Delete All Photos" to remove them)\n\nContinue?')) {
      // Clear localStorage
      localStorage.clear();
      alert('✅ App reset! Please refresh the page.');
      // Optionally auto-refresh
      // window.location.reload();
    }
  };

  const handleDeleteAllPhotos = async () => {
    if (window.confirm('⚠️ DELETE ALL PHOTOS?\n\nThis will permanently delete ALL photos from Vercel Blob storage.\n\nThis CANNOT be undone!\n\nContinue?')) {
      try {
        const response = await fetch('/api/delete-all', {
          method: 'DELETE',
        });
        
        if (response.ok) {
          const result = await response.json();
          alert(`✅ Deleted ${result.deletedCount} photos!`);
          setUploadedPhotos([]);
          setShowResetUI(false);
        } else {
          alert('❌ Failed to delete photos. Check console.');
        }
      } catch (error) {
        console.error('Error deleting photos:', error);
        alert('❌ Error deleting photos. Check console.');
      }
    }
  };

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
    <div className="relative min-h-screen flex flex-col items-center justify-start py-12 px-4">
      {/* Hidden Admin Reset Button - Top left corner, very subtle */}
      <div className="absolute top-2 left-2 z-50">
        <button
          onClick={() => setShowResetUI(!showResetUI)}
          className="text-xs text-gray-300 hover:text-gray-400 opacity-20 hover:opacity-40 transition-opacity"
          title="Admin Reset"
        >
          ⚙️
        </button>
        {showResetUI && (
          <div className="absolute top-8 left-0 bg-white border-2 border-red-300 p-3 rounded-lg shadow-xl w-52 z-50">
            <p className="text-xs text-red-600 mb-2 font-sans font-bold">ADMIN PANEL</p>
            <div className="space-y-2">
              <button
                onClick={handleReset}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-sans transition-all"
              >
                🔄 Reset Questions
              </button>
              <button
                onClick={handleDeleteAllPhotos}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-sans transition-all"
              >
                🗑️ Delete All Photos
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 font-sans">
              Reset = localStorage only<br/>
              Delete = Removes all photos from Vercel Blob
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center text-center animate-[fadeIn_1s_ease-out] mb-12">
        {/* Movie Button - Positioned top right */}
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

        <div className="relative mb-8">
          <svg 
            viewBox="0 0 100 100" 
            className="w-48 h-48 md:w-64 md:h-64 drop-shadow-xl animate-[heartArrival_1s_cubic-bezier(0.175, 0.885, 0.32, 1.275)_forwards]"
          >
            <path
              d="M50 88 L43 82 C16 56 1 42 1 25 C1 11 12 1 26 1 C34 1 42 4 47 11 C52 4 60 1 68 1 C82 1 94 11 94 25 C94 42 78 56 51 82 L50 88 Z"
              className="fill-rose-600"
            />
          </svg>
        </div>

        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl text-rose-700 font-handwritten leading-tight drop-shadow-sm">
            I Love You!
          </h1>
          
          <div className="min-h-[100px] flex flex-col justify-center">
            {isGenerating ? (
              <div className="text-2xl text-rose-400 animate-pulse font-handwritten">
                Thinking of a perfect movie...
              </div>
            ) : suggestedMovie ? (
              <div className="animate-[fadeIn_0.5s_ease-out]">
                <div className="text-3xl text-rose-800 font-bold font-handwritten mb-2">
                  🎬 {suggestedMovie.title}
                </div>
                <div className="text-xl text-slate-700 font-handwritten max-w-md mx-auto italic">
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
              <div className="text-2xl md:text-3xl text-slate-800 font-handwritten leading-relaxed max-w-xl mx-auto italic opacity-90 animate-[fadeIn_1.5s_ease-in_forwards]">
                 {poem}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Photo Wall Section */}
      <div className="w-full max-w-4xl mt-8">
        <div className="bg-white/60 backdrop-blur-sm border-2 border-rose-200 rounded-3xl p-8 shadow-lg">
          {/* Photo Wall Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-handwritten text-rose-900 flex items-center gap-3">
              📸 Our Memories
              {uploadedPhotos.length > 0 && (
                <span className="text-2xl text-rose-400">({uploadedPhotos.length})</span>
              )}
            </h2>
            
            {/* Upload Button */}
            <label className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full text-xl font-handwritten transition-all active:scale-95 shadow-md cursor-pointer inline-flex items-center gap-2">
              {uploading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span>📷</span>
                  <span>Add Photo</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Photo Grid */}
          {uploadedPhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedPhotos.map((photo, index) => (
                <div 
                  key={index} 
                  className="relative group aspect-square animate-[fadeIn_0.5s_ease-out]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img 
                    src={photo.url} 
                    alt={`Memory ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl shadow-md border-4 border-white group-hover:border-rose-300 transition-all group-hover:scale-105 group-hover:shadow-xl"
                  />
                  {/* Polaroid-style date stamp */}
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-sans text-slate-600 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {new Date(photo.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💕</div>
              <p className="text-2xl text-slate-400 font-handwritten">
                No photos yet! Add your first memory
              </p>
            </div>
          )}
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