-- CreateEnum
CREATE TYPE "StatusPresenca" AS ENUM ('PRESENTE', 'AUSENTE', 'JUSTIFICADO');

-- CreateTable
CREATE TABLE "Oficina" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "horarioInicio" TIMESTAMP(3) NOT NULL,
    "horarioFim" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Oficina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Responsavel" (
    "id" SERIAL NOT NULL,
    "nomeResponsavel" TEXT NOT NULL,
    "registroResponsavel" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Responsavel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aluno" (
    "ra" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("ra")
);

-- CreateTable
CREATE TABLE "Presenca" (
    "id" SERIAL NOT NULL,
    "dataPresenca" TIMESTAMP(3) NOT NULL,
    "status" "StatusPresenca" NOT NULL,
    "observacoes" TEXT,
    "alunoRa" INTEGER NOT NULL,
    "oficinaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presenca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OficinaToResponsavel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OficinaToResponsavel_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Responsavel_registroResponsavel_key" ON "Responsavel"("registroResponsavel");

-- CreateIndex
CREATE INDEX "Presenca_alunoRa_idx" ON "Presenca"("alunoRa");

-- CreateIndex
CREATE INDEX "Presenca_oficinaId_idx" ON "Presenca"("oficinaId");

-- CreateIndex
CREATE UNIQUE INDEX "Presenca_alunoRa_oficinaId_dataPresenca_key" ON "Presenca"("alunoRa", "oficinaId", "dataPresenca");

-- CreateIndex
CREATE INDEX "_OficinaToResponsavel_B_index" ON "_OficinaToResponsavel"("B");

-- AddForeignKey
ALTER TABLE "Presenca" ADD CONSTRAINT "Presenca_alunoRa_fkey" FOREIGN KEY ("alunoRa") REFERENCES "Aluno"("ra") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presenca" ADD CONSTRAINT "Presenca_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OficinaToResponsavel" ADD CONSTRAINT "_OficinaToResponsavel_A_fkey" FOREIGN KEY ("A") REFERENCES "Oficina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OficinaToResponsavel" ADD CONSTRAINT "_OficinaToResponsavel_B_fkey" FOREIGN KEY ("B") REFERENCES "Responsavel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
