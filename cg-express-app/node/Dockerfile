# Use Node 23.10.0 as the base image
FROM cgr.dev/chainguard-private/node:23.10.0-dev
USER 0
# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install Grype and jq (jq is needed to parse Grype output)
RUN apk update && apk add --no-cache jq grype

# Install Grype vulnerability scanner
# RUN curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin

# Copy the rest of the application source code
COPY . .
# Set user back to non-privileged
USER 65532
# Expose the port the app runs on
EXPOSE 3000

# Start the app using npm
ENTRYPOINT []
CMD [ "npm", "start" ]