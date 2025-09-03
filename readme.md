# AgroMart

A simple MERN marketplace with category filtering, search suggestions, and role‑aware dashboards (buyer/seller). This README covers setup, project structure, APIs, and key frontend behaviors used in your codebase.

---

## Features

* 🔐 Auth (login/register) with JWT; user stored in `localStorage` (`token`, `userInfo`).
* 🗂️ Category filter bar (client‑side filter) with active state styling.
* 🔎 Live search with suggestions from locally cached products.
* 🛒 Product grid (name, image, description, price).
* 🚪 Logout that clears auth, navigates to login, and blocks history navigation.
* 🧭 Optional history lock on Main and Login pages to discourage back/forward.

---

## Tech Stack

* **Frontend:** React, React Router, Tailwind CSS, Axios, react-icons
* **Backend:** Node.js, Express.js, MongoDB/Mongoose

---

## Project Structure (high‑level)

```
project-root/
├─ backend/
│  ├─ controllers/
│  │  └─ productController.js
│  ├─ models/
│  │  └─ Product.js
│  ├─ routes/
│  │  └─ productRoutes.js
│  ├─ server.js (or app.js)
│  └─ .env
├─ frontend/
│  ├─ src/
│  │  ├─ api.js
│  │  ├─ components/
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ Categorybar.jsx
│  │  │  ├─ Product.jsx
│  │  │  └─ SignupLogin.jsx
│  │  ├─ pages/
│  │  │  └─ Main.jsx
│  │  ├─ App.jsx
│  │  └─ index.jsx
│  └─ package.json
├─ README.md
└─ package.json
```

---

## Backend Setup

1. **Install deps**

   ```bash
   cd backend
   npm install
   ```
2. **Environment variables** (`backend/.env`):

   ```env
   MONGO_URI=mongodb://localhost:27017/agromart
   JWT_SECRET=supersecret
   PORT=5000
   ```
3. **Run server**

   ```bash
   npm run dev   # or: node server.js / nodemon server.js
   ```

### Product model (example)

```js
// backend/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: { type: String, index: true }
});

module.exports = mongoose.model('Product', ProductSchema);
```

### Controllers

```js
// backend/controllers/productController.js
const Product = require('../models/Product');

// GET /api/products?category=Mobiles
const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i'); // case-insensitive
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// (optional) param-based endpoint
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category products' });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
};

module.exports = { getAllProducts, getProductsByCategory, addProduct };
```

### Routes

```js
// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getAllProducts, getProductsByCategory, addProduct } = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.post('/', addProduct);

module.exports = router;
```

### server.js (sketch)

```js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
// app.use('/api/auth', authRoutes); // <- implement login/register here

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => console.log('API running'));
  })
  .catch(console.error);
```

---

## Frontend Setup

1. **Install deps**

   ```bash
   cd frontend
   npm install
   ```
2. **Axios base URL** (`src/api.js`):

   ```js
   import axios from 'axios';

   const instance = axios.create({
     baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
   });

   export default instance;
   ```
3. **Run app**

   ```bash
   npm start
   ```

### Routing

```jsx
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupLogin from './components/SignupLogin';
import MainPage from './pages/Main';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupLogin />} />
        <Route path="/main" element={<MainPage />} />
        {/* <Route path="/dashboard/buyer" element={<BuyerDashboard />} /> */}
        {/* <Route path="/dashboard/seller" element={<SellerDashboard />} /> */}
      </Routes>
    </Router>
  );
}
```

---

## Key Frontend Components

### Navbar

* Loads all products once to power suggestions.
* Displays first name from `localStorage.userInfo`.
* Handles logout (clears storage, navigates home, reloads).
* Attempts to lock history after logout.

**Important:** Ensure you read the right key:

```js
const storedUser = JSON.parse(localStorage.getItem('userInfo'));
```

### Categorybar

* Renders a fixed list of categories.
* Highlights selected; calls `setCategory` prop.

### Main Page

* Fetches `/api/products` on mount.
* Filters by category and search term on the client.
* Optionally locks history to discourage back/forward.

### SignupLogin

* Login/Register form; saves:

  * `token`
  * `email`
  * `userInfo` → `{ name, email, role }`
* On success → `navigate('/main')`.
* (Optional) history lock to refresh page on back/forward.

---

## API Endpoints (current)

* `GET /api/products` — optional query `?category=<Name>` (case‑insensitive)
* `GET /api/products/category/:category` — exact match (optional/legacy)
* `POST /api/products` — create product
* `POST /api/auth/register` — (expected) user registration
* `POST /api/auth/login` — (expected) user login (returns `{ token, user }`)

**Login response shape (expected):**

```json
{
  "token": "<jwt>",
  "user": { "name": "Tanmay Sharma", "email": "t@x.com", "role": "buyer" }
}
```

---

## History / Navigation Lock (optional snippets)

> These are the minimal snippets you already use to reduce back/forward navigation. They do **not** truly disable browser buttons (browsers don’t allow that), but they mitigate by re‑pushing state or reloading.

**Main.jsx** (lock while on page):

```js
useEffect(() => {
  const lock = () => window.history.pushState(null, '', window.location.pathname);
  lock();
  const onPop = () => lock();
  window.addEventListener('popstate', onPop);
  return () => window.removeEventListener('popstate', onPop);
}, []);
```

**SignupLogin.jsx** (force reload on back/forward):

```js
useEffect(() => {
  const onPop = () => navigate(0);
  window.history.pushState(null, '', window.location.href);
  window.addEventListener('popstate', onPop);
  return () => window.removeEventListener('popstate', onPop);
}, [navigate]);
```

**Navbar.jsx** (after logout):

```js
const handleLogout = () => {
  localStorage.clear();
  navigate('/', { replace: true });
  window.location.reload();
};
```

---

## Seeding Products (quick script)

```js
// backend/scripts/seed.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany([
    { name: 'iPhone', description: 'Phone', price: 69999, image: '', category: 'Mobiles' },
    { name: 'ThinkPad', description: 'Laptop', price: 89999, image: '', category: 'Laptops' },
    { name: 'Cricket Bat', description: 'Sports gear', price: 1999, image: '', category: 'Sports' }
  ]);
  console.log('Seeded');
  process.exit(0);
})();
```

Run:

```bash
node backend/scripts/seed.js
```

---

## Troubleshooting

* **Name shows as “User” in Navbar** → Read `userInfo` from `localStorage`, not `user`.
* **No products visible** → Check API base URL, CORS, DB connection, and ensure seed data exists.
* **Category filter not working** → Verify exact category strings in seed data; client filter uses strict equality.
* **History still navigates back** → This is browser‑controlled. Current approach repushes state/refreshes page to mitigate.

---

## License

MIT (for demo purposes).
