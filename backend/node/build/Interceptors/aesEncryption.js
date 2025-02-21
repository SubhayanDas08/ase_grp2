"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aesDecrypt = exports.aesEncrypt = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const key = "z^ctdz%W}$jG-zCd";
// const iv = CryptoJS.enc.Utf8.parse('1020304050607080');
/**
 * Encrypts the given content using AES encryption.
 * @param content - The content to encrypt.
 * @returns The encrypted content as a string.
 */
const aesEncrypt = (content) => {
    const parsedKey = crypto_js_1.default.enc.Utf8.parse(key);
    const encrypted = crypto_js_1.default.AES.encrypt(content, parsedKey, {
        mode: crypto_js_1.default.mode.ECB,
        padding: crypto_js_1.default.pad.Pkcs7,
    });
    return encrypted.toString();
};
exports.aesEncrypt = aesEncrypt;
/**
 * Decrypts the given encrypted content using AES decryption.
 * @param encryptedContent - The encrypted content to decrypt.
 * @returns The decrypted content as a string.
 */
const aesDecrypt = (encryptedContent) => {
    const parsedKey = crypto_js_1.default.enc.Utf8.parse(key);
    const decrypted = crypto_js_1.default.AES.decrypt(encryptedContent, parsedKey, {
        mode: crypto_js_1.default.mode.ECB,
        padding: crypto_js_1.default.pad.Pkcs7,
    });
    return decrypted.toString(crypto_js_1.default.enc.Utf8);
};
exports.aesDecrypt = aesDecrypt;
