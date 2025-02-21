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
exports.getLocationData = exports.saveLocationToDatabase = exports.verifyUserCredentials = exports.saveRegistrationData = void 0;
const server_1 = require("../server");
const aesEncryption_1 = require("../Interceptors/aesEncryption");
// Save registration data with encrypted request body
const saveRegistrationData = (firstName, lastName, email, password, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield server_1.pool.connect();
        // Encrypt password before storing in the database
        const encryptedPassword = (0, aesEncryption_1.aesEncrypt)(password);
        const query = `INSERT INTO users (first_name, last_name, email, password, phone_number, created_at) VALUES ($1, $2, $3, $4, $5, NOW())RETURNING *;`;
        const values = [firstName, lastName, email, encryptedPassword, phoneNumber];
        const result = yield client.query(query, values);
        const savedUser = result.rows[0];
        // await client.query(query, values);
        // await client.query('COMMIT');
        console.log('User registration data saved successfully.');
        return savedUser;
    }
    catch (error) {
        console.error('Error saving user data:', error);
        throw error;
    }
    finally {
        client === null || client === void 0 ? void 0 : client.release();
    }
});
exports.saveRegistrationData = saveRegistrationData;
const verifyUserCredentials = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield server_1.pool.connect();
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = yield client.query(query, [email]);
        if (result.rows.length > 0) {
            return result.rows[0];
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error('Error verifying user credentials:', error);
        throw error;
    }
    finally {
        client === null || client === void 0 ? void 0 : client.release();
    }
});
exports.verifyUserCredentials = verifyUserCredentials;
// Save location data with encrypted request body
const saveLocationToDatabase = (label, latitude, longitude) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield server_1.pool.connect(); // Connect to the database
        yield client.query('BEGIN'); // Begin transaction
        // Decrypt the incoming request body
        // const decryptedData = JSON.parse(aesDecrypt(encryptedData));
        // const { locationName, latitude, longitude } = decryptedData;
        const query = `INSERT INTO public.locations (name, latitude, longitude) VALUES ($1, $2, $3)`;
        yield client.query(query, [label, latitude, longitude]);
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
// Retrieve and decrypt location data
const getLocationData = () => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield server_1.pool.connect();
        const query = 'SELECT * FROM public.locations ORDER BY id DESC LIMIT 1';
        const result = yield client.query(query);
        if (result.rows.length > 0) {
            // Encrypt the retrieved data before sending response
            return JSON.parse((0, aesEncryption_1.aesDecrypt)(result.rows[0]));
        }
        else {
            return result;
        }
    }
    catch (error) {
        console.error('Error retrieving location data:', error);
        throw error;
    }
    finally {
        client === null || client === void 0 ? void 0 : client.release();
    }
});
exports.getLocationData = getLocationData;
