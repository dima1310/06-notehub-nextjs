import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoteHub",
  description: "A simple and efficient application for managing personal notes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TanStackProvider>
          <div className="app-container">
            <Header />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
        </TanStackProvider>
      </body>
    </html>
  );
}
