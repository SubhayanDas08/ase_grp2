"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const locationRoutes_1 = __importDefault(require("./routes/locationRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Routes
app.use('/locations', locationRoutes_1.default);
app.use('/events', eventRoutes_1.default);
// PostgreSQL connection pool
exports.pool = new pg_1.Pool({
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT) || 5432,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});
// Test PostgreSQL connection
exports.pool.connect()
    .then(() => {
    console.log('Connected to PostgreSQL');
})
    .catch((error) => {
    console.error('Error connecting to PostgreSQL:', error);
});
// Start the server
const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
console.log('PostgreSQL Host:', process.env.PG_HOST);
