import { PrismaClient } from "@prisma/client"
import { PrismaService } from "prisma/prisma.service";
import * as bcrypt from 'bcrypt';


const prisma = new PrismaClient()

async function main() {
    await prisma.user.createMany({
            data: [
                    {
                        "username": "admin 1",
                        "password": "Orangputih123",
                        "role": "ADMIN",
                    },
                    {
                        "username": "user 01",
                        "password": "Orangbiasa123",
                        "role": "MAHASISWA",
                    }
                    ]


        })
        console.log("Seed data parkir berhasil ditambahkan")
}

main()