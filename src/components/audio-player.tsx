"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Volume2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Global queue for audio that should be played
const audioQueue = new Set<string>()
const listeners = new Set<(hash: string) => void>()

export function playAudio(hash: string) {
  audioQueue.add(hash)
  listeners.forEach(listener => listener(hash))
}

export function consumeAudio(hash: string) {
  return audioQueue.delete(hash)
}

export function AudioPlayer({ hash }: { hash: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio and check queue
  useEffect(() => {
    const audio = new Audio(`/audio/${hash}.mp3`)
    audioRef.current = audio
    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => setIsPlaying(false)

    // Check if this hash is already in queue (from deep link)
    if (consumeAudio(hash)) {
      // Small delay to ensure browser allows autoplay after user interaction
      setTimeout(() => {
        audio.currentTime = 0
        setIsPlaying(true)
        audio.play().catch(e => {
          console.error("Audio playback failed", e)
          setIsPlaying(false)
        })
      }, 100)
    }

    // Subscribe to new play requests
    const handlePlay = (requestedHash: string) => {
      if (requestedHash === hash && audioRef.current) {
        audioRef.current.currentTime = 0
        setIsPlaying(true)
        audioRef.current.play().catch(e => {
          console.error("Audio playback failed", e)
          setIsPlaying(false)
        })
      }
    }

    listeners.add(handlePlay)
    return () => {
      listeners.delete(handlePlay)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [hash])

  const play = useCallback(() => {
    if (audioRef.current) {
      setIsPlaying(true)
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed", e)
        setIsPlaying(false)
      })
    }
  }, [])

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
  )
}
