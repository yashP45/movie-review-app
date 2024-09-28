import type { AppProps } from "next/app";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/pages/components/navbar";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

function MyApp({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent rendering until mounted
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
 
        <Component {...pageProps} />
        <Toaster />

      </body>
    </html>
  );
}

export default MyApp;