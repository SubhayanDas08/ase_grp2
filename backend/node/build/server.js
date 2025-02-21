"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const locationRoutes_1 = __importDefault(require("./routes/locationRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
const envPath = path_1.default.resolve(__dirname, '.env');
console.log("Loading .env from:", envPath);
dotenv_1.default.config({ path: envPath });
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/locations', locationRoutes_1.default);
app.use('/events', eventRoutes_1.default);
app.use('/user', userRoutes_1.default);
// PostgreSQL connection pool
exports.pool = new pg_1.Pool({
    host: process.env.PG_HOST || 'localhost',
    port: Number(process.env.PG_PORT) || 5432,
    database: process.env.PG_DATABASE || 'postgres',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    // idleTimeoutMillis: 30000, // Closes idle clients after 30 sec
    // connectionTimeoutMillis: 5000, // Timeout for new connections (5 sec)
});
// Test PostgreSQL connection
exports.pool.connect()
    .then(() => console.log('PostgreSQL Connected Successfully'))
    .catch((error) => console.error('PostgreSQL Connection Error:', error.message));
// Start the server
const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
console.log('Checking Environment Variables:');
console.log('PG_HOST:', process.env.PG_HOST);
console.log('PG_USER:', process.env.PG_USER);
console.log('PG_DATABASE:', process.env.PG_DATABASE);
console.log('PG_PASSWORD:', process.env.PG_PASSWORD ? '****' : 'Not Set');
console.log('REDIS_HOST:', process.env.REDIS_HOST);
