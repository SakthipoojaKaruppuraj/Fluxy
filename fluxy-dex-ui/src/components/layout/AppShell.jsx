export default function AppShell({ children }) {
  return (
    <div className="min-h-screen text-white flex flex-col">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      
      <footer className="py-6 text-center text-zinc-500 text-sm">
        <p>© 2024 Fluxy DEX. Built on Base.</p>
      </footer>
    </div>
  );
}
