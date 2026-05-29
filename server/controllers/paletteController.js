import fs from 'fs';
import Vibrant from 'node-vibrant';
import Palette from '../models/Palette.js';

const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

export const createPalette = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

  try {
    const vibrantPalette = await Vibrant.from(req.file.path).getPalette();

    const colors = Object.values(vibrantPalette)
      .filter(Boolean)
      .map((swatch) => {
        const [r, g, b] = swatch.rgb;
        return {
          hex: swatch.hex,
          rgb: `rgb(${r}, ${g}, ${b})`,
          hsl: rgbToHsl(r, g, b),
        };
      });

    const imageUrl = `/uploads/${req.file.filename}`;
    const palette = await Palette.create({ colors, imageUrl });
    res.status(201).json(palette);
  } catch (err) {
    fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: err.message });
  }
};

export const getPalettes = async (req, res) => {
  try {
    const palettes = await Palette.find().sort({ createdAt: -1 });
    res.json(palettes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePalette = async (req, res) => {
  try {
    const palette = await Palette.findByIdAndDelete(req.params.id);
    if (!palette) return res.status(404).json({ error: 'Palette not found' });

    const filePath = `.${palette.imageUrl}`;
    fs.unlink(filePath, () => {});
    res.json({ message: 'Palette deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
