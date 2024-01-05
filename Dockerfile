# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the Docker container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the app's source code to the working directory
COPY ./server .

# Expose port 3000 for the app
EXPOSE 3000

# Define the command to run the app
CMD [ "node", "index.js" ]