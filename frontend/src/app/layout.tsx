import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StellarPay",
  description: "Production-quality payment application on Stellar Testnet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} flex h-screen bg-background text-foreground overflow-hidden`}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
