import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingHelp from "@/components/FloatingHelp";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "VAN STORE - Minecraft & Keybord | Cambodia",
  description: "Cambodia's premium gaming store. Authentic Minecraft accounts & pro-grade mechanical keyboards. Fast support, secure orders, trusted by 5,000+ gamers.",
  keywords: ["Minecraft account Cambodia", "Gaming keyboard Cambodia", "VAN STORE", "Minecraft premium", "Mechanical keyboard"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-[#070a14] text-white antialiased selection:bg-violet-500/30 selection:text-white">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingHelp />
            {/* Back to top */}
            <script dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined') {
                  window.addEventListener('scroll', () => {
                    const btn = document.getElementById('back-to-top');
                    if (btn) btn.style.opacity = window.scrollY > 600 ? '1' : '0';
                  });
                }
              `
            }} />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
