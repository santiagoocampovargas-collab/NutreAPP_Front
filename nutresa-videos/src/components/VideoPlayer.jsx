import { useEffect, useRef, useState } from "react";

const fmt = (s = 0) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const btn = "rounded-md px-3 py-1.5 text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-colors";

export default function VideoPlayer({ video }) {
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [rate, setRate] = useState(1);
  const [vol, setVol] = useState(1);
  const [cine, setCine] = useState(false);

  // Cambia el título de la pestaña al cambiar de video
  useEffect(() => {
    document.title = `${video.titulo} · Nutresa Videos`;
    setPlaying(false); setT(0);
  }, [video.src]);

  // Limpia el modo cine al salir
  useEffect(() => () => document.body.classList.remove("cine"), []);

  const v = () => videoRef.current;
  const alternar = () => (v().paused ? v().play() : v().pause());
  const saltar = (s) => { v().currentTime = Math.max(0, Math.min(v().duration || 0, v().currentTime + s)); };
  const cambiarRate = (r) => { setRate(r); v().playbackRate = r; };
  const cambiarVol = (x) => { setVol(x); v().volume = x; };
  const pantallaCompleta = () => (document.fullscreenElement ? document.exitFullscreen() : stageRef.current.requestFullscreen());
  const pip = async () => {
    try { document.pictureInPictureElement ? await document.exitPictureInPicture() : await v().requestPictureInPicture(); } catch {}
  };
  const modoCine = () => setCine(document.body.classList.toggle("cine"));

  const teclado = (e) => {
    const mapa = { " ": alternar, ArrowRight: () => saltar(5), ArrowLeft: () => saltar(-5), f: pantallaCompleta };
    if (mapa[e.key]) { e.preventDefault(); mapa[e.key](); }
  };

  return (
    <div ref={stageRef} tabIndex={0} onKeyDown={teclado} className="overflow-hidden rounded-2xl bg-nutresa-950">
      <video
        ref={videoRef} key={video.src} src={video.src} className="aspect-video w-full bg-black" playsInline
        onClick={alternar}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => { setDur(e.target.duration); e.target.playbackRate = rate; e.target.volume = vol; }}
        onTimeUpdate={(e) => setT(e.target.currentTime)}
      />
      <div className="space-y-3 p-4">
        <input type="range" min="0" max={dur || 0} step="0.1" value={t} aria-label="Progreso del video"
          onChange={(e) => { v().currentTime = Number(e.target.value); }} className="w-full accent-nutresa-500" />
        <div className="flex flex-wrap items-center gap-2 text-white">
          <button onClick={alternar} className={`${btn} bg-nutresa-600 hover:bg-nutresa-500`}>{playing ? "Pausar" : "Reproducir"}</button>
          <button onClick={() => saltar(-10)} className={btn}>−10 s</button>
          <button onClick={() => saltar(10)} className={btn}>+10 s</button>
          <span className="text-sm tabular-nums opacity-80">{fmt(t)} / {fmt(dur)}</span>
          <select value={rate} onChange={(e) => cambiarRate(Number(e.target.value))} aria-label="Velocidad"
            className="ml-auto rounded-md bg-white/10 px-2 py-1.5 text-sm">
            {[0.5, 1, 1.25, 1.5, 2].map((r) => <option key={r} value={r} className="text-black">{r}×</option>)}
          </select>
          <input type="range" min="0" max="1" step="0.05" value={vol} onChange={(e) => cambiarVol(Number(e.target.value))}
            aria-label="Volumen" className="w-24 accent-nutresa-500" />
          <button onClick={pip} className={btn}>Mini reproductor</button>
          <button onClick={modoCine} aria-pressed={cine} className={btn}>{cine ? "Salir del modo cine" : "Modo cine"}</button>
          <button onClick={pantallaCompleta} className={btn}>Pantalla completa</button>
        </div>
        <p className="text-xs text-white/60">Atajos: espacio reproduce o pausa, ← → saltan 5 s, F pantalla completa.</p>
      </div>
    </div>
  );
}
