# Use a base image with Node.js and Yarn installed
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the project files to the working directory
COPY . .

# Build the Vue.js application using Yarn
RUN yarn build

# Use Nginx as a web server and copy the built files to the appropriate location
FROM nginx:latest
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
