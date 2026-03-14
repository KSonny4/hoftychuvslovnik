"use client"

import { useEffect, useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AudioPlayer } from "@/components/audio-player"
import { slugify } from "@/lib/utils"
import md5 from "md5"
import type { DictionaryEntry } from "@/data/dictionary"

function getInitialHash() {
  if (typeof window === "undefined") return ""
  return window.location.hash.slice(1)
}

interface DictionaryTableProps {
  entries: DictionaryEntry[]
}

export function DictionaryTable({ entries }: DictionaryTableProps) {
  const [initialHash] = useState(getInitialHash)
  const [currentHash, setCurrentHash] = useState(initialHash)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const highlightedId = useMemo(() => currentHash, [currentHash])

  useEffect(() => {
    if (currentHash) {
      const element = document.getElementById(currentHash)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [currentHash])

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.slice(1))
    }

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const handleCopyLink = (entry: DictionaryEntry) => {
    const slug = slugify(entry.original)
    const url = `${window.location.origin}${window.location.pathname}#${slug}`
    navigator.clipboard.writeText(url)
    setCopiedId(slug)
    setTimeout(() => setCopiedId(null), 2000)
  }

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
        {entries.map((entry, index) => {
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
