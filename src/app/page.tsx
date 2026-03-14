import { dictionary } from "@/data/dictionary"
import { ModeToggle } from "@/components/mode-toggle"
import { DictionaryTable } from "@/components/dictionary-table"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24 space-y-12">
      <div className="absolute top-6 right-6">
        <ModeToggle />
      </div>

      <div className="text-center space-y-4 pt-10">
        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent pb-4 leading-tight">
          Hoftychův slovník hlášek
        </h1>
        <p className="text-muted-foreground text-lg italic font-serif">
          Legenda mluví, my překládáme
        </p>
      </div>

      <div className="w-full max-w-4xl border rounded-xl overflow-hidden shadow-2xl bg-card">
        <DictionaryTable entries={dictionary} />
      </div>
    </main>
  )
}
