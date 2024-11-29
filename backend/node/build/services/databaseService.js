"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationData = exports.saveLocationToDatabase = void 0;
const server_1 = require("../server");
// Save location data to PostgreSQL
const saveLocationToDatabase = (locationName, latitude, longitude) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield server_1.pool.connect(); // Connect to the database
        yield client.query('BEGIN'); // Begin transaction
        const query = `
      INSERT INTO public.locations (name, latitude, longitude)
      VALUES ($1, $2, $3)
    `;
        yield client.query(query, [locationName, latitude, longitude]);
        yield client.query('COMMIT'); // Commit transaction
    }
    catch (error) {
        if (client) {
            yield client.query('ROLLBACK'); // Rollback on error
        }
        console.error('Error saving location data:', error);
        throw error;
    }
    finally {
        client === null || client === void 0 ? void 0 : client.release(); // Release the client back to the pool
    }
});
exports.saveLocationToDatabase = saveLocationToDatabase;
// Retrieve the latest location data
const getLocationData = () => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield server_1.pool.connect(); // Connect to the database
        const query = 'SELECT * FROM public.locations ORDER BY id DESC LIMIT 1';
        const result = yield client.query(query);
        return result.rows[0] || null; // Return the latest location data or null if none exists
    }
    catch (error) {
        console.error('Error retrieving location data:', error);
        throw error;
    }
    finally {
        client === null || client === void 0 ? void 0 : client.release(); // Release the client back to the pool
    }
});
exports.getLocationData = getLocationData;
