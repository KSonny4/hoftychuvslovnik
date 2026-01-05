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
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 space-y-8">
      <div className="w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Hoftychův slovník hlášek</h1>
        <ModeToggle />
      </div>

      <div className="w-full max-w-4xl border rounded-lg overflow-hidden">
        <Table>
          <TableCaption>Legenda mluví, my překládáme.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2 font-bold text-lg">Hoftyština</TableHead>
              <TableHead className="w-1/2 font-bold text-lg">Čeština</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dictionary.map((entry, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-base">{entry.original}</TableCell>
                <TableCell className="text-base">{entry.translation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}