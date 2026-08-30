// Resuelve la URL de un video: si PUBLIC_VIDEO_BASE_URL está definida (p.ej.
// apuntando a un bucket R2/CDN), los videos se sirven desde ahí; si no,//
// caen de vuelta a los archivos locales en public/videos (uso en desarrollo).
//
// Las miniaturas (public/thumbs) son livianas y siempre se sirven en local,
// sin importar esta variable.
const BASE = import.meta.env.PUBLIC_VIDEO_BASE_URL?.replace(/\/+$/, '');

export function videoUrl(folder: string, file: string): string {
  const relPath = folder === '.' ? file : `${folder}/${file}`;

  if (BASE) {
    return `${BASE}/${encodeURI(relPath)}`;
  }

  return encodeURI(`/videos/${relPath}`);
}
