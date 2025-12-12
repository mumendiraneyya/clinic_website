import pngToIco from 'png-to-ico';
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';

const INPUT = 'src/assets/favicons/source.png';
const OUTPUT_DIR = 'src/assets/favicons';

// ICO sizes (standard favicon sizes)
const icoSizes = [16, 32, 48, 64, 128, 256];

async function generateFavicons() {
  console.log(`Generating favicons from ${INPUT}...\n`);

  mkdirSync(OUTPUT_DIR, { recursive: true });

  // 1. Generate favicon.png (32x32 standard)
  console.log('Generating favicon.png (32x32)...');
  await sharp(INPUT)
    .resize(32, 32)
    .png()
    .toFile(`${OUTPUT_DIR}/favicon.png`);

  // 2. Generate apple-touch-icon.png (180x180)
  console.log('Generating apple-touch-icon.png (180x180)...');
  await sharp(INPUT)
    .resize(180, 180)
    .png()
    .toFile(`${OUTPUT_DIR}/apple-touch-icon.png`);

  // 3. Generate favicon.ico with multiple sizes
  console.log(`Generating favicon.ico (${icoSizes.join(', ')}px)...`);
  const pngBuffers = await Promise.all(
    icoSizes.map(size =>
      sharp(INPUT)
        .resize(size, size)
        .png()
        .toBuffer()
    )
  );
  const icoBuffer = await pngToIco(pngBuffers);
  writeFileSync(`${OUTPUT_DIR}/favicon.ico`, icoBuffer);

  console.log('\nAll favicons generated successfully!');
  console.log(`Output directory: ${OUTPUT_DIR}/`);
}

generateFavicons().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
