/**
 * MAUZI MÚSICA — puente entre tu app y tu Google Drive.
 *
 * - Google Drive solo guarda las canciones (carpeta "MAUZI MÚSICA", una subcarpeta por grupo).
 * - Las contraseñas y los enlaces se crean desde Admin en tu app. Se guardan aquí, en las
 *   "propiedades del script" de tu cuenta: no aparecen en Drive ni en GitHub.
 * - Tu contraseña de admin no está escrita aquí: solo su huella (SHA-256 con sal).
 *
 * Instalación: ver INSTRUCCIONES.md
 */

// Carpeta de Drive con tu música. Si no existe, se crea sola en "Mi unidad".
const NOMBRE_CARPETA_RAIZ = 'MAUZI MÚSICA';
const ID_CARPETA_RAIZ = '';          // Opcional: pega aquí el ID de la carpeta si prefieres otra

const ADMIN_SAL = '3f78ad908f2e821987876d327cbcf59b';
const ADMIN_HASH = '39018ebae7b107eb07993a5c16bab2b97664927d7dec9c78cb5c57c64fc4ec08';

const EXT_AUDIO = /\.(mp3|m4a|wav|ogg|aac|flac|opus|webm)$/i;
const MAX_BYTES = 35 * 1024 * 1024;        // Google no entrega respuestas de más de ~50 MB
const MIME = { mp3: 'audio/mpeg', m4a: 'audio/mp4', wav: 'audio/wav', ogg: 'audio/ogg', aac: 'audio/aac', flac: 'audio/flac', opus: 'audio/ogg', webm: 'audio/webm' };

function doGet() {
  return salida({ ok: true, app: 'Mauzi Música', carpeta: raiz().getName() });
}

function doPost(e) {
  let r;
  try {
    const req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    r = manejar(req);
  } catch (err) {
    r = { ok: false, error: String((err && err.message) || err) };
  }
  return salida(r);
}

function salida(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// ---------------- Seguridad ----------------
function props() { return PropertiesService.getScriptProperties(); }
function secreto() {
  let s = props().getProperty('SECRETO');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); props().setProperty('SECRETO', s); }
  return s;
}
function firmar(txt) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(txt, secreto())).replace(/=+$/, '');
}
function sha256hex(txt) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, txt, Utilities.Charset.UTF_8)
    .map(b => ((b + 256) % 256).toString(16).padStart(2, '0')).join('');
}
function tokenCarpeta(c) { return firmar('g|' + c.id + '|' + c.v); }
function adminValido(token) {
  if (!token) return false;
  const p = String(token).split('.');
  return p.length === 2 && Number(p[0]) > Date.now() && p[1] === firmar('admin|' + p[0]);
}

// Candados: { idCarpetaDrive: { id: idEnlace, clave, v, nombre } }
function leerCandados() { return JSON.parse(props().getProperty('CANDADOS') || '{}'); }
function guardarCandados(c) { props().setProperty('CANDADOS', JSON.stringify(c)); limpiarCache(); }

// ---------------- Drive ----------------
function raiz() {
  if (ID_CARPETA_RAIZ) return DriveApp.getFolderById(ID_CARPETA_RAIZ);
  const it = DriveApp.getFoldersByName(NOMBRE_CARPETA_RAIZ);
  return it.hasNext() ? it.next() : DriveApp.createFolder(NOMBRE_CARPETA_RAIZ);
}

// Recorre toda la música: canciones { id, name, folder, size, anc[] } y carpetas { id, path }
function arbol(forzar) {
  const cache = CacheService.getScriptCache();
  if (!forzar) {
    const n = Number(cache.get('arbol_n') || 0);
    if (n) {
      const partes = cache.getAll(Array.from({ length: n }, (_, i) => 'arbol_' + i));
      const txt = Array.from({ length: n }, (_, i) => partes['arbol_' + i] || '').join('');
      try { if (txt) return JSON.parse(txt); } catch (e) {}
    }
  }
  const out = { canciones: [], carpetas: [] };
  recorrer(raiz(), '', [], out);
  const txt = JSON.stringify(out);
  const trozos = {};
  let i = 0;
  for (let p = 0; p < txt.length; p += 90000) trozos['arbol_' + (i++)] = txt.slice(p, p + 90000);
  if (i <= 50) { trozos.arbol_n = String(i); cache.putAll(trozos, 600); }
  return out;
}
function recorrer(carpeta, ruta, anc, out) {
  const files = carpeta.getFiles();
  while (files.hasNext()) {
    const f = files.next();
    if (EXT_AUDIO.test(f.getName())) out.canciones.push({ id: f.getId(), name: f.getName(), folder: ruta || 'General', size: f.getSize(), anc });
  }
  const subs = carpeta.getFolders();
  while (subs.hasNext()) {
    const s = subs.next();
    const r = ruta ? ruta + '/' + s.getName() : s.getName();
    out.carpetas.push({ id: s.getId(), path: r });
    recorrer(s, r, anc.concat([s.getId()]), out);
  }
}
function limpiarCache() {
  const cache = CacheService.getScriptCache();
  const n = Number(cache.get('arbol_n') || 0);
  cache.removeAll(['arbol_n'].concat(Array.from({ length: n }, (_, i) => 'arbol_' + i)));
}
function candadoDe(anc, candados) {
  for (const id of anc) if (candados[id]) return Object.assign({ folderId: id }, candados[id]);
  return null;
}
function publica(c) { return { id: c.id, title: c.name.replace(/\.[^.]+$/, ''), folder: c.folder, size: c.size }; }

// ---------------- Acciones ----------------
function manejar(req) {
  const a = req.accion;
  const candados = leerCandados();

  // Lista pública: solo carpetas sin clave
  if (a === 'lista') {
    const t = arbol(false);
    return { ok: true, canciones: t.canciones.filter(c => !candadoDe(c.anc, candados)).map(publica) };
  }

  // Nombre de la carpeta de un enlace
  if (a === 'info') {
    const c = Object.values(candados).find(x => x.id === req.id);
    return c ? { ok: true, nombre: c.nombre } : { ok: false, error: 'Este enlace no es válido.' };
  }

  // Abrir una carpeta con su clave (o con el pase guardado en el aparato)
  if (a === 'carpeta') {
    const folderId = Object.keys(candados).find(k => candados[k].id === req.id);
    if (!folderId) return { ok: false, error: 'Este enlace no es válido.' };
    const c = candados[folderId];
    const okClave = req.clave != null && String(req.clave) === String(c.clave);
    const okToken = req.token && req.token === tokenCarpeta(c);
    if (!okClave && !okToken) return { ok: false, error: 'Clave incorrecta.', clave: true };
    const t = arbol(false);
    const prefijo = (t.carpetas.find(x => x.id === folderId) || {}).path || c.nombre;
    return {
      ok: true, nombre: prefijo, token: tokenCarpeta(c),
      canciones: t.canciones.filter(x => x.anc.indexOf(folderId) >= 0).map(publica)
    };
  }

  // Entregar una canción
  if (a === 'audio') {
    const f = DriveApp.getFileById(req.fileId);
    const rootId = raiz().getId();
    // Sube por las carpetas hasta la raíz para saber dónde está
    const anc = [];
    let p = f.getParents();
    let dentro = false;
    let vueltas = 0;
    while (p.hasNext() && vueltas++ < 30) {
      const padre = p.next();
      if (padre.getId() === rootId) { dentro = true; break; }
      anc.unshift(padre.getId());
      p = padre.getParents();
    }
    if (!dentro) return { ok: false, error: 'Archivo no disponible.' };
    const c = candadoDe(anc, candados);
    if (c && req.token !== tokenCarpeta(c) && !adminValido(req.admin)) return { ok: false, error: 'Necesita la clave.', clave: true };
    if (f.getSize() > MAX_BYTES) return { ok: false, error: 'La canción pesa demasiado (más de 35 MB).' };
    const ext = (f.getName().split('.').pop() || '').toLowerCase();
    return { ok: true, mime: MIME[ext] || f.getMimeType(), data: Utilities.base64Encode(f.getBlob().getBytes()) };
  }

  // -------- Admin --------
  if (a === 'admin_login') {
    if (sha256hex(ADMIN_SAL + String(req.clave || '')) !== ADMIN_HASH) {
      Utilities.sleep(1200);
      return { ok: false, error: 'Contraseña incorrecta.' };
    }
    const exp = Date.now() + 30 * 24 * 3600 * 1000;
    return { ok: true, token: exp + '.' + firmar('admin|' + exp) };
  }
  if (a.indexOf('admin_') === 0 && !adminValido(req.admin)) return { ok: false, error: 'Vuelve a entrar como admin.', admin: true };

  if (a === 'admin_estado') {
    if (req.refrescar) limpiarCache();
    const t = arbol(!!req.refrescar);
    // Quita candados de carpetas que ya no existen
    const ids = new Set(t.carpetas.map(x => x.id));
    let cambio = false;
    Object.keys(candados).forEach(k => { if (!ids.has(k)) { delete candados[k]; cambio = true; } });
    if (cambio) guardarCandados(candados);
    const tokens = {};
    Object.values(candados).forEach(c => { tokens[c.id] = tokenCarpeta(c); });
    return {
      ok: true,
      raiz: raiz().getName(),
      carpetas: t.carpetas.map(x => {
        const c = candados[x.id];
        return { id: x.id, path: x.path, candado: c ? { id: c.id, clave: c.clave } : null };
      }),
      canciones: t.canciones.map(c => Object.assign(publica(c), { anc: c.anc })),
      tokens
    };
  }

  if (a === 'admin_clave') {
    const clave = String(req.clave || '').trim();
    if (clave.length < 4) return { ok: false, error: 'La clave debe tener al menos 4 caracteres.' };
    const t = arbol(false);
    const carpeta = t.carpetas.find(x => x.id === req.carpetaId);
    if (!carpeta) return { ok: false, error: 'No encontré esa carpeta.' };
    if (!candados[carpeta.id]) {
      // No se permite una clave dentro de otra, ni encima de otra
      const dentroDe = carpeta.path.split('/').slice(0, -1).length &&
        t.carpetas.some(x => candados[x.id] && carpeta.path.indexOf(x.path + '/') === 0);
      const tieneHijas = t.carpetas.some(x => candados[x.id] && x.path.indexOf(carpeta.path + '/') === 0);
      if (dentroDe) return { ok: false, error: 'Esa carpeta ya está dentro de una carpeta con clave.' };
      if (tieneHijas) return { ok: false, error: 'Primero quita la clave de sus subcarpetas.' };
      candados[carpeta.id] = { id: Utilities.getUuid().replace(/-/g, '').slice(0, 16), clave, v: 1, nombre: carpeta.path };
    } else {
      candados[carpeta.id].clave = clave;
      candados[carpeta.id].v = (candados[carpeta.id].v || 1) + 1;   // los aparatos con la clave vieja la vuelven a pedir
      candados[carpeta.id].nombre = carpeta.path;
    }
    guardarCandados(candados);
    return { ok: true, id: candados[carpeta.id].id };
  }

  if (a === 'admin_quitar') {
    delete candados[req.carpetaId];
    guardarCandados(candados);
    return { ok: true };
  }

  if (a === 'admin_subir') {
    let carpeta = raiz();
    String(req.carpeta || '').split('/').map(s => s.trim()).filter(Boolean).forEach(nombre => {
      const it = carpeta.getFoldersByName(nombre);
      carpeta = it.hasNext() ? it.next() : carpeta.createFolder(nombre);
    });
    const nombre = String(req.nombre || 'cancion.mp3');
    const viejos = carpeta.getFilesByName(nombre);
    while (viejos.hasNext()) viejos.next().setTrashed(true);
    const ext = (nombre.split('.').pop() || '').toLowerCase();
    carpeta.createFile(Utilities.newBlob(Utilities.base64Decode(req.data), req.mime || MIME[ext] || 'audio/mpeg', nombre));
    limpiarCache();
    return { ok: true };
  }

  return { ok: false, error: 'Acción desconocida.' };
}
