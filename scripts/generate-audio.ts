import fs from 'fs';
import path from 'path';
import * as googleTTS from 'google-tts-api';
import md5 from 'md5';
import { dictionary } from '../src/data/dictionary';

const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio');

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

async function generateAudio() {
  console.log('🎤 Generating audio files...');
  let newCount = 0;
  let skippedCount = 0;

  for (const entry of dictionary) {
    const items = [
      { text: entry.original, type: 'original' },
      { text: entry.translation, type: 'translation' }
    ];

    for (const item of items) {
      const hash = md5(item.text);
      const filename = `${hash}.mp3`;
      const filepath = path.join(AUDIO_DIR, filename);

      if (fs.existsSync(filepath)) {
        skippedCount++;
        continue;
      }

      console.log(`Generating audio for: "${item.text}"...`);
      
      try {
        const url = googleTTS.getAudioUrl(item.text, {
          lang: 'cs',
          slow: false,
          host: 'https://translate.google.com',
        });

        // Fetch the audio content
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        fs.writeFileSync(filepath, buffer);
        newCount++;
        // Be nice to the API
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`❌ Failed to generate audio for "${item.text}":`, error);
        process.exit(1);
      }
    }
  }

  console.log(`
✅ Done!`);
  console.log(`   Generated: ${newCount}`);
  console.log(`   Skipped:   ${skippedCount}`);
}

generateAudio();
