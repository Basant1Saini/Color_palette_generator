import { useState, useEffect } from 'react';
import ImageUploader from '../components/ImageUploader.jsx';
import ColorCard from '../components/ColorCard.jsx';
import PaletteHistory from '../components/PaletteHistory.jsx';
import { fetchPalettes } from '../api/paletteApi.js';

export default function Home() {
  const [palettes, setPalettes] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchPalettes()
      .then(({ data }) => setPalettes(data))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, []);

  const handlePaletteCreated = (palette) => {
    setLatest(palette);
    setPalettes((prev) => [palette, ...prev]);
  };

  const handleDelete = (id) => {
    setPalettes((prev) => prev.filter((p) => p._id !== id));
    if (latest?._id === id) setLatest(null);
  };

  return (
    <div className="space-y-8">
      <ImageUploader onPaletteCreated={handlePaletteCreated} />

      {latest && (
        <div>
          <h2 className="text-lg font-semibold text-gray-200 mb-3">Extracted Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {latest.colors.map((color, i) => (
              <ColorCard key={i} color={color} />
            ))}
          </div>
        </div>
      )}

      {loadingHistory ? (
        <p className="text-gray-500 text-center">Loading history…</p>
      ) : (
        <PaletteHistory palettes={palettes} onDelete={handleDelete} />
      )}
    </div>
  );
}
