# Use an official Node.js runtime as a parent image
FROM node:20 

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if you have one)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your application listens on (e.g., 3000)
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "start"]