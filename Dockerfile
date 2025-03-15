
# Use Node.js as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install -g prism
# Copy the rest of the application code
COPY . .

# Generate Database
#RUN npx prisma migrate dev --name init

# Build the Next.js application
#RUN npm run build

COPY entrypoint.sh . 
CMD ["./entrypoint.sh"]

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
#CMD ["npm", "start"]
