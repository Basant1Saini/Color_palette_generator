import { useState, useRef } from 'react';
import { uploadImage } from '../api/paletteApi.js';

export default function ImageUploader({ onPaletteCreated }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = inputRef.current?.files[0];
    if (!file) return setError('Please select an image first.');

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    try {
      const { data } = await uploadImage(formData);
      onPaletteCreated(data);
      setPreview(null);
      inputRef.current.value = '';
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragging ? 'border-indigo-400 bg-indigo-950' : 'border-gray-700 hover:border-indigo-500'
        }`}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          inputRef.current.files = e.dataTransfer.files;
          handleFile(file);
        }}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
        ) : (
          <p className="text-gray-400">Drag & drop an image here, or <span className="text-indigo-400 underline">browse</span></p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-semibold transition-colors"
      >
        {loading ? 'Extracting...' : 'Generate Palette'}
      </button>
    </form>
  );
}
