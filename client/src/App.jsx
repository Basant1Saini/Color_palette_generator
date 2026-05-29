import Home from './pages/Home.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="py-6 text-center border-b border-gray-800">
        <h1 className="text-3xl font-bold tracking-tight">🎨 Color Palette Generator</h1>
        <p className="text-gray-400 mt-1 text-sm">Extract beautiful palettes from any image</p>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Home />
      </main>
    </div>
  );
}
