import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import md5 from 'md5';
import { dictionary } from '../src/data/dictionary';

const execAsync = promisify(exec);
const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio');
const VENV_BIN = path.join(process.cwd(), 'venv', 'bin', 'edge-tts');

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Function to check if edge-tts is available
async function checkEdgeTTS() {
  try {
    // Check local venv first
    if (fs.existsSync(VENV_BIN)) {
      return VENV_BIN;
    }
    // Check global path
    await execAsync('edge-tts --version');
    return 'edge-tts';
  } catch (e) {
    console.error('❌ edge-tts not found. Please install it using `pip install edge-tts`.');
    process.exit(1);
  }
}

async function generateAudio() {
  const edgeTTSPath = await checkEdgeTTS();
  console.log(`🎤 Generating audio files using ${edgeTTSPath}...`);
  
  let newCount = 0;
  let skippedCount = 0;

  for (const entry of dictionary) {
    const items = [
      {
        text: entry.original,
        type: 'original',
        // Angry/Agitated params: Slightly faster, higher pitch, louder (adjusted for clarity)
        params: '--rate=+10% --pitch=+5Hz --volume=+10%'
      },
      {
        text: entry.translation,
        type: 'translation',
        // Relaxed params: Slower, slightly deeper
        params: '--rate=-10% --pitch=-2Hz'
      }
    ];

    for (const item of items) {
      const hash = md5(item.text);
      const filename = `${hash}.mp3`;
      const filepath = path.join(AUDIO_DIR, filename);

      if (fs.existsSync(filepath)) {
        skippedCount++;
        continue;
      }

      console.log(`Generating audio for [${item.type}]: "${item.text}"...`);
      
      try {
        // Escape quotes in text for shell command
        const safeText = item.text.replace(/"/g, '\"');
        const command = `${edgeTTSPath} --voice cs-CZ-AntoninNeural ${item.params} --text "${safeText}" --write-media "${filepath}"`;
        
        await execAsync(command);
        newCount++;
        
        // Be nice to the API
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`❌ Failed to generate audio for "${item.text}":`, error);
        // Don't exit process, try next word
      }
    }
  }

  console.log(`
✅ Done!`);
  console.log(`   Generated: ${newCount}`);
  console.log(`   Skipped:   ${skippedCount}`);
}

generateAudio();