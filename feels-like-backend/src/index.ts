import { port } from "./config";
import { createApp } from "./app";

function start() {
  const app = createApp();

  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  const shutdown = () => {
    console.log("Shutting down gracefully");
    server.close(() => console.log("Server closed"));
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

start();
