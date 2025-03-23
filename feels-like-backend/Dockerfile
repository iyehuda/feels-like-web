FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chmod 777 uploads

# Create SSL directory with proper permissions
RUN mkdir -p /ssl && chmod 755 /ssl

# Copy .env file
COPY .env .env

EXPOSE 4000

CMD ["npm", "run", "prod"] 