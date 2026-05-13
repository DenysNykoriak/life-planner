ALTER TABLE "PlanItem" ADD COLUMN "parentId" TEXT;

CREATE INDEX "PlanItem_parentId_idx" ON "PlanItem"("parentId");

ALTER TABLE "PlanItem" ADD CONSTRAINT "PlanItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PlanItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
