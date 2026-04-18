import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Trocamos Geist por Inter para evitar o erro
import "@/app/globals.css"
import { cn } from "@/lib/supabase/utils"; // Garanta que o arquivo src/lib/utils.ts exista

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LeARN Project",
  description: "Desenvolvido por Guilherme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={cn(
          "min-height-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}