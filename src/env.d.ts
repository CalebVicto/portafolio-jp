/// <reference types="astro/client" />

interface ImportMetaEnv {
  /**
   * URL base pública (sin slash final) desde donde se sirven los videos,
   * p.ej. un bucket de Cloudflare R2 o Bunny Storage con CDN habilitado.
   * Si no está definida, los videos se sirven localmente desde public/videos.
   */
  readonly PUBLIC_VIDEO_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
