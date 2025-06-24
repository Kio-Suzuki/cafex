/*
  Warnings:

  - The primary key for the `Aluno` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ra` on the `Aluno` table. All the data in the column will be lost.
  - You are about to drop the column `alunoRa` on the `Presenca` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Presenca` table. All the data in the column will be lost.
  - You are about to drop the column `observacoes` on the `Presenca` table. All the data in the column will be lost.
  - You are about to drop the column `oficinaId` on the `Presenca` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Presenca` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dataPresenca,matriculaId]` on the table `Presenca` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matriculaId` to the `Presenca` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Presenca" DROP CONSTRAINT "Presenca_alunoRa_fkey";

-- DropForeignKey
ALTER TABLE "Presenca" DROP CONSTRAINT "Presenca_oficinaId_fkey";

-- DropIndex
DROP INDEX "Presenca_alunoRa_idx";

-- DropIndex
DROP INDEX "Presenca_alunoRa_oficinaId_dataPresenca_key";

-- DropIndex
DROP INDEX "Presenca_oficinaId_idx";

-- AlterTable
ALTER TABLE "Aluno" DROP CONSTRAINT "Aluno_pkey",
DROP COLUMN "ra",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Presenca" DROP COLUMN "alunoRa",
DROP COLUMN "createdAt",
DROP COLUMN "observacoes",
DROP COLUMN "oficinaId",
DROP COLUMN "updatedAt",
ADD COLUMN     "matriculaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Matricula" (
    "id" SERIAL NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "oficinaId" INTEGER NOT NULL,
    "dataMatricula" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Matricula_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Presenca_dataPresenca_matriculaId_key" ON "Presenca"("dataPresenca", "matriculaId");

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presenca" ADD CONSTRAINT "Presenca_matriculaId_fkey" FOREIGN KEY ("matriculaId") REFERENCES "Matricula"("id") ON DELETE CASCADE ON UPDATE CASCADE;
