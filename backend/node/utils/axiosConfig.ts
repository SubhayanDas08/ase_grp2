import axios from 'axios'

const instance= axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default instance
