import { useState } from "react";
import { sha256 } from "../utils/hash";

export const ROLES = [
  { value: "ADMIN", label: "Administrador" },
  { value: "GERENTE", label: "Gerente" },
  { value: "ANALISTA", label: "Analista" },
  { value: "COLABORADOR", label: "Colaborador" },
];
export const DEPARTAMENTOS = [
  { value: "TALENTO_HUMANO", label: "Talento Humano" },
  { value: "TECNOLOGIA", label: "Tecnología" },
  { value: "OPERACIONES", label: "Operaciones" },
  { value: "MERCADEO", label: "Mercadeo" },
  { value: "FINANZAS", label: "Finanzas" },
  { value: "CALIDAD", label: "Calidad" },
];

const VACIO = { nombre: "", correo: "", rol: "", departamento: "", contrasena: "", confirmar: "" };

function validar(f) {
  const e = {};
  if (f.nombre.trim().length < 3) e.nombre = "Escribe tu nombre completo (mínimo 3 letras).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo)) e.correo = "Usa un correo válido, por ejemplo nombre@empresa.com.";
  if (!f.rol) e.rol = "Elige tu rol.";
  if (!f.departamento) e.departamento = "Elige tu departamento.";
  if (f.contrasena.length < 8) e.contrasena = "La contraseña necesita al menos 8 caracteres.";
  if (f.confirmar !== f.contrasena) e.confirmar = "Las contraseñas no coinciden.";
  return e;
}

function Campo({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {error && <p role="alert" className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}

const input = "w-full rounded-lg border border-nutresa-200 bg-white px-3 py-2 text-nutresa-950 placeholder:text-nutresa-900/40";

export default function RegistroForm({ onRegistrar }) {
  const [f, setF] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [ver, setVer] = useState(false);
  const [ultimo, setUltimo] = useState(null);

  const cambiar = (e) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function enviar(e) {
    e.preventDefault();
    const err = validar(f);
    setErrores(err);
    if (Object.keys(err).length) {
      // Manipulación del DOM: lleva el foco al primer campo con error
      document.getElementById(Object.keys(err)[0])?.focus();
      return;
    }
    // Mismo contrato que el modelo Java
    const usuario = {
      id: crypto.randomUUID(),
      nombre: f.nombre.trim(),
      correo: f.correo.trim().toLowerCase(),
      rol: f.rol,
      departamento: f.departamento,
      contrasena_hash: await sha256(f.contrasena),
    };
    onRegistrar(usuario);
    setUltimo(usuario);
    setF(VACIO);
  }

  return (
    <section className="panel rounded-2xl border border-nutresa-100 bg-white p-6 shadow-sm">
      <h2 className="font-display text-2xl font-extrabold">Crea tu cuenta</h2>
      <p className="mt-1 text-sm opacity-70">Regístrate para ver los videos de tu área.</p>

      <form onSubmit={enviar} noValidate className="mt-5 space-y-4">
        <Campo id="nombre" label="Nombre completo" error={errores.nombre}>
          <input id="nombre" name="nombre" value={f.nombre} onChange={cambiar} className={input} autoComplete="name" />
        </Campo>
        <Campo id="correo" label="Correo corporativo" error={errores.correo}>
          <input id="correo" name="correo" type="email" value={f.correo} onChange={cambiar} className={input} autoComplete="email" />
        </Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo id="rol" label="Rol" error={errores.rol}>
            <select id="rol" name="rol" value={f.rol} onChange={cambiar} className={input}>
              <option value="">Selecciona</option>
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </Campo>
          <Campo id="departamento" label="Departamento" error={errores.departamento}>
            <select id="departamento" name="departamento" value={f.departamento} onChange={cambiar} className={input}>
              <option value="">Selecciona</option>
              {DEPARTAMENTOS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </Campo>
        </div>
        <Campo id="contrasena" label="Contraseña" error={errores.contrasena}>
          <div className="relative">
            <input id="contrasena" name="contrasena" type={ver ? "text" : "password"} value={f.contrasena}
              onChange={cambiar} className={`${input} pr-20`} autoComplete="new-password" />
            <button type="button" onClick={() => setVer((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 text-sm font-medium text-nutresa-700">
              {ver ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </Campo>
        <Campo id="confirmar" label="Confirma la contraseña" error={errores.confirmar}>
          <input id="confirmar" name="confirmar" type="password" value={f.confirmar} onChange={cambiar} className={input} autoComplete="new-password" />
        </Campo>
        <button type="submit"
          className="w-full rounded-lg bg-nutresa-600 px-4 py-2.5 font-bold text-white transition-colors hover:bg-nutresa-700">
          Registrarme
        </button>
      </form>

      {ultimo && (
        <div role="status" className="mt-5 rounded-lg bg-nutresa-50 p-3 text-sm text-nutresa-900">
          <p className="font-bold">Listo, {ultimo.nombre.split(" ")[0]}. Tu cuenta quedó creada.</p>
          <pre className="mt-2 overflow-x-auto text-xs">{JSON.stringify(ultimo, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}
