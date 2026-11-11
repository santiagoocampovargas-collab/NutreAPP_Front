# Nutresa Videos

React + Vite + Tailwind. Registro de usuario (modelo Java) y galería de videos corporativos.

    npm install
    npm run dev

- Los videos se configuran en `src/data/videos.js`.
- El hash de la contraseña es una simulación (SHA-256 en el navegador); en producción lo hace el backend con BCrypt/Argon2.
