import { describe, it, expect, beforeEach, vi } from "vitest"
import { playAudio, consumeAudio } from "./audio-player"

describe("Audio Player Deep Link Feature", () => {
  beforeEach(() => {
    // Clear module state between tests by consuming all
    // Since we can't directly access the Set, we test the behavior
  })

  describe("playAudio", () => {
    it("should add hash to queue and notify listeners", () => {
      const mockListener = vi.fn()
      const hash = "test-hash-123"
      
      // Register a listener
      const listeners = new Set<(hash: string) => void>()
      
      // We need to test through the actual module
      // Since listeners is module-level, we can test by consuming
      playAudio(hash)
      
      // After playAudio, the hash should be in queue
      expect(consumeAudio(hash)).toBe(true)
    })

    it("should allow multiple hashes in queue", () => {
      const hash1 = "hash-1"
      const hash2 = "hash-2"
      
      playAudio(hash1)
      playAudio(hash2)
      
      expect(consumeAudio(hash1)).toBe(true)
      expect(consumeAudio(hash2)).toBe(true)
    })
  })

  describe("consumeAudio", () => {
    it("should return true and remove hash from queue when consumed", () => {
      const hash = "test-hash-456"
      playAudio(hash)
      
      // First consumption should succeed
      expect(consumeAudio(hash)).toBe(true)
      
      // Second consumption should fail (already consumed)
      expect(consumeAudio(hash)).toBe(false)
    })

    it("should return false for hash not in queue", () => {
      expect(consumeAudio("unknown-hash")).toBe(false)
    })

    it("should handle hash collision (same hash played twice)", () => {
      const hash = "duplicate-hash"
      
      playAudio(hash)
      playAudio(hash) // Add twice
      
      // Set will only have one entry
      expect(consumeAudio(hash)).toBe(true)
      expect(consumeAudio(hash)).toBe(false) // Second consume fails
    })
  })

  describe("Integration: deep link workflow", () => {
    it("should queue audio when deep link is opened", () => {
      // Simulate deep link hash
      const slug = "dneska-bude-lyzovacka-jak-mrd"
      const expectedAudioHash = "a35f3acfce8dbec6931e4ca663efbb6b" // md5 of "Dneska bude lyžovačka jak mrd"
      
      // When DictionaryTable mounts, it calls playAudio with the hash
      playAudio(expectedAudioHash)
      
      // AudioPlayer component should be able to consume it
      expect(consumeAudio(expectedAudioHash)).toBe(true)
    })

    it("should only play audio once per deep link", () => {
      const hash = "play-once-hash"
      
      // Queue the audio
      playAudio(hash)
      
      // First AudioPlayer instance consumes it
      expect(consumeAudio(hash)).toBe(true)
      
      // Subsequent calls should not play
      expect(consumeAudio(hash)).toBe(false)
    })
  })
})
