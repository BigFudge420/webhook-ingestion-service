import app from "./src/app";
import config from './src/config'
import prisma from "./src/prisma";

const server = app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`)
})

const shutdown = async () => {
  console.log("Shutting down server...")
  await prisma.$disconnect()
  server.close(() => {
    process.exit(0)
  })
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
