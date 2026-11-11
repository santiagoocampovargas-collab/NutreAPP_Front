import { useState } from "react";
import RegistroForm, { ROLES, DEPARTAMENTOS } from "./components/RegistroForm";
import VideoPlayer from "./components/VideoPlayer";
import { VIDEOS_INICIALES } from "./data/videos";

const etiqueta = (lista, valor) => lista.find((x) => x.value === valor)?.label ?? valor;

export default function App() {
  const [usuarios, setUsuarios] = useState(() => {
    try { return JSON.parse(localStorage.getItem("usuarios")) ?? []; } catch { return []; }
  });
  const [videos, setVideos] = useState(VIDEOS_INICIALES);
  const [actual, setActual] = useState(VIDEOS_INICIALES[0]);

  const registrar = (u) => {
    const sig = [u, ...usuarios];
    setUsuarios(sig);
    try { localStorage.setItem("usuarios", JSON.stringify(sig)); } catch {}
  };

  const agregarLocal = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const nuevo = { id: crypto.randomUUID(), titulo: f.name.replace(/\.[^.]+$/, ""), categoria: "Local", src: URL.createObjectURL(f) };
    setVideos((p) => [...p, nuevo]);
    setActual(nuevo);
  };

  return (
    <>
      <header className="bg-nutresa-600 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <h1 className="font-display text-xl font-extrabold">Nutresa Videos</h1>
          <p className="text-sm text-white/80">{usuarios.length} {usuarios.length === 1 ? "persona registrada" : "personas registradas"}</p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[22rem_1fr]">
        <RegistroForm onRegistrar={registrar} />

        <section className="space-y-4">
          <VideoPlayer video={actual} />
          <div className="panel rounded-2xl border border-nutresa-100 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold">Videos corporativos</h2>
              <label className="cursor-pointer rounded-lg bg-nutresa-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-nutresa-700">
                Agregar desde mi equipo
                <input type="file" accept="video/*" onChange={agregarLocal} className="sr-only" />
              </label>
            </div>
            <ul className="divide-y divide-nutresa-100">
              {videos.map((v) => (
                <li key={v.id}>
                  <button onClick={() => setActual(v)} aria-current={v.id === actual.id}
                    className={`flex w-full items-center justify-between px-2 py-2.5 text-left hover:bg-nutresa-50/60 ${v.id === actual.id ? "font-bold text-nutresa-700" : ""}`}>
                    <span>{v.titulo}</span>
                    <span className="text-sm opacity-60">{v.categoria}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel rounded-2xl border border-nutresa-100 bg-white p-4 lg:col-span-2">
          <h2 className="font-display text-lg font-extrabold">Personas registradas</h2>
          {usuarios.length === 0 ? (
            <p className="mt-2 text-sm opacity-70">Aún no hay registros. Completa el formulario y aparecerás aquí.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b border-nutresa-100">
                  {["Nombre", "Correo", "Rol", "Departamento", "ID"].map((h) => <th key={h} className="py-2 pr-4 font-bold">{h}</th>)}
                </tr></thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id} className="border-b border-nutresa-50">
                      <td className="py-2 pr-4">{u.nombre}</td>
                      <td className="py-2 pr-4">{u.correo}</td>
                      <td className="py-2 pr-4">{etiqueta(ROLES, u.rol)}</td>
                      <td className="py-2 pr-4">{etiqueta(DEPARTAMENTOS, u.departamento)}</td>
                      <td className="py-2 pr-4 font-mono text-xs">{u.id.slice(0, 8)}…</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
