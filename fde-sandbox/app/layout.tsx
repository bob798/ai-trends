import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FDE Sandbox — Practice the last mile",
  description:
    "Become a Forward Deployed Engineer by shipping, not watching. Practice the messiest real moment: dirty data, a vague ask, and production that has to not break.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
