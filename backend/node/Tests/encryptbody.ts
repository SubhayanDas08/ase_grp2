import { aesEncrypt } from '../Interceptors/aesEncryption'; // Import encryption function

// Sample User Data (For Registration/Login)
const data = {
  first_name: 'sibin',
  last_name: 'george',
  email: 'sibin@garda.com',
  password: 'sibin123',
  phone_number: '1234567890',
};

// Encrypt Data
const encryptedData = aesEncrypt(JSON.stringify(data));
console.log("Encrypted Data:", encryptedData);
