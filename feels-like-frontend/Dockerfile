# Build stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Add environment variables for build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 443

CMD ["sh", "-c", "serve -s dist --ssl-cert /ssl/cert.pem --ssl-key /ssl/key.pem --listen $PORT"] 