import { useRef, useState, useEffect } from "react";


export default function ComponenteEjemplo() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [prevSongIndex, setPrevSongIndex] = useState(0);
  const [volume, setVolume] = useState(80); // 0-100
  const [countP3, setCountP3] = useState(0);
  const [countP4, setCountP4] = useState(0);
  const [countP5, setCountP5] = useState(0);

  const franchiseByIndex: Record<number, "P3" | "P4" | "P5"> = {
    0: "P3", // Full Moon Full Life
    1: "P5", // I Believe
    2: "P4", // Reach Out To The Truth
    3: "P5", // Take Over
  };

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
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    const franchise = franchiseByIndex[nextIndex];
    if (franchise === "P3") setCountP3((c) => c + 1);
    if (franchise === "P4") setCountP4((c) => c + 1);
    if (franchise === "P5") setCountP5((c) => c + 1);
    setIsPlaying(true);
  };

  const previousSong = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    const franchise = franchiseByIndex[prevIndex];
    if (franchise === "P3") setCountP3((c) => c + 1);
    if (franchise === "P4") setCountP4((c) => c + 1);
    if (franchise === "P5") setCountP5((c) => c + 1);
    setIsPlaying(true);
  };

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    // Al seleccionar, la canción sonará: suma según la saga
    const franchise = franchiseByIndex[index];
    if (franchise === "P3") setCountP3((c) => c + 1);
    if (franchise === "P4") setCountP4((c) => c + 1);
    if (franchise === "P5") setCountP5((c) => c + 1);
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

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseInt(e.target.value, 10);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVol / 100));
    }
  };

  const formatTime = (time: number) => {
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

  // Cargar contadores desde localStorage al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem("personaCounts");
      if (raw) {
        const parsed = JSON.parse(raw) as { p3?: number; p4?: number; p5?: number };
        if (typeof parsed.p3 === "number") setCountP3(parsed.p3);
        if (typeof parsed.p4 === "number") setCountP4(parsed.p4);
        if (typeof parsed.p5 === "number") setCountP5(parsed.p5);
      }
    } catch {}
  }, []);

  // Guardar contadores cuando cambian
  useEffect(() => {
    try {
      const payload = JSON.stringify({ p3: countP3, p4: countP4, p5: countP5 });
      localStorage.setItem("personaCounts", payload);
    } catch {}
  }, [countP3, countP4, countP5]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, volume / 100));
  }, [volume]);

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
      {/* Gráfico de barras por saga (proporcional) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-3xl px-6">
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-white/80 text-sm tracking-widest uppercase">Escuchas por Juego</span>
            <button
              onClick={() => {
                setCountP3(0);
                setCountP4(0);
                setCountP5(0);
                try { localStorage.removeItem("personaCounts"); } catch {}
              }}
              className="px-3 py-1 text-xs font-semibold rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
            >
              Reset gráfico
            </button>
          </div>
          {(() => {
            const total = countP3 + countP4 + countP5;
            const p3Pct = total ? Math.round((countP3 / total) * 100) : 0;
            const p4Pct = total ? Math.round((countP4 / total) * 100) : 0;
            const p5Pct = total ? Math.round((countP5 / total) * 100) : 0;
            return (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cyan-400 font-bold">Persona 3</span>
                    <span className="text-white/70 text-xs">{p3Pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-700" style={{ width: `${p3Pct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-yellow-400 font-bold">Persona 4</span>
                    <span className="text-white/70 text-xs">{p4Pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-600" style={{ width: `${p4Pct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-red-500 font-bold">Persona 5</span>
                    <span className="text-white/70 text-xs">{p5Pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-rose-700" style={{ width: `${p5Pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

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

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 text-sm">Volumen</span>
            <span className="text-slate-400 text-xs">{volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
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