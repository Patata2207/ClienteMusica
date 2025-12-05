import { useRef, useState, useEffect } from "react";


export default function ComponenteEjemplo() {
  const audioRef = useRef(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [prevSongIndex, setPrevSongIndex] = useState(0);

  const songs = [
    { 
      title: "Full Moon Full Life", 
      url: "http://127.0.0.1:8000/media/audio/Full-Moon-Full-Life.ogg",
      image: "/fondos/persona3fondo.jpg"
    },
    { 
      title: "I Believe", 
      url: "http://127.0.0.1:8000/media/audio/I-believe.ogg",
      image: "/fondos/persona5fondo.jpg"
    },
    { 
      title: "Reach Out To The Truth", 
      url: "http://127.0.0.1:8000/media/audio/Reach-Out-To-The-Truth.ogg",
      image: "/fondos/persona4fondo.jpg"
    },
    { 
      title: "Take Over", 
      url: "http://127.0.0.1:8000/media/audio/Take-Over.ogg",
      image: "/fondos/persona5fondo.jpg"
    },
  ];

  const colorThemes = [
    {
      // Full Moon Full Life - Azul
      bg: "bg-slate-900",
      card: "bg-slate-800",
      accent: "bg-cyan-600",
      accentHover: "from-cyan-600 to-blue-800",
      button: "bg-slate-700 hover:bg-slate-600",
      progress: "accent-cyan-600",
    },
    {
      // I Believe - Rojo
      bg: "bg-red-950",
      card: "bg-red-900",
      accent: "bg-red-600",
      accentHover: "from-red-600 to-red-800",
      button: "bg-red-800 hover:bg-red-700",
      progress: "accent-red-600",
    },
    {
      // Reach Out To The Truth - Amarillo
      bg: "bg-yellow-950",
      card: "bg-yellow-500",
      accent: "bg-yellow-500",
      accentHover: "from-yellow-500 to-yellow-700",
      button: "bg-yellow-800 hover:bg-yellow-700",
      progress: "accent-yellow-500",
    },
    {
      // Take Over - Rojo
      bg: "bg-red-950",
      card: "bg-red-900",
      accent: "bg-red-600",
      accentHover: "from-red-600 to-red-800",
      button: "bg-red-800 hover:bg-red-700",
      progress: "accent-red-600",
    },
  ];

  const currentTheme = colorThemes[currentSongIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const previousSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const selectSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSongEnd = () => {
    nextSong();
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevSongIndex(currentSongIndex);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentSongIndex]);

  return (
    <div 
      className="flex justify-center items-center min-h-screen p-4 relative overflow-hidden"
    >

      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${songs[prevSongIndex].image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          opacity: currentSongIndex === prevSongIndex ? 1 : 0,
        }}
      />


      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${songs[currentSongIndex].image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          opacity: currentSongIndex === prevSongIndex ? 0 : 1,
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className={`mb-6 ${currentTheme.card} p-4 rounded-lg transition-colors duration-500`}>
          <h3 className="text-white font-bold mb-3 text-center">Selecciona una canción:</h3>
          <div className="grid grid-cols-1 gap-2">
            {songs.map((song, index) => (
              <button
                key={index}
                onClick={() => selectSong(index)}
                className={`px-4 py-2 rounded font-semibold transition-all duration-300 ${
                  currentSongIndex === index
                    ? `${colorThemes[index].accent} text-white shadow-lg`
                    : `${colorThemes[index].button} text-slate-300`
                }`}
              >
                {song.title}
              </button>
            ))}
          </div>
        </div>


        <div className="text-center mb-6">
          <h2 className="text-white font-bold text-xl mb-2">{songs[currentSongIndex].title}</h2>
          <p className="text-slate-400 text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>


        <div className="mb-6">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer ${currentTheme.progress} transition-colors duration-500`}
          />
        </div>


        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={previousSong}
            className={`px-6 py-3 text-white hover:text-slate-900 font-bold 
                       hover:bg-white
                       focus:hover:bg-linear-to-r focus:hover:${currentTheme.accentHover}
                       focus:hover:text-white
                       transform skew-x-12 
                       shadow-lg hover:shadow-xl 
                       transition-all duration-300 
                       hover:scale-105 hover:brightness-110
                       hover:cursor-pointer`}
          >
             Anterior
          </button>

          <button
            onClick={togglePlay}
            className={`px-8 py-4 text-white hover:text-slate-900 font-bold 
                       hover:bg-white
                       focus:hover:bg-linear-to-r focus:hover:${currentTheme.accentHover}
                       focus:hover:text-white
                       transform skew-x-12 
                       shadow-lg hover:shadow-xl 
                       transition-all duration-300 
                       hover:scale-105 hover:brightness-110
                       hover:cursor-pointer`}
          >
            {isPlaying ? " Pausar" : " Reproducir"}
          </button>

          <button
            onClick={nextSong}
            className={`px-6 py-3 text-white hover:text-slate-900 font-bold 
                       hover:bg-white
                       focus:hover:bg-linear-to-r focus:hover:${currentTheme.accentHover}
                       focus:hover:text-white
                       transform skew-x-12 
                       shadow-lg hover:shadow-xl 
                       transition-all duration-300 
                       hover:scale-105 hover:brightness-110
                       hover:cursor-pointer`}
          >
            Siguiente 
          </button>
        </div>

        <audio
          ref={audioRef}
          src={songs[currentSongIndex].url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleSongEnd}
        />
      </div>
    </div>
  );
}