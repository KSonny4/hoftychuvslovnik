import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { dictionary } from "@/data/dictionary"
import { ModeToggle } from "@/components/mode-toggle"

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
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-1/2 font-serif font-bold text-xl py-6 px-8 text-foreground">Hoftyština</TableHead>
              <TableHead className="w-1/2 font-serif font-bold text-xl py-6 px-8 text-foreground">Čeština</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dictionary.map((entry, index) => (
              <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-lg py-4 px-8 border-r">{entry.original}</TableCell>
                <TableCell className="text-lg py-4 px-8 italic">{entry.translation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
