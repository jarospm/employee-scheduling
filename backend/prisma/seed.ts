import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env["DATABASE_URL"] || "postgresql://postgres:password@localhost:5433/employee_scheduling";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });



async function main() {
  const users = await prisma.user.createMany({
    data: [
      {
        name: "Carlos Rivera",
        email: "carlos.rivera@company.com",
        passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890",
        role: "EMPLOYER"
      },
      {
        name: "Lucia Mendoza",
        email: "lucia.mendoza@company.com",
        passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890",
        role: "EMPLOYER"
      },
      {
        name: "Juan Garcia",
        email: "juan.garcia@company.com",
        passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890",
        role: "EMPLOYEE"
      },
      {
        name: "Maria Fernandez",
        email: "maria.fernandez@company.com",
        passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890",
        role: "EMPLOYEE"
      },
      {
        name: "Pedro Martinez",
        email: "pedro.martinez@company.com",
        passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890",
        role: "EMPLOYEE"
      },
      {
        name: "Ana Lopez",
        email: "ana.lopez@company.com",
        passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890",
        role: "EMPLOYEE"
      },
      {
        name: "David Sanchez",
        email: "david.sanchez@company.com",
        passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890",
        role: "EMPLOYEE"
      },
      {
        name: "Rosa Torres",
        email: "rosa.torres@company.com",
        passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890",
        role: "EMPLOYEE"
      }
    ],
    skipDuplicates: true
  });

  console.log(`Seeded ${users.count} users`);
}


main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e: unknown) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
    
  });

