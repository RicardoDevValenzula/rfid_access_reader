export default function KioskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="h-screen w-screen bg-black text-white flex items-center justify-center select-none">
        {children}
      </body>
    </html>
  );
}
