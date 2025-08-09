FROM node:18.20.2-slim
ENV TZ=Asia/Phnom_Penh
# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install
RUN apt-get update && apt install vim -y

# Copy the rest of your app
COPY . .

# Expose the app port
EXPOSE 3000

# Start the app with nodemon for development
CMD ["npm", "run", "dev"]
