import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
  hex: String,
  rgb: String,
  hsl: String,
});

const paletteSchema = new mongoose.Schema(
  {
    colors: [colorSchema],
    imageUrl: { type: String, required: true },
    name: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Palette', paletteSchema);
