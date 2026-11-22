# Conectar tu app con Google Drive (una sola vez)

Google Drive solo guarda tus canciones. Las claves y los enlaces se crean en **Admin** de tu app.

## 1. Crear el script
1. Entra a **script.google.com** con tu cuenta de Google (la del Drive donde estará tu música).
2. Toca **Nuevo proyecto**. Arriba, cámbiale el nombre a **Mauzi Música**.
3. Borra todo lo que hay en `Código.gs` y pega el contenido del archivo **Codigo.gs** (está en esta carpeta).
4. Toca el ícono de **Guardar** 💾.

## 2. Darle permiso (una vez)
1. Arriba, en la lista de funciones, elige **doGet** y toca **▶ Ejecutar**.
2. Toca **Revisar permisos** → elige tu cuenta.
3. Si sale "Google no verificó esta app": toca **Configuración avanzada** → **Ir a Mauzi Música (no seguro)** → **Permitir**.
   (Es tu propio script; ese aviso sale con cualquier script personal.)
4. Esto crea en tu Drive la carpeta **MAUZI MÚSICA**.

## 3. Publicarlo
1. Toca **Implementar → Nueva implementación**.
2. En el engrane ⚙️ elige **Aplicación web**.
3. **Ejecutar como:** Yo. **Quién tiene acceso:** Cualquier usuario.
4. Toca **Implementar** y copia la **URL de la aplicación web** (termina en `/exec`).
5. **Mándame esa dirección** y yo la pongo en tu app (o pégala en `index.html`, en la línea `scriptUrl: ''`).

## 4. Tu música
- En Google Drive abre **MAUZI MÚSICA** y crea una subcarpeta por grupo: `CELEBREMOS`, `María y Marta`, etc.
  Dentro puedes hacer más subcarpetas.
- Sube ahí tus canciones (mp3, m4a, wav…), desde la app de Drive del celular o desde la computadora.
- Cada canción debe pesar menos de 30 MB.
- En Admin de tu app toca **Actualizar** para ver lo nuevo (o espera unos 10 minutos).

## Si algún día cambias el script
**Implementar → Administrar implementaciones → ✏️ Editar → Versión: Nueva versión → Implementar.**
Así la dirección `/exec` sigue siendo la misma.
