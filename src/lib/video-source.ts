import manifest from '../data/video-manifest.json';

// Resuelve la URL de un video:
// - Si PUBLIC_VIDEO_BASE_URL está definida, se sirve desde ahí. Como GitHub
//   Releases no tiene carpetas, se busca el nombre de archivo "limpio" (sin
//   tildes/espacios) en video-manifest.json y se arma:
//   `${BASE}/${asset}` — ej. https://github.com/<owner>/<repo>/releases/download/<tag>/<asset>
// - Si no está definida, cae de vuelta a los archivos locales en
//   public/videos (uso en desarrollo).
//
// Las miniaturas (public/thumbs) son livianas y siempre se sirven en local,
// sin importar esta variable.
const BASE = import.meta.env.PUBLIC_VIDEO_BASE_URL?.replace(/\/+$/, '');
const MANIFEST: Record<string, string> = manifest;

export function videoUrl(folder: string, file: string): string {
  const relPath = folder === '.' ? file : `${folder}/${file}`;

  if (BASE) {
    const asset = MANIFEST[relPath];
    if (!asset) {
      throw new Error(
        `video-source: no hay entrada en video-manifest.json para "${relPath}". ` +
          `Agrégala o vuelve a generar el manifiesto.`
      );
    }
    return `${BASE}/${asset}`;
  }

  return encodeURI(`/videos/${relPath}`);
}
