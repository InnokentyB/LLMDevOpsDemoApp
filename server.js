import { createDemoServer, readPort } from './src/app.js';

const port = readPort(process.env);
const server = createDemoServer(process.env);

server.listen(port, '0.0.0.0', () => {
  console.log(`LLMDevOps Demo listening on port ${port}`);
});

function shutdown(signal) {
  console.log(`Received ${signal}; shutting down.`);
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
