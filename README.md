# FolderBeats — Tu música en Google Drive, con carpetas privadas por enlace

- **Google Drive** guarda tus canciones (carpeta `MAUZI MÚSICA`, una subcarpeta por grupo).
- **Admin** de tu app crea las claves y los enlaces para tus usuarios.
- La app se publica en GitHub Pages: https://rulymauzi-byte.github.io/Mauzi-Música-/

## Primera vez
1. Sigue `google-drive/INSTRUCCIONES.md` para crear tu script de Google (una vez) y pon su dirección `/exec`
   en `index.html` (línea `scriptUrl`).
2. Sube a GitHub: `index.html`, `sw.js`, `manifest.webmanifest`, `icono-192.png`, `icono-512.png`.
   (La carpeta `google-drive` y `_respaldo` no hace falta subirlas.)
3. Sube tus canciones a Google Drive, dentro de `MAUZI MÚSICA/<carpeta>`.

## Admin (en la app, celular o computadora)
- Entras con tu contraseña de admin. Ves todas las carpetas de tu Drive.
- **Poner contraseña** → escribes la clave (ej. 12345) → Guardar → **Copiar enlace** y se lo pasas a ellos.
- **Cambiar clave / Quitar clave** cuando quieras. El enlace no cambia.
- **Subir música:** desde tu aparato a la carpeta que elijas (o súbela directo en Google Drive).
- **Actualizar:** vuelve a leer tu Drive.

## Qué ve cada uno
- **Enlace principal:** solo carpetas sin clave. Tú, en Admin, ves y escuchas todo.
- **Enlace de una carpeta:** solo esa carpeta y sus subcarpetas. Ponen la clave **una sola vez** por aparato.
  Si cambias la clave, se les vuelve a pedir.
- Las canciones con clave no se pueden descargar sin la clave (lo revisa tu script de Google).

## Sin internet e instalar
- Cada canción que se escucha se guarda en el aparato; sin internet se escucha lo ya descargado.
- Botón **Instalar** arriba. Si se instala desde el enlace de una carpeta, la app abre esa carpeta.

## Límites de Google
- Cada canción: menos de 30 MB.
- Google da a cada cuenta unos 90 minutos de trabajo del script al día. Alcanza para varios cientos de
  descargas diarias; lo que ya está descargado en cada aparato no cuenta.
