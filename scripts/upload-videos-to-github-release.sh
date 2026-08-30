#!/bin/bash
# Sube todos los videos de public/videos como assets de un GitHub Release,
# usando los nombres "limpios" definidos en src/data/video-manifest.json.
#
# Requiere: gh auth login (ya autenticado)
#
# Uso:
#   ./scripts/upload-videos-to-github-release.sh <owner>/<repo> <tag>
# Ejemplo:
#   ./scripts/upload-videos-to-github-release.sh josepeche/josepeche-media media-v1
set -euo pipefail

REPO="${1:?Uso: $0 <owner>/<repo> <tag>}"
TAG="${2:?Uso: $0 <owner>/<repo> <tag>}"

cd "$(dirname "$0")/.."

if ! gh auth status >/dev/null 2>&1; then
  echo "No hay sesión de gh. Corre: gh auth login"
  exit 1
fi

# Crea el repo si no existe (público, vacío, sin código del sitio)
if ! gh repo view "$REPO" >/dev/null 2>&1; then
  echo "Creando repo público $REPO..."
  gh repo create "$REPO" --public --description "Video assets para josepeche.com" -y
fi

# Crea el release si no existe
if ! gh release view "$TAG" --repo "$REPO" >/dev/null 2>&1; then
  echo "Creando release $TAG..."
  gh release create "$TAG" --repo "$REPO" --title "$TAG" --notes "Video assets"
fi

echo "Subiendo archivos (esto puede tardar varios minutos, hay un archivo de ~1.9GB)..."

node -e '
const fs = require("fs");
const path = require("path");
const manifest = require("./src/data/video-manifest.json");

for (const [relPath, asset] of Object.entries(manifest)) {
  const full = path.join("public/videos", relPath);
  console.log(`${full}#${asset}`);
}
' | while IFS='#' read -r filepath assetname; do
  echo "-> $assetname"
  gh release upload "$TAG" "$filepath#$assetname" --repo "$REPO" --clobber
done

echo ""
echo "Listo. Base URL para PUBLIC_VIDEO_BASE_URL:"
echo "https://github.com/$REPO/releases/download/$TAG"
