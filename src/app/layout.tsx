import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { PlayerProvider } from "@/context/player-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "کتابگرد | فروشگاه آنلاین کتاب الکترونیک و صوتی",
  description: "سامانه خرید و مطالعه آنلاین کتاب الکترونیک و کتاب صوتی همراه با کتابخوان درون‌مرورگر",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={vazirmatn.variable}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <PlayerProvider>
              {children}
            </PlayerProvider>
          </TooltipProvider>
          <Toaster position="bottom-left" dir="rtl" />
        </ThemeProvider>
      </body>
    </html>
  );
}
