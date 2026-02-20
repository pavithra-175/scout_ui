
import "./globals.css";
export const metadata = {
  title: "SCOUT",
  description: "AI Powered Team Formation Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}