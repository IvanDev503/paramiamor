import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Star, Music, VolumeX, Volume2, Play, Pause } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: 'heart' | 'sparkle' | 'star';
}

function App() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [currentBackground, setCurrentBackground] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const backgroundImages = [
    '/images/foto1.jpg',
    '/images/foto2.jpg', 
    '/images/foto3.jpg',
    '/images/foto4.jpg',
    '/images/foto5.jpg',
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
  ];

  const loveMessages = [
    "Respeto profundamente la mujer increíble que eres 🌹",
    "Admiro tu fuerza, tu inteligencia y tu corazón noble 💎",
    "Mi amor por ti crece cada día como las flores en primavera 🌸",
    "Apoyo todos tus sueños y estaré siempre a tu lado 🤝",
    "Agradezco al universo por ponerte en mi camino ✨",
    "Tu sabiduría y bondad me inspiran a ser mejor persona 🌟",
    "Valoro cada momento, cada sonrisa, cada abrazo tuyo 💕",
    "Eres mi compañera, mi confidente, mi mejor amiga 👫",
    "Tu amor me da la fuerza para conquistar cualquier desafío 💪",
    "Gracias por ser la luz que ilumina mis días más oscuros 🕯️"
  ];

  const deepFeelings = [
    { title: "Mi Respeto", message: "Respeto tu independencia, tus decisiones y tu forma única de ver el mundo", icon: "🙏" },
    { title: "Mi Admiración", message: "Admiro tu valentía para perseguir tus sueños y tu capacidad de amar sin límites", icon: "⭐" },
    { title: "Mi Apoyo", message: "Siempre estaré aquí para apoyarte, celebrar tus triunfos y consolarte en los momentos difíciles", icon: "🤝" },
    { title: "Mi Gratitud", message: "Agradezco cada día que compartes conmigo, cada lección que me enseñas", icon: "🙏" },
    { title: "Mi Amor Incondicional", message: "Te amo no solo por quien eres, sino por quien me ayudas a ser", icon: "💖" },
    { title: "Mi Compromiso", message: "Me comprometo a amarte, respetarte y valorarte todos los días de mi vida", icon: "💍" },
    { title: "Mi Protección", message: "Protegeré tu corazón, tus sueños y tu felicidad como el tesoro más preciado", icon: "🛡️" },
    { title: "Mi Devoción", message: "Eres mi inspiración diaria, mi razón para sonreír y mi hogar del alma", icon: "🏠" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loveMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground(prev => (prev + 1) % backgroundImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const createParticle = (x: number, y: number): Particle => {
    const types: Array<'heart' | 'sparkle' | 'star'> = ['heart', 'sparkle', 'star'];
    const colors = ['#ff6b9d', '#ffd93d', '#6bcf7f', '#4ecdc4', '#45b7d1', '#f093fb', '#ff9a9e'];

    return {
      id: Math.random(),
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * -4 - 2,
      size: Math.random() * 25 + 15,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: types[Math.floor(Math.random() * types.length)]
    };
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticles = Array.from({ length: 12 }, () => createParticle(x, y));
    setParticles(prev => [...prev, ...newParticles]);
    setClickCount(prev => prev + 1);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 4000);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.15
      })));
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const renderParticleIcon = (p: Particle) => {
    const style = {
      position: 'absolute' as const,
      left: p.x,
      top: p.y,
      color: p.color,
      fontSize: p.size,
      pointerEvents: 'none' as const,
      animation: 'float 4s ease-out forwards',
      zIndex: 10,
      filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))'
    };

    switch (p.type) {
      case 'heart': return <Heart key={p.id} style={style} fill={p.color} />;
      case 'sparkle': return <Sparkles key={p.id} style={style} />;
      case 'star': return <Star key={p.id} style={style} fill={p.color} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden cursor-pointer" onClick={handleClick}>
      {/* Audio local desde /public/music/oursong.mp3 */}
      <audio
        ref={audioRef}
        loop
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => alert("No se pudo cargar la canción 😢")}
      >
        <source src="/music/oursong.mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>

      {/* Controles de música */}
      <div className="fixed top-6 right-6 z-50 flex space-x-3">
        <button onClick={(e) => { e.stopPropagation(); toggleMusic(); }}
          className="bg-white/20 backdrop-blur-lg rounded-full p-3 border border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg">
          {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          className="bg-white/20 backdrop-blur-lg rounded-full p-3 border border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg">
          {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Fondos animados */}
      {backgroundImages.map((image, index) => (
        <div key={index} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-3000 ${
          index === currentBackground ? 'opacity-60' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${image})`, filter: 'blur(1px)' }} />
      ))}

      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/70 via-purple-900/70 to-indigo-900/70" />

      {/* Estrellas */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)'
            }} />
        ))}
      </div>

      {particles.map(renderParticleIcon)}

      {/* Contenido */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="mb-8">
          <h1 className="text-7xl md:text-9xl font-bold text-white mb-6 animate-pulse filter drop-shadow-2xl">💝</h1>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 via-rose-200 to-yellow-200 filter drop-shadow-lg">Para Mi Amorcito Hermosa</h2>
          <p className="text-xl md:text-3xl text-pink-100 font-light filter drop-shadow-md">Una declaración con todo el corazón de mi alma</p>
        </div>

        {showMessage && (
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-500">
              <p className="text-2xl md:text-4xl text-white font-medium leading-relaxed animate-fade-in filter drop-shadow-md">
                {loveMessages[currentMessage]}
              </p>
            </div>
          </div>
        )}

        {clickCount > 0 && (
          <div className="mb-8 animate-bounce">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full shadow-xl border border-white/20">
              <p className="text-xl font-semibold filter drop-shadow-sm">
                ¡Has creado {clickCount} explosiones de amor! 💕✨
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {deepFeelings.slice(0, Math.min(8, clickCount + 3)).map((f, index) => (
            <div key={index}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:rotate-1 shadow-xl"
              style={{ animationDelay: `${index * 0.3}s` }}>
              <div className="text-4xl mb-4 filter drop-shadow-lg">{f.icon}</div>
              <h3 className="text-white text-lg md:text-xl font-bold mb-3 filter drop-shadow-md">{f.title}</h3>
              <p className="text-pink-100 text-sm md:text-base leading-relaxed filter drop-shadow-sm">{f.message}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="text-pink-100 text-xl mb-6 animate-pulse filter drop-shadow-md">✨ Haz clic en cualquier parte para crear magia romántica ✨</p>
          <div className="flex justify-center space-x-6 text-5xl animate-bounce">
            <Heart className="text-pink-300 filter drop-shadow-lg" fill="currentColor" />
            <Sparkles className="text-yellow-300 filter drop-shadow-lg" />
            <Heart className="text-red-300 filter drop-shadow-lg" fill="currentColor" />
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <p className="text-white text-2xl md:text-3xl font-light mb-6 filter drop-shadow-md">
            Este código fue escrito con amor infinito, cada línea pensada en ti
          </p>
          <p className="text-pink-200 text-lg md:text-xl filter drop-shadow-sm">
            Porque el amor verdadero también se puede programar 💻💕
          </p>
          <div className="mt-8 text-6xl animate-pulse">🌹💖🌹</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          50% { transform: translateY(-50px) rotate(180deg) scale(1.2); opacity: 0.8; }
          100% { transform: translateY(-120px) rotate(360deg) scale(0.8); opacity: 0; }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(30px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in { animation: fade-in 1.5s ease-out; }
        .transition-opacity { transition-property: opacity; }
        .duration-3000 { transition-duration: 3000ms; }
      `}</style>
    </div>
  );
}

export default App;
