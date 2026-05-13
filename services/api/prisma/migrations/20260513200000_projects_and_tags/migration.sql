-- Create project table
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "project_userId_idx" ON "project"("userId");

ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add tags column (migrate existing single topic into a one-element array)
ALTER TABLE "knowledge_entry" ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT '{}';
UPDATE "knowledge_entry" SET "tags" = ARRAY["topic"];
ALTER TABLE "knowledge_entry" DROP COLUMN "topic";

-- Add optional project reference
ALTER TABLE "knowledge_entry" ADD COLUMN "projectId" TEXT;
ALTER TABLE "knowledge_entry" ADD CONSTRAINT "knowledge_entry_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
