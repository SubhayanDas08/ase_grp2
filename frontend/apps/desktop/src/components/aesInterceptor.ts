import CryptoJS from 'crypto-js';

const key = "z^ctdz%W}$jG-zCd"; 
// const iv = CryptoJS.enc.Utf8.parse('1020304050607080');

/**
 * Encrypts the given content using AES encryption.
 * @param content - The content to encrypt.
 * @returns The encrypted content as a string.
 */
export const aesEncrypt = (content: string): string => {
  const parsedKey = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.AES.encrypt(content, parsedKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

/**
 * Decrypts the given encrypted content using AES decryption.
 * @param encryptedContent - The encrypted content to decrypt.
 * @returns The decrypted content as a string.
 */
export const aesDecrypt = (encryptedContent: string): string => {
  const parsedKey = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.AES.decrypt(encryptedContent, parsedKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

