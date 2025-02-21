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
exports.FElogin = exports.FEregistrationData = void 0;
const databaseService_1 = require("../services/databaseService");
const aesEncryption_1 = require("../Interceptors/aesEncryption");
const FEregistrationData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Log the request body
        console.log("Received Request Body:", req.body);
        // Validate that encryptedData exists
        if (!req.body.encryptedData) {
            console.error("Error: Missing encryptedData in request body");
            return res.status(400).json({ error: "Missing encryptedData" });
        }
        // Try decrypting the request
        let decryptedString;
        try {
            decryptedString = (0, aesEncryption_1.aesDecrypt)(req.body.encryptedData);
        }
        catch (decryptError) {
            console.error("Error Decrypting Request:", decryptError);
            return res.status(400).json({ error: "Invalid encryptedData" });
        }
        console.log("Decrypted String:", decryptedString);
        // Parse JSON from decrypted string
        let decryptedData;
        try {
            decryptedData = JSON.parse(decryptedString);
        }
        catch (parseError) {
            console.error("Error Parsing Decrypted Data:", parseError);
            return res.status(400).json({ error: "Invalid JSON format" });
        }
        console.log("Parsed Decrypted Data:", decryptedData);
        const { first_name, last_name, email, password, phone_number } = decryptedData;
        // Log extracted data
        console.log("Registering User:", { first_name, last_name, email, password, phone_number });
        // Save user data
        const Data = yield (0, databaseService_1.saveRegistrationData)(first_name, last_name, email, password, phone_number);
        // Encrypt and send response
        const encryptedResponse = (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ message: "Data saved successfully", data: Data }));
        console.log("Sending Response:", encryptedResponse);
        res.status(200).json({ encryptedData: encryptedResponse });
    }
    catch (error) {
        console.error("Internal Server Error:", error);
        const encryptedError = (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ error: "Internal Server Error" }));
        res.status(500).json({ encryptedData: encryptedError });
    }
});
exports.FEregistrationData = FEregistrationData;
const FElogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Received Login Request Body:", req.body);
        // Decrypt the incoming request body
        if (!req.body.encryptedData) {
            console.error("Error: Missing encryptedData in request body");
            return res.status(400).json({ encryptedData: (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ error: "Missing encryptedData" })) });
        }
        const decryptedData = JSON.parse((0, aesEncryption_1.aesDecrypt)(req.body.encryptedData));
        console.log("Decrypted Login Data:", decryptedData);
        const { email, password } = decryptedData;
        // Verify user credentials
        const userData = yield (0, databaseService_1.verifyUserCredentials)(email);
        if (!userData) {
            console.error("Error: Invalid Credentials");
            return res.status(401).json({ encryptedData: (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ error: "Invalid Credentials" })) });
        }
        console.log("Retrieved User Data:", userData);
        // Decrypt stored password
        const decryptedPassword = (0, aesEncryption_1.aesDecrypt)(userData.password);
        console.log("Decrypted Stored Password:", decryptedPassword);
        if (decryptedPassword !== password) {
            console.error("Error: Password Mismatch");
            return res.status(401).json({ encryptedData: (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ error: "Invalid Credentials" })) });
        }
        console.log("Login Successful for:", email);
        // Encrypt the successful response
        const encryptedResponse = (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ message: "Login Successful", user: userData }));
        res.status(200).json({ encryptedData: encryptedResponse });
    }
    catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ encryptedData: (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ error: "Internal Server Error" })) });
    }
});
exports.FElogin = FElogin;
