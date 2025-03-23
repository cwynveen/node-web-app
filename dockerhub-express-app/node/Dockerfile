# Use Node 23.10.0 as the base image
FROM node:23.10.0

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install curl and jq (jq is needed to parse Grype output)
RUN apt-get update && apt-get install -y curl jq

# Install Grype vulnerability scanner
RUN curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin

# Copy the rest of the application source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app using npm
CMD [ "npm", "start" ]