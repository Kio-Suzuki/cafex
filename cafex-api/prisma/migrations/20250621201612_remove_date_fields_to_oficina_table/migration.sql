/*
  Warnings:

  - You are about to drop the column `horarioFim` on the `Oficina` table. All the data in the column will be lost.
  - You are about to drop the column `horarioInicio` on the `Oficina` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO');

-- AlterTable
ALTER TABLE "Oficina" DROP COLUMN "horarioFim",
DROP COLUMN "horarioInicio",
ADD COLUMN     "diaSemana" "DiaSemana"[];
