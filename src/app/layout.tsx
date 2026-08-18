import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teknoh — Evidence-backed opportunities",
  description: "Find public evidence of problems your product or service can solve.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
