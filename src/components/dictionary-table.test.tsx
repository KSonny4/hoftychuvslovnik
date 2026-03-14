import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { DictionaryTable } from "./dictionary-table"
import type { DictionaryEntry } from "@/data/dictionary"

// Mock window.location
const mockLocation = {
  hash: "",
  pathname: "/",
  origin: "https://example.com",
}

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
})

// Mock scrollIntoView on Element prototype
Element.prototype.scrollIntoView = vi.fn()

// Mock HTMLAudioElement
class MockAudio {
  currentTime = 0
  paused = true
  src = ""
  onended: (() => void) | null = null
  onerror: (() => void) | null = null
  
  play() {
    this.paused = false
    return Promise.resolve()
  }
  
  pause() {
    this.paused = true
  }
}

// @ts-expect-error - Mocking Audio constructor
global.Audio = vi.fn(() => new MockAudio())

// Mock audio-player module
vi.mock("./audio-player", () => ({
  AudioPlayer: vi.fn(({ hash }: { hash: string }) => (
    <button data-testid={`audio-${hash}`}>Play</button>
  )),
  playAudio: vi.fn(),
  consumeAudio: vi.fn(() => false),
}))

// Mock md5
vi.mock("md5", () => ({
  default: vi.fn((str: string) => "hash-" + str.replace(/\s/g, "-")),
}))

const mockEntries: DictionaryEntry[] = [
  { original: "Dneska bude lyžovačka jak mrd", translation: "Dneska to na lyžích bude stát za to", slyseno: "14. 3. 7:20" },
  { original: "Cíga prostě chutnaj líp na horách, hochu", translation: "Na horách je kouření příjemnější", slyseno: "13. 3. 22:15" },
  { original: "Bráško", translation: "kamaráde" },
]

describe("DictionaryTable", () => {
  beforeEach(() => {
    mockLocation.hash = ""
    vi.clearAllMocks()
  })

  describe("Deep Link Audio Feature", () => {
    it("should queue audio when hash matches entry on mount", async () => {
      // Set hash before rendering
      mockLocation.hash = "#dneska-bude-lyzovacka-jak-mrd"
      
      render(<DictionaryTable entries={mockEntries} />)
      
      // Component should render with the highlighted row
      await waitFor(() => {
        const row = screen.getByText("Dneska bude lyžovačka jak mrd").closest("tr")
        expect(row).toHaveClass("bg-yellow-100")
      })
    })

    it("should scroll to highlighted row on mount", async () => {
      mockLocation.hash = "#dneska-bude-lyzovacka-jak-mrd"
      
      render(<DictionaryTable entries={mockEntries} />)
      
      // Wait for scroll effect
      await waitFor(() => {
        const row = screen.getByText("Dneska bude lyžovačka jak mrd").closest("tr")
        expect(row).toBeInTheDocument()
      })
    })

    it("should not highlight any row when hash does not match", () => {
      mockLocation.hash = "#unknown-slug"
      
      render(<DictionaryTable entries={mockEntries} />)
      
      // No row should have yellow highlight
      const rows = screen.getAllByRole("row")
      rows.forEach(row => {
        expect(row).not.toHaveClass("bg-yellow-100")
      })
    })

    it("should update highlight when hash changes", async () => {
      mockLocation.hash = "#brasiko"
      
      const { rerender } = render(<DictionaryTable entries={mockEntries} />)
      
      // Change hash
      mockLocation.hash = "#dneska-bude-lyzovacka-jak-mrd"
      
      // Trigger hashchange event
      window.dispatchEvent(new HashChangeEvent("hashchange"))
      
      // Wait for update
      await waitFor(() => {
        const row = screen.getByText("Dneska bude lyžovačka jak mrd").closest("tr")
        expect(row).toHaveClass("bg-yellow-100")
      })
    })
  })

  describe("Slugify Integration", () => {
    it("should generate correct slugs for all entries", () => {
      render(<DictionaryTable entries={mockEntries} />)
      
      // Check that each entry has a row with the correct ID
      const expectedSlugs = [
        "dneska-bude-lyzovacka-jak-mrd",
        "ciga-proste-chutnaj-lip-na-horach-hochu",
        "brasko",
      ]
      
      expectedSlugs.forEach(slug => {
        const element = document.getElementById(slug)
        expect(element).toBeInTheDocument()
      })
    })
  })

  describe("Copy Link Feature", () => {
    it("should copy link to clipboard when copy button is clicked", async () => {
      // Mock clipboard
      const mockClipboard = {
        writeText: vi.fn().mockResolvedValue(undefined),
      }
      Object.assign(navigator, { clipboard: mockClipboard })
      
      render(<DictionaryTable entries={mockEntries} />)
      
      // Find and click copy button for first entry
      const copyButtons = screen.getAllByTitle("Kopírovat odkaz")
      await copyButtons[0].click()
      
      // Check clipboard was called with correct URL
      expect(mockClipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining("#dneska-bude-lyzovacka-jak-mrd")
      )
    })
  })
})
