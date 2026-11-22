# FolderBeats — Reproductor por carpetas con bloqueo selectivo

Reproductor de música para GitHub Pages:
- Las carpetas **libres** las escucha cualquiera.
- Las carpetas **bloqueadas** piden contraseña y se suben **cifradas** (AES-256) en `privado/`,
  así que nadie puede descargarlas ni escucharlas sin la clave, aunque el repositorio sea público.
- La contraseña del admin no está escrita en el código (solo una huella PBKDF2 que no se puede leer).

## Cómo usar el panel Admin (en Chrome o Edge de tu computadora)
1. Pon tu música original en una carpeta **fuera** de este repositorio
   (ej. `NUEVOS PROGRAMAS\musica-original\Publica`, `...\Acustico`). Cada subcarpeta = una carpeta del reproductor.
2. Abre `index.html` y pulsa **Admin** → escribe tu contraseña de administrador.
3. **Elegir carpeta del repositorio** → esta carpeta (`reproductor-github`).
4. **Elegir carpeta de música** → tu carpeta de música original.
5. Marca cuáles quedan **Bloqueadas** y escribe la contraseña que compartirás con esas personas.
   Las que no marques quedan **Libres**.
6. **Guardar cambios en el repositorio** → crea `musica/` (libres), `privado/` (cifradas) y `biblioteca.json`.
7. Sube los cambios a GitHub (GitHub Desktop: *Commit* y *Push*).

Para cambiar algo después, repite los pasos: el panel recuerda las contraseñas de cada carpeta
(guardadas cifradas con tu clave de admin) y solo vuelve a cifrar lo que cambió.

## Notas
- `_respaldo/` nunca se sube (está en `.gitignore`). Ahí quedan copias de lo que el panel retira del repositorio.
  Si subes archivos arrastrándolos en la web de GitHub, **no** arrastres `_respaldo`.
- GitHub no acepta archivos de más de 100 MB.
- Publicar en GitHub Pages: **Settings → Pages**, rama `main`. Enlace: `https://TU-USUARIO.github.io/NOMBRE-REPO/`.

## Sin internet
- Cada canción que alguien escucha se descarga sola a su celular o computadora (con o sin la app instalada).
  Las de carpetas bloqueadas se guardan cifradas: solo se abren con su contraseña.
- `sw.js` guarda la interfaz: si abren el enlace sin internet, el reproductor abre igual y pueden escuchar
  lo ya descargado (punto naranja). Si tocan una que no han descargado, les avisa que se conecten una vez.
- Sube `sw.js` junto con `index.html`.
