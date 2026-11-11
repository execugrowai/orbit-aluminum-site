import type { Metadata } from "next";
import "./globals.css";
import chrome from "@/data/chrome.json";

export const metadata: Metadata = {
  title: { default: "Orbit Aluminum", template: "%s" },
  description: "Integrated aluminum coil manufacturer in Aqaba, Jordan.",
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
