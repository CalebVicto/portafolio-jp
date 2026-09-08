import manifestData from '../data/video-manifest.json';

// video-manifest.json es la fuente de verdad de QUÉ videos existen (folder +
// nombre real + nombre de asset "limpio" para GitHub Releases). Se genera a
// partir de public/videos, pero una vez generado no depende de que esa
// carpeta exista en el entorno de build (Vercel no la tiene, está en
// .vercelignore) — así que tanto la Galería como los Proyectos Destacados
// pueden listar todo (títulos, categorías, miniaturas) sin tocar el disco.
export interface VideoManifestEntry {
  folder: string; // "." para archivos sueltos en la raíz de public/videos
  file: string;
  asset: string;
}

export const manifest: VideoManifestEntry[] = manifestData;

const BASE = import.meta.env.PUBLIC_VIDEO_BASE_URL?.replace(/\/+$/, '');

// URL del video en sí: remota (BASE + nombre de asset) si PUBLIC_VIDEO_BASE_URL
// está definida, o local (/videos/folder/file) para desarrollo.
export function videoUrl(entry: VideoManifestEntry): string {
  if (BASE) {
    return `${BASE}/${entry.asset}`;
  }
  const relPath = entry.folder === '.' ? entry.file : `${entry.folder}/${entry.file}`;
  return encodeURI(`/videos/${relPath}`);
}

// La miniatura siempre es local (public/thumbs, liviano, sí va en git).
// Usa el mismo slug ASCII que `asset` (sin tildes/espacios/carpetas): al
// bajar el repo desde GitHub, Vercel normaliza a NFC los nombres de archivo
// con acentos, mientras que este manifiesto guarda la forma NFD tal cual la
// da el filesystem de macOS — con nombres acentuados eso rompe en producción
// (funciona en local porque ahí sí coincide byte a byte con el disco).
export function posterUrl(entry: VideoManifestEntry): string {
  const assetBase = entry.asset.replace(/\.[^.]+$/, '');
  return `/thumbs/${assetBase}.jpg`;
}

export function findEntry(folderHint: string, match: string): VideoManifestEntry | null {
  const wantedFolder = folderHint.normalize('NFC');
  return (
    manifest.find(
      (e) => e.folder.normalize('NFC') === wantedFolder && e.file.toLowerCase().includes(match.toLowerCase())
    ) ?? null
  );
}
