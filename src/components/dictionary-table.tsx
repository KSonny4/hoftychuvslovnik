"use client"

import { useEffect, useState, useMemo, useCallback, useRef } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AudioPlayer, playAudio } from "@/components/audio-player"
import { slugify } from "@/lib/utils"
import md5 from "md5"
import type { DictionaryEntry } from "@/data/dictionary"

interface DictionaryTableProps {
  entries: DictionaryEntry[]
}

function getHash() {
  if (typeof window === "undefined") return ""
  return window.location.hash.slice(1).replace(/(^-|-$)/g, "")
}

export function DictionaryTable({ entries }: DictionaryTableProps) {
  // Initialize state empty to avoid hydration mismatch, then populate from hash
  const [currentHash, setCurrentHash] = useState<string>("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const initializedRef = useRef(false)

  // Queue audio on initial mount (runs once)
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    
    const hash = getHash()
    if (hash) {
      setCurrentHash(hash)
      // Find the entry for this hash and play its audio
      const entry = entries.find((e: DictionaryEntry) => slugify(e.original) === hash)
      if (entry) {
        const audioHash = md5(entry.original)
        playAudio(audioHash)
      }
      
      // Scroll to element
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 200)
    }
  }, [entries])

  // Handle hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const newHash = getHash()
      setCurrentHash(newHash)
      if (newHash) {
        // Scroll to element
        setTimeout(() => {
          const element = document.getElementById(newHash)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 100)
        
        // Queue audio for playback
        const entry = entries.find((e: DictionaryEntry) => slugify(e.original) === newHash)
        if (entry) {
          const audioHash = md5(entry.original)
          playAudio(audioHash)
        }
      }
    }

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [entries])

  const handleCopyLink = useCallback((entry: DictionaryEntry) => {
    const slug = slugify(entry.original)
    const url = `${window.location.origin}${window.location.pathname}#${slug}`
    navigator.clipboard.writeText(url)
    setCopiedId(slug)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const highlightedId = useMemo(() => currentHash, [currentHash])

  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="w-1/3 font-serif font-bold text-xl py-6 px-8 text-foreground">
            Hoftyština
          </TableHead>
          <TableHead className="w-1/3 font-serif font-bold text-xl py-6 px-8 text-foreground">
            Čeština
          </TableHead>
          <TableHead className="w-1/6 font-serif font-bold text-xl py-6 px-8 text-foreground">
            Slyšeno
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry: DictionaryEntry, index: number) => {
          const slug = slugify(entry.original)
          const isHighlighted = highlightedId === slug

          return (
            <TableRow
              key={index}
              id={slug}
              className={`hover:bg-muted/30 transition-colors ${
                isHighlighted ? "bg-yellow-100 dark:bg-yellow-900/30 ring-2 ring-yellow-500" : ""
              }`}
            >
              <TableCell className="font-medium text-lg py-4 px-8 border-r">
                <div className="flex items-center justify-between gap-2">
                  <span>{entry.original}</span>
                  <div className="flex items-center gap-1">
                    <AudioPlayer hash={md5(entry.original)} />
                    <button
                      onClick={() => handleCopyLink(entry)}
                      className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors"
                      title="Kopírovat odkaz"
                    >
                      {copiedId === slug ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-lg py-4 px-8 italic border-r">
                <div className="flex items-center justify-between">
                  <span>{entry.translation}</span>
                  <AudioPlayer hash={md5(entry.translation)} />
                </div>
              </TableCell>
              <TableCell className="text-lg py-4 px-8 text-muted-foreground">
                {entry.slyseno && (
                  <span className="text-sm bg-muted px-2 py-1 rounded">
                    {entry.slyseno}
                  </span>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
