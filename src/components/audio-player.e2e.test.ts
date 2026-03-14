import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook } from "@testing-library/react"

describe("Deep Link Audio Playback - E2E Workflow", () => {
  let audioQueue: Set<string>
  let listeners: Set<(hash: string) => void>

  // Re-import the module to get fresh state for each test
  beforeEach(async () => {
    // Clear module cache and re-import
    vi.resetModules()
    const audioPlayer = await import("./audio-player")
    
    // Access the internal state through the exported functions
    // We'll test the behavior indirectly
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("Full user workflow", () => {
    it("should play audio when user opens a shared link", async () => {
      // Step 1: Simulate opening link with hash
      const hash = "dneska-bude-lyzovacka-jak-mrd"
      const audioHash = "a35f3acfce8dbec6931e4ca663efbb6b"
      
      // Step 2: DictionaryTable mounts and calls playAudio
      const { playAudio, consumeAudio } = await import("./audio-player")
      
      playAudio(audioHash)
      
      // Step 3: AudioPlayer component mounts and checks queue
      expect(consumeAudio(audioHash)).toBe(true)
      
      // Step 4: Audio should play (consumed from queue)
      expect(consumeAudio(audioHash)).toBe(false) // Already consumed
    })

    it("should handle multiple AudioPlayer instances with same hash", async () => {
      const audioHash = "shared-hash"
      const { playAudio, consumeAudio } = await import("./audio-player")
      
      // Queue audio once
      playAudio(audioHash)
      
      // First AudioPlayer consumes it
      expect(consumeAudio(audioHash)).toBe(true)
      
      // Second AudioPlayer with same hash should not play
      expect(consumeAudio(audioHash)).toBe(false)
    })

    it("should handle rapid hash changes", async () => {
      const { playAudio, consumeAudio } = await import("./audio-player")
      
      const hash1 = "first-hash"
      const hash2 = "second-hash"
      
      // User navigates to first entry
      playAudio(hash1)
      
      // Then quickly to second entry
      playAudio(hash2)
      
      // Both should be queued
      expect(consumeAudio(hash1)).toBe(true)
      expect(consumeAudio(hash2)).toBe(true)
    })
  })

  describe("Error handling", () => {
    it("should handle playAudio with empty string", async () => {
      const { playAudio, consumeAudio } = await import("./audio-player")
      
      playAudio("")
      expect(consumeAudio("")).toBe(true)
    })

    it("should handle concurrent play requests", async () => {
      const { playAudio, consumeAudio } = await import("./audio-player")
      
      const hash = "concurrent-hash"
      
      // Multiple rapid calls
      playAudio(hash)
      playAudio(hash)
      playAudio(hash)
      
      // Only one should succeed (Set deduplication)
      expect(consumeAudio(hash)).toBe(true)
      expect(consumeAudio(hash)).toBe(false)
    })
  })
})
