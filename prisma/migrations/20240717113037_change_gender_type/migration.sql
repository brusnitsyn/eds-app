-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('slava', 'liza');

-- CreateEnum
CREATE TYPE "Rule" AS ENUM ('user', 'admin', 'sadmin');

-- CreateTable
CREATE TABLE "Example" (
    "id" TEXT NOT NULL,
    "details" TEXT NOT NULL,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "login" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "rule" "Rule" NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "surName" TEXT NOT NULL,
    "inn" TEXT NOT NULL,
    "snils" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "dob" TIMESTAMP(3),
    "tel" TEXT,
    "sex" "GenderType" NOT NULL,
    "divisionId" INTEGER,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cert" (
    "id" SERIAL NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3) NOT NULL,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "Cert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Division" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Cert_personId_key" ON "Cert"("personId");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cert" ADD CONSTRAINT "Cert_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
