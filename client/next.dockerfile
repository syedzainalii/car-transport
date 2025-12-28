# Use Node 22 for better stability with Next.js 16
FROM node:22-alpine

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies including jwt-decode
RUN npm install

# Copy all files
COPY . .

# Set environment variable for the build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "start"]