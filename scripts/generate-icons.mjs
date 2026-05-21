import sharp from 'sharp'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

/**
 * SVG construit sur une grille 160×160.
 * Le « E » occupe un bloc 80×80 centré (départ à 40,40).
 *
 * 4 rectangles aux coins arrondis :
 *   - barre verticale gauche  (pleine hauteur)     #FAF9F6
 *   - barre haute             (pleine largeur)      #FAF9F6
 *   - barre centrale          (73 % de la largeur)  #7B9E9A
 *   - barre basse             (pleine largeur)      #FAF9F6
 *
 * Épaisseur des barres : 13 px
 * Espacement inter-barres : symétrique (≈ 20,5 px de gap)
 */
function buildSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 160 160">
  <!-- Fond arrondi -->
  <rect width="160" height="160" rx="36" ry="36" fill="#1A1A1A"/>

  <!-- Barre verticale gauche -->
  <rect x="40" y="40" width="13" height="80" rx="4" ry="4" fill="#FAF9F6"/>

  <!-- Barre haute (pleine largeur) -->
  <rect x="40" y="40" width="80" height="13" rx="4" ry="4" fill="#FAF9F6"/>

  <!-- Barre centrale (73 % = 58 px), centrée verticalement dans le E -->
  <rect x="40" y="73.5" width="58" height="13" rx="4" ry="4" fill="#7B9E9A"/>

  <!-- Barre basse (pleine largeur) -->
  <rect x="40" y="107" width="80" height="13" rx="4" ry="4" fill="#FAF9F6"/>
</svg>`
}

async function generate(size, filename) {
  const svg = Buffer.from(buildSvg(size))
  const dest = resolve(ROOT, 'public', filename)
  await sharp(svg).png().toFile(dest)
  console.log(`✓  public/${filename}  (${size}×${size})`)
}

await generate(192, 'icon-192.png')
await generate(512, 'icon-512.png')

console.log('\nIcônes générées avec succès.')
