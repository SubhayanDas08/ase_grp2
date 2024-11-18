const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.get('/', (req, res) => res.send('Hello from backend!'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));