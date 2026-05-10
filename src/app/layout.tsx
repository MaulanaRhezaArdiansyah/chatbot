import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeepChat — AI Assistant",
  description: "A modern AI chatbot powered by DeepSeek and LangChain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
