# FolderBeats — Reproductor por carpetas con enlaces privados

Enlace principal: https://rulymauzi-byte.github.io/Mauzi-Música-/

## Primera vez (solo una vez)
1. Sube a GitHub estos archivos: `index.html`, `sw.js`, `manifest.webmanifest`, `icono-192.png`, `icono-512.png`.
2. En GitHub: **Configuración → Pages** → rama **main**, carpeta **/(raíz)** → Guardar.
3. Abre tu enlace → **Admin** → tu contraseña de admin.
4. Te pedirá un **token** de GitHub (una vez en cada aparato). Los pasos salen en pantalla:
   - github.com/settings/personal-access-tokens/new
   - Repository access: *Only select repositories* → **Mauzi-Música-**
   - Permissions → Repository permissions → **Contents: Read and write**
   - Generate token → cópialo y pégalo en Admin.
   El token se guarda solo en ese aparato, cifrado con tu contraseña de admin. Nunca se sube.

## Desde Admin (celular o computadora)
- **Tus carpetas:** ves todas las que tienes en GitHub.
- **Poner contraseña:** escribe la clave (ej. 12345) → Guardar → aparece **Copiar enlace**. Ese enlace se lo pasas a esas personas.
- **Cambiar clave / Quitar clave:** cuando quieras. El enlace sigue siendo el mismo.
- **Subir música:** elige archivos o una carpeta de tu aparato y a qué carpeta van (o crea una nueva).
  Si la carpeta tiene clave, las canciones se suben cifradas.
- **Actualizar:** vuelve a leer GitHub y agrega a la lista canciones que hayas subido a mano.
- Los cambios se ven en la página pública en 1 o 2 minutos.

## Qué ve cada uno
- **Enlace principal:** solo las carpetas libres. Tú, al entrar a Admin, ves y abres todas.
- **Enlace de una carpeta** (`...?carpeta=...`): solo esa carpeta y sus subcarpetas, después de poner su clave.

## Seguridad
- Las carpetas con clave se guardan **cifradas** en `privado/`.
- Si le pones clave a una carpeta que ya estaba libre, sus versiones viejas siguen en el historial de GitHub.
  Para música privada desde el inicio, súbela directo a una carpeta que ya tenga clave.

## Sin internet e instalar
- Cada canción que se escucha se guarda en el aparato; sin internet se puede escuchar lo descargado.
- Botón **Instalar** arriba. Si se instala desde el enlace de una carpeta, la app abre siempre esa carpeta.
