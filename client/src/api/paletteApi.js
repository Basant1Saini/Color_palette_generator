import axios from 'axios';

const BASE = '/api/palette';

export const uploadImage = (formData) =>
  axios.post(BASE, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const fetchPalettes = () => axios.get(BASE);

export const deletePalette = (id) => axios.delete(`${BASE}/${id}`);
