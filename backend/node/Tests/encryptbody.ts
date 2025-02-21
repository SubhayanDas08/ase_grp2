import { aesEncrypt } from '../Interceptors/aesEncryption'; // Import encryption function

// Sample User Data (For Registration/Login)
const data = {
  first_name: 'Simon',
  last_name: 'Walter',
  email: 'walters@garda.com',
  password: 'simongoback',
  phone_number: '1234567890',
};

// Encrypt Data
const encryptedData = aesEncrypt(JSON.stringify(data));
console.log("Encrypted Data:", encryptedData);
