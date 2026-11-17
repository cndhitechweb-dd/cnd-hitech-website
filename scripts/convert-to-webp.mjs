/**
 * Converts all PNG/JPG images in src/imports/ that are used by the site to WebP.
 * Run once: node scripts/convert-to-webp.mjs
 * Then update imports in source files automatically.
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises'
import { resolve, basename, extname, join } from 'path'
import sharp from 'sharp'

const IMPORTS_DIR = resolve('src/imports')
const SOURCE_FILES = [
  'src/components/Logo.tsx',
  'src/pages/HomePage.tsx',
  'src/data/products.ts',
  'src/pages/IndustriesPage.tsx',
  'src/pages/IndustryDetailPage.tsx',
]

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg'])

async function main() {
  const files = await readdir(IMPORTS_DIR)
  const imageFiles = files.filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()))

  console.log(`\nFound ${imageFiles.length} images to convert...\n`)

  let converted = 0
  let skipped = 0
  let saved = 0

  for (const file of imageFiles) {
    const srcPath = join(IMPORTS_DIR, file)
    const webpName = basename(file, extname(file)) + '.webp'
    const dstPath = join(IMPORTS_DIR, webpName)

    try {
      const srcStat = await stat(srcPath)
      const srcSize = srcStat.size

      await sharp(srcPath)
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(dstPath)

      const dstStat = await stat(dstPath)
      const dstSize = dstStat.size
      const saving = Math.round((1 - dstSize / srcSize) * 100)

      console.log(`✅ ${file} → ${webpName}  (${Math.round(srcSize/1024)}KB → ${Math.round(dstSize/1024)}KB, ${saving}% smaller)`)
      converted++
      saved += srcSize - dstSize
    } catch (err) {
      console.error(`❌ ${file}: ${err.message}`)
      skipped++
    }
  }

  console.log(`\n────────────────────────────────────────`)
  console.log(`Converted: ${converted}  Skipped: ${skipped}`)
  console.log(`Total saved: ${Math.round(saved / 1024)}KB (${Math.round(saved / 1024 / 1024 * 10) / 10}MB)`)

  // Now update import statements in source files
  console.log(`\nUpdating import statements...\n`)
  for (const relPath of SOURCE_FILES) {
    try {
      const content = await readFile(relPath, 'utf-8')
      // Replace .png' and .jpg' and .jpeg' in import paths that come from ../imports/
      const updated = content.replace(
        /(from '\.\.\/imports\/[^']+)\.(png|jpg|jpeg)(')/gi,
        '$1.webp$3'
      ).replace(
        /(from '\.\/imports\/[^']+)\.(png|jpg|jpeg)(')/gi,
        '$1.webp$3'
      )
      if (updated !== content) {
        await writeFile(relPath, updated, 'utf-8')
        console.log(`✅ Updated imports in ${relPath}`)
      } else {
        console.log(`⏭  No changes in ${relPath}`)
      }
    } catch (err) {
      console.error(`❌ ${relPath}: ${err.message}`)
    }
  }

  console.log(`\n✨ Done! Commit and push the changes.`)
}

main().catch(console.error)

