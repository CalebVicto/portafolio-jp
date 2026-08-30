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
export function posterUrl(entry: VideoManifestEntry): string {
  const base = entry.file.replace(/\.[^.]+$/, '');
  const relPath = entry.folder === '.' ? `${base}.jpg` : `${entry.folder}/${base}.jpg`;
  return encodeURI(`/thumbs/${relPath}`);
}

export function findEntry(folderHint: string, match: string): VideoManifestEntry | null {
  const wantedFolder = folderHint.normalize('NFC');
  return (
    manifest.find(
      (e) => e.folder.normalize('NFC') === wantedFolder && e.file.toLowerCase().includes(match.toLowerCase())
    ) ?? null
  );
}
