-- CreateTable
CREATE TABLE "Resumption" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "termId" INTEGER NOT NULL,
    "resumptionDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Resumption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resumption_sessionId_termId_key" ON "Resumption"("sessionId", "termId");

-- AddForeignKey
ALTER TABLE "Resumption" ADD CONSTRAINT "Resumption_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resumption" ADD CONSTRAINT "Resumption_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
