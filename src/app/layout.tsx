import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hoftychuvslovnik.pages.dev'),
  title: "Hoftychův slovník",
  description: "Hoftychův slovník – Legenda mluví, my překládáme",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
  openGraph: {
    title: "Hoftychův slovník – Legenda mluví, my překládáme",
    description: "Objev humorné překlady výroků mistra Hoftycha z tajemné hoftyštiny do češtiny, které pobaví každého, kdo zná Hoftycha i tenhle zvláštní „jazyk“.",
    url: "https://hoftychuvslovnik.pages.dev/",
    siteName: "Hoftychův slovník",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Hoftychův slovník – Legenda mluví, my překládáme",
      },
    ],
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hoftychův slovník – Legenda mluví, my překládáme",
    description: "Objev humorné překlady výroků mistra Hoftycha z tajemné hoftyštiny do češtiny, které pobaví každého, kdo zná Hoftycha i tenhle zvláštní „jazyk“.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
