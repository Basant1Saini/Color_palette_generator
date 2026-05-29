import { useState } from 'react';
import ColorCard from './ColorCard.jsx';
import { deletePalette } from '../api/paletteApi.js';

export default function PaletteHistory({ palettes, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deletePalette(id);
      onDelete(id);
    } catch {
      alert('Failed to delete palette.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!palettes.length)
    return <p className="text-gray-500 text-center mt-8">No saved palettes yet.</p>;

  return (
    <div className="space-y-8 mt-10">
      <h2 className="text-xl font-semibold text-gray-200">Saved Palettes</h2>
      {palettes.map((palette) => (
        <div key={palette._id} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img
                src={palette.imageUrl}
                alt="source"
                className="h-12 w-12 rounded-lg object-cover border border-gray-700"
              />
              <span className="text-gray-400 text-xs">
                {new Date(palette.createdAt).toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => handleDelete(palette._id)}
              disabled={deletingId === palette._id}
              className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
            >
              {deletingId === palette._id ? 'Deleting…' : 'Delete'}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {palette.colors.map((color, i) => (
              <ColorCard key={i} color={color} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
