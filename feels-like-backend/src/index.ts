import { connect, disconnect } from "./db";
import { dbConnectionString, port } from "./config";
import { createApp } from "./app";
import https from 'https';
import fs from 'fs';

async function start() {
  try {
    console.log('Starting server...');
    const app = createApp();
    
    console.log('Connecting to database...');
    await connect(dbConnectionString);
    console.log('Database connected successfully');

    console.log('Loading SSL certificates...');
    const sslOptions = {
      key: fs.readFileSync('/ssl/key.pem'),
      cert: fs.readFileSync('/ssl/cert.pem')
    };
    console.log('SSL certificates loaded successfully');

    const server = https.createServer(sslOptions, app).listen(Number(port), '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });

    const shutdown = () => {
      console.log("Shutting down gracefully");
      server.close(() => console.log("Server closed"));
      disconnect()
        .then(() => console.log("DB connection closed"))
        .catch(console.error);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      shutdown();
    });
    process.on("unhandledRejection", (error) => {
      console.error("Unhandled Rejection:", error);
      shutdown();
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start().catch((error) => {
  console.error("Failed to run server:", error);
  process.exit(1);
});
