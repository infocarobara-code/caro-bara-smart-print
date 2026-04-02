import "./globals.css";
import { LanguageProvider } from "@/lib/languageContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}