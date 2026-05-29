# 🎨 Color Palette Generator

A full-stack MERN application that extracts dominant color palettes from uploaded images using modern, non-deprecated tooling.

---

## ✨ Features

- Upload any image (JPG, PNG, WEBP, GIF) via drag-and-drop or file picker
- Extracts up to 6 dominant colors per image
- Displays HEX, RGB, and HSL values for each color
- One-click copy any color value to clipboard
- Save and browse previously generated palettes
- Delete saved palettes
- Responsive dark UI built with React 18 + Vite 5 + Tailwind CSS v3
- REST API built with Express 5
- MongoDB 7 + Mongoose 8 for palette history storage

---

## 🛠 Tech Stack

| Layer            | Technology                                                                    |
|------------------|-------------------------------------------------------------------------------|
| Frontend         | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)                |
| Styling          | [Tailwind CSS v3](https://tailwindcss.com/)                                   |
| Backend          | [Node.js 20 LTS](https://nodejs.org/) + [Express 5](https://expressjs.com/)  |
| Database         | [MongoDB 7](https://www.mongodb.com/) + [Mongoose 8](https://mongoosejs.com/)|
| Color Extraction | [node-vibrant ^3.2.1](https://github.com/Vibrant-Colors/node-vibrant)        |
| Image Processing | [sharp ^0.33](https://sharp.pixelplumbing.com/)                               |
| File Upload      | [Multer ^1.4.5-lts.1](https://github.com/expressjs/multer)                   |
| HTTP Client      | [Axios ^1.7](https://axios-http.com/)                                         |

> All packages are actively maintained. No deprecated tools (`jimp`, `color-thief-node`, `memoryStorage`) are used.

---

## 📁 Project Structure

```
Color_palette_generator/
├── client/                          # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── paletteApi.js        # Axios API calls
│   │   ├── components/
│   │   │   ├── ColorCard.jsx        # Single color swatch with copy
│   │   │   ├── ImageUploader.jsx    # Drag-and-drop uploader
│   │   │   └── PaletteHistory.jsx   # Saved palettes list
│   │   ├── pages/
│   │   │   └── Home.jsx             # Main page
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                # Tailwind directives
│   ├── index.html
│   ├── vite.config.js               # Vite + proxy config
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── server/                          # Express backend
│   ├── controllers/
│   │   └── paletteController.js     # Upload, extract, CRUD logic
│   ├── models/
│   │   └── Palette.js               # Mongoose schema
│   ├── routes/
│   │   └── paletteRoutes.js         # API routes
│   ├── middleware/
│   │   └── upload.js                # Multer diskStorage config
│   ├── uploads/                     # Temp uploaded images
│   ├── app.js                       # Express entry point
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.x
- MongoDB >= 7.x running locally, or a [MongoDB Atlas](https://www.mongodb.com/atlas) URI
- npm >= 10.x

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/color-palette-generator.git
cd color-palette-generator
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Copy the example env file and fill in your values:

```bash
cp ../.env.example .env
```

`.env` contents:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/color_palette
```

Start the dev server:

```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`

> The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000` automatically — no CORS issues in development.

---

## 🔌 API Endpoints

| Method | Endpoint           | Description                         |
|--------|--------------------|-------------------------------------|
| POST   | `/api/palette`     | Upload image → returns color palette |
| GET    | `/api/palette`     | Fetch all saved palettes             |
| DELETE | `/api/palette/:id` | Delete a saved palette by ID         |

### POST `/api/palette`

**Request**
- `Content-Type: multipart/form-data`
- Body field: `image` (file, max 5 MB)

**Response `201`**

```json
{
  "_id": "664abc123...",
  "colors": [
    { "hex": "#3A86FF", "rgb": "rgb(58, 134, 255)", "hsl": "hsl(217, 100%, 61%)" },
    { "hex": "#FF006E", "rgb": "rgb(255, 0, 110)",  "hsl": "hsl(334, 100%, 50%)" }
  ],
  "imageUrl": "/uploads/1716200000000.jpg",
  "createdAt": "2024-05-20T10:00:00.000Z",
  "updatedAt": "2024-05-20T10:00:00.000Z"
}
```

---

## ⚙️ Key Implementation Notes

### File Upload — `server/middleware/upload.js`

Uses `multer` with `diskStorage` and MIME-type validation. No deprecated `memoryStorage`.

```js
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
export default multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });
```

### Color Extraction — `server/controllers/paletteController.js`

Uses `node-vibrant` (replaces deprecated `color-thief-node`). HSL is computed server-side from the RGB values returned by Vibrant.

```js
const vibrantPalette = await Vibrant.from(req.file.path).getPalette();
const colors = Object.values(vibrantPalette)
  .filter(Boolean)
  .map((swatch) => ({
    hex: swatch.hex,
    rgb: `rgb(${swatch.rgb.join(', ')})`,
    hsl: rgbToHsl(...swatch.rgb),
  }));
```

### Vite Proxy — `client/vite.config.js`

Proxies API and static uploads to the Express server during development:

```js
server: {
  proxy: {
    '/api': 'http://localhost:5000',
    '/uploads': 'http://localhost:5000',
  },
}
```

---

## 📦 Dependencies

### `server/package.json`

```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^5.0.1",
    "mongoose": "^8.4.1",
    "multer": "^1.4.5-lts.1",
    "node-vibrant": "^3.2.1-5",
    "sharp": "^0.33.4"
  },
  "devDependencies": {
    "nodemon": "^3.1.3"
  }
}
```

### `client/package.json`

```json
{
  "dependencies": {
    "axios": "^1.7.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.1"
  }
}
```

---

## 🌐 Environment Variables

| Variable    | Description               | Default                                   |
|-------------|---------------------------|-------------------------------------------|
| `PORT`      | Express server port       | `5000`                                    |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/color_palette` |

---

## 📸 Screenshots

> Add screenshots of your UI here after running the app.

---

## 📄 License

[MIT](LICENSE)
