import { PrismaClient } from "@prisma/client"
import { PrismaService } from "prisma/prisma.service";
import * as bcrypt from 'bcrypt';


const prisma = new PrismaClient()

async function main() {
    await prisma.user.createMany({
            data: [
                    {
                        "username": "admin 1",
                        "password": bcrypt.hashSync("Orangputih123", 10),
                        "role": "ADMIN",
                    },
                    {
                        "username": "user 01",
                        "password": bcrypt.hashSync("Orangbiasa123", 10),
                        "role": "MAHASISWA",
                    },
                    {
                        "username": "admin 02",
                        "password": bcrypt.hashSync("wonggantengdewe", 10),
                        "role": "ADMIN",
                    }
                    ]


        })
        console.log("Seed data parkir berhasil ditambahkan")
}

main()