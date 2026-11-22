# FolderBeats — Reproductor por carpetas con enlaces privados

## Cómo se organiza
Pon toda tu música dentro de `musica`, una carpeta por grupo:

```
reproductor-github/
  musica/
    CELEBREMOS/          ← libre (se ve en el enlace principal)
    Acustico/            ← libre
    María y Marta/       ← con contraseña y su propio enlace
      Ensayo 1.mp3
      Voces/             ← subcarpeta: se ve al entrar a María y Marta
```

## Poner contraseña y crear el enlace (en Chrome o Edge de tu computadora)
1. Abre `index.html` → **Admin** → tu contraseña de administrador.
2. **Elegir carpeta del repositorio** → `reproductor-github`.
3. Marca la carpeta (ej. *María y Marta*) y escribe su clave (ej. `12345`).
4. **Guardar cambios en el repositorio**.
5. Toca **Copiar enlace** y compártelo con esas personas junto con la clave.
6. Sube a GitHub: `index.html`, `sw.js`, `manifest.webmanifest`, `icono-192.png`, `icono-512.png`,
   `biblioteca.json` y las carpetas `musica` y `privado`. **No subas `_respaldo`.**

## Qué ve cada uno
- **Enlace principal** (`https://rulymauzi-byte.github.io/Mauzi-Música-/`): solo las carpetas libres.
  Si entras a **Admin** con tu contraseña, ves y abres todas.
- **Enlace de una carpeta** (`...?carpeta=...`): solo esa carpeta y sus subcarpetas, después de poner su clave.
  Las demás no aparecen.

## Seguridad
- Las canciones con contraseña se suben **cifradas** en `privado/`. El original queda en
  `_respaldo/originales/` en tu computadora (no se sube). Si vuelves a dejar la carpeta libre, regresa sola a `musica/`.
- Tu contraseña de admin no está escrita en el código.

## Sin internet e instalar
- Cada canción que se escucha se guarda sola en el dispositivo. Sin internet se puede escuchar lo descargado;
  si una no está descargada, avisa que se conecten una vez.
- Botón **Instalar** arriba. En iPhone: Safari → Compartir → *Agregar a inicio*.
  Si se instala desde el enlace de una carpeta, la app abre siempre esa carpeta.

## Reproducción
- Tocar una canción reproduce **solo esa**. Para seguir con las demás: **Reproducir todo**, **Aleatorio** o **Repetir**.
