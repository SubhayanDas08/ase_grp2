
import { aesDecrypt } from '../Interceptors/aesEncryption'; // Import AES decryption function

// Replace this with the actual encrypted response received from the API
const encryptedResponse: string = "7k3VUX1TmAYmQu6qJp3UHLtVfyLbFUzn0ypSJGbQ6Gs7ILqh3arSbumS4H0YwZEMz8wb/i5eUC850+0xvTQsg+9LM4NM+h4Y+mcy8qU2R0TlPOklCA+ZTHlI9jL/x8NMMZ8dJpK7s1zonaTwDIhvB7zmR/SR+wzvO7eRyN0GqXFWdM/5qMxLUpK1Uk/N835rWmG9d2eIm9ilqjawSiU5lkcrBo8xQqAy3Ksv+ShaLCz5ip3WgXhVPY/ZotfvVByJRbKWzqxB7vI9UWU+ZNh8USRw5TsNnu1oG4LE90TnJ7q0yhrz5Bg6Ow1eAiwt9iKv";

// Decrypt the response
const decryptedData: string = aesDecrypt(encryptedResponse);

// Print the decrypted result
console.log("Decrypted Response:", decryptedData);
