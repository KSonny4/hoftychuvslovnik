import fs from 'fs';
import path from 'path';
import md5 from 'md5';
import { dictionary } from '../src/data/dictionary';

const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio');
let missingCount = 0;

console.log('🔍 Checking for missing audio files...');

if (!fs.existsSync(AUDIO_DIR)) {
  console.error('❌ Audio directory not found!');
  process.exit(1);
}

for (const entry of dictionary) {
  const items = [
    { text: entry.original, type: 'original' },
    { text: entry.translation, type: 'translation' }
  ];

  for (const item of items) {
    const hash = md5(item.text);
    const filename = `${hash}.mp3`;
    const filepath = path.join(AUDIO_DIR, filename);

    if (!fs.existsSync(filepath)) {
      console.error(`❌ Missing audio for [${item.type}]: "${item.text}"`);
      missingCount++;
    }
  }
}

if (missingCount > 0) {
  console.error(`\n❌ Found ${missingCount} missing audio files.`);
  console.error(`Run 'npm run generate-audio' to fix this.`);
  process.exit(1);
} else {
  console.log('✅ All audio files are present.');
  process.exit(0);
}
