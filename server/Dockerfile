# Use the Node.js 14 image
FROM node:16

# Create and change to the /app directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install build tools
RUN apt-get update && apt-get install -y build-essential

# Rebuild TensorFlow.js node package from source
RUN npm rebuild @tensorflow/tfjs-node --build-addon-from-source

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3100

# Start the server
CMD ["node", "index.js"]
