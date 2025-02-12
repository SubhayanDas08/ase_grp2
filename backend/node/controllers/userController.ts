import { Request, Response } from 'express';
import { saveRegistrationData, verifyUserCredentials, saveLocationToDatabase, getLocationData } from '../services/databaseService';
import { aesEncrypt, aesDecrypt } from '../Interceptors/aesEncryption';


export const FEregistrationData = async (req: Request, res: Response): Promise<any> => {
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
            decryptedString = aesDecrypt(req.body.encryptedData);
        } catch (decryptError) {
            console.error("Error Decrypting Request:", decryptError);
            return res.status(400).json({ error: "Invalid encryptedData" });
        }

        console.log("Decrypted String:", decryptedString);

        // Parse JSON from decrypted string
        let decryptedData;
        try {
            decryptedData = JSON.parse(decryptedString);
        } catch (parseError) {
            console.error("Error Parsing Decrypted Data:", parseError);
            return res.status(400).json({ error: "Invalid JSON format" });
        }

        console.log("Parsed Decrypted Data:", decryptedData);
        const { first_name, last_name, email, password, phone_number } = decryptedData;

        // Log extracted data
        console.log("Registering User:", { first_name, last_name, email, password, phone_number });

        // Save user data
        const Data = await saveRegistrationData(first_name, last_name, email, password, phone_number);

        // Encrypt and send response
        const encryptedResponse = aesEncrypt(JSON.stringify({ message: "Data saved successfully",data: Data }));
        console.log("Sending Response:", encryptedResponse);
        
        res.status(200).json({ encryptedData: encryptedResponse });
    } catch (error) {
        console.error("Internal Server Error:", error);
        const encryptedError = aesEncrypt(JSON.stringify({ error: "Internal Server Error" }));
        res.status(500).json({ encryptedData: encryptedError });
    }
};

export const FElogin = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log("Received Login Request Body:", req.body);

        // Decrypt the incoming request body
        if (!req.body.encryptedData) {
            console.error("Error: Missing encryptedData in request body");
            return res.status(400).json({ encryptedData: aesEncrypt(JSON.stringify({ error: "Missing encryptedData" })) });
        }

        const decryptedData = JSON.parse(aesDecrypt(req.body.encryptedData));
        console.log("Decrypted Login Data:", decryptedData);

        const { email, password } = decryptedData;

        // Verify user credentials
        const userData = await verifyUserCredentials(email);
        if (!userData) {
            console.error("Error: Invalid Credentials");
            return res.status(401).json({ encryptedData: aesEncrypt(JSON.stringify({ error: "Invalid Credentials" })) });
        }

        console.log("Retrieved User Data:", userData);

        // Decrypt stored password
        const decryptedPassword = aesDecrypt(userData.password);
        console.log("Decrypted Stored Password:", decryptedPassword);

        if (decryptedPassword !== password) {
            console.error("Error: Password Mismatch");
            return res.status(401).json({ encryptedData: aesEncrypt(JSON.stringify({ error: "Invalid Credentials" })) });
        }

        console.log("Login Successful for:", email);

        // Encrypt the successful response
        const encryptedResponse = aesEncrypt(JSON.stringify({ message: "Login Successful", user: userData }));
        res.status(200).json({ encryptedData: encryptedResponse });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ encryptedData: aesEncrypt(JSON.stringify({ error: "Internal Server Error" })) });
    }
};