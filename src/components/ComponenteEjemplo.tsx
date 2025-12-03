import { useRef } from "react";

export default function ComponenteEjemplo() {
  const audioRef = useRef(null);
  const buttonRef = useRef(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.blur();
      }
    }, 100);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <button
        ref={buttonRef}
        onClick={playAudio}
        className="px-8 py-4 text-white hover:text-slate-900 font-bold 
                   hover:bg-white
                   focus:hover:bg-linear-to-r focus:hover:from-cyan-600 focus:hover:to-blue-800
                   focus:hover:text-white
                   transform skew-x-12 
                   shadow-lg hover:shadow-xl 
                   transition-all duration-300 
                   hover:scale-105 hover:brightness-110
                   hover:cursor-pointer
                   "
      >
        Reproducir música
      </button>

      <audio
        ref={audioRef}
        src="http://127.0.0.1:8000/media/audio/Full-Moon-Full-Life.ogg"
      />
    </div>
  );
}