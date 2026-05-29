import { Router } from 'express';
import upload from '../middleware/upload.js';
import {
  createPalette,
  getPalettes,
  deletePalette,
} from '../controllers/paletteController.js';

const router = Router();

router.post('/', upload.single('image'), createPalette);
router.get('/', getPalettes);
router.delete('/:id', deletePalette);

export default router;
