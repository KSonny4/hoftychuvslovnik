"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AudioPlayer({ hash }: { hash: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(`/audio/${hash}.mp3`);
    audioRef.current.onended = () => setIsPlaying(false);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [hash]);

  useEffect(() => {
    const handlePlayAudio = (e: CustomEvent) => {
      if (e.detail === hash && audioRef.current) {
        audioRef.current.currentTime = 0;
        setIsPlaying(true);
        audioRef.current.play().catch(e => {
          console.error("Audio playback failed", e);
          setIsPlaying(false);
        });
      }
    };

    window.addEventListener("play-audio", handlePlayAudio as EventListener);
    return () => window.removeEventListener("play-audio", handlePlayAudio as EventListener);
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
