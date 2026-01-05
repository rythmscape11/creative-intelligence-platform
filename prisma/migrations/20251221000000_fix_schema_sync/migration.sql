-- AlterTable
ALTER TABLE "agency_clients" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "competition_reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "focusArea" TEXT,
    "competitors" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competition_reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "agency_clients" ADD CONSTRAINT "agency_clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_reports" ADD CONSTRAINT "competition_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
