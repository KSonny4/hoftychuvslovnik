"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioPlayerProps {
  text: string;
}

// We need to use md5 to match the filename generation
// Since we can't easily import 'md5' in the client component without polyfills,
// we will pass the hash from the server component or pre-calculate it.
// However, page.tsx is a server component by default in App Router, so we can generate hashes there.
// But wait, the previous `page.tsx` was "use client"? No, it wasn't marked, but it imported `ModeToggle` which is client.
// Let's check page.tsx content again.

export function AudioPlayer({ hash }: { hash: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(`/audio/${hash}.mp3`);
    audioRef.current.onended = () => setIsPlaying(false);
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [hash]);

  const play = () => {
    if (audioRef.current) {
      setIsPlaying(true);
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed", e);
        setIsPlaying(false);
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={play} 
      disabled={isPlaying}
      className="h-8 w-8 ml-2 text-muted-foreground hover:text-foreground"
    >
      {isPlaying ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      <span className="sr-only">Play pronunciation</span>
    </Button>
  );
}
