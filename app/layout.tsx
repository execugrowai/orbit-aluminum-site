import type { Metadata } from "next";
import "./globals.css";
import chrome from "@/data/chrome.json";

export const metadata: Metadata = {
  title: { default: "Orbit Aluminum", template: "%s" },
  description: "Integrated aluminum coil manufacturer in Aqaba, Jordan.",
  icons: {
    icon: [
      { url: "/brand/orbit-icon.svg", type: "image/svg+xml" },
      { url: "/brand/Orbit_Favicon_32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/Orbit_Favicon_192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/brand/Orbit_Favicon_180x180.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div dangerouslySetInnerHTML={{ __html: chrome.header }} />
        <main>{children}</main>
        <div dangerouslySetInnerHTML={{ __html: chrome.footer }} />
      </body>
    </html>
  );
}
