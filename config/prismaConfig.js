// Import the PrismaClient class from the '@prisma/client' package
import { PrismaClient } from '@prisma/client'

// Create an instance of PrismaClient
const prisma = new PrismaClient()

// Export the prisma instance for use in other parts of the application
export { prisma }
