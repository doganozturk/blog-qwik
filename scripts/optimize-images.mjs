import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function optimizeAvatar() {
  const sourcePath = join(projectRoot, 'src/media/images/avatar.jpg');
  const outputDir = join(projectRoot, 'src/media/images');

  console.log('Optimizing avatar images...');

  // Generate 100x100 WebP for 1x displays
  await sharp(sourcePath)
    .resize(100, 100, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 85 })
    .toFile(join(outputDir, 'avatar-100.webp'));
  console.log('✓ Created avatar-100.webp (100x100)');

  // Generate 200x200 WebP for 2x displays
  await sharp(sourcePath)
    .resize(200, 200, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 85 })
    .toFile(join(outputDir, 'avatar-200.webp'));
  console.log('✓ Created avatar-200.webp (200x200)');

  // Also optimize the original size as fallback
  await sharp(sourcePath)
    .webp({ quality: 85 })
    .toFile(join(outputDir, 'avatar.webp'));
  console.log('✓ Created avatar.webp (365x365, fallback)');

  // Optimize public avatar for social media (keep as JPG but optimize)
  const publicSourcePath = join(projectRoot, 'public/images/avatar.jpg');
  const publicOutputPath = join(projectRoot, 'public/images/avatar-optimized.jpg');

  await sharp(publicSourcePath)
    .jpeg({ quality: 80, progressive: true })
    .toFile(publicOutputPath);
  console.log('✓ Created optimized public/images/avatar-optimized.jpg');

  console.log('\nImage optimization complete!');
}

optimizeAvatar().catch(console.error);
