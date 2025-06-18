/*
  Warnings:

  - You are about to drop the `Responsavel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OficinaToResponsavel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OficinaToResponsavel" DROP CONSTRAINT "_OficinaToResponsavel_A_fkey";

-- DropForeignKey
ALTER TABLE "_OficinaToResponsavel" DROP CONSTRAINT "_OficinaToResponsavel_B_fkey";

-- DropTable
DROP TABLE "Responsavel";

-- DropTable
DROP TABLE "_OficinaToResponsavel";
